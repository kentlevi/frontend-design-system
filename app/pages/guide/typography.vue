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
        font-size: 12px;
        line-height: 20px;
        color: var(--text-muted);
    }

    .type-sample {
        margin: 0;
        color: var(--text-primary);
    }

    .type-display {
        font-size: 48px;
        line-height: 68px;
        font-weight: 700;
    }

    .type-h1 {
        font-size: 32px;
        line-height: 44px;
        font-weight: 700;
    }

    .type-h2 {
        font-size: 24px;
        line-height: 36px;
        font-weight: 600;
    }

    .type-body {
        font-size: 16px;
        font-weight: 400;
        line-height: 28px;
    }

    .type-caption {
        font-size: 14px;
        line-height: 24px;
        font-weight: 400;
    }

    .type-micro {
        font-size: 12px;
        line-height: 20px;
        font-weight: 500;
    }
}
</style>
