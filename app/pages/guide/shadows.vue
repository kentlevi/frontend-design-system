<script setup lang="ts">
const shadowScale = [
    {
        token: '$shadow-sm',
        css: '0 1px 2px rgba(0, 0, 0, 0.06)',
        use: 'Subtle lift for compact controls',
    },
    {
        token: '$shadow-md',
        css: '0 4px 10px rgba(0, 0, 0, 0.08)',
        use: 'Default elevated component surfaces',
    },
    {
        token: '$shadow-lg',
        css: '0 8px 24px rgba(0, 0, 0, 0.18)',
        use: 'Menus, popovers, and layered panels',
    },
    {
        token: '$shadow-xl',
        css: '0 16px 40px rgba(0, 0, 0, 0.24)',
        use: 'Modals and high-priority overlays',
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
    margin: 12px 0 4px;
    font-size: 13px;
    line-height: 20px;
    font-weight: 700;
    color: var(--text-primary);
}

.shadow-css {
    margin: 0;
    font-size: 12px;
    line-height: 18px;
    color: var(--text-secondary);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
        'Courier New', monospace;
}

.shadow-use {
    margin: 8px 0 0;
    font-size: 12px;
    line-height: 18px;
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
        font-size: 16px;
        line-height: 24px;
        color: var(--text-primary);
    }

    p {
        margin: 0;
        font-size: 13px;
        line-height: 20px;
        color: var(--text-secondary);
    }
}

.shadow-demo-card--base {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.shadow-demo-card--overlay {
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.24);
}
</style>
