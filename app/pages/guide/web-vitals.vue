<script setup lang="ts">
import GuideCommandList from '@/components/guide/GuideCommandList.vue';

type MetricName = 'LCP' | 'INP' | 'CLS';
type StatusTone = 'success' | 'warning' | 'danger' | 'default';
type PageType =
    | 'all'
    | 'home'
    | 'product-list'
    | 'product-detail'
    | 'auth'
    | 'account'
    | 'other';

type RouteVitals = {
    route: string;
    pageType: Exclude<PageType, 'all'>;
    count: number;
    lastSeen: string;
    nav: { initial: number; soft: number };
    p75: Partial<Record<MetricName, number>>;
    diagnostics: {
        jsLongTaskP95: number | null;
        hydrationMs: number | null;
        errorRate: number | null;
        apiFailureRate: number | null;
    };
    interactions: Record<'menu' | 'modal' | 'search' | 'form' | 'other', number | null>;
    thirdPartyTop: Array<{
        host: string;
        inpImpactMs: number | null;
        lcpImpactMs: number | null;
        transferSizeAvg: number | null;
    }>;
    budgets: Record<
        string,
        { status: 'pass' | 'warn' | 'fail'; threshold: number; value: number | null }
    >;
};

type SummaryResponse = {
    ok: boolean;
    generatedAt: string;
    routeCount: number;
    budgetTotals: { pass: number; warn: number; fail: number };
    routes: RouteVitals[];
};

type LabSummaryResponse = {
    ok: boolean;
    hasData: boolean;
    generatedAt: string;
    routeCount: number;
    totals: {
        coreFail: number;
        corePass: number;
        secondaryWarn: number;
        secondaryPass: number;
    };
};

const pageTypeFilter = ref<PageType>('all');

const { data, status, refresh, error } = await useFetch<SummaryResponse>(
    '/api/web-vitals/summary',
    {
        server: false,
        lazy: true,
        default: () => ({
            ok: true,
            generatedAt: new Date().toISOString(),
            routeCount: 0,
            budgetTotals: { pass: 0, warn: 0, fail: 0 },
            routes: [],
        }),
    }
);

const { data: labData, refresh: refreshLab } = await useFetch<LabSummaryResponse>(
    '/api/web-vitals/lab-summary',
    {
        server: false,
        lazy: true,
        default: () => ({
            ok: true,
            hasData: false,
            generatedAt: '',
            routeCount: 0,
            totals: {
                coreFail: 0,
                corePass: 0,
                secondaryWarn: 0,
                secondaryPass: 0,
            },
        }),
    }
);

const rows = computed(() => data.value?.routes ?? []);
const filteredRows = computed(() => {
    if (pageTypeFilter.value === 'all') return rows.value;
    return rows.value.filter((row) => row.pageType === pageTypeFilter.value);
});
const generatedAtLabel = computed(() =>
    data.value?.generatedAt ? new Date(data.value.generatedAt).toLocaleString() : '-'
);
const labGeneratedAtLabel = computed(() =>
    labData.value?.generatedAt ? new Date(labData.value.generatedAt).toLocaleString() : '-'
);

function toneForMetric(name: MetricName, value?: number): StatusTone {
    if (value === undefined || value === null) return 'default';
    if (name === 'LCP') return value <= 2500 ? 'success' : value <= 4000 ? 'warning' : 'danger';
    if (name === 'INP') return value <= 200 ? 'success' : value <= 500 ? 'warning' : 'danger';
    return value <= 0.1 ? 'success' : value <= 0.25 ? 'warning' : 'danger';
}

function formatMetric(name: MetricName, value?: number): string {
    if (value === undefined || value === null) return '-';
    if (name === 'CLS') return value.toFixed(4);
    return `${Math.round(value)} ms`;
}

function routeBudgetTone(row: RouteVitals): StatusTone {
    const statuses = Object.values(row.budgets).map((item) => item.status);
    if (statuses.includes('fail')) return 'danger';
    if (statuses.includes('warn')) return 'warning';
    if (statuses.includes('pass')) return 'success';
    return 'default';
}

function routeBudgetLabel(row: RouteVitals): string {
    const tone = routeBudgetTone(row);
    if (tone === 'danger') return 'Fail';
    if (tone === 'warning') return 'Warn';
    if (tone === 'success') return 'Pass';
    return 'No Data';
}
</script>

<template>
    <section class="guide-wrapper guide-web-vitals">
        <header class="guide-header">
            <p class="guide-eyebrow">Core</p>
            <h1 class="guide-title">Web Vitals v2</h1>
            <p class="guide-description">
                Field (RUM) and Lab (LHCI) performance governance by page type.
            </p>
        </header>

        <section class="guide-section">
            <div class="web-vitals-toolbar">
                <label class="web-vitals-filter">
                    <span>Page Type</span>
                    <select v-model="pageTypeFilter">
                        <option value="all">All</option>
                        <option value="home">Home</option>
                        <option value="product-list">Product List</option>
                        <option value="product-detail">Product Detail</option>
                        <option value="auth">Auth</option>
                        <option value="account">Account</option>
                        <option value="other">Other</option>
                    </select>
                </label>
                <UiButton
                    type="button"
                    variant="outline"
                    tone="neutral"
                    size="sm"
                    data-testid="guide-web-vitals-refresh-button"
                    @click="refresh(); refreshLab()"
                >
                    Refresh
                </UiButton>
            </div>

            <div class="web-vitals-split">
                <article class="web-vitals-panel">
                    <h2>Field (RUM)</h2>
                    <p>Generated: <strong>{{ generatedAtLabel }}</strong></p>
                    <p>Routes: <strong>{{ filteredRows.length }}</strong></p>
                    <p class="budget-inline">
                        Core+Secondary Status:
                        <UiBadge variant="tonal" tone="success">Pass {{ data?.budgetTotals.pass ?? 0 }}</UiBadge>
                        <UiBadge variant="tonal" tone="warning">Warn {{ data?.budgetTotals.warn ?? 0 }}</UiBadge>
                        <UiBadge variant="tonal" tone="danger">Fail {{ data?.budgetTotals.fail ?? 0 }}</UiBadge>
                    </p>
                </article>
                <article class="web-vitals-panel">
                    <h2>Lab (LHCI)</h2>
                    <template v-if="labData?.hasData">
                        <p>Generated: <strong>{{ labGeneratedAtLabel }}</strong></p>
                        <p>Routes: <strong>{{ labData.routeCount }}</strong></p>
                        <p class="budget-inline">
                            <UiBadge variant="tonal" tone="danger">Core Fail {{ labData.totals.coreFail }}</UiBadge>
                            <UiBadge variant="tonal" tone="success">Core Pass {{ labData.totals.corePass }}</UiBadge>
                            <UiBadge variant="tonal" tone="warning">Secondary Warn {{ labData.totals.secondaryWarn }}</UiBadge>
                        </p>
                    </template>
                    <div v-else class="web-vitals-command-fallback">
                        <p>No lab summary found. Run:</p>
                        <GuideCommandList
                            :commands="['pnpm run perf:ci']"
                            testid-prefix="guide-web-vitals-command"
                        />
                    </div>
                </article>
            </div>

            <p v-if="status === 'pending'" class="web-vitals-hint">Loading vitals summary...</p>
            <p v-else-if="error" class="web-vitals-hint web-vitals-hint-danger">
                Unable to load summary. Check `/api/web-vitals/summary`.
            </p>
            <p v-else-if="filteredRows.length === 0" class="web-vitals-hint">
                No samples yet for selected filter.
            </p>

            <div v-else class="web-vitals-table-wrap">
                <table class="web-vitals-table">
                    <thead>
                        <tr>
                            <th>Route</th>
                            <th>Type</th>
                            <th>Budget</th>
                            <th>LCP</th>
                            <th>INP</th>
                            <th>CLS</th>
                            <th>Long Task p95</th>
                            <th>Hydration p75</th>
                            <th>Errors/API</th>
                            <th>Nav (Init/Soft)</th>
                            <th>Top Third-Party</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in filteredRows" :key="row.route">
                            <td class="route">{{ row.route }}</td>
                            <td>{{ row.pageType }}</td>
                            <td>
                                <UiBadge variant="tonal" :tone="routeBudgetTone(row)">
                                    {{ routeBudgetLabel(row) }}
                                </UiBadge>
                            </td>
                            <td>
                                <UiBadge variant="tonal" :tone="toneForMetric('LCP', row.p75.LCP)">
                                    {{ formatMetric('LCP', row.p75.LCP) }}
                                </UiBadge>
                            </td>
                            <td>
                                <UiBadge variant="tonal" :tone="toneForMetric('INP', row.p75.INP)">
                                    {{ formatMetric('INP', row.p75.INP) }}
                                </UiBadge>
                            </td>
                            <td>
                                <UiBadge variant="tonal" :tone="toneForMetric('CLS', row.p75.CLS)">
                                    {{ formatMetric('CLS', row.p75.CLS) }}
                                </UiBadge>
                            </td>
                            <td>{{ row.diagnostics.jsLongTaskP95 ? `${row.diagnostics.jsLongTaskP95} ms` : '-' }}</td>
                            <td>{{ row.diagnostics.hydrationMs ? `${row.diagnostics.hydrationMs} ms` : '-' }}</td>
                            <td>
                                {{ row.diagnostics.errorRate ?? '-' }}%
                                /
                                {{ row.diagnostics.apiFailureRate ?? '-' }}%
                            </td>
                            <td>{{ row.nav.initial }} / {{ row.nav.soft }}</td>
                            <td>
                                <span v-if="row.thirdPartyTop.length">
                                    {{ row.thirdPartyTop[0]?.host }}
                                </span>
                                <span v-else>-</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-web-vitals {
    .web-vitals-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 12px;
        margin-bottom: 12px;
    }

    .web-vitals-filter {
        display: grid;
        gap: 6px;
        font-size: 12px;
        color: var(--text-secondary);
    }

    .web-vitals-filter select {
        border: 1px solid var(--border-default);
        border-radius: 10px;
        padding: 8px 10px;
        min-width: 180px;
        background: var(--contrast-light);
        color: var(--text-primary);
    }

    .web-vitals-split {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 12px;
    }

    .web-vitals-panel {
        border: 1px solid var(--border-default);
        border-radius: 12px;
        background: var(--contrast-light);
        padding: 12px;
    }

    .web-vitals-panel h2 {
        margin: 0 0 8px;
        font-size: 16px;
        line-height: 28px;
        color: var(--text-primary);
    }

    .web-vitals-panel p {
        margin: 0;
        font-size: 14px;
        line-height: 24px;
        color: var(--text-secondary);
    }

    .web-vitals-command-fallback {
        display: grid;
        gap: 8px;
    }

    .budget-inline {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
    }

    .web-vitals-hint {
        margin: 0;
        color: var(--text-secondary);
    }

    .web-vitals-hint-danger {
        color: var(--error);
    }

    .web-vitals-table-wrap {
        overflow-x: auto;
        border: 1px solid var(--border-default);
        border-radius: 12px;
        background: var(--contrast-light);
    }

    .web-vitals-table {
        width: 100%;
        min-width: 1180px;
        border-collapse: collapse;
    }

    .web-vitals-table th,
    .web-vitals-table td {
        padding: 12px;
        border-bottom: 1px solid var(--border-default);
        text-align: left;
        font-size: 13px;
        color: var(--text-secondary);
        vertical-align: middle;
    }

    .web-vitals-table th {
        color: var(--text-primary);
        font-weight: 700;
        background: color-mix(in srgb, var(--gray-20) 55%, var(--contrast-light));
    }

    .web-vitals-table td.route {
        color: var(--text-primary);
        font-weight: 600;
    }

    @media (max-width: 900px) {
        .web-vitals-split {
            grid-template-columns: 1fr;
        }
    }
}
</style>
