type WebVitalName = 'LCP' | 'CLS' | 'INP';
type WebVitalRating = 'good' | 'needs-improvement' | 'poor';

export type WebVitalPayload = {
    name: WebVitalName;
    value: number;
    rating: WebVitalRating;
    route: string;
    url: string;
    ts: string;
    source: 'visibilitychange' | 'pagehide';
    element?: string;
};

type RouteMetricBucket = Record<WebVitalName, number[]>;

type RouteStore = {
    metrics: RouteMetricBucket;
    count: number;
    lastSeen: string;
};

type RouteSummary = {
    route: string;
    count: number;
    lastSeen: string;
    p75: Partial<Record<WebVitalName, number>>;
};

const ROUTE_LIMIT = 200;
const METRIC_SAMPLE_LIMIT = 400;

const store = new Map<string, RouteStore>();

function normalizeRoutePath(route: string): string {
    const path = route.split('?')[0]?.split('#')[0] ?? route;
    if (!path) return '/';
    return path.startsWith('/') ? path : `/${path}`;
}

function isGuideRoute(route: string): boolean {
    const path = normalizeRoutePath(route).toLowerCase();
    if (path === '/guide' || path.startsWith('/guide/')) return true;

    // Handle locale-prefixed routes such as /en/guide or /kr/guide/...
    return /^\/[a-z]{2}(?:-[a-z]{2})?\/guide(?:\/|$)/i.test(path);
}

function createRouteStore(ts: string): RouteStore {
    return {
        metrics: {
            LCP: [],
            CLS: [],
            INP: [],
        },
        count: 0,
        lastSeen: ts,
    };
}

function percentile(values: readonly number[], p: number): number | null {
    if (values.length === 0) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.max(0, Math.ceil((p / 100) * sorted.length) - 1);
    return sorted[index] ?? null;
}

function trimOldestRouteIfNeeded(): void {
    if (store.size < ROUTE_LIMIT) return;
    const oldest = store.keys().next().value as string | undefined;
    if (oldest) {
        store.delete(oldest);
    }
}

function trimMetricSamples(metricValues: number[]): void {
    if (metricValues.length <= METRIC_SAMPLE_LIMIT) return;
    metricValues.splice(0, metricValues.length - METRIC_SAMPLE_LIMIT);
}

export function addWebVitalSample(payload: WebVitalPayload): void {
    if (isGuideRoute(payload.route)) return;

    const routeKey = payload.route;
    if (!store.has(routeKey)) {
        trimOldestRouteIfNeeded();
        store.set(routeKey, createRouteStore(payload.ts));
    }

    const routeStore = store.get(routeKey);
    if (!routeStore) return;

    routeStore.count += 1;
    routeStore.lastSeen = payload.ts;
    routeStore.metrics[payload.name].push(payload.value);
    trimMetricSamples(routeStore.metrics[payload.name]);
}

export function getWebVitalSummaryByRoute(): RouteSummary[] {
    const rows: RouteSummary[] = [];

    for (const [route, routeStore] of store.entries()) {
        if (isGuideRoute(route)) continue;

        const lcpP75 = percentile(routeStore.metrics.LCP, 75);
        const clsP75 = percentile(routeStore.metrics.CLS, 75);
        const inpP75 = percentile(routeStore.metrics.INP, 75);

        const p75: Partial<Record<WebVitalName, number>> = {};
        if (lcpP75 !== null) p75.LCP = Math.round(lcpP75);
        if (clsP75 !== null) p75.CLS = Number(clsP75.toFixed(4));
        if (inpP75 !== null) p75.INP = Math.round(inpP75);

        rows.push({
            route,
            count: routeStore.count,
            lastSeen: routeStore.lastSeen,
            p75,
        });
    }

    return rows.sort((a, b) => b.count - a.count);
}
