<script setup lang="ts">
const shadowScale = [
    {
        label: 'Base',
        token: '$shadow-base',
        css: '0 1px 2px rgba(51, 51, 51, 0.08)',
        use: 'Base separation for light surfaces and subtle cards.',
    },
    {
        label: 'Small',
        token: '$shadow-sm',
        css: '0 1px 2px rgba(51, 51, 51, 0.08)',
        use: 'Subtle lift for compact controls and inputs.',
    },
    {
        label: 'Medium',
        token: '$shadow-md',
        css: '0 4px 4px rgba(51, 51, 51, 0.04)',
        use: 'Default elevated component surfaces.',
    },
    {
        label: 'Large',
        token: '$shadow-lg',
        css: '0 16px 20px rgba(51, 51, 51, 0.08)',
        use: 'Menus, drawers, and layered panels.',
    },
    {
        label: 'XLarge',
        token: '$shadow-xl',
        css: '0 20px 40px rgba(51, 51, 51, 0.12)',
        use: 'Modals and high-priority overlays.',
    },
] as const;
</script>

<template>
    <section class="guide-wrapper guide-shadows">
        <header class="guide-header">
            <p class="guide-eyebrow">Foundation</p>
            <h1 class="guide-title">Shadows</h1>
            <p class="guide-description">
                Elevation scale used to separate layers, reinforce focus, and
                define surface hierarchy.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Elevation Scale</h2>
            <div class="guide-shadows-grid">
                <article
                    v-for="item in shadowScale"
                    :key="item.token"
                    class="shadow-card"
                >
                    <div class="shadow-preview-wrap">
                        <div class="shadow-preview" :style="{ boxShadow: item.css }" />
                    </div>
                    <p class="shadow-name">{{ item.label }}</p>
                    <p class="shadow-token">{{ item.token }}</p>
                    <p class="shadow-css">{{ item.css }}</p>
                    <p class="shadow-use">{{ item.use }}</p>
                </article>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Applied Example</h2>
            <div class="shadow-demo">
                <article class="shadow-demo-card shadow-demo-card--base">
                    <h3>Base Surface</h3>
                    <p>Uses `shadow-md` for default raised content.</p>
                </article>

                <article class="shadow-demo-card shadow-demo-card--overlay">
                    <h3>Overlay Surface</h3>
                    <p>Uses `shadow-xl` for stronger elevation context.</p>
                </article>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-shadows-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 14px;
}

.shadow-card {
    border: 1px solid var(--border-default);
    border-radius: 12px;
    background: var(--bg-surface);
    padding: 12px;
}

.shadow-preview-wrap {
    border: 1px dashed var(--border-default);
    border-radius: 10px;
    min-height: 110px;
    display: grid;
    place-items: center;
    background: var(--bg-muted);
}

.shadow-preview {
    width: 120px;
    height: 64px;
    border-radius: 10px;
    background: var(--contrast-light);
    border: 1px solid var(--border-default);
}

.shadow-token {
    margin: 2px 0 4px;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
}

.shadow-name {
    margin: 12px 0 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-secondary);
}

.shadow-css {
    margin: 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-secondary);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
        'Courier New', monospace;
}

.shadow-use {
    margin: 8px 0 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-muted);
}

.shadow-demo {
    border: 1px solid var(--border-default);
    border-radius: 12px;
    background: var(--bg-muted);
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 14px;
}

.shadow-demo-card {
    border-radius: 12px;
    border: 1px solid var(--border-default);
    background: var(--bg-surface);
    padding: 16px;

    h3 {
        margin: 0 0 6px;
        font-size: var(--type-size-200);
        line-height: var(--type-line-200);
        color: var(--text-primary);
    }

    p {
        margin: 0;
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        color: var(--text-secondary);
    }
}

.shadow-demo-card--base {
    box-shadow: 0 4px 4px rgba(51, 51, 51, 0.04);
}

.shadow-demo-card--overlay {
    box-shadow: 0 20px 40px rgba(51, 51, 51, 0.12);
}
</style>
