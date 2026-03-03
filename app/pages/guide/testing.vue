<script setup lang="ts">
import GuideCommandList from '@/components/guide/GuideCommandList.vue';

const componentName = ref('UiButton');
const stateName = ref('default');
const actionName = ref('click');

const generatedTestId = computed(
    () =>
        `${componentName.value}-${stateName.value}-${actionName.value}`
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
);
</script>

<template>
    <section class="guide-wrapper guide-testing">
        <header class="guide-header">
            <p class="guide-eyebrow">Core</p>
            <h1 class="guide-title">Testing</h1>
            <p class="guide-description">
                Standard testing patterns for accessibility, interaction, visual
                stability, and release QA.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Test ID Conventions</h2>
            <article class="testing-card">
                <p class="testing-copy">
                    Use stable, descriptive, kebab-case IDs: `component-state-action`.
                </p>
                <div class="testing-grid">
                    <UiInput v-model="componentName" placeholder="Component (e.g. UiButton)" />
                    <UiInput v-model="stateName" placeholder="State (e.g. active)" />
                    <UiInput v-model="actionName" placeholder="Action (e.g. click)" />
                </div>
                <p class="testing-output">
                    Suggested `data-testid`: <strong>{{ generatedTestId }}</strong>
                </p>
            </article>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Accessibility Test Checklist</h2>
            <article class="testing-card">
                <ul class="testing-list">
                    <li>Buttons expose accessible names (including icon-only buttons).</li>
                    <li>Images have meaningful non-redundant alt text.</li>
                    <li>Modal flows support focus trap, Escape close, and focus return.</li>
                    <li>Document root includes correct `lang` attribute.</li>
                    <li>Focus-visible states are clear on all interactive controls.</li>
                </ul>
            </article>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Interaction Test Matrix</h2>
            <article class="testing-card">
                <div class="testing-chip-row">
                    <UiBadge variant="outline">Hover</UiBadge>
                    <UiBadge variant="outline">Focus</UiBadge>
                    <UiBadge variant="outline">Active</UiBadge>
                    <UiBadge variant="outline">Disabled</UiBadge>
                    <UiBadge variant="outline">Loading</UiBadge>
                    <UiBadge variant="outline">Keyboard</UiBadge>
                </div>
                <p class="testing-copy">
                    Validate each component against all relevant states before merge.
                </p>
            </article>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Performance Budget Targets</h2>
            <article class="testing-card">
                <ul class="testing-list">
                    <li>LCP <= 2.5s, CLS <= 0.10, performance score >= 0.90.</li>
                    <li>Total byte weight <= 350KB per route budget target.</li>
                    <li>Script budget <= 170KB, stylesheet budget <= 70KB, image budget <= 250KB.</li>
                    <li>Apply LCP image guidance: eager, fetchpriority=high, fixed dimensions.</li>
                </ul>
            </article>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">SEO and Metadata QA</h2>
            <article class="testing-card">
                <ul class="testing-list">
                    <li>Title, meta description, and canonical are set per route.</li>
                    <li>Document language and locale alternate tags are valid per page.</li>
                    <li>Open Graph and social metadata are present on key landing pages.</li>
                    <li>Product routes include structured data and unique descriptive text.</li>
                </ul>
            </article>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Visual Regression Targets</h2>
            <article class="testing-card">
                <ul class="testing-list">
                    <li>Guide base pages: colors, typography, spacing, buttons.</li>
                    <li>Core flows: cart patterns, header patterns, auth flow.</li>
                    <li>Overlay states: modals, search, locale, cart drawer open/close.</li>
                    <li>Responsive snapshots at mobile, tablet, and desktop widths.</li>
                </ul>
            </article>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Release Gate Commands</h2>
            <article class="testing-card">
                <GuideCommandList
                    title="Use these commands as release gate baseline."
                    :commands="[
                        'pnpm --dir playwright-shared run test:smoke',
                        'pnpm --dir playwright-shared run test:guide',
                        'pnpm --dir playwright-shared run test:guide-onboarding',
                        'pnpm run quality:ci',
                    ]"
                    testid-prefix="guide-testing-command"
                />
            </article>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Pre-release QA Pass</h2>
            <article class="testing-card">
                <ul class="testing-list">
                    <li>Run Lighthouse and fix critical accessibility and CLS issues.</li>
                    <li>Verify i18n overflow behavior on long strings and alternate locales.</li>
                    <li>Check animation timing and reduced-motion behavior.</li>
                    <li>Confirm all critical user journeys with deterministic test IDs.</li>
                </ul>
            </article>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-testing {
    .testing-card {
        border: 1px solid var(--border-default);
        border-radius: 14px;
        background: var(--contrast-light);
        padding: 16px;
        display: grid;
        gap: 12px;
    }

    .testing-copy {
        margin: 0;
        color: var(--text-secondary);
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
    }

    .testing-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }

    .testing-output {
        margin: 0;
        color: var(--text-secondary);
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);

        strong {
            color: var(--text-primary);
            font-weight: var(--font-weight-bold);
        }
    }

    .testing-list {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: 6px;
        color: var(--text-secondary);
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
    }

    .testing-chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    @media (max-width: 900px) {
        .testing-grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>
