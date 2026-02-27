import { resolveSupportedCountry } from '~/constants/countries';

type WebVitalName = 'LCP' | 'CLS' | 'INP';
type WebVitalRating = 'good' | 'needs-improvement' | 'poor';
type NavType = 'initial' | 'soft';
type Source = 'visibilitychange' | 'pagehide' | 'routechange';
type PageType =
    | 'home'
    | 'product-list'
    | 'product-detail'
    | 'auth'
    | 'account'
    | 'other';
type InteractionTarget = 'menu' | 'modal' | 'search' | 'form' | 'other';

type ThirdPartySummaryItem = {
    host: string;
    lcpImpactMs?: number;
    inpImpactMs?: number;
    transferSize?: number;
};

type WebVitalPayload = {
    name: WebVitalName;
    value: number;
    rating: WebVitalRating;
    route: string;
    url: string;
    ts: string;
    source: Source;
    pageType: PageType;
    navType: NavType;
    sessionId: string;
    traceId: string;
    interactionTarget?: InteractionTarget;
    jsLongTaskP95?: number;
    hydrationMs?: number;
    thirdPartySummary?: ThirdPartySummaryItem[];
    errorCount?: number;
    apiFailureCount?: number;
    element?: string;
};

const WEB_VITAL_THRESHOLDS: Record<WebVitalName, { good: number; poor: number }> = {
    LCP: { good: 2500, poor: 4000 },
    CLS: { good: 0.1, poor: 0.25 },
    INP: { good: 200, poor: 500 },
};

function toBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') return value;
    return String(value).toLowerCase() === 'true';
}

function getRating(name: WebVitalName, value: number): WebVitalRating {
    const thresholds = WEB_VITAL_THRESHOLDS[name];
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
}

function normalizeRoute(route: string): string {
    const path = route.split('?')[0]?.split('#')[0] ?? route;
    if (!path) return '/';
    return path.startsWith('/') ? path : `/${path}`;
}

function stripCountryPrefix(route: string): string {
    const path = normalizeRoute(route);
    const [firstSegment, ...rest] = path.split('/').filter(Boolean);
    if (!firstSegment) return '/';
    if (!resolveSupportedCountry(firstSegment)) return path;
    return rest.length ? `/${rest.join('/')}` : '/';
}

function classifyPageType(route: string): PageType {
    const path = stripCountryPrefix(route).toLowerCase();
    if (path === '/') return 'home';
    if (/^\/(stickers|sheet-stickers|roll-stickers)\/[^/]+$/.test(path)) return 'product-detail';
    if (
        path === '/stickers' ||
        path === '/sheet-stickers' ||
        path === '/roll-stickers'
    ) {
        return 'product-list';
    }
    if (path.startsWith('/auth/')) return 'auth';
    if (path.startsWith('/account/')) return 'account';
    return 'other';
}

function percentile(values: number[], p: number): number | null {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.max(0, Math.ceil((p / 100) * sorted.length) - 1);
    return sorted[index] ?? null;
}

function getElementHint(element: Element | null | undefined): string | undefined {
    if (!element) return undefined;
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const className =
        typeof element.className === 'string'
            ? element.className
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((token) => `.${token}`)
                  .join('')
            : '';
    return `${tagName}${id}${className}` || tagName;
}

function classifyInteractionTargetFromElement(
    element: Element | null | undefined
): InteractionTarget {
    if (!element) return 'other';
    const text =
        `${element.tagName} ${element.getAttribute('data-testid') || ''} ${element.className || ''}`.toLowerCase();
    if (text.includes('menu')) return 'menu';
    if (text.includes('modal')) return 'modal';
    if (text.includes('search')) return 'search';
    if (text.includes('form') || text.includes('input') || text.includes('submit')) {
        return 'form';
    }
    return 'other';
}

function getSessionId(): string {
    const key = 'web-vitals-session-id';
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const next = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    sessionStorage.setItem(key, next);
    return next;
}

function nextTraceId(): string {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default defineNuxtPlugin(() => {
    const runtimeConfig = useRuntimeConfig();
    const enabled = toBoolean(runtimeConfig.public.webVitalsEnabled);
    if (!enabled || typeof window === 'undefined' || !('PerformanceObserver' in window)) {
        return;
    }

    const debug = toBoolean(runtimeConfig.public.webVitalsDebug);
    const endpoint = String(runtimeConfig.public.webVitalsEndpoint || '').trim();
    const router = useRouter();
    const origin = window.location.origin;

    let currentRoute = router.currentRoute.value.fullPath;
    let navType: NavType = 'initial';
    let traceId = nextTraceId();
    const sessionId = getSessionId();
    let routeStartedAt = performance.now();
    let hydrationMs = 0;
    let hasFinalFlush = false;

    let lcpValue = 0;
    let lcpElement: Element | null = null;
    let clsValue = 0;
    let inpValue = 0;
    let inpTarget: InteractionTarget = 'other';
    const longTaskDurations: number[] = [];
    let errorCount = 0;
    let apiFailureCount = 0;

    const thirdPartySummary = new Map<
        string,
        { lcpImpactMs: number[]; inpImpactMs: number[]; transferSize: number }
    >();

    const pushThirdParty = (host: string, duration: number, transferSize: number) => {
        if (!thirdPartySummary.has(host)) {
            thirdPartySummary.set(host, {
                lcpImpactMs: [],
                inpImpactMs: [],
                transferSize: 0,
            });
        }
        const current = thirdPartySummary.get(host);
        if (!current) return;
        current.lcpImpactMs.push(Math.round(duration * 0.22));
        current.inpImpactMs.push(Math.round(duration * 0.15));
        current.transferSize += transferSize;
    };

    const observers: PerformanceObserver[] = [];

    const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<PerformanceEntry & { element?: Element }>) {
            lcpValue = Math.max(lcpValue, entry.startTime);
            lcpElement = entry.element || lcpElement;
        }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    observers.push(lcpObserver);

    const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
            if (!entry.hadRecentInput) clsValue += entry.value;
        }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    observers.push(clsObserver);

    const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<PerformanceEntry & { interactionId?: number; duration: number; target?: Element }>) {
            if (entry.interactionId && entry.duration > inpValue) {
                inpValue = entry.duration;
                inpTarget = classifyInteractionTargetFromElement(entry.target);
            }
        }
    });
    inpObserver.observe({ type: 'event', durationThreshold: 40, buffered: true });
    observers.push(inpObserver);

    const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            longTaskDurations.push(entry.duration);
            if (longTaskDurations.length > 400) {
                longTaskDurations.splice(0, longTaskDurations.length - 400);
            }
        }
    });
    longTaskObserver.observe({ type: 'longtask', buffered: true });
    observers.push(longTaskObserver);

    const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceResourceTiming[]) {
            try {
                const url = new URL(entry.name);
                if (url.origin === origin) continue;
                pushThirdParty(url.host, entry.duration, entry.transferSize || 0);
            } catch {
                // Ignore invalid URL entries.
            }
        }
    });
    resourceObserver.observe({ type: 'resource', buffered: true });
    observers.push(resourceObserver);

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args) => {
        try {
            const response = await originalFetch(...args);
            if (!response.ok) apiFailureCount += 1;
            return response;
        } catch (error) {
            apiFailureCount += 1;
            throw error;
        }
    };

    window.addEventListener('error', () => {
        errorCount += 1;
    });
    window.addEventListener('unhandledrejection', () => {
        errorCount += 1;
    });

    const reportMetric = async (payload: WebVitalPayload) => {
        if (debug) {
            console.info('[web-vitals]', payload);
        }
        if (!endpoint) return;
        try {
            await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true,
            });
        } catch {
            // Ignore network errors for non-blocking telemetry.
        }
    };

    const toThirdPartyList = (): ThirdPartySummaryItem[] => {
        return Array.from(thirdPartySummary.entries())
            .map(([host, values]) => ({
                host,
                lcpImpactMs: Math.round(percentile(values.lcpImpactMs, 75) || 0),
                inpImpactMs: Math.round(percentile(values.inpImpactMs, 75) || 0),
                transferSize: Math.round(values.transferSize),
            }))
            .sort((a, b) => (b.lcpImpactMs || 0) + (b.inpImpactMs || 0) - ((a.lcpImpactMs || 0) + (a.inpImpactMs || 0)))
            .slice(0, 6);
    };

    const resetForNextSpan = (nextRoute: string, nextNavType: NavType) => {
        currentRoute = nextRoute;
        navType = nextNavType;
        traceId = nextTraceId();
        routeStartedAt = performance.now();
        hydrationMs = 0;
        lcpValue = 0;
        lcpElement = null;
        clsValue = 0;
        inpValue = 0;
        inpTarget = 'other';
        longTaskDurations.length = 0;
        errorCount = 0;
        apiFailureCount = 0;
        thirdPartySummary.clear();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                hydrationMs = Math.round(performance.now() - routeStartedAt);
            });
        });
    };

    resetForNextSpan(currentRoute, 'initial');

    const flushMetrics = (source: Source) => {
        if (source !== 'routechange' && hasFinalFlush) return;
        if (source !== 'routechange') hasFinalFlush = true;

        const jsLongTaskP95 = percentile(longTaskDurations, 95);
        const common = {
            route: currentRoute,
            url: window.location.href,
            ts: new Date().toISOString(),
            source,
            pageType: classifyPageType(currentRoute),
            navType,
            sessionId,
            traceId,
            jsLongTaskP95:
                jsLongTaskP95 === null ? undefined : Math.round(jsLongTaskP95),
            hydrationMs: hydrationMs || undefined,
            thirdPartySummary: toThirdPartyList(),
            errorCount,
            apiFailureCount,
        } as const;

        void reportMetric({
            ...common,
            name: 'LCP',
            value: lcpValue,
            rating: getRating('LCP', lcpValue),
            element: getElementHint(lcpElement),
        });

        void reportMetric({
            ...common,
            name: 'CLS',
            value: Number(clsValue.toFixed(4)),
            rating: getRating('CLS', clsValue),
        });

        if (inpValue > 0) {
            void reportMetric({
                ...common,
                name: 'INP',
                value: Math.round(inpValue),
                rating: getRating('INP', inpValue),
                interactionTarget: inpTarget,
            });
        }
    };

    router.afterEach((to) => {
        flushMetrics('routechange');
        resetForNextSpan(to.fullPath, 'soft');
    });

    const onVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            flushMetrics('visibilitychange');
        }
    };

    const onPageHide = () => flushMetrics('pagehide');

    document.addEventListener('visibilitychange', onVisibilityChange, true);
    window.addEventListener('pagehide', onPageHide, true);
});
