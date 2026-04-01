<script setup lang="ts">
import type { ProductItem, ProductCategoryKey  } from '~/types/products/catalog';
import { useFileBaseUrl } from '~/composables/core/fileBaseUrl/useFileBaseUrl';
import VinylLetteringDesigner from '~/components/products/product-category/VinylLetteringDesigner.vue';
import { getProductSlugByCategory } from '~/helpers/products/productCategory.helper';

import { useQuoteSectionHandler } from '~/composables/product-page/useQuoteSectionHandler';


const props = defineProps<{
	category?: ProductCategoryKey;
	categoryProducts: ProductItem[];
	hasPickedProduct: boolean;
	selectedId: string | null;
	selectedProduct: ProductItem | null;
	quantityOptions: readonly number[];
	selectedQty: number;
	navigationInFlight: boolean;
	subtotal: number;
	discountRate: number;
	total: number;
	getProductName: (product: ProductItem) => string;
	getProductBlurb: (product: ProductItem) => string;
	quantityPrice: (qty: number) => number;
}>();

const emit = defineEmits<{
	'select-product': [productId: string];
	'update:selectedQty': [qty: number];
	'open-upload': [];
}>();

// 🔥 Functionality Implementation
const {
	product,
	size,
	featured_sizes,
	size_featured_cards,
	custom_size,
	is_custom_size,
	quantity,
	featured_quantities,
	is_custom_qty,
	custom_qty_input,
	formatted_custom_qty,
	is_custom_size_focus,
	is_custom_qty_focus,
	color,
	featured_colors,
	has_color_selection,
	has_font_selection,
	has_lettering_editor,
	lettering,
	lettering_navigation_flight,
	selected_font,
	featured_fonts,
	pricing_ready,
	discount,
	standard_price,
	unit_price,
	price,
	is_vinylsize_focused,
	inputUpdateSize,
	inputUpdateCustomSize,
	inputUpdateQuantity,
	inputUpdateCustomQuantity,
	instatiateForm,
	focusWidthInput,
	showCustomSize,
	showCustomQty,
	formatPrice,
	onCustomSizeFocus,
	onCustomSizeBlur,
	onCustomQtyFocus,
	onCustomQtyBlur,
	inputUpdateColor,
	letteringTextInput,
	letteringWidthUpdate,
	letteringHeightUpdate,
	letteringWidthInput,
	letteringHeightInput,
	updateProduct,
	clearForm,
	onVinylSizeFocus,
	onVinylSizeBlur,
	onVinylFontFocus,
	onVinylFontBlur,
} = useQuoteSectionHandler();

const route = useRoute()
const resolved_category = computed<ProductCategoryKey>(() => {
	if (props.category) {
		return props.category
	}

	const route_category = route.params?.category
	if (route_category === 'stickers' || route_category === 'roll-stickers' || route_category === 'sheet-stickers') {
		return route_category
	}

	return 'stickers'
})
const route_product_slug = computed(() => {
	const route_product = route.params?.product
	return typeof route_product === 'string'
		? route_product
		: Array.isArray(route_product)
			? route_product[0] ?? null
			: null
})

watch(
	route_product_slug,
	(next_slug) => {
		if (typeof next_slug === 'string' && next_slug) {
			updateProduct(next_slug)
			void instatiateForm({ interactive: false })
			return
		}

		clearForm()
	},
	{ immediate: true }
)

watch(
	() => props.selectedProduct?.id,
	(next_product_id) => {
		if (!next_product_id) return

		const next_slug = getProductSlugByCategory(next_product_id, resolved_category.value)
		updateProduct(next_slug)
		void instatiateForm({ interactive: false })
	},
	{ immediate: true }
)

const { t } = useI18n();
const { resolveFileUrl } = useFileBaseUrl();
const demo_hero_video_url = resolveFileUrl('products/die-cut-sticker/hero/01-donut-sticker-in-hand-video.mp4');
const demo_hero_poster_url = resolveFileUrl('products/die-cut-sticker/hero/01-donut-sticker-in-hand-poster.png');
const has_hydrated = ref(false)

onMounted(() => {
	has_hydrated.value = true
})



const prevent_non_digit_input = (event: InputEvent) => {
	if (!event.data) return
	if (/^\d+$/.test(event.data)) return
	event.preventDefault()
}




const has_valid_custom_size = computed(() =>
	Boolean(is_custom_size.value && custom_size.value.width && custom_size.value.width > 0 && custom_size.value.height && custom_size.value.height > 0)
)

const has_pending_custom_selection = computed(() =>
	(is_custom_size.value && !has_valid_custom_size.value)
	|| (is_custom_size.value && !quantity.value?.nr)
	|| (quantity.value && quantity.value?.nr && quantity.value?.nr <= 0 )
	|| (has_lettering_editor.value && !lettering.value.text)
)

const should_play_preview_video = computed(() =>
	has_hydrated.value && Boolean(props.selectedProduct) && !has_lettering_editor.value && !props.navigationInFlight
)

const displayed_product_title = computed(() =>
	has_lettering_editor.value ? 'Vinyl Lettering Sticker' : props.selectedProduct ? props.getProductName(props.selectedProduct) : ''
)

</script>

<template>
	<section class="product-stage" :class="{ 'is-selected': props.hasPickedProduct }" data-testid="product-category-stage-root">
		<section :key="resolved_category" class="product-picker product-picker-layer" data-testid="product-category-picker">
			<button
				v-for="(prod, index) in props.categoryProducts"
				:key="prod.id"
				type="button"
				class="product-picker-item"
				:class="{ 'is-active': props.selectedId === prod.id }"
				:data-testid="`product-category-picker-item-${prod.id}`"
				@click="emit('select-product', prod.id)"
			>
				<div class="product-picker-icon" :class="`is-${prod.id}`">
					<img
						:src="prod.image"
						:alt="`${props.getProductName(prod)} preview`"
						:loading="index === 0 ? 'eager' : 'lazy'"
						:fetchpriority="index === 0 ? 'high' : undefined"
						:decoding="index === 0 ? 'sync' : 'async'"
						width="156"
						height="120"
						class="product-picker-image"
					>
				</div>
				<p class="product-picker-name">
					{{ props.getProductName(prod) }}
				</p>
			</button>
		</section>

		<section v-show="props.hasPickedProduct" class="product-reveal product-reveal-layer" data-testid="product-category-reveal">
			<section v-if="props.selectedProduct && product">
				<section class="product-configurator" data-testid="product-category-configurator">
					<div class="product-preview" data-testid="product-category-preview">

						<div class="product-preview-header">
							<h1 class="product-preview-title" data-testid="product-category-preview-title">
								{{ displayed_product_title }}
							</h1>

							<p class="product-preview-blurb" data-testid="product-category-preview-blurb">
								{{ props.getProductBlurb(props.selectedProduct) }}
							</p>
						</div>

						<div
							v-if="!has_lettering_editor"
							class="product-preview-media"
							data-testid="product-category-preview-media"
						>
							<img
								v-if="!should_play_preview_video"
								:src="demo_hero_poster_url"
								:alt="`${displayed_product_title || 'Product'} preview poster`"
								class="product-preview-media-image"
							>
							<video
								v-else
								:key="props.selectedId ?? 'preview-video'"
								:poster="demo_hero_poster_url"
								class="product-preview-media-image"
								autoplay
								muted
								loop
								playsinline
								preload="metadata"
							>
								<source :src="demo_hero_video_url" type="video/mp4">
							</video>
						</div>

						<div
							v-else
							class="vinyl-preview-board"
							data-testid="product-category-vinyl-preview"
						>
							<VinylLetteringDesigner
								:text="lettering.text"
								:width="lettering.width"
								:height="lettering.height"
								:font="selected_font"
								:color-key="color?.key ?? 'black'"
								:redirecting="props.navigationInFlight || lettering_navigation_flight"
								:active-size="lettering.active"
								@update:text="letteringTextInput($event)"
								@update:width="letteringWidthUpdate($event)"
								@update:height="letteringHeightUpdate($event)"
							/>
						</div>

						<div class="product-preview-features" data-testid="product-category-preview-features">
							<button
								v-for="featured_size_cards in size_featured_cards"
								:key="'sizes-cards-'+featured_size_cards.key+'-'+featured_size_cards.id"
								type="button"
								class="mini-feature"
								:disabled="has_lettering_editor"
								:class="{ 'is-active': !is_custom_size && !has_lettering_editor && size?.id === featured_size_cards.id }"
								:data-testid="`product-category-feature-card-${featured_size_cards.key}`"
								@click="inputUpdateSize(featured_size_cards)"
							>
								<h4 class="mini-feature-title">{{ t(`product.sizes.${featured_size_cards.key}.label`) }}</h4>

								<img
									v-if="featured_size_cards.image"
									:src="featured_size_cards.image"
									:alt="t(`product.sizes.${featured_size_cards.key}.label`)"
									loading="lazy"
									class="mini-feature-image"
								>

								<p class="mini-feature-description">
									{{ t(`product.featureCards.${featured_size_cards.description}.description`) }}
								</p>
							</button>
						</div>
					</div>

					<aside class="product-options" data-testid="product-category-options">
						<section v-if="has_color_selection" class="product-section">
							<h3 class="option-title" data-testid="product-category-color-title">Select your preferred color</h3>
							<div class="color-grid" data-testid="product-category-color-options">
								<button
									v-for="(fcolor, key) in featured_colors"
									:key="'color-'+key+'-'+fcolor.id"
									type="button"
									class="color-swatch"
									:class="{ 'is-active': color?.id === fcolor.id }"
									:aria-label="fcolor.name"
									:data-testid="`product-category-color-option-${fcolor.key}`"
									@click="inputUpdateColor(fcolor)"
								>
									<span class="color-swatch-tooltip">{{ fcolor.name }}</span>
									<span class="color-swatch-core" :style="fcolor.swatch_style">
										<UiIcon
											v-if="color?.id === fcolor.id"
											name="regular-check"
											:size="24"
											class="color-swatch-check"
											:color="fcolor.code"
										/>
									</span>
								</button>
							</div>
						</section>

						<section v-if="!has_lettering_editor" class="product-section">
							<div class="option-head" data-testid="product-category-size-head">
								<h3 class="option-title" data-testid="product-category-size-title">{{ t('product.options.selectSize') }}</h3>
								<small class="option-head-unit">{{ t('product.options.unitMm') }}</small>
							</div>
							<div class="option-grid option-grid-size" data-testid="product-category-size-options">
								<button
									v-for="(fsize, key) in featured_sizes"
									:key="'size-'+key+'-'+fsize.id"
									type="button"
									class="option-pill"
									:class="{ 'is-active': !is_custom_size && size?.id === fsize.id }"
									:data-testid="`product-category-size-option-${fsize.id}`"
									@click="inputUpdateSize(fsize)"
								>
									<span class="size-pill-name">{{ fsize.label }}</span>
									<span class="size-pill-dim">{{ fsize.width }}x{{ fsize.height }}</span>
								</button>

								<!-- Custom size button -->
								<button
									v-if="!is_custom_size"
									type="button"
									class="option-pill option-pill-wide"
									data-testid="product-category-size-option-custom-button"
									@click="showCustomSize"
								>
									{{ t('product.options.customSize') }}
								</button>

								<!-- Width x Height input -->
								<div
									v-else
									class="option-pill option-pill-wide custom-size-pill"
									:class="{
										'is-active': true,
										'is-input-focused': is_custom_size_focus
									}"
									data-testid="product-category-size-option-custom-input"
									@click.self="focusWidthInput"
								>
									<input
										ref="custom_width_input"
										v-model="custom_size.width"
										type="number"
										inputmode="numeric"
										pattern="[0-9]*"
										placeholder="Width"
										class="custom-size-input"
										@beforeinput="prevent_non_digit_input"
										@input="inputUpdateCustomSize"
										@focus="onCustomSizeFocus"
										@blur="onCustomSizeBlur"
									>

									<span class="size-separator">x</span>

									<input
										v-model="custom_size.height"
										type="number"
										inputmode="numeric"
										pattern="[0-9]*"
										placeholder="Height"
										class="custom-size-input"
										@beforeinput="prevent_non_digit_input"
										@input="inputUpdateCustomSize"
										@focus="onCustomSizeFocus"
										@blur="onCustomSizeBlur"
									>
								</div>
							</div>
						</section>

						<section v-if="!has_lettering_editor" class="product-section">
							<h3 class="option-title" data-testid="product-category-quantity-title">{{ t('product.options.selectQuantity') }}</h3>
							<div class="option-grid" data-testid="product-category-quantity-options">
								<button
									v-for="qty in featured_quantities"
									:key="qty.nr ?? 'qty-key'"
									type="button"
									class="option-pill"
									:class="{ 'is-active': !is_custom_qty && quantity?.nr === qty.nr }"
									:data-testid="`product-category-quantity-option-${qty.nr}`"
									@click="inputUpdateQuantity(qty)"
								>
									<span class="qty-pill-count">{{ qty.nr?.toLocaleString() }}</span>
									<strong class="qty-pill-price">{{ formatPrice(qty.price ?? 0) }}</strong>
								</button>
								<button
									v-if="!is_custom_qty"
									type="button"
									class="option-pill option-pill-wide"
									data-testid="product-category-quantity-option-custom-button"
									@click="showCustomQty"
								>
									{{ t('product.options.customQuantity') }}
								</button>

								<div
									v-else
									class="option-pill option-pill-wide custom-size-pill"
									:class="{
										'is-active': true,
										'is-input-focused': is_custom_qty_focus
									}"
									data-testid="product-category-quantity-option-custom-input"
									@click.self="custom_qty_input?.focus()"
								>
									<input
										ref="custom_qty_input"
										:value="formatted_custom_qty"
										type="text"
										inputmode="numeric"
										pattern="[0-9]*"
										placeholder="Enter Quantity"
										class="custom-size-input custom-quantity-input"
										@beforeinput="prevent_non_digit_input"
										@input="inputUpdateCustomQuantity($event)"
										@focus="onCustomQtyFocus"
										@blur="onCustomQtyBlur"
									>
								</div>
							</div>
						</section>

						<template v-else>
							<section class="product-section">
								<div class="option-head" data-testid="product-category-size-head">
									<h3 class="option-title" data-testid="product-category-size-title">{{ t('product.options.selectSize') }}</h3>
									<small class="option-head-unit">{{ t('product.options.unitMm') }}</small>
								</div>

								<div class="option-grid">
									<div
										class="option-pill option-pill-wide custom-size-pill"
										:class="{
											'is-active': true,
											'is-input-focused': is_vinylsize_focused
										}"
										data-testid="product-category-vinyl-size-input"
									>
										<input
											:value="lettering.width"
											type="text"
											inputmode="numeric"
											pattern="[0-9]*"
											class="custom-size-input"
											@beforeinput="prevent_non_digit_input"
											@input="letteringWidthInput"
											@focus="onVinylSizeFocus"
											@blur="onVinylSizeBlur"
										>
										<span class="size-separator">x</span>
										<input
											:value="lettering.height"
											type="text"
											inputmode="numeric"
											pattern="[0-9]*"
											class="custom-size-input"
											@beforeinput="prevent_non_digit_input"
											@input="letteringHeightInput"
											@focus="onVinylSizeFocus"
											@blur="onVinylSizeBlur"
										>
									</div>
								</div>
							</section>

							<section v-if="has_font_selection" class="product-section">
								<h3 class="option-title">Select your font</h3>
								<div class="option-grid">
									<div class="option-pill-wide">
										<UiSelect
											v-model="selected_font"
											:options="featured_fonts"
											trigger-class="custom-size-input font-select-trigger"
											menu-class="vinyl-font-menu"
											@focus="onVinylFontFocus"
											@blur="onVinylFontBlur"
										/>
									</div>
								</div>
							</section>

							<section class="product-section">
								<h3 class="option-title" data-testid="product-category-quantity-title">{{ t('product.options.selectQuantity') }}</h3>
								<div class="option-grid vinyl-quantity-grid" data-testid="product-category-quantity-options">
									<button
										v-for="qty in featured_quantities"
										:key="qty.nr ?? 'qty-key'"
										type="button"
										class="option-pill"
										:class="{ 'is-active': !is_custom_qty && quantity?.nr === qty.nr }"
										:data-testid="`product-category-quantity-option-${qty.nr}`"
										@click="inputUpdateQuantity(qty)"
									>
										<span class="qty-pill-count">{{ qty.nr?.toLocaleString() }}</span>
										<strong class="qty-pill-price">{{ formatPrice(qty.price ?? 0) }}</strong>
									</button>
									<button
										v-if="!is_custom_qty"
										type="button"
										class="option-pill option-pill-wide"
										data-testid="product-category-quantity-option-custom-button"
										@click="showCustomQty"
									>
										{{ t('product.options.customQuantity') }}
									</button>
									<div
										v-else
										class="option-pill option-pill-wide custom-size-pill"
										:class="{
											'is-active': true,
											'is-input-focused': is_custom_qty_focus
										}"
										data-testid="product-category-quantity-option-custom-input"
										@click.self="custom_qty_input?.focus()"
									>
										<input
											ref="custom_qty_input"
											:value="formatted_custom_qty"
											type="text"
											inputmode="numeric"
											pattern="[0-9]*"
											placeholder="Enter Quantity"
											class="custom-size-input custom-quantity-input"
											@beforeinput="prevent_non_digit_input"
											@input="inputUpdateCustomQuantity($event)"
											@focus="onCustomQtyFocus"
											@blur="onCustomQtyBlur"
										>
									</div>
								</div>
							</section>
						</template>

						<section class="price-summary" data-testid="product-category-price-summary">
							<div class="price-summary-top">
								<ul class="price-benefits" data-testid="product-category-price-benefits">
									<li data-testid="product-category-price-benefit-shipping">{{ t('product.price.benefitShipping') }}</li>
									<li data-testid="product-category-price-benefit-ships-tomorrow">{{ t('product.price.benefitShipsTomorrow') }}</li>
								</ul>

								<div class="price-summary-stack">
									<p
										v-if="pricing_ready"
										class="price-summary-row discount"
										data-testid="product-category-price-discount-row"
									>
										<strong class="price-discount-rate">-{{ Math.round(discount * 100)}}%</strong>
										<span class="price-summary-strike">{{ formatPrice(standard_price) }}</span>
									</p>
									<p class="price-summary-row total" data-testid="product-category-price-total-row">
										<strong class="price-summary-value">{{ pricing_ready ? formatPrice(unit_price) : '--' }}</strong>
									</p>
									<p class="price-summary-unit">
										({{ pricing_ready ? formatPrice(price) : '--' }} per piece)
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
								:disabled="props.navigationInFlight || has_pending_custom_selection"
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
@use '~/assets/scss/fonts/lettering';

.product-stage {
    position: relative;
    margin-top: 0;
    display: grid;
    overflow: visible;
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
		animation: fadeInUp 0.4s cubic-bezier(0.2, 0, 0.2, 1) both;

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
			transition: transform 0.24s ease, opacity 0.3s ease;
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
        overflow: visible;
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

				&:disabled {
					cursor: default;
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
        gap: 16px;

        .option-title {
            font-size: var(--type-size-200);
            line-height: var(--type-line-200);
            color: var(--text-primary);
        }

        .color-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
        }

        .color-swatch {
            width: 40px;
            height: 40px;
            padding: 0;
            border: 0;
            border-radius: 999px;
            background: transparent;
            display: grid;
            place-items: center;
            cursor: pointer;
            position: relative;
            transition: transform 0.18s ease, box-shadow 0.18s ease;

            &:hover {
                transform: translateY(-1px);
            }

            &.is-active {
                border-radius: 16px;
                border: 1px solid var(--Gold-Base-Color, #F5DF4D);
                background: var(--gold-10, #FDF9DB);
            }

            &:hover .color-swatch-tooltip {
                opacity: 1;
                transform: translate(-50%, 0);
            }
        }

        .color-swatch-core {
            width: 28px;
            height: 28px;
            border-radius: 12px;
            display: grid;
            place-items: center;
            overflow: hidden;
        }

        .color-swatch-tooltip {
            position: absolute;
            left: 50%;
            bottom: calc(100% + 12px);
            transform: translate(-50%, 6px);
            min-width: 72px;
            padding: 8px 14px;
            border-radius: 18px;
            background: #342b37;
            color: var(--white-base);
            font-size: var(--type-size-150);
            line-height: 1;
            font-weight: var(--font-weight-semibold);
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.18s ease, transform 0.18s ease;

            &::after {
                content: '';
                position: absolute;
                left: 50%;
                top: calc(100% - 1px);
                transform: translateX(-50%);
                width: 14px;
                height: 10px;
                background: #342b37;
                clip-path: polygon(50% 100%, 0 0, 100% 0);
            }
        }

        .color-swatch-check {
            flex: 0 0 auto;
        }
        .product-section {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .option-head {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 8px;

                .option-head-unit {
                    color: var(--text-secondary);
                    font-size: var(--type-size-100);
                    line-height: var(--type-line-100);
                }
            }
        }


        :deep(.vinyl-font-trigger) {
            min-height: 36px;
            border-radius: 999px;
            border: 1px solid var(--border-default);
            padding: 0 16px 0 20px;
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            color: var(--text-primary);
        }

        :deep(.vinyl-font-menu) {
            border-radius: 8px;
        }

        .font-select-trigger {
            border-radius: 32px !important;
        }

        :deep(.font-select-trigger) {
            .ui-select-value {
                font-size: var(--type-size-100);
                font-weight: var(--font-weight-bold);
                color: var(--text-primary);
            }
        }

        :deep(.vinyl-font-menu) {
            border-radius: 8px;

            .ui-select-option {
                &:hover {
                    background: var(--gray-10);
                }

                &.is-selected {
                    background: var(--gray-20) !important;
                    font-weight: var(--font-weight-bold);
                }
            }
        }

        .vinyl-size-pill {
            min-height: 36px;
            border-radius: 999px;
            border: 1px solid var(--border-default);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 28px;
            padding: 0 16px;
        }

        .vinyl-size-input {
            width: 72px;
            border: 0;
            background: transparent;
            text-align: center;
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            color: var(--text-primary);
            outline: none;
        }

        .vinyl-size-input::-webkit-outer-spin-button,
        .vinyl-size-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        .vinyl-size-input {
            appearance: textfield;
            -moz-appearance: textfield;
        }

        .vinyl-size-separator {
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            color: var(--text-primary);
            font-weight: var(--font-weight-semibold);
        }

        .option-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;

			&:not(.option-grid-size) {
				.qty-pill-count {
					font-weight: var(--font-weight-semibold);
				}
			}

            .option-pill {
                border: 1px solid var(--border-default);
                border-radius: 999px;
                min-height: 36px;
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                color: var(--text-primary);
                cursor: pointer;
                padding: 0 20px;
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
            .custom-size-pill {
                justify-content: center;
                gap: 24px;

                .custom-size-input {
                    width: 100%;
                    max-width: 42px;
                    border: none;
                    background: transparent;
                    text-align: center;
                    font-size: var(--type-size-100);
                    line-height: var(--type-line-100);
                    font-weight: var(--font-weight-regular);
                    outline: none;
                    appearance: textfield;
                    -moz-appearance: textfield;

                    &::placeholder {
                        color: var(--gray-60);
                        opacity: 1; // prevents browser default fading
                    }

                    &.custom-quantity-input {
                        max-width: 84px;
                    }
                }

                .custom-size-input::-webkit-outer-spin-button,
                .custom-size-input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                .size-separator {
                    color: var(--text-primary);
                    font-weight: var(--font-weight-medium);
                }
                &.is-active {
                    border: 2px solid var(--gold-base);

                }
                &.is-input-focused {
                    border: 2px solid var(--gold-base);
                    background: var(--white-base);
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

        .vinyl-quantity-grid {
            grid-template-columns: 1fr 1fr;
        }
    }

    .price-summary {
        display: flex;
        flex-direction: column;
        gap: 16px;
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
            font-size: var(--type-size-450);
            line-height: var(--type-line-450);
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
        font-size: 12px;
        line-height: 20px;
        list-style: disc;
        max-width: 174.5px;
    }

    .next-step-btn {
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

.product-picker-item {
	@for $i from 1 through 12 {
		&:nth-child(#{$i}) {
			animation-delay: #{$i * 0.03}s;
		}
	}
}

@keyframes fadeInUp {
	0% {
		opacity: 0;
		transform: translateY(12px) scale(0.98);
	}
	100% {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}
</style>