<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useProductExperience } from '~/composables/products/categoryExperience/useProductCategoryExperience';
import { useAttributesStore } from '~/stores/product/attributes.store';

const {
	size,
	active_size_code,
	quantity,
	quantity_options,
	is_loading_features,
	featured_sizes,
	featured_quantities,
	featured_colors,
	color,
	has_color_selection,
	has_font_selection,
	featured_fonts,
	selected_font,
	lettering_navigation_flight,
	pricing_ready,
	discount_rate,
	subtotal,
	unit_price,
	total,
	formatPrice,
	selection_navigation_in_flight,
	lettering,
	is_custom_size,
	custom_size,
	custom_quantity,
	is_custom_qty,
	formatted_custom_qty,
	is_custom_size_focus,
	is_custom_qty_focus,
	is_vinylsize_focused,
	custom_width_input,
	custom_qty_input,
	has_lettering_editor,
	vinyl_preview_ready,
	url_slug,
	selected_id,

	// Actions
	proceedToNextStep,
	showCustomSize,
	showCustomQty,
	focusWidthInput,
	onCustomSizeFocus,
	onCustomSizeBlur,
	onCustomQtyFocus,
	onCustomQtyBlur,
	onVinylSizeFocus,
	onVinylSizeBlur,
	onVinylFontFocus,
	onVinylFontBlur,
	inputUpdateSize,
	inputUpdateCustomSize,
	inputUpdateQuantity,
	inputUpdateCustomQuantity,
	inputUpdateColor,
	letteringWidthUpdate,
	letteringHeightUpdate,
} = useProductExperience();

const { t } = useI18n();
const attribute_store = useAttributesStore();
const last_known_color_count_by_slug = ref<Record<string, number>>({});
const last_known_quantity_count_by_slug = ref<Record<string, number>>({});
const color_skeleton_grid_ref = ref<HTMLElement | null>(null);
const color_skeleton_columns = ref(8);
let color_skeleton_resize_observer: ResizeObserver | null = null;

function updateColorSkeletonColumns() {
	if (typeof window === 'undefined') return;
	const width = color_skeleton_grid_ref.value?.clientWidth ?? 0;
	if (!width) return;

	const swatch_size = 40;
	const swatch_gap = 4;
	const estimated_columns = Math.max(1, Math.floor((width + swatch_gap) / (swatch_size + swatch_gap)));
	color_skeleton_columns.value = estimated_columns;
}

const resolved_color_count = computed(() => {
	const active_slug = url_slug.value || '';
	const cached_colors = active_slug
		? attribute_store.attribute_cache[active_slug]?.colors ?? []
		: [];
	const live_colors = attribute_store.colors ?? [];

	return featured_colors.value.length || cached_colors.length || live_colors.length;
});

watch(
	resolved_color_count,
	(count) => {
		const active_slug = url_slug.value || '';
		if (count > 0 && active_slug) {
			last_known_color_count_by_slug.value = {
				...last_known_color_count_by_slug.value,
				[active_slug]: count,
			};
		}
	},
	{ immediate: true }
);

onMounted(() => {
	updateColorSkeletonColumns();
	if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') return;

	color_skeleton_resize_observer = new ResizeObserver(() => {
		updateColorSkeletonColumns();
	});

	if (color_skeleton_grid_ref.value) {
		color_skeleton_resize_observer.observe(color_skeleton_grid_ref.value);
	}
});

onBeforeUnmount(() => {
	color_skeleton_resize_observer?.disconnect();
	color_skeleton_resize_observer = null;
});

const color_skeleton_count = computed(() => {
	const active_slug = url_slug.value || '';
	const remembered_count = active_slug
		? last_known_color_count_by_slug.value[active_slug] ?? 0
		: 0;
	const estimated_grid_count = color_skeleton_columns.value * 2;

	return resolved_color_count.value || remembered_count || estimated_grid_count;
});

const resolved_quantity_count = computed(() => {
	const active_slug = url_slug.value || '';
	const cached_quantities = active_slug
		? attribute_store.attribute_cache[active_slug]?.quantities ?? []
		: [];
	const live_quantities = attribute_store.quantities ?? [];
	const current_featured_quantities = featured_quantities.value ?? [];

	return current_featured_quantities.length || cached_quantities.length || live_quantities.length;
});

watch(
	resolved_quantity_count,
	(count) => {
		const active_slug = url_slug.value || '';
		if (count > 0 && active_slug) {
			last_known_quantity_count_by_slug.value = {
				...last_known_quantity_count_by_slug.value,
				[active_slug]: count,
			};
		}
	},
	{ immediate: true }
);

const quantity_skeleton_count = computed(() => {
	const active_slug = url_slug.value || '';
	const remembered_count = active_slug
		? last_known_quantity_count_by_slug.value[active_slug] ?? 0
		: 0;
	const default_quantity_count = quantity_options.length || 8;

	return resolved_quantity_count.value || remembered_count || default_quantity_count;
});

const ships_tomorrow_benefit = computed(() => {
	const product_specific_key = selected_id.value
		? `product.price.benefitShipsTomorrowByProduct.${selected_id.value}`
		: '';
	const product_specific_copy = product_specific_key ? t(product_specific_key) : '';

	return product_specific_copy && product_specific_copy !== product_specific_key
		? product_specific_copy
		: t('product.price.benefitShipsTomorrow');
});

const has_pending_custom_selection = computed(() => {
	const size_source = is_custom_size.value ? custom_size.value : size.value;
	const quantity_source = is_custom_qty.value ? custom_quantity.value : quantity.value;

	const missing_size = !size_source?.width || !size_source?.height;
	const missing_quantity = !quantity_source?.nr;
	const missing_lettering_text = has_lettering_editor.value && !lettering.value.text;

	return (
		missing_size
		|| missing_quantity
		|| missing_lettering_text
	);
});

const prevent_non_digit_input = (event: InputEvent) => {
	if (!event.data) return;
	if (/^\d+$/.test(event.data)) return;
	event.preventDefault();
};

const nextStep = async () => {
	await proceedToNextStep();
};
</script>

<template>
	<aside class="product-options" data-testid="product-category-options">
		<section v-if="has_color_selection" class="product-section">
			<h3 class="option-title" data-testid="product-category-color-title">{{ t('product.options.selectColor') }}</h3>
			<div
				v-if="is_loading_features"
				ref="color_skeleton_grid_ref"
				class="color-grid"
				data-testid="product-category-color-skeletons"
			>
				<UiSkeleton v-for="i in color_skeleton_count" :key="'color-skeleton-'+i" height="40px" width="40px" border-radius="999px" />
			</div>
			<div v-else class="color-grid" data-testid="product-category-color-options">
				<button
					v-for="(fcolor, key) in featured_colors"
					:key="'color-'+key+'-'+(fcolor.id ?? key)"
					type="button"
					class="color-swatch"
					:class="{ 'is-active': color?.id === fcolor.id }"
					:aria-label="fcolor.name"
					@click="inputUpdateColor(fcolor)"
				>
					<span class="color-swatch-tooltip">{{ fcolor.name }}</span>
					<span class="color-swatch-core" :style="fcolor.style">
						<UiIcon
							v-if="color?.id === fcolor.id"
							name="regular-check"
							:size="24"
							class="color-swatch-check"
							:color="fcolor.hex_code"
						/>
					</span>
				</button>
			</div>
		</section>

		<!-- Size & Quantity (Standard) -->
		<template v-if="!has_lettering_editor">
			<section class="product-section">
				<div class="option-head">
					<h3 class="option-title">{{ t('product.options.selectSize') }}</h3>
					<small class="option-head-unit">{{ t('product.options.productPageUnitMm') }}</small>
				</div>

				<div v-if="is_loading_features" class="option-grid option-grid-size">
					<UiSkeleton v-for="i in 4" :key="'size-skeleton-'+i" height="var(--option-control-height)" border-radius="999px" />
					<UiSkeleton height="var(--option-control-height)" border-radius="999px" width="100%" class="grid-column-full" />
				</div>
				<div v-else class="option-grid option-grid-size">
					<button
						v-for="(fsize, key) in featured_sizes"
						:key="'size-'+key+'-'+(fsize.code ?? key)"
						type="button"
						class="option-pill"
						:class="{ 'is-active': !is_custom_size && active_size_code === fsize.code }"
						@click="inputUpdateSize(fsize)"
					>
						<span class="size-pill-name">{{ fsize.label }}</span>
						<span class="size-pill-dim">({{ fsize.width }}x{{ fsize.height }})</span>
					</button>

					<!-- Custom size button -->
					<button
						v-if="!is_custom_size"
						type="button"
						class="option-pill option-pill-wide"
						@click="showCustomSize"
					>
						{{ t('product.options.customSize') }}
					</button>

					<!-- Custom size input -->
					<div
						v-else
						class="option-pill option-pill-wide custom-size-pill"
						:class="{ 'is-active': true, 'is-input-focused': is_custom_size_focus }"
						@click.self="focusWidthInput"
					>
						<input
							ref="custom_width_input"
							:value="custom_size?.width"
							type="number"
							class="custom-size-input"
							placeholder="Width"
							@beforeinput="prevent_non_digit_input"
							@input="inputUpdateCustomSize($event, 'width')"
							@focus="onCustomSizeFocus"
							@blur="onCustomSizeBlur"
						>
						<span class="size-separator">x</span>
						<input
							:value="custom_size?.height"
							type="number"
							class="custom-size-input"
							placeholder="Height"
							@beforeinput="prevent_non_digit_input"
							@input="inputUpdateCustomSize($event, 'height')"
							@focus="onCustomSizeFocus"
							@blur="onCustomSizeBlur"
						>
					</div>
				</div>
			</section>

			<section class="product-section">
				<h3 class="option-title">{{ t('product.options.selectQuantity') }}</h3>
				<div v-if="is_loading_features" class="option-grid">
					<UiSkeleton v-for="i in quantity_skeleton_count" :key="'qty-skeleton-'+i" height="var(--option-control-height)" border-radius="999px" />
					<UiSkeleton height="var(--option-control-height)" border-radius="999px" width="100%" class="grid-column-full" />
				</div>
				<div v-else class="option-grid">
					<button
						v-for="(qty, index) in featured_quantities"
						:key="qty.nr ?? `qty-${index}`"
						type="button"
						class="option-pill"
						:class="{ 'is-active': !is_custom_qty && quantity?.nr === qty.nr }"
						@click="inputUpdateQuantity(qty)"
					>
						<span class="qty-pill-count">{{ qty.nr?.toLocaleString() }}</span>
						<span class="qty-pill-price">{{ formatPrice(qty.price ?? 0) }}</span>
					</button>
					<button
						v-if="!is_custom_qty"
						type="button"
						class="option-pill option-pill-wide"
						@click="showCustomQty"
					>
						{{ t('product.options.customQuantity') }}
					</button>
					<div
						v-else
						class="option-pill option-pill-wide custom-size-pill"
						:class="{ 'is-active': true, 'is-input-focused': is_custom_qty_focus }"
						@click.self="custom_qty_input?.focus()"
					>
						<input
							ref="custom_qty_input"
							:value="custom_quantity?.nr"
							type="number"
							class="custom-qty-input"
							placeholder="Enter quantity"
							@beforeinput="prevent_non_digit_input"
							@input="inputUpdateCustomQuantity"
							@focus="onCustomQtyFocus"
							@blur="onCustomQtyBlur"
						>
					</div>
				</div>
			</section>
		</template>

		<!-- Vinyl Lettering Options -->
		<template v-else>
			<section class="product-section">
				<div class="option-head">
					<h3 class="option-title">{{ t('product.options.selectSize') }}</h3>
					<small class="option-head-unit">{{ t('product.options.productPageUnitMm') }}</small>
				</div>
				<div v-if="is_loading_features || lettering_navigation_flight || !selected_font || !vinyl_preview_ready" class="option-grid">
					<UiSkeleton height="var(--option-control-height)" border-radius="999px" width="100%" class="grid-column-full" />
				</div>
				<div v-else class="option-grid">
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
							placeholder="Width"
							@beforeinput="prevent_non_digit_input"
							@input="letteringWidthUpdate"
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
							placeholder="Height"
							@beforeinput="prevent_non_digit_input"
							@input="letteringHeightUpdate"
							@focus="onVinylSizeFocus"
							@blur="onVinylSizeBlur"
						>
					</div>
				</div>
			</section>

			<section v-if="has_font_selection" class="product-section">
				<h3 class="option-title">{{ t('product.options.selectFont') }}</h3>
				<div v-if="is_loading_features || lettering_navigation_flight || !selected_font || !vinyl_preview_ready" class="option-grid">
					<UiSkeleton height="var(--option-control-height)" border-radius="999px" width="100%" class="grid-column-full" />
				</div>
				<div v-else class="option-grid">
					<div class="option-pill-wide">
						<UiSelect
							v-model="selected_font"
							:options="featured_fonts"
							size="38"
							trigger-class="custom-size-input font-select-trigger"
							menu-class="vinyl-font-menu"
							@focus="onVinylFontFocus"
							@blur="onVinylFontBlur"
						/>
					</div>
				</div>
			</section>

			<section class="product-section">
				<h3 class="option-title">{{ t('product.options.selectQuantity') }}</h3>
				<div v-if="is_loading_features" class="option-grid vinyl-quantity-grid">
					<UiSkeleton v-for="i in quantity_skeleton_count" :key="'qty-skeleton-'+i" height="var(--option-control-height)" border-radius="999px" />
					<UiSkeleton height="var(--option-control-height)" border-radius="999px" width="100%" class="grid-column-full" />
				</div>
				<div v-else class="option-grid vinyl-quantity-grid">
					<button
						v-for="(qty, index) in featured_quantities"
						:key="qty.nr ?? `vinyl-qty-${index}`"
						type="button"
						class="option-pill"
						:class="{ 'is-active': !is_custom_qty && quantity?.nr === qty.nr }"
						@click="inputUpdateQuantity(qty)"
					>
						<span class="qty-pill-count">{{ qty.nr?.toLocaleString() }}</span>
						<strong class="qty-pill-price">{{ formatPrice(qty.price ?? 0) }}</strong>
					</button>
					<button
						v-if="!is_custom_qty"
						type="button"
						class="option-pill option-pill-wide"
						@click="showCustomQty"
					>
						{{ t('product.options.customQuantity') }}
					</button>
					<div
						v-else
						class="option-pill option-pill-wide custom-size-pill"
						:class="{ 'is-active': true, 'is-input-focused': is_custom_qty_focus }"
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

		<!-- Price Summary -->
		<section class="price-summary">
			<div class="price-summary-top">
				<ul class="price-benefits">
					<li>{{ t('product.price.benefitShipping') }}</li>
					<li>{{ ships_tomorrow_benefit }}</li>
				</ul>

				<div v-if="is_loading_features" class="price-summary-stack">
					<div class="price-summary-row price-summary-row--skeleton">
						<UiSkeleton width="80px" height="14px" class="price-summary-skeleton-discount" />
					</div>
					<div class="price-summary-row price-summary-row--skeleton price-summary-row--total">
						<UiSkeleton width="120px" height="32px" class="price-summary-skeleton-total" />
					</div>
					<div class="price-summary-unit price-summary-unit--skeleton">
						<UiSkeleton width="100px" height="12px" class="price-summary-skeleton-unit" />
					</div>
				</div>
				<div v-else class="price-summary-stack">
					<p v-if="pricing_ready" class="price-summary-row discount">
						<strong class="price-discount-rate">-{{ Math.round(discount_rate * 100)}}%</strong>
						<span class="price-summary-strike">{{ formatPrice(subtotal) }}</span>
					</p>
					<p class="price-summary-row total">
						<strong class="price-summary-value">{{ pricing_ready ? formatPrice(total) : '--' }}</strong>
					</p>
					<p class="price-summary-unit">
						({{ pricing_ready ? formatPrice(unit_price * (1 - discount_rate)) : '--' }} {{ t('product.price.perPiece') }})
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
				:disabled="selection_navigation_in_flight || has_pending_custom_selection"
				@click="nextStep"
			>
				{{ t('product.price.nextStep') }}
			</UiButton>
		</section>
	</aside>
</template>

<style scoped lang="scss">
.product-options {
	--option-control-height: 38px;
	background: transparent;
	border: 0;
	border-radius: 0;
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 2px 0 0;

	.option-title {
		color: var(--text-primary);
		font-size: var(--type-size-200);
		line-height: var(--type-line-200);
	}

	.product-section {
		display: flex;
		flex-direction: column;
		gap: 8px;

		.option-head {
			align-items: center;
			display: flex;
			gap: 8px;
			justify-content: space-between;

			.option-head-unit {
				color: var(--text-secondary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
			}
		}
	}

	.color-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.color-swatch {
		background: transparent;
		border: 0;
		border-radius: 999px;
		cursor: pointer;
		display: grid;
		height: 40px;
		padding: 0;
		place-items: center;
		position: relative;
		transition: transform 0.18s ease, box-shadow 0.18s ease;
		width: 40px;

		&:hover {
			transform: translateY(-1px);

			.color-swatch-tooltip {
				opacity: 1;
				transform: translate(-50%, 0);
			}
		}

		&.is-active {
			background: var(--gold-10, #fdf9db);
			box-shadow: inset 0 0 0 1px var(--Gold-Base-Color, #f5df4d);
			border-radius: 16px;
		}
	}

	.color-swatch-core {
		border-radius: 12px;
		display: grid;
		height: 28px;
		overflow: hidden;
		place-items: center;
		width: 28px;
	}

	.color-swatch-tooltip {
		background: #342b37;
		border-radius: 18px;
		bottom: calc(100% + 12px);
		color: var(--white-base);
		font-size: var(--type-size-150);
		font-weight: var(--font-weight-semibold);
		left: 50%;
		line-height: 1;
		min-width: 72px;
		opacity: 0;
		padding: 8px 14px;
		pointer-events: none;
		position: absolute;
		transform: translate(-50%, 6px);
		transition: opacity 0.18s ease, transform 0.18s ease;
		white-space: nowrap;
		z-index: 10;

		&:after {
			background: #342b37;
			clip-path: polygon(50% 100%, 0 0, 100% 0);
			content: "";
			height: 10px;
			left: 50%;
			position: absolute;
			top: calc(100% - 1px);
			transform: translate(-50%);
			width: 14px;
		}
	}

	.option-grid {
		display: grid;
		gap: 8px;
		grid-template-columns: 1fr 1fr;

		&:not(.option-grid-size) {
			.qty-pill-count {
				font-weight: var(--font-weight-semibold);
			}
		}

		.option-pill {
			align-items: center;
			border: 0;
			border-radius: 999px;
			box-shadow: inset 0 0 0 1px var(--border-default);
			color: var(--text-primary);
			cursor: pointer;
			display: flex;
			font-size: var(--type-size-100);
			gap: 8px;
			justify-content: center;
			line-height: var(--type-line-100);
			min-height: var(--option-control-height);
			padding: 0 20px;
			transition: all 0.2s ease;

			&.is-active {
				background: var(--gold-10);
				box-shadow: inset 0 0 0 1px var(--gold-base);
			}

			.qty-pill-price {
				color: var(--text-secondary);
				font-size: inherit;
				font-weight: var(--font-weight-regular);
				line-height: inherit;
			}
		}

		.option-pill-wide {
			font-weight: var(--font-weight-medium);
			grid-column: 1/-1;
		}

		.grid-column-full {
			grid-column: 1/-1;
		}

		.custom-size-pill {
			gap: 24px;
			justify-content: center;

			&.is-active {
				box-shadow: inset 0 0 0 1px var(--gold-base);
			}

			&.is-input-focused {
				background: var(--white-base);
				box-shadow: inset 0 0 0 1px var(--gold-base);
			}
		}

		.custom-size-input,
		.custom-qty-input {
			background: transparent;
			border: none;
			font-size: var(--type-size-100);
			font-weight: var(--font-weight-regular);
			line-height: var(--type-line-100);
			max-width: 42px;
			outline: none;
			text-align: center;
			width: 100%;
			-moz-appearance: textfield;

			&::placeholder {
				color: var(--gray-60);
				opacity: 1;
			}

			&.custom-quantity-input,
			&.custom-qty-input {
				max-width: 84px;
			}

			&::-webkit-outer-spin-button,
			&::-webkit-inner-spin-button {
				-webkit-appearance: none;
				margin: 0;
			}
		}

		.size-separator {
			color: var(--text-primary);
			font-weight: var(--font-weight-medium);
		}
	}

	.vinyl-quantity-grid {
		grid-template-columns: 1fr 1fr;
	}

	:deep(.vinyl-font-trigger) {
		border: 1px solid var(--border-default);
		border-radius: 999px;
		box-sizing: border-box;
		color: var(--text-primary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		min-height: var(--option-control-height);
		padding: 0 16px 0 20px;
	}

	.font-select-trigger {
		border-radius: 32px !important;
	}

	:deep(.font-select-trigger) {
		.ui-select-value {
			color: var(--text-primary);
			font-size: var(--type-size-100);
			font-weight: var(--font-weight-bold);
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

	.price-summary {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-top: 16px;

		.price-summary-top {
			align-items: center;
			display: flex;
			gap: 16px;
			justify-content: space-between;
		}

		.price-benefits {
			color: var(--text-secondary);
			display: grid;
			font-size: 12px;
			gap: 4px;
			line-height: 20px;
			list-style: disc;
			max-width: 174.5px;
			padding-left: 16px;
		}

		.price-summary-stack {
			text-align: right;
			min-height: 70px;
			display: flex;
			flex-direction: column;
			align-items: flex-end;

			.price-summary-row {
				align-items: baseline;
				display: flex;
				justify-content: flex-end;

				&.discount {
					color: var(--error);
					gap: 10px;
				}

				&.total {
					color: var(--text-primary);

					.price-summary-value {
						font-size: var(--type-size-450);
						font-weight: var(--font-weight-bold);
						line-height: var(--type-line-450);
					}
				}

				&.price-summary-row--skeleton {
					width: 100%;
					min-height: 18px;
				}

				&.price-summary-row--total {
					min-height: 36px;
				}
			}

			.price-summary-strike {
				color: var(--text-muted);
				text-decoration: line-through;
			}

			.price-summary-unit {
				color: var(--text-secondary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);

				&.price-summary-unit--skeleton {
					min-height: 14px;
					width: 100%;
					display: flex;
					justify-content: flex-end;
				}
			}

			.price-summary-skeleton-discount,
			.price-summary-skeleton-total,
			.price-summary-skeleton-unit {
				margin-left: auto;
			}
		}

		.next-step-btn {
			border-radius: 999px;
			box-shadow: none;
			font-size: var(--type-size-200);
			font-weight: var(--font-weight-bold);
			line-height: var(--type-line-200);
			width: 100%;
			--btn-bg: var(--gold-base);
			--btn-fg: var(--text-primary);
			--btn-border: transparent;
		}
	}
}

@media (max-width: 760px) {
	.product-options .option-pill {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		min-height: 40px;
		padding: 6px 10px;
	}
	.price-summary {
		.price-summary-top {
			flex-direction: column;
		}
		.price-summary-stack {
			text-align: left;
			width: 100%;
			.price-summary-row {
				justify-content: flex-start;
			}
		}
		.next-step-btn {
			font-size: var(--type-size-500);
			line-height: var(--type-line-500);
		}
	}
}
</style>