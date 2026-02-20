type WebVitalName = 'LCP' | 'CLS' | 'INP';
type WebVitalRating = 'good' | 'needs-improvement' | 'poor';

type WebVitalPayload = {
    name: WebVitalName;
    value: number;
    rating: WebVitalRating;
    route: string;
    url: string;
    ts: string;
    source: 'visibilitychange' | 'pagehide';
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

export default defineNuxtPlugin(() => {
    const runtimeConfig = useRuntimeConfig();
    const enabled = toBoolean(runtimeConfig.public.webVitalsEnabled);
    if (!enabled || typeof window === 'undefined' || !('PerformanceObserver' in window)) {
        return;
    }

    const debug = toBoolean(runtimeConfig.public.webVitalsDebug);
    const endpoint = String(runtimeConfig.public.webVitalsEndpoint || '').trim();
    const router = useRouter();

    let currentRoute = router.currentRoute.value.fullPath;
    let hasFlushed = false;
    let lcpValue = 0;
    let lcpElement: Element | null = null;
    let clsValue = 0;
    let inpValue = 0;

    const observers: PerformanceObserver[] = [];

    const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<PerformanceEntry & { element?: Element }>) {
            lcpValue = entry.startTime;
            lcpElement = entry.element || null;
        }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    observers.push(lcpObserver);

    const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
            }
        }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    observers.push(clsObserver);

    const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<PerformanceEntry & { interactionId?: number; duration: number }>) {
            if (entry.interactionId && entry.duration > inpValue) {
                inpValue = entry.duration;
            }
        }
    });
    inpObserver.observe({ type: 'event', durationThreshold: 40, buffered: true });
    observers.push(inpObserver);

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

    const flushMetrics = (source: WebVitalPayload['source']) => {
        if (hasFlushed) return;
        hasFlushed = true;

        for (const observer of observers) observer.disconnect();

        const common = {
            route: currentRoute,
            url: window.location.href,
            ts: new Date().toISOString(),
            source,
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
            });
        }
    };

    router.afterEach((to) => {
        currentRoute = to.fullPath;
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
