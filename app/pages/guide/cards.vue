<script setup lang="ts">
import GuideCopy from '@/components/guide/GuideCopy.vue';

const cardMarkup = {
    default: `<article class="guide-card-sample">
  <header class="guide-card-sample-header">
    <h3 class="guide-card-sample-title">Premium Vinyl Stickers</h3>
    <UiBadge tone="success">Popular</UiBadge>
  </header>
  <p class="guide-card-sample-meta">Ships in 2-3 business days</p>
  <p class="guide-card-sample-body">
    Waterproof, UV-resistant, and ideal for product packaging, laptops, and outdoor use.
  </p>
  <footer class="guide-card-sample-footer">
    <UiButton tone="neutral">Customize</UiButton>
  </footer>
</article>`,
    interactive: `<article class="guide-card-sample guide-card-sample-interactive">
  <p class="guide-card-sample-kicker">Product Collection</p>
  <h3 class="guide-card-sample-title">Die-Cut Roll Stickers</h3>
  <p class="guide-card-sample-body">
    Compact roll format for fast dispensing and high-volume packaging workflows.
  </p>
  <div class="guide-card-sample-arrow" aria-hidden="true">
    <UiIcon name="light-long-arrow-right" />
  </div>
</article>`,
    media: `<article class="guide-card-sample">
  <div class="guide-card-sample-media" aria-hidden="true"></div>
  <h3 class="guide-card-sample-title">Matte Finish Pack</h3>
  <p class="guide-card-sample-meta">Starts at: $24.00</p>
  <p class="guide-card-sample-body">
    Smooth matte coating with durable adhesive for premium brand applications.
  </p>
  <footer class="guide-card-sample-footer">
    <UiButton tone="neutral">View Details</UiButton>
  </footer>
</article>`,
    defaultSecondary: `<article class="guide-card-sample">
  <header class="guide-card-sample-header">
    <h3 class="guide-card-sample-title">Gloss Sticker Bundle</h3>
    <UiBadge tone="warning">Low Stock</UiBadge>
  </header>
  <p class="guide-card-sample-meta">Ships next business day</p>
  <p class="guide-card-sample-body">
    High-shine finish for bold brand visuals and packaging inserts.
  </p>
  <footer class="guide-card-sample-footer">
    <UiButton tone="neutral" variant="outline">Customize</UiButton>
  </footer>
</article>`,
    defaultTertiary: `<article class="guide-card-sample">
  <header class="guide-card-sample-header">
    <h3 class="guide-card-sample-title">Eco Paper Labels</h3>
    <UiBadge tone="success">New</UiBadge>
  </header>
  <p class="guide-card-sample-meta">Best for indoor packaging</p>
  <p class="guide-card-sample-body">
    Lightweight paper stock with clean print detail and writable surface.
  </p>
  <footer class="guide-card-sample-footer">
    <UiButton tone="neutral">Customize</UiButton>
  </footer>
</article>`,
    interactiveSecondary: `<article class="guide-card-sample guide-card-sample-interactive">
  <p class="guide-card-sample-kicker">Recommended</p>
  <h3 class="guide-card-sample-title">Kiss-Cut Sticker Sheets</h3>
  <p class="guide-card-sample-body">
    Multiple artwork cuts on one sheet for giveaways and small packs.
  </p>
  <div class="guide-card-sample-arrow" aria-hidden="true">
    <UiIcon name="light-long-arrow-right" />
  </div>
</article>`,
    interactiveTertiary: `<article class="guide-card-sample guide-card-sample-interactive">
  <p class="guide-card-sample-kicker">Team Favorite</p>
  <h3 class="guide-card-sample-title">Holographic Labels</h3>
  <p class="guide-card-sample-body">
    Metallic shimmer stock for premium promo drops and product launches.
  </p>
  <div class="guide-card-sample-arrow" aria-hidden="true">
    <UiIcon name="light-long-arrow-right" />
  </div>
</article>`,
    mediaSecondary: `<article class="guide-card-sample">
  <div class="guide-card-sample-media" aria-hidden="true"></div>
  <h3 class="guide-card-sample-title">Starter Sample Pack</h3>
  <p class="guide-card-sample-meta">Starts at: $16.00</p>
  <p class="guide-card-sample-body">
    Compact pack to compare finish, adhesive, and print detail before scaling.
  </p>
  <footer class="guide-card-sample-footer">
    <UiButton tone="neutral" variant="outline">View Details</UiButton>
  </footer>
</article>`,
    mediaTertiary: `<article class="guide-card-sample">
  <div class="guide-card-sample-media" aria-hidden="true"></div>
  <h3 class="guide-card-sample-title">Premium Outdoor Set</h3>
  <p class="guide-card-sample-meta">Starts at: $29.00</p>
  <p class="guide-card-sample-body">
    Weatherproof material for long-term durability on vehicles and gear.
  </p>
  <footer class="guide-card-sample-footer">
    <UiButton tone="neutral">View Details</UiButton>
  </footer>
</article>`,
} as const;
</script>

<template>
    <section class="guide-wrapper guide-cards">
        <header class="guide-header">
            <p class="guide-eyebrow">Base</p>
            <h1 class="guide-title">Cards</h1>
            <p class="guide-description">
                Reusable card patterns for grouped content, media previews, and
                action-driven summaries.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Default Card</h2>
            <div class="guide-card-grid">
                <GuideCopy
                    class="guide-copy-start guide-card-copy-wrap"
                    :text="cardMarkup.default"
                    :ignore-interactive-click="true"
                >
                    <article class="guide-card-sample">
                    <header class="guide-card-sample-header">
                        <h3 class="guide-card-sample-title">
                            Premium Vinyl Stickers
                        </h3>
                        <UiBadge tone="success">Popular</UiBadge>
                    </header>
                    <p class="guide-card-sample-meta">
                        Ships in 2-3 business days
                    </p>
                    <p class="guide-card-sample-body">
                        Waterproof, UV-resistant, and ideal for product
                        packaging, laptops, and outdoor use.
                    </p>
                    <footer class="guide-card-sample-footer">
                        <UiButton tone="neutral">Customize</UiButton>
                    </footer>
                    </article>
                </GuideCopy>
                <GuideCopy
                    class="guide-copy-start guide-card-copy-wrap"
                    :text="cardMarkup.defaultSecondary"
                    :ignore-interactive-click="true"
                >
                    <article class="guide-card-sample">
                        <header class="guide-card-sample-header">
                            <h3 class="guide-card-sample-title">Gloss Sticker Bundle</h3>
                            <UiBadge tone="warning">Low Stock</UiBadge>
                        </header>
                        <p class="guide-card-sample-meta">Ships next business day</p>
                        <p class="guide-card-sample-body">
                            High-shine finish for bold brand visuals and packaging inserts.
                        </p>
                        <footer class="guide-card-sample-footer">
                            <UiButton tone="neutral" variant="outline">Customize</UiButton>
                        </footer>
                    </article>
                </GuideCopy>
                <GuideCopy
                    class="guide-copy-start guide-card-copy-wrap"
                    :text="cardMarkup.defaultTertiary"
                    :ignore-interactive-click="true"
                >
                    <article class="guide-card-sample">
                        <header class="guide-card-sample-header">
                            <h3 class="guide-card-sample-title">Eco Paper Labels</h3>
                            <UiBadge tone="success">New</UiBadge>
                        </header>
                        <p class="guide-card-sample-meta">Best for indoor packaging</p>
                        <p class="guide-card-sample-body">
                            Lightweight paper stock with clean print detail and writable surface.
                        </p>
                        <footer class="guide-card-sample-footer">
                            <UiButton tone="neutral">Customize</UiButton>
                        </footer>
                    </article>
                </GuideCopy>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Interactive Card</h2>
            <div class="guide-card-grid">
                <GuideCopy
                    class="guide-copy-start guide-card-copy-wrap"
                    :text="cardMarkup.interactive"
                    :ignore-interactive-click="true"
                >
                    <article class="guide-card-sample guide-card-sample-interactive">
                    <p class="guide-card-sample-kicker">Product Collection</p>
                    <h3 class="guide-card-sample-title">Die-Cut Roll Stickers</h3>
                    <p class="guide-card-sample-body">
                        Compact roll format for fast dispensing and high-volume
                        packaging workflows.
                    </p>
                    <div class="guide-card-sample-arrow" aria-hidden="true">
                        <UiIcon
                            name="light-long-arrow-right"
                            color="var(--brand-secondary)"
                            size="var(--size-icon-md)"
                        />
                    </div>
                    </article>
                </GuideCopy>
                <GuideCopy
                    class="guide-copy-start guide-card-copy-wrap"
                    :text="cardMarkup.interactiveSecondary"
                    :ignore-interactive-click="true"
                >
                    <article class="guide-card-sample guide-card-sample-interactive">
                        <p class="guide-card-sample-kicker">Recommended</p>
                        <h3 class="guide-card-sample-title">Kiss-Cut Sticker Sheets</h3>
                        <p class="guide-card-sample-body">
                            Multiple artwork cuts on one sheet for giveaways and small packs.
                        </p>
                        <div class="guide-card-sample-arrow" aria-hidden="true">
                            <UiIcon
                                name="light-long-arrow-right"
                                color="var(--brand-secondary)"
                                size="var(--size-icon-md)"
                            />
                        </div>
                    </article>
                </GuideCopy>
                <GuideCopy
                    class="guide-copy-start guide-card-copy-wrap"
                    :text="cardMarkup.interactiveTertiary"
                    :ignore-interactive-click="true"
                >
                    <article class="guide-card-sample guide-card-sample-interactive">
                        <p class="guide-card-sample-kicker">Team Favorite</p>
                        <h3 class="guide-card-sample-title">Holographic Labels</h3>
                        <p class="guide-card-sample-body">
                            Metallic shimmer stock for premium promo drops and product launches.
                        </p>
                        <div class="guide-card-sample-arrow" aria-hidden="true">
                            <UiIcon
                                name="light-long-arrow-right"
                                color="var(--brand-secondary)"
                                size="var(--size-icon-md)"
                            />
                        </div>
                    </article>
                </GuideCopy>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Media Card</h2>
            <div class="guide-card-grid">
                <GuideCopy
                    class="guide-copy-start guide-card-copy-wrap"
                    :text="cardMarkup.media"
                    :ignore-interactive-click="true"
                >
                    <article class="guide-card-sample">
                    <div class="guide-card-sample-media" aria-hidden="true"></div>
                    <h3 class="guide-card-sample-title">Matte Finish Pack</h3>
                    <p class="guide-card-sample-meta">
                        Starts at: $24.00
                    </p>
                    <p class="guide-card-sample-body">
                        Smooth matte coating with durable adhesive for premium
                        brand applications.
                    </p>
                    <footer class="guide-card-sample-footer">
                        <UiButton tone="neutral">View Details</UiButton>
                    </footer>
                    </article>
                </GuideCopy>
                <GuideCopy
                    class="guide-copy-start guide-card-copy-wrap"
                    :text="cardMarkup.mediaSecondary"
                    :ignore-interactive-click="true"
                >
                    <article class="guide-card-sample">
                        <div class="guide-card-sample-media" aria-hidden="true"></div>
                        <h3 class="guide-card-sample-title">Starter Sample Pack</h3>
                        <p class="guide-card-sample-meta">Starts at: $16.00</p>
                        <p class="guide-card-sample-body">
                            Compact pack to compare finish, adhesive, and print detail before scaling.
                        </p>
                        <footer class="guide-card-sample-footer">
                            <UiButton tone="neutral" variant="outline">View Details</UiButton>
                        </footer>
                    </article>
                </GuideCopy>
                <GuideCopy
                    class="guide-copy-start guide-card-copy-wrap"
                    :text="cardMarkup.mediaTertiary"
                    :ignore-interactive-click="true"
                >
                    <article class="guide-card-sample">
                        <div class="guide-card-sample-media" aria-hidden="true"></div>
                        <h3 class="guide-card-sample-title">Premium Outdoor Set</h3>
                        <p class="guide-card-sample-meta">Starts at: $29.00</p>
                        <p class="guide-card-sample-body">
                            Weatherproof material for long-term durability on vehicles and gear.
                        </p>
                        <footer class="guide-card-sample-footer">
                            <UiButton tone="neutral">View Details</UiButton>
                        </footer>
                    </article>
                </GuideCopy>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-card-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.guide-card-copy-wrap {
    border-radius: 14px;
    width: 100%;
}

.guide-card-sample {
    width: 100%;
    border: 1px solid var(--border-default);
    border-radius: 14px;
    background: var(--contrast-light);
    padding: 16px;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
}

.guide-card-sample-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
}

.guide-card-sample-title {
    margin: 0;
    color: var(--text-primary);
    font-size: 16px;
    line-height: 28px;
}

.guide-card-sample-kicker {
    margin: 0 0 4px;
    color: var(--text-muted);
    font-size: 12px;
    line-height: 18px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.guide-card-sample-meta {
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 20px;
}

.guide-card-sample-body {
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 24px;
}

.guide-card-sample-footer {
    margin-top: 12px;
}

.guide-card-sample-interactive {
    cursor: pointer;
    transition:
        transform 0.16s ease,
        box-shadow 0.16s ease,
        border-color 0.16s ease;

    &:hover {
        transform: translateY(-2px);
        border-color: color-mix(in srgb, var(--brand-secondary) 36%, var(--border-default));
        box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
    }
}

.guide-card-sample-arrow {
    margin-top: 8px;
}

.guide-card-sample-media {
    height: 130px;
    border-radius: 10px;
    background: #e2e8f0;
    border: 1px solid #cbd5e1;
    margin-bottom: 12px;
}

@media (max-width: 1120px) {
    .guide-card-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 760px) {
    .guide-card-grid {
        grid-template-columns: 1fr;
    }
}
</style>
