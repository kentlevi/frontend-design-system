<script setup lang="ts">
import type { ProductItem } from '~/types/products/catalog';
import type { SizeOptionKey } from '~/types/products/categoryExperience';
import { useFileBaseUrl } from '~/composables/core/fileBaseUrl/useFileBaseUrl';

type SizeOptionModel = {
	key: SizeOptionKey;
	name: string;
	dim: string;
};

type SizeFeatureCard = {
	key: SizeOptionKey;
	image: string;
	descriptionKey: string;
};

const props = defineProps<{
	categoryProducts: ProductItem[];
	hasPickedProduct: boolean;
	selectedId: string | null;
	selectedProduct: ProductItem | null;
	sizeFeatureCards: readonly SizeFeatureCard[];
	selectedSize: SizeOptionKey;
	sizeOptionModels: SizeOptionModel[];
	quantityOptions: readonly number[];
	selectedQty: number;
	navigationInFlight: boolean;
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
	'update:selectedSize': [size: SizeOptionKey];
	'update:selectedQty': [qty: number];
	'open-upload': [];
}>();

const { t } = useI18n();
const { resolveFileUrl } = useFileBaseUrl();
const demoHeroVideoUrl = resolveFileUrl('products/die-cut-sticker/hero/01-donut-sticker-in-hand-video.mp4');
const demoHeroPosterUrl = resolveFileUrl('products/die-cut-sticker/hero/01-donut-sticker-in-hand-poster.png');
const unitPrice = computed(() =>
	props.selectedQty > 0 ? props.total / props.selectedQty : 0
);

</script>

<template>
	<section class="product-stage" :class="{ 'is-selected': props.hasPickedProduct }" data-testid="product-category-stage-root">
		<section class="product-picker product-picker-layer" data-testid="product-category-picker">
			<button
				v-for="(product, index) in props.categoryProducts"
				:key="product.id"
				type="button"
				class="product-picker-item"
				:class="{ 'is-active': props.selectedId === product.id }"
				:data-testid="`product-category-picker-item-${product.id}`"
				@click="emit('select-product', product.id)"
			>
				<div class="product-picker-icon" :class="`is-${product.id}`">
					<img
						:src="product.image"
						:alt="`${props.getProductName(product)} preview`"
						:loading="index === 0 ? 'eager' : 'lazy'"
						:fetchpriority="index === 0 ? 'high' : undefined"
						:decoding="index === 0 ? 'sync' : 'async'"
						width="156"
						height="120"
						class="product-picker-image"
					>
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
							<video
								:poster="demoHeroPosterUrl"
								class="product-preview-media-image"
								autoplay
								muted
								loop
								playsinline
								preload="metadata"
							>
								<source :src="demoHeroVideoUrl" type="video/mp4">
							</video>
						</div>

						<div class="product-preview-features" data-testid="product-category-preview-features">
							<button
								v-for="feature in props.sizeFeatureCards"
								:key="feature.key"
								type="button"
								class="mini-feature"
								:class="{ 'is-active': props.selectedSize === feature.key }"
								:data-testid="`product-category-feature-card-${feature.key}`"
								@click="emit('update:selectedSize', feature.key)"
							>
								<h4 class="mini-feature-title">{{ t(`product.sizes.${feature.key}.label`) }}</h4>
								<img
									:src="feature.image"
									:alt="t(`product.sizes.${feature.key}.label`)"
									loading="lazy" class="mini-feature-image" >

								<p class="mini-feature-description">
									{{ t(`product.featureCards.${feature.descriptionKey}.description`) }}
								</p>
							</button>
						</div>
					</div>

					<aside class="product-options" data-testid="product-category-options">
						<section>
							<div class="option-head" data-testid="product-category-size-head">
								<h3 class="option-title" data-testid="product-category-size-title">{{ t('product.options.selectSize') }}</h3>
								<small class="option-head-unit">{{ t('product.options.unitMm') }}</small>
							</div>
							<div class="option-grid option-grid-size" data-testid="product-category-size-options">
								<button
									v-for="size in props.sizeOptionModels"
									:key="size.key"
									type="button"
									class="option-pill"
									:class="{ 'is-active': props.selectedSize === size.key }"
									:data-testid="`product-category-size-option-${size.key}`"
									@click="emit('update:selectedSize', size.key)"
								>
									<span class="size-pill-name">{{ size.name }}</span>
									<span class="size-pill-dim">{{ size.dim }}</span>
								</button>
								<button
									type="button"
									class="option-pill option-pill-wide is-disabled"
									disabled
									data-testid="product-category-size-option-custom-button"
								>
									{{ t('product.options.customSize') }}
								</button>
							</div>
						</section>

						<section>
							<h3 class="option-title" data-testid="product-category-quantity-title">{{ t('product.options.selectQuantity') }}</h3>
							<div class="option-grid" data-testid="product-category-quantity-options">
								<button
									v-for="qty in props.quantityOptions"
									:key="qty"
									type="button"
									class="option-pill"
									:class="{ 'is-active': props.selectedQty === qty }"
									:data-testid="`product-category-quantity-option-${qty}`"
									@click="emit('update:selectedQty', qty)"
								>
									<span class="qty-pill-count">{{ qty.toLocaleString() }}</span>
									<strong class="qty-pill-price">{{ props.formatPrice(props.quantityPrice(qty)) }}</strong>
								</button>
								<button
									type="button"
									class="option-pill option-pill-wide is-disabled"
									disabled
									data-testid="product-category-quantity-option-custom-button"
								>
									{{ t('product.options.customQuantity') }}
								</button>
							</div>
						</section>

						<section class="price-summary" data-testid="product-category-price-summary">
							<p class="price-summary-row price-summary-row-hidden" data-testid="product-category-price-subtotal-row">
								<span class="price-summary-label">{{ t('product.price.subtotal') }}</span>
								<strong class="price-summary-value">{{ props.formatPrice(props.subtotal) }}</strong>
							</p>

							<div class="price-summary-top">
								<ul class="price-benefits" data-testid="product-category-price-benefits">
									<li data-testid="product-category-price-benefit-shipping">{{ t('product.price.benefitShipping') }}</li>
									<li data-testid="product-category-price-benefit-ships-tomorrow">{{ t('product.price.benefitShipsTomorrow') }}</li>
								</ul>

								<div class="price-summary-stack">
									<p class="price-summary-row discount" data-testid="product-category-price-discount-row">
										<strong class="price-discount-rate">-{{ Math.round(props.discountRate * 100) }}%</strong>
										<span class="price-summary-strike">{{ props.formatPrice(props.subtotal) }}</span>
									</p>
									<p class="price-summary-row total" data-testid="product-category-price-total-row">
										<strong class="price-summary-value">{{ props.formatPrice(props.total) }}</strong>
									</p>
									<p class="price-summary-unit">
										({{ props.formatPrice(unitPrice) }} per piece)
									</p>
								</div>
							</div>

							<UiButton
								type="button"
								variant="filled"
								tone="default"
								size="md"
								height="48px"
								class="next-step-btn"
								:disabled="props.navigationInFlight"
								data-testid="product-category-next-step-button"
								@click="emit('open-upload')"
							>
								{{ t('product.price.nextStep') }}
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

        text-align: center;
        font-size: var(--type-size-200);
        font-weight: var(--font-weight-medium);
        line-height: var(--type-line-200);
        color: var(--text-primary);
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

            font-size: var(--type-size-600);
            line-height: var(--type-line-600);
            color: var(--text-primary);
        }

        .product-preview-blurb {

            font-size: var(--type-size-200);
            line-height: var(--type-line-200);
            color: var(--text-secondary);
        }
        .product-preview-media {
            margin-top: 0;
            height: 362px;
            border-radius: 24px;
            position: relative;
            overflow: hidden;

            .product-preview-media-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
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

                    font-size: var(--type-size-100);
                    line-height: var(--type-line-100);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    flex: 0 0 24px;
                    display: -webkit-box;
                    line-clamp: 2;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .mini-feature-description {

                    font-size: var(--type-size-100);
                    line-height: var(--type-line-100);
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

            font-size: var(--type-size-300);
            line-height: var(--type-line-300);
            color: var(--text-primary);
        }

        .option-head {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 8px;

            .option-head-unit {
                color: var(--text-muted);
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
            }
        }

        .option-grid {
            margin-top: 10px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px 12px;

            &:not(.option-grid-size) {
                .qty-pill-count {
                    font-weight: var(--font-weight-semibold);
                }
            }

            .option-pill {
                border: 1px solid var(--border-default);
                border-radius: 999px;
                min-height: 44px;
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                color: var(--text-primary);
                cursor: pointer;
                padding: 8px 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;

                .qty-pill-price {
                    font-size: inherit;
                    line-height: inherit;
                    font-weight: var(--font-weight-regular);
                    color: var(--text-secondary);
                }

                &.is-active {
                    border: 2px solid var(--gold-base);
                    background: var(--gold-10);
                }

                &.is-disabled {
                    cursor: not-allowed;
                    opacity: 0.55;
                }
            }

            .option-pill-wide {
                grid-column: 1 / -1;
                font-weight: var(--font-weight-medium);
            }

            .size-pill-name {
                font-size: var(--type-size-100);
                font-weight: var(--font-weight-semibold);
                line-height: var(--type-line-100);
            }

            .size-pill-dim {
                font-size: var(--type-size-100);
                font-weight: var(--font-weight-regular);
                line-height: var(--type-line-100);
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

            display: flex;
            align-items: baseline;
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            color: var(--text-secondary);
        }

        .price-summary-row-hidden {
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip: rect(0 0 0 0);
            white-space: nowrap;
            clip-path: inset(50%);
        }

        .price-summary-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
        }

        .price-summary-stack {
            text-align: right;
        }

        .discount {
            justify-content: flex-end;
            gap: 10px;
        }

        .price-discount-rate {
            color: var(--error);
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
        }

        .price-summary-strike {
            color: var(--text-muted);
            text-decoration: line-through;
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
        }

        .total {
            justify-content: flex-end;
            color: var(--text-primary);
        }

        .total .price-summary-value {
            font-size: var(--type-size-500);
            line-height: var(--type-line-500);
        }

        .price-summary-unit {
            color: var(--text-secondary);
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
        }

    }

    .price-benefits {
        padding-left: 16px;
        color: var(--text-secondary);
        display: grid;
        gap: 4px;
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        list-style: disc;
        max-width: 174.5px;
    }

    .next-step-btn {
        margin-top: 16px;
        width: 100%;
        border-radius: 999px;
        background: var(--gold-base);
        color: var(--text-primary);
        font-size: var(--type-size-200);
        line-height: var(--type-line-200);
        font-weight: var(--font-weight-bold);
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
            font-size: var(--type-size-550);
            line-height: var(--type-line-550);
        }

        .product-preview-features {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .price-summary .price-discount-rate {
            font-size: var(--type-size-500);
            line-height: var(--type-line-500);
        }

        .price-summary .total .price-summary-value {
            font-size: clamp(34px, 7vw, 44px);
            line-height: var(--type-line-400);
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
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
        }

        .price-summary .price-summary-top {
            flex-direction: column;
        }

        .price-summary .price-summary-stack {
            width: 100%;
            text-align: left;
        }

        .price-summary .discount,
        .price-summary .total {
            justify-content: flex-start;
        }

        .price-benefits {
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
        }

        .next-step-btn {
            font-size: var(--type-size-500);
            line-height: var(--type-line-500);
        }
    }
}
</style>