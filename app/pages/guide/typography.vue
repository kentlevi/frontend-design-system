<template>
    <section class="guide-wrapper guide-typography">
        <header class="guide-header">
            <p class="guide-eyebrow">Foundation</p>
            <h1 class="guide-title">Typography</h1>
            <p class="guide-description">
                Core type scale for headings, body copy, and supporting text.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Type Scale</h2>
            <div class="guide-grid">
                <article class="type-row">
                    <p class="type-token">Display / 48</p>
                    <p class="type-sample type-display">
                        The sticker that makes it click, every time.
                    </p>
                </article>
                <article class="type-row">
                    <p class="type-token">Heading / 32</p>
                    <p class="type-sample type-h1">Client Reviews, Satisfaction Guaranteed.</p>
                </article>
                <article class="type-row">
                    <p class="type-token">Subheading / 24</p>
                    <p class="type-sample type-h2">Popular products this week</p>
                </article>
                <article class="type-row">
                    <p class="type-token">Body / 16</p>
                    <p class="type-sample type-body">
                        Real reviews, real photos, and clear communication help customers decide faster.
                    </p>
                </article>
                <article class="type-row">
                    <p class="type-token">Caption / 14</p>
                    <p class="type-sample type-caption">Shipping fees and discounts are calculated at checkout.</p>
                </article>
                <article class="type-row">
                    <p class="type-token">Micro / 12</p>
                    <p class="type-sample type-micro">Updated 2 minutes ago</p>
                </article>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-typography {
    .type-row {
        border: 1px solid var(--border-default);
        border-radius: 12px;
        background: var(--contrast-light);
        padding: 14px 16px;
    }

    .type-token {
        margin: 0 0 8px;
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        color: var(--text-muted);
    }

    .type-sample {
        margin: 0;
        color: var(--text-primary);
    }

    .type-display {
        font-size: var(--type-size-600);
        line-height: var(--type-line-600);
        font-weight: var(--font-weight-bold);
    }

    .type-h1 {
        font-size: var(--type-size-500);
        line-height: var(--type-line-500);
        font-weight: var(--font-weight-bold);
    }

    .type-h2 {
        font-size: var(--type-size-400);
        line-height: var(--type-line-400);
        font-weight: var(--font-weight-semibold);
    }

    .type-body {
        font-size: var(--type-size-200);
        font-weight: var(--font-weight-regular);
        line-height: var(--type-line-200);
    }

    .type-caption {
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        font-weight: var(--font-weight-regular);
    }

    .type-micro {
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        font-weight: var(--font-weight-medium);
    }
}
</style>
