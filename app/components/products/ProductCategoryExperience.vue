<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ProductReviewsSection from '~/components/products/ProductReviewsSection.vue';
import {
    productCatalog,
    type ProductItem,
    type ProductCategoryKey,
} from '~/data/products/catalog';

const props = defineProps<{
    category: ProductCategoryKey;
}>();
const { t } = useI18n();

const sizeOptions = ['small30', 'medium75', 'large100', 'extraLarge125'];
const quantityOptions = [10, 50, 100, 200, 300, 500, 1000, 2000, 5000, 10000];
const sizeOptionModels = computed(() =>
    sizeOptions.map((size) => ({
        key: size,
        ...sizeLabelParts(size),
    }))
);

const categoryData = computed(() => productCatalog[props.category]);
const selectedId = ref<string | null>(null);
const selectedSize = ref(sizeOptions[0]);
const selectedQty = ref(quantityOptions[0]);
const hasPickedProduct = ref(false);

const selectedProduct = computed(
    () => {
        if (!selectedId.value) return null;
        return (
            categoryData.value.products.find((item) => item.id === selectedId.value) ||
            null
        );
    }
);

const unitPrice = computed(() => {
    const base = props.category === 'stickers' ? 2.4 : props.category === 'roll-stickers' ? 1.7 : 1.9;
    return Math.max(0.18, base - selectedQty.value / 5000);
});

const subtotal = computed(() => unitPrice.value * selectedQty.value);
const discountRate = computed(() => (selectedQty.value >= 1000 ? 0.2 : selectedQty.value >= 300 ? 0.12 : 0.06));
const total = computed(() => subtotal.value * (1 - discountRate.value));

watch(
    () => props.category,
    () => {
        selectedId.value = null;
        selectedSize.value = sizeOptions[0];
        selectedQty.value = quantityOptions[0];
        hasPickedProduct.value = false;
    }
);

function selectProduct(productId: string) {
    selectedId.value = productId;
    hasPickedProduct.value = true;
}

function formatPrice(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(value);
}

function quantityPrice(qty: number) {
    return unitPrice.value * qty;
}

function getProductName(product: ProductItem) {
    return t(`products.items.${product.id}.name`);
}

function getProductBlurb(product: ProductItem) {
    return t(`products.items.${product.id}.blurb`);
}

function sizeLabelParts(sizeKey: string) {
    const label = t(`products.sizes.${sizeKey}.label`);
    const [name, ...rest] = label.split(' ');
    return {
        name,
        dim: rest.join(' '),
    };
}
</script>

<template>
    <section class="product-experience">
        <div class="product-experience-container">
            <section
                class="product-stage"
                :class="{ 'is-selected': hasPickedProduct }"
            >
                <section class="product-picker product-picker-layer">
                    <button
                        v-for="product in categoryData.products"
                        :key="product.id"
                        type="button"
                        class="product-picker-item"
                        :class="{ 'is-active': selectedId === product.id }"
                        @click="selectProduct(product.id)"
                    >
                        <div
                            class="product-picker-icon"
                            :class="`is-${product.id}`"
                        >
                            <img
                                :src="product.image"
                                :alt="getProductName(product)"
                                loading="lazy"
                            />
                        </div>
                        <p class="product-picker-name">
                            {{ getProductName(product) }}
                        </p>
                    </button>
                </section>

                <section
                    v-show="hasPickedProduct"
                    class="product-reveal product-reveal-layer"
                >
                    <section v-if="selectedProduct">
                        <section class="product-configurator">
                            <div class="product-preview">
                                <h1>{{ getProductName(selectedProduct) }}</h1>
                                <p>{{ getProductBlurb(selectedProduct) }}</p>
                                <div class="product-preview-media">
                                    <div class="preview-watermark">
                                        <UiLogo
                                            name="musticker"
                                            variant="mark"
                                            color="white"
                                            :size="120"
                                        />
                                    </div>
                                </div>

                                <div class="product-preview-features">
                                    <article class="mini-feature is-active">
                                        <img
                                            src="/icons/custom/size-use-cases/small-helmet.svg"
                                            :alt="t('products.sizes.small30.label')"
                                            loading="lazy"
                                        />
                                        <h4>
                                            {{
                                                t(
                                                    `products.sizes.${selectedSize}.label`
                                                )
                                            }}
                                        </h4>
                                        <p>
                                            {{
                                                t(
                                                    'products.featureCards.small.description'
                                                )
                                            }}
                                        </p>
                                    </article>
                                    <article class="mini-feature">
                                        <img
                                            src="/icons/custom/size-use-cases/medium-tumbler.svg"
                                            :alt="t('products.sizes.medium75.label')"
                                            loading="lazy"
                                        />
                                        <h4>
                                            {{
                                                t(
                                                    'products.sizes.medium75.label'
                                                )
                                            }}
                                        </h4>
                                        <p>
                                            {{
                                                t(
                                                    'products.featureCards.medium.description'
                                                )
                                            }}
                                        </p>
                                    </article>
                                    <article class="mini-feature">
                                        <img
                                            src="/icons/custom/size-use-cases/large-case.svg"
                                            :alt="t('products.sizes.large100.label')"
                                            loading="lazy"
                                        />
                                        <h4>
                                            {{
                                                t(
                                                    'products.sizes.large100.label'
                                                )
                                            }}
                                        </h4>
                                        <p>
                                            {{
                                                t(
                                                    'products.featureCards.large.description'
                                                )
                                            }}
                                        </p>
                                    </article>
                                    <article class="mini-feature">
                                        <img
                                            src="/icons/custom/size-use-cases/extra-large-cooler.svg"
                                            :alt="t('products.sizes.extraLarge125.label')"
                                            loading="lazy"
                                        />
                                        <h4>
                                            {{
                                                t(
                                                    'products.sizes.extraLarge125.label'
                                                )
                                            }}
                                        </h4>
                                        <p>
                                            {{
                                                t(
                                                    'products.featureCards.extraLarge.description'
                                                )
                                            }}
                                        </p>
                                    </article>
                                </div>
                            </div>

                            <aside class="product-options">
                                <section>
                                    <div class="option-head">
                                        <h3>
                                            {{
                                                t(
                                                    'products.options.selectSize'
                                                )
                                            }}
                                        </h3>
                                        <small>
                                            {{
                                                t('products.options.unitMm')
                                            }}
                                        </small>
                                    </div>
                                    <div class="option-grid option-grid-size">
                                        <button
                                            v-for="size in sizeOptionModels"
                                            :key="size.key"
                                            type="button"
                                            class="option-pill"
                                            :class="{
                                                'is-active':
                                                    selectedSize === size.key,
                                            }"
                                            @click="selectedSize = size.key"
                                        >
                                            <span class="size-pill-name">{{
                                                size.name
                                            }}</span>
                                            <span class="size-pill-dim">{{
                                                size.dim
                                            }}</span>
                                        </button>
                                        <button
                                            type="button"
                                            class="option-pill option-pill-wide"
                                        >
                                            {{ t('products.options.customSize') }}
                                        </button>
                                    </div>
                                </section>

                                <section>
                                    <h3>
                                        {{
                                            t(
                                                'products.options.selectQuantity'
                                            )
                                        }}
                                    </h3>
                                    <div class="option-grid">
                                        <button
                                            v-for="qty in quantityOptions"
                                            :key="qty"
                                            type="button"
                                            class="option-pill"
                                            :class="{ 'is-active': selectedQty === qty }"
                                            @click="selectedQty = qty"
                                        >
                                            <span>{{ qty.toLocaleString() }}</span>
                                            <strong>{{ formatPrice(quantityPrice(qty)) }}</strong>
                                        </button>
                                        <button
                                            type="button"
                                            class="option-pill option-pill-wide"
                                        >
                                            {{
                                                t(
                                                    'products.options.customQuantity'
                                                )
                                            }}
                                        </button>
                                    </div>
                                </section>

                                <section class="price-summary">
                                    <p><span>{{ t('products.price.subtotal') }}</span><strong>{{ formatPrice(subtotal) }}</strong></p>
                                    <p class="discount">
                                        <span>{{ t('products.price.discount') }} ({{ Math.round(discountRate * 100) }}%)</span>
                                        <strong>-{{ formatPrice(subtotal - total) }}</strong>
                                    </p>
                                    <p class="total"><span>{{ t('products.price.total') }}</span><strong>{{ formatPrice(total) }}</strong></p>
                                    <ul class="price-benefits">
                                        <li>{{ t('products.price.benefitShipping') }}</li>
                                        <li>{{ t('products.price.benefitShipsTomorrow') }}</li>
                                    </ul>
                                    <button type="button" class="next-step-btn">{{ t('products.price.nextStep') }}</button>
                                </section>
                            </aside>
                        </section>
                    </section>
                </section>
            </section>
        </div>

        <section v-show="hasPickedProduct" class="product-guarantees-band">
            <div class="product-guarantees">
                <article class="guarantee-card">
                    <img
                        src="/icons/custom/guarantees/delivery-truck.svg"
                        :alt="t('products.guarantees.madeToday.title')"
                        loading="lazy"
                    />
                    <h4>{{ t('products.guarantees.madeToday.title') }}</h4>
                    <p>{{ t('products.guarantees.madeToday.text') }}</p>
                </article>
                <article class="guarantee-card">
                    <img
                        src="/icons/custom/guarantees/proof-review.svg"
                        :alt="t('products.guarantees.proofReview.title')"
                        loading="lazy"
                    />
                    <h4>{{ t('products.guarantees.proofReview.title') }}</h4>
                    <p>{{ t('products.guarantees.proofReview.text') }}</p>
                </article>
                <article class="guarantee-card">
                    <img
                        src="/icons/custom/guarantees/weather-durability.svg"
                        :alt="t('products.guarantees.durability.title')"
                        loading="lazy"
                    />
                    <h4>{{ t('products.guarantees.durability.title') }}</h4>
                    <p>{{ t('products.guarantees.durability.text') }}</p>
                </article>
            </div>
        </section>

        <div class="product-experience-container">
            <section class="product-story">
                <article class="story-row">
                    <div class="story-image">
                        <img
                            src="/illustrations/products/sticker-kids/kid-making-stickers.svg"
                            :alt="t('products.story.timeless.title')"
                            loading="lazy"
                        />
                    </div>
                    <div class="story-copy">
                        <h3>{{ t('products.story.timeless.title') }}</h3>
                        <p>
                            {{ t('products.story.timeless.text') }}
                        </p>
                    </div>
                </article>
                <article class="story-row reverse">
                    <div class="story-image">
                        <img
                            src="/illustrations/products/sticker-kids/kid-laptop-sticker.svg"
                            :alt="t('products.story.quickStick.title')"
                            loading="lazy"
                        />
                    </div>
                    <div class="story-copy">
                        <h3>{{ t('products.story.quickStick.title') }}</h3>
                        <p>
                            {{ t('products.story.quickStick.text') }}
                        </p>
                    </div>
                </article>
                <article class="story-row">
                    <div class="story-image">
                        <img
                            src="/illustrations/products/sticker-kids/kid-decorating-sheet.svg"
                            :alt="t('products.story.preciseCut.title')"
                            loading="lazy"
                        />
                    </div>
                    <div class="story-copy">
                        <h3>{{ t('products.story.preciseCut.title') }}</h3>
                        <p>
                            {{ t('products.story.preciseCut.text') }}
                        </p>
                    </div>
                </article>
            </section>
        </div>

        <ProductReviewsSection class="product-experience-reviews" />
    </section>
</template>

<style scoped lang="scss">
.product-experience {
    --picker-stage-height: calc(100vh - 122px);
    background: var(--bg-page);

    .product-experience-container {
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
    }

    .product-picker {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        row-gap: 16px;
        column-gap: 40px;
        align-content: start;
    }

    .product-picker-item {
        border: 0;
        border-radius: 16px;
        background: transparent;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .product-picker-item:hover {
        background: var(--contrast-light);
    }

    .product-picker-item.is-active {
        background: var(--contrast-light);
    }

    .product-picker-icon {
        padding: 34px 42px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        position: relative;
    }

    .product-picker-icon img {
        width: 156px;
        height: 120px;
        object-fit: contain;
        display: block;
        transform-origin: center;
        transition: transform 0.24s ease;
    }

    .product-picker-item:hover .product-picker-icon img {
        transform: scale(1.07);
    }

    .product-picker-name {
        margin: 0;
        text-align: center;
        font-size: 16px;
        line-height: 28px;
        color: var(--text-primary);
        font-weight: 500;
        padding-bottom: 24px;
    }

    .product-reveal {
        margin-top: 0;
    }

    .product-stage {
        position: relative;
        margin-top: 0;
        display: grid;
        overflow: hidden;
        min-height: 864px;
        align-content: start;
    }

    .product-picker-layer {
        position: relative;
        z-index: 2;
        grid-area: 1 / 1;
        align-self: start;
        padding: 56px 60px;
        background: var(--gray-20);
        border-radius: 0 0 20px 20px;
        clip-path: inset(0 0 0 0 round 0 0 20px 20px);
        transition: clip-path 0.85s cubic-bezier(0.22, 1, 0.36, 1);
        min-height: inherit;
    }

    .product-reveal-layer {
        position: relative;
        z-index: 1;
        grid-area: 1 / 1;
        align-self: stretch;
        overflow: hidden;
    }

    .product-stage.is-selected .product-picker-layer {
        clip-path: inset(0 0 100% 0 round 0 0 20px 20px);
        pointer-events: none;
    }

    .product-configurator {
        padding-top: 56px;
        padding-bottom: 122px;
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(290px, 1fr);
        gap: 28px;
    }

    .product-preview {
        display: flex;
        flex-direction: column;
        gap: 16px;
        background: transparent;
        border-radius: 0;
        border: 0;
        padding: 0;

        h1 {
            margin: 0;
            font-size: 48px;
            line-height: 68px;
            color: var(--text-primary);
        }

        > p {
            margin: 0;
            font-size: 16px;
            line-height: 28px;
            color: var(--text-secondary);
        }
    }

    .product-preview-media {
        margin-top: 0;
        height: min(46vh, 520px);
        min-height: 300px;
        border-radius: 24px;
        border: 1px solid var(--border-default);
        background:
            radial-gradient(
                circle at 20% 15%,
                rgba(248, 248, 248, 0.4),
                transparent 40%
            ),
            linear-gradient(140deg, var(--gray-80) 0%, var(--gray-100) 100%);
        position: relative;
        overflow: hidden;
    }

    .preview-watermark {
        position: absolute;
        right: 20px;
        bottom: 14px;
        opacity: 0.18;
    }

    .product-preview-features {
        margin-top: 0;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
        border-bottom: 1px solid var(--border-default);
    }

    .mini-feature {
        border-radius: 0;
        border: 0;
        background: transparent;
        padding: 12px 10px 18px;
        text-align: center;
        position: relative;

        img {
            width: 70px;
            height: 56px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
        }

        h4 {
            margin: 8px 0 4px;
            font-size: 14px;
            line-height: 1.4;
            font-weight: 600;
            color: var(--text-primary);
        }

        p {
            margin: 0;
            font-size: 14px;
            line-height: 1.6;
            color: var(--text-secondary);
        }
    }

    .mini-feature.is-active {
        box-shadow: none;
    }

    .mini-feature.is-active::after {
        content: '';
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: 0;
        height: 2px;
        background: var(--gold-base);
    }

    .product-options {
        background: transparent;
        border: 0;
        border-radius: 0;
        padding: 2px 0 0;
        display: flex;
        flex-direction: column;
        gap: 20px;

        h3 {
            margin: 0;
            font-size: 18px;
            line-height: 32px;
            color: var(--text-primary);
        }
    }

    .option-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 8px;

        small {
            color: var(--text-muted);
            font-size: 14px;
            line-height: 24px;
        }
    }

    .option-grid {
        margin-top: 10px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px 12px;
    }

    .option-grid-size {
        grid-template-columns: 1fr 1fr;
    }

    .option-pill {
        border: 1px solid var(--border-default);
        border-radius: 999px;
        min-height: 44px;
        font-size: 14px;
        line-height: 24px;
        color: var(--text-primary);
        cursor: pointer;
        padding: 8px 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .option-pill strong {
        font-size: inherit;
        font-weight: 400;
        color: var(--text-secondary);
    }

    .option-grid:not(.option-grid-size) .option-pill > span {
        font-weight: 600;
    }

    .option-pill.is-active {
        border-color: var(--gold-base);
        background: var(--gold-10);
    }

    .option-pill-wide {
        grid-column: 1 / -1;
        font-weight: 500;
    }

    .size-pill-name {
        font-size: 14px;
        font-weight: 600;
        line-height: 24px;
    }

    .size-pill-dim {
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
    }

    .price-summary {
        border-top: 1px solid var(--border-default);
        padding-top: 16px;

        p {
            margin: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: var(--text-secondary);
        }

        p + p {
            margin-top: 8px;
        }

        .discount strong {
            color: var(--error);
        }

        .total {
            margin-top: 12px;
            padding-top: 10px;
            border-top: 0;
            font-size: 15px;
            color: var(--text-primary);

            strong {
                font-size: clamp(30px, 2vw, 42px);
                line-height: 1;
            }
        }
    }

    .price-benefits {
        margin: 12px 0 0;
        padding-left: 16px;
        color: var(--text-secondary);
        display: grid;
        gap: 3px;
        font-size: 12px;
    }

    .next-step-btn {
        margin-top: 18px;
        width: 100%;
        height: 48px;
        border: 0;
        border-radius: 999px;
        background: var(--gold-base);
        color: var(--text-primary);
        font-size: 16px;
        line-height: 28px;
        font-weight: 700;
        cursor: pointer;
    }

    .product-guarantees-band {
        background: var(--gray-10);
        padding: 48px 0;
    }

    .product-guarantees {
        max-width: 1120px;
        margin: 0 auto;
        padding: 0 22px;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
    }

    .guarantee-card {
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 16px;

        img {
            width: 120px;
            height: 96px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
        }

        h4 {
            font-size: 18px;
            line-height: 1.2;
            color: var(--text-primary);
        }

        p {
            padding: 0 40px;
            font-size: 12px;
            line-height: 1.45;
            color: var(--text-secondary);
        }
    }

    .product-story {
        padding: 144px 0;
        display: flex;
        flex-direction: column;
        gap: 144px;
    }

    .story-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        gap: 32px;
    }

    .story-row.reverse .story-image {
        order: 2;
    }

    .story-row.reverse .story-copy {
        order: 1;
    }

    .story-image {
        height: 352px;
        border-radius: 18px;
        background: linear-gradient(140deg, var(--gray-40) 0%, var(--gray-10) 100%);
        border: 1px solid var(--border-default);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
    }

    .story-copy {
        padding: 0 80px;
        display: flex;
        flex-direction: column;
        gap: 24px;

        h3 {
            font-size: 36px;
            line-height: 52px;
            letter-spacing: -0.02em;
            color: var(--text-primary);
        }
        
        p {
            margin: 0;
            font-size: 16px;
            line-height: 28px;
            color: var(--text-secondary);
        }
    }
    

    @media (max-width: 980px) {
        .product-picker {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .product-configurator {
            grid-template-columns: 1fr;
        }

        .product-preview h1 {
            font-size: 36px;
        }

        .product-preview-features {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .product-guarantees {
            grid-template-columns: 1fr;
        }

        .story-copy h3 {
            font-size: 32px;
        }
    }

    @media (max-width: 760px) {
        --picker-stage-height: calc(100vh - 106px);

        .product-picker {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            padding: 18px;
        }

        .product-picker-icon {
            width: 98px;
            height: 82px;
        }

        .option-pill {
            min-height: 40px;
            padding: 6px 10px;
            font-size: 13px;
        }

        .story-row {
            grid-template-columns: 1fr;
            gap: 18px;
        }

        .story-row.reverse .story-image,
        .story-row.reverse .story-copy {
            order: initial;
        }
    }
}
</style>
