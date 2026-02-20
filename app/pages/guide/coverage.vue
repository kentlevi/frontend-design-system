<script setup lang="ts">
import { computed } from 'vue';
import { guides } from '@/data/guide/guides';
const localePath = useLocalePath();

const uiComponentFiles = Object.keys(
    import.meta.glob('/app/components/ui/**/*.vue', { eager: false })
).sort();

type CoverageStatus = 'missing' | 'partial' | 'complete';

const coverageRows = computed(() => {
    const guideByFile = new Map<string, { title: string; path: string; hasHooks: boolean }>();

    for (const guide of guides) {
        const hasHooks = Boolean(guide.tags?.includes('testid'));
        for (const ref of guide.usedIn ?? []) {
            guideByFile.set(ref.path.replace(/\\/g, '/').toLowerCase(), {
                title: guide.title,
                path: guide.path,
                hasHooks,
            });
        }
    }

    return uiComponentFiles.map((rawPath) => {
        const path = rawPath.replace(/^.*\/app\//, 'frontend/app/');
        const guideRef = guideByFile.get(path.toLowerCase());
        let status: CoverageStatus = 'missing';
        if (guideRef) {
            status = guideRef.hasHooks ? 'complete' : 'partial';
        }

        return {
            component: path.split('/').pop()?.replace('.vue', '') ?? path,
            path,
            status,
            guide: guideRef,
        };
    });
});

const summary = computed(() => ({
    complete: coverageRows.value.filter((row) => row.status === 'complete').length,
    partial: coverageRows.value.filter((row) => row.status === 'partial').length,
    missing: coverageRows.value.filter((row) => row.status === 'missing').length,
}));
</script>

<template>
    <section class="guide-wrapper guide-coverage">
        <header class="guide-header">
            <p class="guide-eyebrow">Governance</p>
            <h1 class="guide-title">Guide Coverage Dashboard</h1>
            <p class="guide-description">
                Tracks shared UI components and identifies missing or partial guide coverage.
            </p>
        </header>

        <section class="guide-section">
            <div class="guide-coverage-summary">
                <UiBadge tone="success" variant="tonal">Complete: {{ summary.complete }}</UiBadge>
                <UiBadge tone="warning" variant="tonal">Partial: {{ summary.partial }}</UiBadge>
                <UiBadge tone="danger" variant="tonal">Missing: {{ summary.missing }}</UiBadge>
            </div>
            <div class="guide-coverage-table-wrap">
                <table class="guide-coverage-table">
                    <thead>
                        <tr>
                            <th>Component</th>
                            <th>Status</th>
                            <th>Guide</th>
                            <th>Source Path</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in coverageRows" :key="row.path">
                            <td>{{ row.component }}</td>
                            <td>
                                <UiBadge
                                    variant="tonal"
                                    :tone="
                                        row.status === 'complete'
                                            ? 'success'
                                            : row.status === 'partial'
                                                ? 'warning'
                                                : 'danger'
                                    "
                                >
                                    {{ row.status }}
                                </UiBadge>
                            </td>
                            <td>
                                <NuxtLink
                                    v-if="row.guide"
                                    :to="localePath(row.guide.path)"
                                    class="guide-coverage-link"
                                >
                                    {{ row.guide.title }}
                                </NuxtLink>
                                <span v-else>-</span>
                            </td>
                            <td><code>{{ row.path }}</code></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-coverage-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 14px;
}

.guide-coverage-table-wrap {
    overflow-x: auto;
    border: 1px solid var(--border-default);
    border-radius: 12px;
}

.guide-coverage-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
        text-align: left;
        padding: 10px 12px;
        border-bottom: 1px solid var(--border-default);
        font-size: 13px;
        line-height: 20px;
    }
}

.guide-coverage-link {
    color: var(--text-primary);
    text-decoration: underline;
}
</style>


