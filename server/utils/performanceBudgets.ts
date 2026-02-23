export type PageType =
    | 'home'
    | 'product-list'
    | 'product-detail'
    | 'auth'
    | 'account'
    | 'other';

export type CoreMetricName = 'LCP' | 'INP' | 'CLS';

export type SecondaryMetricName =
    | 'jsBytes'
    | 'longTaskMs'
    | 'hydrationMs'
    | 'imageBytes'
    | 'fontShiftCls'
    | 'thirdPartyInpImpactMs'
    | 'thirdPartyLcpImpactMs';

export type BudgetLevel = 'core' | 'secondary';
export type BudgetStatus = 'pass' | 'warn' | 'fail';

export type PageTypeBudget = {
    core: Record<CoreMetricName, number>;
    secondary: Record<SecondaryMetricName, number>;
};

export const PAGE_TYPE_BUDGETS: Record<PageType, PageTypeBudget> = {
    home: {
        core: { LCP: 2200, INP: 180, CLS: 0.08 },
        secondary: {
            jsBytes: 180_000,
            longTaskMs: 200,
            hydrationMs: 1200,
            imageBytes: 300_000,
            fontShiftCls: 0.02,
            thirdPartyInpImpactMs: 40,
            thirdPartyLcpImpactMs: 150,
        },
    },
    'product-list': {
        core: { LCP: 2500, INP: 200, CLS: 0.1 },
        secondary: {
            jsBytes: 220_000,
            longTaskMs: 200,
            hydrationMs: 1200,
            imageBytes: 350_000,
            fontShiftCls: 0.02,
            thirdPartyInpImpactMs: 40,
            thirdPartyLcpImpactMs: 150,
        },
    },
    'product-detail': {
        core: { LCP: 2600, INP: 220, CLS: 0.1 },
        secondary: {
            jsBytes: 240_000,
            longTaskMs: 200,
            hydrationMs: 1200,
            imageBytes: 450_000,
            fontShiftCls: 0.02,
            thirdPartyInpImpactMs: 40,
            thirdPartyLcpImpactMs: 150,
        },
    },
    auth: {
        core: { LCP: 2400, INP: 250, CLS: 0.1 },
        secondary: {
            jsBytes: 170_000,
            longTaskMs: 200,
            hydrationMs: 900,
            imageBytes: 350_000,
            fontShiftCls: 0.02,
            thirdPartyInpImpactMs: 40,
            thirdPartyLcpImpactMs: 150,
        },
    },
    account: {
        core: { LCP: 2600, INP: 250, CLS: 0.1 },
        secondary: {
            jsBytes: 190_000,
            longTaskMs: 200,
            hydrationMs: 900,
            imageBytes: 350_000,
            fontShiftCls: 0.02,
            thirdPartyInpImpactMs: 40,
            thirdPartyLcpImpactMs: 150,
        },
    },
    other: {
        core: { LCP: 2500, INP: 200, CLS: 0.1 },
        secondary: {
            jsBytes: 200_000,
            longTaskMs: 200,
            hydrationMs: 1100,
            imageBytes: 350_000,
            fontShiftCls: 0.02,
            thirdPartyInpImpactMs: 40,
            thirdPartyLcpImpactMs: 150,
        },
    },
};

export function classifyPageType(route: string): PageType {
    const normalized = normalizeRoutePath(route).toLowerCase();

    if (normalized === '/') return 'home';

    if (/^\/(stickers|sheet-stickers|roll-stickers)\/[^/]+$/.test(normalized)) {
        return 'product-detail';
    }

    if (
        normalized === '/stickers' ||
        normalized === '/sheet-stickers' ||
        normalized === '/roll-stickers'
    ) {
        return 'product-list';
    }

    if (normalized.startsWith('/auth/')) return 'auth';
    if (normalized.startsWith('/account/')) return 'account';

    return 'other';
}

export function normalizeRoutePath(route: string): string {
    const path = route.split('?')[0]?.split('#')[0] ?? route;
    if (!path) return '/';
    return path.startsWith('/') ? path : `/${path}`;
}

export function evaluateBudget(
    level: BudgetLevel,
    value: number | null | undefined,
    threshold: number
): BudgetStatus {
    if (value === null || value === undefined || !Number.isFinite(value)) {
        return 'warn';
    }

    if (value <= threshold) return 'pass';
    return level === 'core' ? 'fail' : 'warn';
}
