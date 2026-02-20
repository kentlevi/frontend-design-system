<script setup lang="ts">
const localePath = useLocalePath();
type MetricName = 'LCP' | 'INP' | 'CLS';

type RouteVitals = {
    route: string;
    count: number;
    lastSeen: string;
    p75: Partial<Record<MetricName, number>>;
};

type SummaryResponse = {
    ok: boolean;
    generatedAt: string;
    routeCount: number;
    routes: RouteVitals[];
};

type StatusTone = 'success' | 'warning' | 'danger' | 'default';
type SampleQuality = 'low' | 'medium' | 'high';

const { data, status, refresh, error } = await useFetch<SummaryResponse>(
    '/api/web-vitals/summary',
    {
        server: false,
        lazy: true,
        default: () => ({
            ok: true,
            generatedAt: new Date().toISOString(),
            routeCount: 0,
            routes: [],
        }),
    }
);

const rows = computed(() => data.value?.routes ?? []);
const hasRows = computed(() => rows.value.length > 0);
const generatedAtLabel = computed(() => {
    if (!data.value?.generatedAt) return '-';
    return new Date(data.value.generatedAt).toLocaleString();
});

function formatMetric(name: MetricName, value?: number): string {
    if (value === undefined || value === null) return '-';
    if (name === 'CLS') return value.toFixed(4);
    return `${Math.round(value)} ms`;
}

function toneForMetric(
    name: MetricName,
    value?: number
): 'success' | 'warning' | 'danger' | 'default' {
    if (value === undefined || value === null) return 'default';

    if (name === 'LCP') {
        if (value <= 2500) return 'success';
        if (value <= 4000) return 'warning';
        return 'danger';
    }

    if (name === 'INP') {
        if (value <= 200) return 'success';
        if (value <= 500) return 'warning';
        return 'danger';
    }

    if (value <= 0.1) return 'success';
    if (value <= 0.25) return 'warning';
    return 'danger';
}

function statusLabelForTone(
    tone: StatusTone
): string {
    if (tone === 'success') return 'Good';
    if (tone === 'warning') return 'Needs Improvement';
    if (tone === 'danger') return 'Poor';
    return 'No Data';
}

function severityFromTone(
    tone: StatusTone
): number {
    if (tone === 'danger') return 3;
    if (tone === 'warning') return 2;
    if (tone === 'success') return 1;
    return 0;
}

function overallStatus(
    row: RouteVitals
): {
    tone: StatusTone;
    label: string;
} {
    const tones = [
        toneForMetric('LCP', row.p75.LCP),
        toneForMetric('INP', row.p75.INP),
        toneForMetric('CLS', row.p75.CLS),
    ];

    let selected: 'success' | 'warning' | 'danger' | 'default' = 'default';
    for (const tone of tones) {
        if (severityFromTone(tone) > severityFromTone(selected)) {
            selected = tone;
        }
    }

    return {
        tone: selected,
        label: statusLabelForTone(selected),
    };
}

function sampleQuality(row: RouteVitals): {
    level: SampleQuality;
    tone: StatusTone;
    label: string;
} {
    if (row.count < 30) {
        return { level: 'low', tone: 'default', label: 'Insufficient (<30)' };
    }

    if (row.count < 100) {
        return { level: 'medium', tone: 'warning', label: 'Developing (30-99)' };
    }

    return { level: 'high', tone: 'success', label: 'Reliable (100+)' };
}

function hoursSince(isoDate: string): number {
    const ts = new Date(isoDate).getTime();
    if (Number.isNaN(ts)) return Number.POSITIVE_INFINITY;
    return Math.max(0, (Date.now() - ts) / (1000 * 60 * 60));
}

const totalRoutes = computed(() => rows.value.length);

function countOverallByTone(tone: StatusTone): number {
    return rows.value.filter((row) => overallStatus(row).tone === tone).length;
}

function countMetricByTone(metric: MetricName, tone: StatusTone): number {
    return rows.value.filter((row) => toneForMetric(metric, row.p75[metric]) === tone).length;
}

const statusCards = computed(() => [
    { key: 'good', label: 'Good', tone: 'success' as const, count: countOverallByTone('success') },
    {
        key: 'needs',
        label: 'Needs Improvement',
        tone: 'warning' as const,
        count: countOverallByTone('warning'),
    },
    { key: 'poor', label: 'Poor', tone: 'danger' as const, count: countOverallByTone('danger') },
    { key: 'no-data', label: 'No Data', tone: 'default' as const, count: countOverallByTone('default') },
]);

const metricBreakdown = computed(() => {
    const metrics: MetricName[] = ['LCP', 'INP', 'CLS'];

    return metrics.map((metric) => {
        const good = countMetricByTone(metric, 'success');
        const needs = countMetricByTone(metric, 'warning');
        const poor = countMetricByTone(metric, 'danger');
        const none = countMetricByTone(metric, 'default');
        const total = totalRoutes.value || 1;

        return {
            metric,
            good,
            needs,
            poor,
            none,
            goodPct: (good / total) * 100,
            needsPct: (needs / total) * 100,
            poorPct: (poor / total) * 100,
            nonePct: (none / total) * 100,
        };
    });
});

const qualityCards = computed(() => {
    const low = rows.value.filter((row) => sampleQuality(row).level === 'low').length;
    const medium = rows.value.filter((row) => sampleQuality(row).level === 'medium').length;
    const high = rows.value.filter((row) => sampleQuality(row).level === 'high').length;

    return [
        { key: 'low', label: 'Insufficient', tone: 'default' as const, count: low },
        { key: 'medium', label: 'Developing', tone: 'warning' as const, count: medium },
        { key: 'high', label: 'Reliable', tone: 'success' as const, count: high },
    ];
});

const activityTrend = computed(() => {
    const fresh = rows.value.filter((row) => hoursSince(row.lastSeen) <= 1).length;
    const recent = rows.value.filter((row) => {
        const hours = hoursSince(row.lastSeen);
        return hours > 1 && hours <= 24;
    }).length;
    const stale = rows.value.filter((row) => hoursSince(row.lastSeen) > 24).length;
    const total = totalRoutes.value || 1;

    return {
        fresh,
        recent,
        stale,
        freshPct: (fresh / total) * 100,
        recentPct: (recent / total) * 100,
        stalePct: (stale / total) * 100,
    };
});
</script>

<template>
    <section class="guide-wrapper guide-web-vitals">
        <header class="guide-header">
            <p class="guide-eyebrow">Core</p>
            <h1 class="guide-title">Web Vitals</h1>
            <p class="guide-description">
                Real-user p75 vitals by route from the telemetry endpoint.
            </p>
        </header>

        <section class="guide-section">
            <article class="web-vitals-explainer">
                <h2 class="web-vitals-explainer-title">How to read this</h2>
                <ul class="web-vitals-explainer-list">
                    <li><strong>LCP</strong>: Largest Contentful Paint. Measures loading speed of the main visible content.</li>
                    <li><strong>INP</strong>: Interaction to Next Paint. Measures responsiveness after user input.</li>
                    <li><strong>CLS</strong>: Cumulative Layout Shift. Measures unexpected visual movement.</li>
                    <li><strong>p75</strong>: 75th percentile. 75% of visits are at or better than this value.</li>
                    <li><strong>Status</strong>: Derived from the worst metric on that route.</li>
                </ul>
                <p class="web-vitals-thresholds">
                    Good: LCP <= 2500ms, INP <= 200ms, CLS <= 0.10. Needs Improvement: LCP <= 4000ms, INP <= 500ms, CLS <= 0.25. Poor: above those thresholds.
                </p>
                <p class="web-vitals-thresholds">
                    Related QA workflow:
                    <NuxtLink :to="localePath('/guide/testing')">
                        Guide Testing
                    </NuxtLink>
                </p>
            </article>

            <section v-if="hasRows" class="web-vitals-visuals">
                <div class="web-vitals-status-cards">
                    <article v-for="card in statusCards" :key="card.key" class="web-vitals-status-card">
                        <p class="web-vitals-status-label">{{ card.label }}</p>
                        <p class="web-vitals-status-value">{{ card.count }}</p>
                        <UiBadge variant="tonal" :tone="card.tone">{{ card.label }}</UiBadge>
                    </article>
                </div>

                <div class="web-vitals-quality-cards">
                    <article
                        v-for="card in qualityCards"
                        :key="card.key"
                        class="web-vitals-status-card"
                    >
                        <p class="web-vitals-status-label">Sample Quality</p>
                        <p class="web-vitals-status-value">{{ card.count }}</p>
                        <UiBadge variant="tonal" :tone="card.tone">{{ card.label }}</UiBadge>
                    </article>
                </div>

                <article class="web-vitals-activity-card">
                    <div class="web-vitals-metric-head">
                        <h3>Route Activity Trend</h3>
                        <p>{{ totalRoutes }} routes</p>
                    </div>

                    <div
                        class="web-vitals-bar"
                        role="img"
                        aria-label="Route activity distribution by recency"
                    >
                        <span class="segment segment-fresh" :style="{ width: `${activityTrend.freshPct}%` }" />
                        <span class="segment segment-recent" :style="{ width: `${activityTrend.recentPct}%` }" />
                        <span class="segment segment-stale" :style="{ width: `${activityTrend.stalePct}%` }" />
                    </div>

                    <p class="web-vitals-metric-meta">
                        Last hour {{ activityTrend.fresh }} | Last 24h {{ activityTrend.recent }} | Older {{ activityTrend.stale }}
                    </p>
                </article>

                <div class="web-vitals-metric-bars">
                    <article
                        v-for="item in metricBreakdown"
                        :key="item.metric"
                        class="web-vitals-metric-card"
                    >
                        <div class="web-vitals-metric-head">
                            <h3>{{ item.metric }}</h3>
                            <p>{{ totalRoutes }} routes</p>
                        </div>

                        <div class="web-vitals-bar" role="img" :aria-label="`${item.metric} status distribution`">
                            <span class="segment segment-good" :style="{ width: `${item.goodPct}%` }" />
                            <span class="segment segment-needs" :style="{ width: `${item.needsPct}%` }" />
                            <span class="segment segment-poor" :style="{ width: `${item.poorPct}%` }" />
                            <span class="segment segment-none" :style="{ width: `${item.nonePct}%` }" />
                        </div>

                        <p class="web-vitals-metric-meta">
                            Good {{ item.good }} | Needs {{ item.needs }} | Poor {{ item.poor }} | No Data {{ item.none }}
                        </p>
                    </article>
                </div>
            </section>

            <div class="web-vitals-toolbar">
                <p class="web-vitals-meta">
                    Generated: <strong>{{ generatedAtLabel }}</strong>
                </p>
                <UiButton
                    type="button"
                    variant="outline"
                    tone="neutral"
                    size="sm"
                    data-testid="guide-web-vitals-refresh-button"
                    @click="refresh()"
                >
                    Refresh
                </UiButton>
            </div>

            <p v-if="status === 'pending'" class="web-vitals-hint">Loading vitals summary...</p>
            <p v-else-if="error" class="web-vitals-hint web-vitals-hint-danger">
                Unable to load summary. Check `/api/web-vitals/summary` and restart dev/preview server.
            </p>
            <p v-else-if="!hasRows" class="web-vitals-hint">
                No samples yet. Enable `runtimeConfig.public.webVitalsEnabled` and navigate routes.
            </p>

            <div v-else class="web-vitals-table-wrap">
                <table class="web-vitals-table">
                    <thead>
                        <tr>
                            <th>Route</th>
                            <th>Status</th>
                            <th>Quality</th>
                            <th>Samples</th>
                            <th>LCP p75</th>
                            <th>INP p75</th>
                            <th>CLS p75</th>
                            <th>Last Seen</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in rows" :key="row.route">
                            <td class="route">{{ row.route }}</td>
                            <td>
                                <UiBadge variant="tonal" :tone="overallStatus(row).tone">
                                    {{ overallStatus(row).label }}
                                </UiBadge>
                            </td>
                            <td>
                                <UiBadge variant="tonal" :tone="sampleQuality(row).tone">
                                    {{ sampleQuality(row).label }}
                                </UiBadge>
                            </td>
                            <td>{{ row.count }}</td>
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
                            <td>{{ new Date(row.lastSeen).toLocaleString() }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-web-vitals {
    .web-vitals-explainer {
        border: 1px solid var(--border-default);
        border-radius: 12px;
        background: var(--contrast-light);
        padding: 14px;
        margin-bottom: 12px;
    }

    .web-vitals-explainer-title {
        margin: 0 0 8px;
        font-size: 16px;
        line-height: 24px;
        color: var(--text-primary);
    }

    .web-vitals-explainer-list {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: 4px;
        color: var(--text-secondary);
        font-size: 13px;
        line-height: 22px;
    }

    .web-vitals-thresholds {
        margin: 10px 0 0;
        color: var(--text-secondary);
        font-size: 13px;
        line-height: 22px;
    }

    .web-vitals-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
    }

    .web-vitals-visuals {
        margin-bottom: 12px;
        display: grid;
        gap: 12px;
    }

    .web-vitals-status-cards {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
    }

    .web-vitals-quality-cards {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }

    .web-vitals-status-card {
        border: 1px solid var(--border-default);
        border-radius: 10px;
        background: var(--contrast-light);
        padding: 10px;
        display: grid;
        gap: 6px;
    }

    .web-vitals-status-label {
        margin: 0;
        font-size: 12px;
        line-height: 18px;
        color: var(--text-secondary);
    }

    .web-vitals-status-value {
        margin: 0;
        font-size: 24px;
        line-height: 30px;
        color: var(--text-primary);
        font-weight: 700;
    }

    .web-vitals-metric-bars {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }

    .web-vitals-activity-card {
        border: 1px solid var(--border-default);
        border-radius: 10px;
        background: var(--contrast-light);
        padding: 10px;
        display: grid;
        gap: 8px;
    }

    .web-vitals-metric-card {
        border: 1px solid var(--border-default);
        border-radius: 10px;
        background: var(--contrast-light);
        padding: 10px;
        display: grid;
        gap: 8px;
    }

    .web-vitals-metric-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 10px;

        h3,
        p {
            margin: 0;
        }

        h3 {
            font-size: 14px;
            line-height: 20px;
            color: var(--text-primary);
        }

        p {
            font-size: 12px;
            line-height: 18px;
            color: var(--text-secondary);
        }
    }

    .web-vitals-bar {
        height: 8px;
        width: 100%;
        border-radius: 999px;
        overflow: hidden;
        display: flex;
        background: var(--gray-20);

        .segment {
            height: 100%;
            display: block;
        }

        .segment-good {
            background: #16a34a;
        }

        .segment-needs {
            background: #f59e0b;
        }

        .segment-poor {
            background: #dc2626;
        }

        .segment-none {
            background: #cbd5e1;
        }

        .segment-fresh {
            background: #16a34a;
        }

        .segment-recent {
            background: #f59e0b;
        }

        .segment-stale {
            background: #94a3b8;
        }
    }

    .web-vitals-metric-meta {
        margin: 0;
        font-size: 12px;
        line-height: 18px;
        color: var(--text-secondary);
    }

    .web-vitals-meta {
        margin: 0;
        font-size: 14px;
        line-height: 22px;
        color: var(--text-secondary);
    }

    .web-vitals-hint {
        margin: 0;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 24px;
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
        border-collapse: collapse;
        min-width: 760px;

        th,
        td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--border-default);
            font-size: 13px;
            line-height: 20px;
            color: var(--text-secondary);
            vertical-align: middle;
        }

        th {
            color: var(--text-primary);
            font-weight: 700;
            background: color-mix(in srgb, var(--gray-20) 55%, var(--contrast-light));
        }

        tbody tr:last-child td {
            border-bottom: 0;
        }

        td.route {
            color: var(--text-primary);
            font-weight: 600;
        }
    }

    @media (max-width: 980px) {
        .web-vitals-status-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .web-vitals-quality-cards {
            grid-template-columns: 1fr;
        }

        .web-vitals-metric-bars {
            grid-template-columns: 1fr;
        }
    }
}
</style>
