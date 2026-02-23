import {
    PAGE_TYPE_BUDGETS,
    classifyPageType,
    evaluateBudget,
    normalizeRoutePath,
    type BudgetStatus,
    type CoreMetricName,
    type PageType,
    type SecondaryMetricName,
} from './performanceBudgets';

type WebVitalName = 'LCP' | 'CLS' | 'INP';
type WebVitalRating = 'good' | 'needs-improvement' | 'poor';
type NavType = 'initial' | 'soft';
type Source = 'visibilitychange' | 'pagehide' | 'routechange';
type InteractionTarget = 'menu' | 'modal' | 'search' | 'form' | 'other';

export type ThirdPartySummaryItem = {
    host: string;
    lcpImpactMs?: number;
    inpImpactMs?: number;
    transferSize?: number;
};

export type WebVitalPayload = {
    name: WebVitalName;
    value: number;
    rating: WebVitalRating;
    route: string;
    url: string;
    ts: string;
    source: Source;
    pageType?: PageType;
    navType?: NavType;
    sessionId?: string;
    traceId?: string;
    interactionTarget?: InteractionTarget;
    jsLongTaskP95?: number;
    hydrationMs?: number;
    thirdPartySummary?: ThirdPartySummaryItem[];
    errorCount?: number;
    apiFailureCount?: number;
    element?: string;
};

type RouteMetricBucket = Record<WebVitalName, number[]>;

type ThirdPartyStore = Record<
    string,
    {
        lcpImpactValues: number[];
        inpImpactValues: number[];
        transferSizeTotal: number;
        sampleCount: number;
    }
>;

type InteractionStore = Record<InteractionTarget, number[]>;

type BudgetResult = Record<
    CoreMetricName | SecondaryMetricName,
    { status: BudgetStatus; threshold: number; value: number | null }
>;

type RouteStore = {
    pageType: PageType;
    metrics: RouteMetricBucket;
    navCounts: Record<NavType, number>;
    count: number;
    lastSeen: string;
    jsLongTaskP95: number[];
    hydrationMs: number[];
    errorCount: number[];
    apiFailureCount: number[];
    interactionDurations: InteractionStore;
    thirdParty: ThirdPartyStore;
};

type RouteSummary = {
    route: string;
    pageType: PageType;
    count: number;
    lastSeen: string;
    nav: Record<NavType, number>;
    p75: Partial<Record<WebVitalName, number>>;
    diagnostics: {
        jsLongTaskP95: number | null;
        hydrationMs: number | null;
        errorRate: number | null;
        apiFailureRate: number | null;
    };
    interactions: Record<InteractionTarget, number | null>;
    thirdPartyTop: Array<{
        host: string;
        inpImpactMs: number | null;
        lcpImpactMs: number | null;
        transferSizeAvg: number | null;
    }>;
    budgets: BudgetResult;
};

const ROUTE_LIMIT = 300;
const METRIC_SAMPLE_LIMIT = 500;
const DIAGNOSTIC_SAMPLE_LIMIT = 300;

const store = new Map<string, RouteStore>();

function isGuideRoute(route: string): boolean {
    const path = normalizeRoutePath(route).toLowerCase();
    if (path === '/guide' || path.startsWith('/guide/')) return true;
    return /^\/[a-z]{2}(?:-[a-z]{2})?\/guide(?:\/|$)/i.test(path);
}

function createRouteStore(ts: string, pageType: PageType): RouteStore {
    return {
        pageType,
        metrics: {
            LCP: [],
            CLS: [],
            INP: [],
        },
        navCounts: {
            initial: 0,
            soft: 0,
        },
        count: 0,
        lastSeen: ts,
        jsLongTaskP95: [],
        hydrationMs: [],
        errorCount: [],
        apiFailureCount: [],
        interactionDurations: {
            menu: [],
            modal: [],
            search: [],
            form: [],
            other: [],
        },
        thirdParty: {},
    };
}

function percentile(values: readonly number[], p: number): number | null {
    if (values.length === 0) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.max(0, Math.ceil((p / 100) * sorted.length) - 1);
    return sorted[index] ?? null;
}

function trimArray(values: number[], maxSize: number): void {
    if (values.length <= maxSize) return;
    values.splice(0, values.length - maxSize);
}

function trimOldestRouteIfNeeded(): void {
    if (store.size < ROUTE_LIMIT) return;
    const oldest = store.keys().next().value as string | undefined;
    if (oldest) {
        store.delete(oldest);
    }
}

function toRounded(value: number | null, precision = 0): number | null {
    if (value === null) return null;
    if (precision <= 0) return Math.round(value);
    const fixed = Number(value.toFixed(precision));
    return Number.isFinite(fixed) ? fixed : null;
}

function average(values: number[]): number | null {
    if (values.length === 0) return null;
    return values.reduce((sum, current) => sum + current, 0) / values.length;
}

function toBudgetResult(
    pageType: PageType,
    metrics: {
        lcp: number | null;
        inp: number | null;
        cls: number | null;
        jsLongTaskP95: number | null;
        hydrationMs: number | null;
        imageBytes: number | null;
        fontShiftCls: number | null;
        thirdPartyInpImpactMs: number | null;
        thirdPartyLcpImpactMs: number | null;
    }
): BudgetResult {
    const budget = PAGE_TYPE_BUDGETS[pageType];

    return {
        LCP: {
            status: evaluateBudget('core', metrics.lcp, budget.core.LCP),
            threshold: budget.core.LCP,
            value: metrics.lcp,
        },
        INP: {
            status: evaluateBudget('core', metrics.inp, budget.core.INP),
            threshold: budget.core.INP,
            value: metrics.inp,
        },
        CLS: {
            status: evaluateBudget('core', metrics.cls, budget.core.CLS),
            threshold: budget.core.CLS,
            value: metrics.cls,
        },
        jsBytes: {
            status: evaluateBudget('secondary', null, budget.secondary.jsBytes),
            threshold: budget.secondary.jsBytes,
            value: null,
        },
        longTaskMs: {
            status: evaluateBudget(
                'secondary',
                metrics.jsLongTaskP95,
                budget.secondary.longTaskMs
            ),
            threshold: budget.secondary.longTaskMs,
            value: metrics.jsLongTaskP95,
        },
        hydrationMs: {
            status: evaluateBudget(
                'secondary',
                metrics.hydrationMs,
                budget.secondary.hydrationMs
            ),
            threshold: budget.secondary.hydrationMs,
            value: metrics.hydrationMs,
        },
        imageBytes: {
            status: evaluateBudget(
                'secondary',
                metrics.imageBytes,
                budget.secondary.imageBytes
            ),
            threshold: budget.secondary.imageBytes,
            value: metrics.imageBytes,
        },
        fontShiftCls: {
            status: evaluateBudget(
                'secondary',
                metrics.fontShiftCls,
                budget.secondary.fontShiftCls
            ),
            threshold: budget.secondary.fontShiftCls,
            value: metrics.fontShiftCls,
        },
        thirdPartyInpImpactMs: {
            status: evaluateBudget(
                'secondary',
                metrics.thirdPartyInpImpactMs,
                budget.secondary.thirdPartyInpImpactMs
            ),
            threshold: budget.secondary.thirdPartyInpImpactMs,
            value: metrics.thirdPartyInpImpactMs,
        },
        thirdPartyLcpImpactMs: {
            status: evaluateBudget(
                'secondary',
                metrics.thirdPartyLcpImpactMs,
                budget.secondary.thirdPartyLcpImpactMs
            ),
            threshold: budget.secondary.thirdPartyLcpImpactMs,
            value: metrics.thirdPartyLcpImpactMs,
        },
    };
}

export function addWebVitalSample(payload: WebVitalPayload): void {
    if (isGuideRoute(payload.route)) return;

    const routeKey = normalizeRoutePath(payload.route);
    const pageType = payload.pageType || classifyPageType(routeKey);
    const navType: NavType = payload.navType || 'initial';

    if (!store.has(routeKey)) {
        trimOldestRouteIfNeeded();
        store.set(routeKey, createRouteStore(payload.ts, pageType));
    }

    const routeStore = store.get(routeKey);
    if (!routeStore) return;

    routeStore.pageType = pageType;
    routeStore.count += 1;
    routeStore.lastSeen = payload.ts;
    routeStore.navCounts[navType] += 1;
    routeStore.metrics[payload.name].push(payload.value);
    trimArray(routeStore.metrics[payload.name], METRIC_SAMPLE_LIMIT);

    if (typeof payload.jsLongTaskP95 === 'number' && Number.isFinite(payload.jsLongTaskP95)) {
        routeStore.jsLongTaskP95.push(payload.jsLongTaskP95);
        trimArray(routeStore.jsLongTaskP95, DIAGNOSTIC_SAMPLE_LIMIT);
    }

    if (typeof payload.hydrationMs === 'number' && Number.isFinite(payload.hydrationMs)) {
        routeStore.hydrationMs.push(payload.hydrationMs);
        trimArray(routeStore.hydrationMs, DIAGNOSTIC_SAMPLE_LIMIT);
    }

    if (typeof payload.errorCount === 'number' && Number.isFinite(payload.errorCount)) {
        routeStore.errorCount.push(payload.errorCount);
        trimArray(routeStore.errorCount, DIAGNOSTIC_SAMPLE_LIMIT);
    }

    if (
        typeof payload.apiFailureCount === 'number' &&
        Number.isFinite(payload.apiFailureCount)
    ) {
        routeStore.apiFailureCount.push(payload.apiFailureCount);
        trimArray(routeStore.apiFailureCount, DIAGNOSTIC_SAMPLE_LIMIT);
    }

    if (payload.name === 'INP' && payload.interactionTarget) {
        const values = routeStore.interactionDurations[payload.interactionTarget];
        values.push(payload.value);
        trimArray(values, DIAGNOSTIC_SAMPLE_LIMIT);
    }

    for (const item of payload.thirdPartySummary || []) {
        const host = String(item.host || '').trim().toLowerCase();
        if (!host) continue;

        if (!routeStore.thirdParty[host]) {
            routeStore.thirdParty[host] = {
                lcpImpactValues: [],
                inpImpactValues: [],
                transferSizeTotal: 0,
                sampleCount: 0,
            };
        }

        const target = routeStore.thirdParty[host];
        target.sampleCount += 1;

        if (typeof item.lcpImpactMs === 'number' && Number.isFinite(item.lcpImpactMs)) {
            target.lcpImpactValues.push(item.lcpImpactMs);
            trimArray(target.lcpImpactValues, DIAGNOSTIC_SAMPLE_LIMIT);
        }

        if (typeof item.inpImpactMs === 'number' && Number.isFinite(item.inpImpactMs)) {
            target.inpImpactValues.push(item.inpImpactMs);
            trimArray(target.inpImpactValues, DIAGNOSTIC_SAMPLE_LIMIT);
        }

        if (typeof item.transferSize === 'number' && Number.isFinite(item.transferSize)) {
            target.transferSizeTotal += item.transferSize;
        }
    }
}

export function getWebVitalSummaryByRoute(): RouteSummary[] {
    const rows: RouteSummary[] = [];

    for (const [route, routeStore] of store.entries()) {
        if (isGuideRoute(route)) continue;

        const lcpP75 = toRounded(percentile(routeStore.metrics.LCP, 75));
        const clsP75 = toRounded(percentile(routeStore.metrics.CLS, 75), 4);
        const inpP75 = toRounded(percentile(routeStore.metrics.INP, 75));

        const jsLongTaskP95 = toRounded(percentile(routeStore.jsLongTaskP95, 95));
        const hydrationP75 = toRounded(percentile(routeStore.hydrationMs, 75));
        const errorRate =
            routeStore.count > 0
                ? toRounded(((average(routeStore.errorCount) || 0) / routeStore.count) * 100, 2)
                : null;
        const apiFailureRate =
            routeStore.count > 0
                ? toRounded(
                      ((average(routeStore.apiFailureCount) || 0) / routeStore.count) * 100,
                      2
                  )
                : null;

        const interactionP75: Record<InteractionTarget, number | null> = {
            menu: toRounded(percentile(routeStore.interactionDurations.menu, 75)),
            modal: toRounded(percentile(routeStore.interactionDurations.modal, 75)),
            search: toRounded(percentile(routeStore.interactionDurations.search, 75)),
            form: toRounded(percentile(routeStore.interactionDurations.form, 75)),
            other: toRounded(percentile(routeStore.interactionDurations.other, 75)),
        };

        const thirdPartyTop = Object.entries(routeStore.thirdParty)
            .map(([host, data]) => {
                const inpImpactMs = toRounded(percentile(data.inpImpactValues, 75));
                const lcpImpactMs = toRounded(percentile(data.lcpImpactValues, 75));
                const transferSizeAvg =
                    data.sampleCount > 0
                        ? toRounded(data.transferSizeTotal / data.sampleCount)
                        : null;
                return {
                    host,
                    inpImpactMs,
                    lcpImpactMs,
                    transferSizeAvg,
                };
            })
            .sort(
                (a, b) =>
                    (b.lcpImpactMs || 0) + (b.inpImpactMs || 0) - ((a.lcpImpactMs || 0) + (a.inpImpactMs || 0))
            )
            .slice(0, 5);

        const imageBytes = thirdPartyTop.reduce((sum, row) => sum + (row.transferSizeAvg || 0), 0);
        const fontShiftCls = clsP75 !== null ? Number((clsP75 * 0.15).toFixed(4)) : null;
        const thirdPartyInpImpactMs = toRounded(
            Math.max(0, ...thirdPartyTop.map((item) => item.inpImpactMs || 0))
        );
        const thirdPartyLcpImpactMs = toRounded(
            Math.max(0, ...thirdPartyTop.map((item) => item.lcpImpactMs || 0))
        );

        const budgets = toBudgetResult(routeStore.pageType, {
            lcp: lcpP75,
            inp: inpP75,
            cls: clsP75,
            jsLongTaskP95,
            hydrationMs: hydrationP75,
            imageBytes: imageBytes || null,
            fontShiftCls,
            thirdPartyInpImpactMs,
            thirdPartyLcpImpactMs,
        });

        const p75: Partial<Record<WebVitalName, number>> = {};
        if (lcpP75 !== null) p75.LCP = lcpP75;
        if (clsP75 !== null) p75.CLS = clsP75;
        if (inpP75 !== null) p75.INP = inpP75;

        rows.push({
            route,
            pageType: routeStore.pageType,
            count: routeStore.count,
            lastSeen: routeStore.lastSeen,
            nav: routeStore.navCounts,
            p75,
            diagnostics: {
                jsLongTaskP95,
                hydrationMs: hydrationP75,
                errorRate,
                apiFailureRate,
            },
            interactions: interactionP75,
            thirdPartyTop,
            budgets,
        });
    }

    return rows.sort((a, b) => b.count - a.count);
}
