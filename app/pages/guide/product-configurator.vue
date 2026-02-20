<script setup lang="ts">
const selectedProduct = ref<'die-cut' | 'roll' | 'sheet'>('die-cut');
const selectedSize = ref<'sm' | 'md' | 'lg'>('md');
const selectedQty = ref<100 | 150 | 300>(150);
const hasArtwork = ref(false);

const sizePriceMap: Record<'sm' | 'md' | 'lg', number> = {
    sm: 18.5,
    md: 24.75,
    lg: 31.4,
};

const qtyMultiplierMap: Record<100 | 150 | 300, number> = {
    100: 1,
    150: 1.22,
    300: 1.98,
};

const subtotal = computed(() => {
    const base = sizePriceMap[selectedSize.value];
    const multi = qtyMultiplierMap[selectedQty.value];
    return base * multi;
});

const discountRate = computed(() => (selectedQty.value >= 300 ? 0.14 : 0.08));
const total = computed(() => subtotal.value * (1 - discountRate.value));

function formatPrice(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}
</script>

<template>
    <section class="guide-wrapper guide-product-configurator">
        <header class="guide-header">
            <p class="guide-eyebrow">Core</p>
            <h1 class="guide-title">Product Configurator</h1>
            <p class="guide-description">
                Patterns for product picker, option pills, pricing summary, and
                next-step progression.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Product Picker</h2>
            <div class="config-picker-grid">
                <button
                    type="button"
                    class="config-picker-item"
                    :class="{ 'is-active': selectedProduct === 'die-cut' }"
                    @click="selectedProduct = 'die-cut'"
                >
                    <img
                        src="/illustrations/products/stickers/die-cut.svg"
                        alt="Die-cut stickers preview"
                        width="84"
                        height="84"
                        loading="eager"
                        fetchpriority="high"
                    />
                    <span>Die-Cut</span>
                </button>
                <button
                    type="button"
                    class="config-picker-item"
                    :class="{ 'is-active': selectedProduct === 'roll' }"
                    @click="selectedProduct = 'roll'"
                >
                    <img
                        src="/illustrations/products/roll-stickers/die-cut-labels.svg"
                        alt="Die-cut roll stickers preview"
                        width="84"
                        height="84"
                        loading="lazy"
                    />
                    <span>Roll</span>
                </button>
                <button
                    type="button"
                    class="config-picker-item"
                    :class="{ 'is-active': selectedProduct === 'sheet' }"
                    @click="selectedProduct = 'sheet'"
                >
                    <img
                        src="/illustrations/products/sheet-stickers/die-cut-sheet.svg"
                        alt="Sticker sheets preview"
                        width="84"
                        height="84"
                        loading="lazy"
                    />
                    <span>Sheet</span>
                </button>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Size + Quantity Pills</h2>
            <article class="config-card">
                <div class="config-pill-group">
                    <p class="config-label">Size</p>
                    <div class="config-pills">
                        <UiButton
                            tone="neutral"
                            :variant="selectedSize === 'sm' ? 'filled' : 'outline'"
                            size="sm"
                            @click="selectedSize = 'sm'"
                        >
                            Small
                        </UiButton>
                        <UiButton
                            tone="neutral"
                            :variant="selectedSize === 'md' ? 'filled' : 'outline'"
                            size="sm"
                            @click="selectedSize = 'md'"
                        >
                            Medium
                        </UiButton>
                        <UiButton
                            tone="neutral"
                            :variant="selectedSize === 'lg' ? 'filled' : 'outline'"
                            size="sm"
                            @click="selectedSize = 'lg'"
                        >
                            Large
                        </UiButton>
                    </div>
                </div>

                <div class="config-pill-group">
                    <p class="config-label">Quantity</p>
                    <div class="config-pills">
                        <UiButton
                            tone="neutral"
                            :variant="selectedQty === 100 ? 'filled' : 'outline'"
                            size="sm"
                            @click="selectedQty = 100"
                        >
                            100
                        </UiButton>
                        <UiButton
                            tone="neutral"
                            :variant="selectedQty === 150 ? 'filled' : 'outline'"
                            size="sm"
                            @click="selectedQty = 150"
                        >
                            150
                        </UiButton>
                        <UiButton
                            tone="neutral"
                            :variant="selectedQty === 300 ? 'filled' : 'outline'"
                            size="sm"
                            @click="selectedQty = 300"
                        >
                            300
                        </UiButton>
                    </div>
                </div>
            </article>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Price Summary + Next Step</h2>
            <article class="config-card">
                <div class="config-summary-row">
                    <span>Subtotal</span>
                    <strong>{{ formatPrice(subtotal) }}</strong>
                </div>
                <div class="config-summary-row">
                    <span>Discount ({{ Math.round(discountRate * 100) }}%)</span>
                    <strong>-{{ formatPrice(subtotal - total) }}</strong>
                </div>
                <div class="config-summary-row is-total">
                    <span>Total</span>
                    <strong>{{ formatPrice(total) }}</strong>
                </div>

                <label class="config-artwork-check">
                    <UiCheckbox v-model="hasArtwork" />
                    <span>Artwork uploaded</span>
                </label>

                <UiButton
                    tone="neutral"
                    variant="filled"
                    :disabled="!hasArtwork"
                >
                    Next Step: Upload Artwork
                </UiButton>
            </article>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Implementation Checklist</h2>
            <article class="config-card">
                <ul class="config-list">
                    <li>LCP picker image is discoverable in HTML and not lazy-loaded.</li>
                    <li>Picker images include concise, non-redundant alt text.</li>
                    <li>Size and quantity controls preserve clear selected states.</li>
                    <li>Price summary uses deterministic subtotal/discount/total order.</li>
                    <li>Next-step CTA is disabled until required artwork state is valid.</li>
                    <li>All key actions include stable data-testid hooks.</li>
                </ul>
            </article>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-product-configurator {
    .config-picker-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
    }

    .config-picker-item {
        border: 1px solid var(--border-default);
        border-radius: 12px;
        background: var(--contrast-light);
        min-height: 138px;
        display: grid;
        place-items: center;
        gap: 8px;
        padding: 10px;
        cursor: pointer;
        color: var(--text-secondary);
        transition: border-color 0.16s ease, transform 0.16s ease;

        span {
            font-size: 13px;
            line-height: 20px;
            font-weight: 600;
        }

        &.is-active {
            border-color: var(--brand-secondary);
            color: var(--text-primary);
            transform: translateY(-1px);
        }
    }

    .config-card {
        border: 1px solid var(--border-default);
        border-radius: 14px;
        background: var(--contrast-light);
        padding: 16px;
        display: grid;
        gap: 12px;
    }

    .config-pill-group {
        display: grid;
        gap: 8px;
    }

    .config-label {
        margin: 0;
        color: var(--text-primary);
        font-size: 14px;
        line-height: 22px;
        font-weight: 600;
    }

    .config-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .config-summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 22px;

        strong {
            color: var(--text-primary);
            font-weight: 700;
        }

        &.is-total {
            padding-top: 8px;
            border-top: 1px solid var(--border-default);
        }
    }

    .config-artwork-check {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--text-secondary);
        font-size: 13px;
        line-height: 20px;
    }

    .config-list {
        margin: 0;
        padding-left: 18px;
        display: grid;
        gap: 6px;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 24px;
    }

    @media (max-width: 820px) {
        .config-picker-grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>
