<script setup lang="ts">
import type { ProductItem } from '~/data/products/catalog';

type SizeOptionModel = {
    key: string;
    name: string;
    dim: string;
};

type SizeFeatureCard = {
    key: string;
    image: string;
    descriptionKey: string;
};

const props = defineProps<{
    categoryProducts: ProductItem[];
    hasPickedProduct: boolean;
    selectedId: string | null;
    selectedProduct: ProductItem | null;
    sizeFeatureCards: readonly SizeFeatureCard[];
    selectedSize: string;
    sizeOptionModels: SizeOptionModel[];
    quantityOptions: readonly number[];
    selectedQty: number;
    subtotal: number;
    discountRate: number;
    total: number;
    getProductName: (product: ProductItem) => string;
    getProductBlurb: (product: ProductItem) => string;
    formatPrice: (value: number) => string;
    quantityPrice: (qty: number) => number;
}>();

const emit = defineEmits<{
    'select-product': [productId: string];
    'update:selectedSize': [size: string];
    'update:selectedQty': [qty: number];
    'open-upload': [];
}>();

const { t } = useI18n();
</script>

<template>
    <section class="product-stage" :class="{ 'is-selected': props.hasPickedProduct }" data-testid="product-category-stage-root">
        <section class="product-picker product-picker-layer" data-testid="product-category-picker">
            <button
                v-for="product in props.categoryProducts"
                :key="product.id"
                type="button"
                class="product-picker-item"
                :class="{ 'is-active': props.selectedId === product.id }"
                @click="emit('select-product', product.id)"
                :data-testid="`product-category-picker-item-${product.id}`"
            >
                <div class="product-picker-icon" :class="`is-${product.id}`">
                    <img :src="product.image" :alt="props.getProductName(product)" loading="lazy" class="product-picker-image" />
                </div>
                <p class="product-picker-name">
                    {{ props.getProductName(product) }}
                </p>
            </button>
        </section>

        <section v-show="props.hasPickedProduct" class="product-reveal product-reveal-layer" data-testid="product-category-reveal">
            <section v-if="props.selectedProduct">
                <section class="product-configurator" data-testid="product-category-configurator">
                    <div class="product-preview" data-testid="product-category-preview">
                        <h1 class="product-preview-title" data-testid="product-category-preview-title">{{ props.getProductName(props.selectedProduct) }}</h1>
                        <p class="product-preview-blurb" data-testid="product-category-preview-blurb">{{ props.getProductBlurb(props.selectedProduct) }}</p>
                        <div class="product-preview-media" data-testid="product-category-preview-media">
                            <div class="preview-watermark">
                                <UiLogo name="musticker" variant="mark" color="white" :size="120" />
                            </div>
                        </div>

                        <div class="product-preview-features" data-testid="product-category-preview-features">
                            <button
                                v-for="feature in props.sizeFeatureCards"
                                :key="feature.key"
                                type="button"
                                class="mini-feature"
                                :class="{ 'is-active': props.selectedSize === feature.key }"
                                @click="emit('update:selectedSize', feature.key)"
                                :data-testid="`product-category-feature-card-${feature.key}`"
                            >
                                <h4 class="mini-feature-title">{{ t(`products.sizes.${feature.key}.label`) }}</h4>
                                <img
                                    :src="feature.image"
                                    :alt="t(`products.sizes.${feature.key}.label`)"
                                    loading="lazy" class="mini-feature-image" />

                                <p class="mini-feature-description">
                                    {{ t(`products.featureCards.${feature.descriptionKey}.description`) }}
                                </p>
                            </button>
                        </div>
                    </div>

                    <aside class="product-options" data-testid="product-category-options">
                        <section>
                            <div class="option-head" data-testid="product-category-size-head">
                                <h3 class="option-title" data-testid="product-category-size-title">{{ t('products.options.selectSize') }}</h3>
                                <small class="option-head-unit">{{ t('products.options.unitMm') }}</small>
                            </div>
                            <div class="option-grid option-grid-size" data-testid="product-category-size-options">
                                <button
                                    v-for="size in props.sizeOptionModels"
                                    :key="size.key"
                                    type="button"
                                    class="option-pill"
                                    :class="{ 'is-active': props.selectedSize === size.key }"
                                    @click="emit('update:selectedSize', size.key)"
                                    :data-testid="`product-category-size-option-${size.key}`"
                                >
                                    <span class="size-pill-name">{{ size.name }}</span>
                                    <span class="size-pill-dim">{{ size.dim }}</span>
                                </button>
                                <button type="button" class="option-pill option-pill-wide" data-testid="product-category-size-option-custom">
                                    {{ t('products.options.customSize') }}
                                </button>
                            </div>
                        </section>

                        <section>
                            <h3 class="option-title" data-testid="product-category-quantity-title">{{ t('products.options.selectQuantity') }}</h3>
                            <div class="option-grid" data-testid="product-category-quantity-options">
                                <button
                                    v-for="qty in props.quantityOptions"
                                    :key="qty"
                                    type="button"
                                    class="option-pill"
                                    :class="{ 'is-active': props.selectedQty === qty }"
                                    @click="emit('update:selectedQty', qty)"
                                    :data-testid="`product-category-quantity-option-${qty}`"
                                >
                                    <span class="qty-pill-count">{{ qty.toLocaleString() }}</span>
                                    <strong class="qty-pill-price">{{ props.formatPrice(props.quantityPrice(qty)) }}</strong>
                                </button>
                                <button type="button" class="option-pill option-pill-wide" data-testid="product-category-quantity-option-custom">
                                    {{ t('products.options.customQuantity') }}
                                </button>
                            </div>
                        </section>

                        <section class="price-summary" data-testid="product-category-price-summary">
                            <p class="price-summary-row" data-testid="product-category-price-subtotal-row">
                                <span class="price-summary-label">{{ t('products.price.subtotal') }}</span>
                                <strong class="price-summary-value">{{ props.formatPrice(props.subtotal) }}</strong>
                            </p>
                            <p class="price-summary-row discount" data-testid="product-category-price-discount-row">
                                <span class="price-summary-label">
                                    {{ t('products.price.discount') }} ({{ Math.round(props.discountRate * 100) }}%)
                                </span>
                                <strong class="price-summary-value">-{{ props.formatPrice(props.subtotal - props.total) }}</strong>
                            </p>
                            <p class="price-summary-row total" data-testid="product-category-price-total-row">
                                <span class="price-summary-label">{{ t('products.price.total') }}</span>
                                <strong class="price-summary-value">{{ props.formatPrice(props.total) }}</strong>
                            </p>
                            <ul class="price-benefits" data-testid="product-category-price-benefits">
                                <li data-testid="product-category-price-benefit-shipping">{{ t('products.price.benefitShipping') }}</li>
                                <li data-testid="product-category-price-benefit-ships-tomorrow">{{ t('products.price.benefitShipsTomorrow') }}</li>
                            </ul>
                            <UiButton
                                type="button"
                                variant="filled"
                                tone="default"
                                size="md"
                                height="48px"
                                class="next-step-btn"
                                @click="emit('open-upload')"
                                data-testid="product-category-next-step-button"
                            >
                                {{ t('products.price.nextStep') }}
                            </UiButton>
                        </section>
                    </aside>
                </section>
            </section>
        </section>
    </section>
</template>

<style scoped lang="scss">
.product-stage {
    position: relative;
    margin-top: 0;
    display: grid;
    overflow: hidden;
    min-height: 864px;
    align-content: start;

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

        &:hover,
        &.is-active {
            background: var(--contrast-light);
        }

        &:hover {
            .product-picker-image {
                transform: scale(1.07);
            }
        }
    }

    .product-picker-icon {
        padding: 34px 42px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        position: relative;

        .product-picker-image {
            width: 156px;
            height: 120px;
            object-fit: contain;
            display: block;
            transform-origin: center;
            transition: transform 0.24s ease;
        }
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

    &.is-selected {
        .product-picker-layer {
            clip-path: inset(0 0 100% 0 round 0 0 20px 20px);
            pointer-events: none;
        }
    }

    .product-configurator {
        padding-top: 56px;
        padding-bottom: 122px;
        display: grid;
        grid-template-columns: 772px 348px;
        gap: 80px;
    }

    .product-preview {
        display: flex;
        flex-direction: column;
        gap: 16px;
        background: transparent;
        border-radius: 0;
        border: 0;
        padding: 0;

        .product-preview-title {
            margin: 0;
            font-size: 48px;
            line-height: 68px;
            color: var(--text-primary);
        }

        .product-preview-blurb {
            margin: 0;
            font-size: 16px;
            line-height: 28px;
            color: var(--text-secondary);
        }
        .product-preview-media {
            margin-top: 0;
            height: 362px;
            border-radius: 24px;
            border: 1px solid var(--border-default);
            background:
                radial-gradient(circle at 20% 15%, rgba(248, 248, 248, 0.4), transparent 40%),
                linear-gradient(140deg, var(--gray-80) 0%, var(--gray-100) 100%);
            position: relative;
            overflow: hidden;

            .preview-watermark {
                position: absolute;
                right: 20px;
                bottom: 14px;
                opacity: 0.18;
            }
        }

        .product-preview-features {
            margin-top: 0;
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 24px;
            border-bottom: 1px solid var(--border-default);
            max-height: 200px;

            .mini-feature {
                border-radius: 0;
                border: 0;
                background: transparent;
                padding: 20px 11.5px;
                text-align: center;
                position: relative;
                width: 100%;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;

                .mini-feature-image {
                    width: 72px;
                    max-width: 72px;
                    height: 72px;
                    object-fit: contain;
                    display: block;
                    flex: 0 0 auto;
                }

                .mini-feature-title {
                    width: 152px;
                    max-width: 100%;
                    height: 24px;
                    margin: 0;
                    font-size: 14px;
                    line-height: 24px;
                    font-weight: 600;
                    color: var(--text-primary);
                    flex: 0 0 24px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .mini-feature-description {
                    margin: 0;
                    font-size: 14px;
                    line-height: 24px;
                    color: var(--text-secondary);
                    max-width: 232px;
                    flex: 1 0 auto;
                }

                &.is-active {
                    box-shadow: none;

                    &::after {
                        content: '';
                        position: absolute;
                        left: 8px;
                        right: 8px;
                        bottom: 0;
                        height: 2px;
                        background: var(--gold-base);
                    }
                }
            }
        }
    }

    .product-options {
        background: transparent;
        border: 0;
        border-radius: 0;
        padding: 2px 0 0;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .option-title {
            margin: 0;
            font-size: 18px;
            line-height: 32px;
            color: var(--text-primary);
        }

        .option-head {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 8px;

            .option-head-unit {
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

            &:not(.option-grid-size) {
                .qty-pill-count {
                    font-weight: 600;
                }
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

                .qty-pill-price {
                    font-size: inherit;
                    font-weight: 400;
                    color: var(--text-secondary);
                }

                &.is-active {
                    border-color: var(--gold-base);
                    background: var(--gold-10);
                }
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
        }

        .option-grid-size {
            grid-template-columns: 1fr 1fr;
        }
    }

    .price-summary {
        border-top: 1px solid var(--border-default);
        padding-top: 16px;

        .price-summary-row {
            margin: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: var(--text-secondary);
        }

        .price-summary-row + .price-summary-row {
            margin-top: 8px;
        }

        .discount .price-summary-value {
            color: var(--error);
        }

        .total {
            margin-top: 12px;
            padding-top: 10px;
            border-top: 0;
            font-size: 15px;
            color: var(--text-primary);

            .price-summary-value {
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
        border-radius: 999px;
        background: var(--gold-base);
        color: var(--text-primary);
        font-size: 16px;
        line-height: 28px;
        font-weight: 700;
        box-shadow: none;
        --btn-border: transparent;
    }
}

@media (max-width: 980px) {
    .product-stage {
        .product-picker {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .product-configurator {
            grid-template-columns: 1fr;
        }

        .product-preview .product-preview-title {
            font-size: 36px;
        }

        .product-preview-features {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
}

@media (max-width: 760px) {
    .product-stage {
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
    }
}
</style>
