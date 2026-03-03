<script setup lang="ts">
const spacingScale = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64];
</script>

<template>
    <section class="guide-wrapper guide-spacing">
        <header class="guide-header">
            <p class="guide-eyebrow">Foundation</p>
            <h1 class="guide-title">Spacing</h1>
            <p class="guide-description">
                Base spacing scale and layout rhythm used in cards, sections, and forms.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Spacing Scale</h2>
            <div class="guide-grid">
                <article v-for="value in spacingScale" :key="value" class="space-row">
                    <p class="space-token">{{ value }}px</p>
                    <div class="space-demo">
                        <span class="space-block" :style="{ width: `${value}px` }" />
                    </div>
                </article>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Section Rhythm Example</h2>
            <div class="rhythm-card">
                <h3>Card Title</h3>
                <p>
                    Spacing between title, description, and actions follows the same scale for predictable layout behavior.
                </p>
                <div class="rhythm-actions">
                    <UiButton variant="outline" tone="neutral">Cancel</UiButton>
                    <UiButton tone="neutral">Save</UiButton>
                </div>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-spacing {
    .space-row {
        border: 1px solid var(--border-default);
        border-radius: 12px;
        background: var(--contrast-light);
        padding: 12px 14px;
        display: grid;
        grid-template-columns: 64px 1fr;
        align-items: center;
        gap: 12px;
    }

    .space-token {
        margin: 0;
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        color: var(--text-muted);
    }

    .space-demo {
        height: 14px;
        background: var(--bg-muted);
        border-radius: 999px;
        display: flex;
        align-items: center;
        padding: 0 6px;
    }

    .space-block {
        height: 6px;
        border-radius: 999px;
        background: var(--brand-secondary);
        display: block;
    }

    .rhythm-card {
        border: 1px solid var(--border-default);
        border-radius: 14px;
        background: var(--contrast-light);
        padding: 24px;

        h3 {
            margin: 0 0 12px;
            font-size: var(--type-size-300);
            line-height: var(--type-line-300);
            color: var(--text-primary);
        }

        p {
            margin: 0 0 24px;
            font-size: var(--type-size-200);
            line-height: var(--type-line-200);
            color: var(--text-secondary);
        }
    }

    .rhythm-actions {
        display: flex;
        gap: 12px;
    }
}
</style>
