<script setup lang="ts">
import type { ProductItem } from '~/types/products/catalog';
import type { SizeOptionKey } from '~/types/products/categoryExperience';
import { useFileBaseUrl } from '~/composables/core/fileBaseUrl/useFileBaseUrl';
import VinylLetteringDesigner from '~/components/products/product-category/VinylLetteringDesigner.vue';

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

type SelectOption = {
	label: string;
	value: string | number;
	style?: Record<string, any>;
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
const specialColorProductIds = ['transfer-sticker', 'vinyl-lettering'] as const
const vinylQuantityOptions = [1, 2, 5, 10, 50, 100, 200, 300] as const

const fontNames = [
	'Antique Olive', 'American Typewriter', 'akaDora', 'Arial Black', 'Arial Narrow', 'Arial Rounded', 'Arial',
	'AT Old English', 'Autumn In November', 'Blackstab Full', 'Balloon', 'Balthazar', 'Bank Ghotic',
	'BASIC SQUARE 7', 'Bauhaus', 'BEBAS', 'Bender', 'Bimini', 'Bitter', 'Black Chancery', 'Boyz R Gross',
	'Brush Script', 'Century Gothic', 'Broadway', 'Chunkfive', 'City D Medium', 'Comfortaa', 'Comfortaa Light',
	'Comic Sans', 'Cooper Black', 'Copperplate Gothic', 'Coquette Regular', 'Curlz', 'Delftone Stylus',
	'Digital Sans', 'Edwardian Script', 'Forte', 'Franklin G. Heavy', 'Futura Book BT', 'Gill Sans',
	'Gotham Light', 'Gotham Book', 'Gotham Medium', 'Gotham Black', 'Grave Digger', 'Great Vibes',
	'Hand Of Sean', 'Handel', 'Harry Potter', 'HIGH SCHOOL USA', 'Honey Script', 'Impact', 'Intro Line',
	'Juice', 'KaushanScript', 'Kristen ITC', 'Langdon', 'League Spartan', 'Lobster', 'MagnoliaScript',
	'Mandatory', 'Marker Felt', 'Monotype Corsiva', 'Museo', 'Myriad', 'Nexa Bold', 'Open Sans',
	'Optimus Princeps', 'OLIVER', 'Ottawa', 'Pacifico', 'Ravie', 'Raleway Semibold', 'Script V730',
	'Segoe Print', 'Segoe Script', 'Segoe UI', 'STENCIL STD', 'SueEllenFrancisco', 'Tahoma',
	'Throw My Hands Up', 'THUNDER', 'Time Burner', 'Times New Roman', 'Trajan Pro', 'Vani',
	'Vladimir Script', 'Walt Disney'
]

const vinylFontOptions: SelectOption[] = fontNames.map(font => ({
	label: font,
	value: font,
	style: { fontFamily: font }
}))

const colorOptions = [
	{ key: 'black', label: 'Black', checkColor: '#ffffff', swatchStyle: { background: '#000000' } },
	{ key: 'white', label: 'White', checkColor: '#111827', swatchStyle: { background: '#FFFFFF', border: '1px solid var(--black-base)' } },
	{ key: 'red', label: 'Red', checkColor: '#ffffff', swatchStyle: { background: '#FF0000' } },
	{ key: 'orange', label: 'Orange', checkColor: '#ffffff', swatchStyle: { background: '#FFA500' } },
	{ key: 'yellow', label: 'Yellow', checkColor: '#111827', swatchStyle: { background: '#FFFF00' } },
	{ key: 'green', label: 'Green', checkColor: '#ffffff', swatchStyle: { background: '#008000' } },
	{ key: 'blue', label: 'Blue', checkColor: '#ffffff', swatchStyle: { background: '#0000FF' } },
	{ key: 'purple', label: 'Purple', checkColor: '#ffffff', swatchStyle: { background: '#800080' } },
	{ key: 'pink', label: 'Pink', checkColor: '#111827', swatchStyle: { background: '#FFC0CB' } },
	{ key: 'yellow-orange', label: 'Yellow Orange', checkColor: '#111827', swatchStyle: { background: '#FFB700' } },
	{ key: 'gold', label: 'Gold', checkColor: '#111827', swatchStyle: { background: 'linear-gradient(135deg, #FFD700 0%, #FFF 50%, #FFD700 100%)' } },
	{ key: 'silver', label: 'Silver', checkColor: '#111827', swatchStyle: { background: 'linear-gradient(135deg, #C0C0C0 0%, #FFF 50%, #C0C0C0 100%)' } },
	{ key: 'bronze', label: 'Bronze', checkColor: '#111827', swatchStyle: { background: 'linear-gradient(135deg, #CD7F32 0%, #FFF 49.52%, #CD7F32 100%)' } },
	{ key: 'hologram', label: 'Hologram', checkColor: '#111827', swatchStyle: { background: 'linear-gradient(135deg, #B6EEE8 0%, #F5F3EA 32%, #F1B2B9 50%, #D893C1 60%, #B6EEE8 80%)' } },
	{
		key: 'full-color',
		label: 'Full Color',
		checkColor: '#111827',
		swatchStyle: {
			background: 'conic-gradient(from 0deg, #ff3c3c 0deg, #ff9800 60deg, #ffe600 120deg, #1abf48 180deg, #0085ff 240deg, #7f2cff 300deg, #ff3c3c 360deg)',
		},
	},
] as const

const isCustomSize = ref(false)
const customWidth = ref<number | null>(null)
const customHeight = ref<number | null>(null)
const customWidthInput = ref<HTMLInputElement | null>(null)
const isCustomQty = ref(false)
const customQty = ref<number | null>(null)
const customQtyInput = ref<HTMLInputElement | null>(null)
const isCustomSizeFocused = ref(false)
const isCustomQtyFocused = ref(false)
const selectedColor = ref<(typeof colorOptions)[number]['key']>('black')
const vinylWidth = ref(192)
const vinylHeight = ref(30)
const vinylText = ref('')
const selectedVinylFont = ref<string>('Antique Olive')
const vinylActiveSize = ref<'width' | 'height'>('height')
const isVinylSizeFocused = ref(false)
const isVinylFontFocused = ref(false)

const onVinylSizeFocus = () => { isVinylSizeFocused.value = true }
const onVinylSizeBlur = () => { isVinylSizeFocused.value = false }
const onVinylFontFocus = () => { isVinylFontFocused.value = true }
const onVinylFontBlur = () => { isVinylFontFocused.value = false }


const onCustomSizeFocus = () => {
	isCustomSizeFocused.value = true
}

const onCustomSizeBlur = () => {
	isCustomSizeFocused.value = false
}

const onCustomQtyFocus = () => {
	isCustomQtyFocused.value = true
}

const onCustomQtyBlur = () => {
	isCustomQtyFocused.value = false
}

const preventNonDigitInput = (event: InputEvent) => {
	if (!event.data) return
	if (/^\d+$/.test(event.data)) return
	event.preventDefault()
}

const formattedCustomQty = computed(() => {
	if (customQty.value === null) return ''
	return customQty.value.toLocaleString()
})

const onCustomQtyInput = (e: Event) => {
	const input = e.target as HTMLInputElement
	const raw = input.value.replace(/[^0-9]/g, '')
	if (raw === '') {
		customQty.value = null
		return
	}
	const number = Number(raw)
	if (!isNaN(number)) {
		customQty.value = number
		emit('update:selectedQty', number)
	}
}

const enableCustomQty = async () => {
	isCustomQty.value = true
	customQty.value = null
	emit('update:selectedQty', 0)
	await nextTick()
	customQtyInput.value?.focus()
}

watch(customQty, (val) => {
	if (val && val > 0) {
		emit('update:selectedQty', val)
		return
	}

	emit('update:selectedQty', 0)
})

const onCustomWidthInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	const raw = target.value.replace(/[^0-9]/g, '')
	customWidth.value = raw === '' ? null : Number(raw)
}

const onCustomHeightInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	const raw = target.value.replace(/[^0-9]/g, '')
	customHeight.value = raw === '' ? null : Number(raw)
}

const focusWidthInput = () => {
	customWidthInput.value?.focus()
}

const enableCustomSize = async () => {
	isCustomSize.value = true
	customWidth.value = null
	customHeight.value = null
	emit('update:selectedQty', 0)
	await nextTick()
	customWidthInput.value?.focus()
}

const unitPrice = computed(() =>
	props.selectedQty > 0 ? props.total / props.selectedQty : 0
);

const hasValidCustomSize = computed(() =>
	Boolean(isCustomSize.value && customWidth.value && customWidth.value > 0 && customHeight.value && customHeight.value > 0)
)

const hasValidCustomQty = computed(() =>
	Boolean(isCustomQty.value && customQty.value && customQty.value > 0)
)

const hasValidVinylText = computed(() =>
	!isVinylLettering.value || vinylText.value.trim().length > 0
)

const hasPendingCustomSelection = computed(() =>
	(isCustomSize.value && !hasValidCustomSize.value)
	|| (isCustomQty.value && !hasValidCustomQty.value)
	|| props.selectedQty <= 0
	|| !hasValidVinylText.value
)

const displayedSubtotal = computed(() => (hasPendingCustomSelection.value ? 0 : props.subtotal))
const displayedDiscountRate = computed(() => (hasPendingCustomSelection.value ? 0 : props.discountRate))
const displayedTotal = computed(() => (hasPendingCustomSelection.value ? 0 : props.total))
const displayedUnitPrice = computed(() => (hasPendingCustomSelection.value ? 0 : unitPrice.value))
const showDiscountRow = computed(() => displayedSubtotal.value > 0 && displayedDiscountRate.value > 0)
const isVinylLettering = computed(() => props.selectedProduct?.id === 'vinyl-lettering')
const shouldPlayPreviewVideo = computed(() =>
	Boolean(props.selectedProduct) && !isVinylLettering.value && !props.navigationInFlight
)
const showPreferredColorSection = computed(() =>
	Boolean(props.selectedProduct && specialColorProductIds.includes(props.selectedProduct.id as (typeof specialColorProductIds)[number]))
)
const availableColorOptions = computed(() => {
	if (isVinylLettering.value) {
		return colorOptions.filter((color) => color.key !== 'full-color')
	}

	return colorOptions
})
const displayedProductTitle = computed(() =>
	isVinylLettering.value ? 'Vinyl Lettering Sticker' : props.selectedProduct ? props.getProductName(props.selectedProduct) : ''
)

const onVinylWidthInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	const raw = target.value.replace(/[^0-9]/g, '')
	if (raw === '') return
	const nextWidth = Number(raw)
	if (!Number.isFinite(nextWidth) || nextWidth <= 0) return
	vinylActiveSize.value = 'width'
	vinylWidth.value = nextWidth
}

const onVinylHeightInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	const raw = target.value.replace(/[^0-9]/g, '')
	if (raw === '') return
	const nextHeight = Number(raw)
	if (!Number.isFinite(nextHeight) || nextHeight <= 0) return
	vinylActiveSize.value = 'height'
	vinylHeight.value = nextHeight
}

watch(
	() => props.selectedProduct?.id ?? null,
	(nextProductId) => {
		if (!nextProductId || !specialColorProductIds.includes(nextProductId as (typeof specialColorProductIds)[number])) {
			selectedColor.value = 'black'
		}
		else if (nextProductId === 'vinyl-lettering' && selectedColor.value === 'full-color') {
			selectedColor.value = 'black'
		}

		if (nextProductId === 'vinyl-lettering' && !vinylQuantityOptions.includes(props.selectedQty as (typeof vinylQuantityOptions)[number])) {
			emit('update:selectedQty', vinylQuantityOptions[0])
		}
	},
	{ immediate: true }
)

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

						<div class="product-preview-header">
							<h1 class="product-preview-title" data-testid="product-category-preview-title">
								{{ displayedProductTitle }}
							</h1>

							<p class="product-preview-blurb" data-testid="product-category-preview-blurb">
								{{ props.getProductBlurb(props.selectedProduct) }}
							</p>
						</div>

						<div
							v-if="!isVinylLettering"
							class="product-preview-media"
							data-testid="product-category-preview-media"
						>
							<img
								v-if="!shouldPlayPreviewVideo"
								:src="demoHeroPosterUrl"
								:alt="`${displayedProductTitle || 'Product'} preview poster`"
								class="product-preview-media-image"
							>
							<video
								v-else
								:key="props.selectedId ?? 'preview-video'"
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

						<div
							v-else
							class="vinyl-preview-board"
							data-testid="product-category-vinyl-preview"
						>
							<VinylLetteringDesigner
								:text="vinylText"
								:width="vinylWidth"
								:height="vinylHeight"
								:font="selectedVinylFont"
								:color-key="selectedColor"
								:redirecting="props.navigationInFlight"
								:active-size="vinylActiveSize"
								@update:text="vinylText = $event"
								@update:width="vinylWidth = $event"
								@update:height="vinylHeight = $event"
							/>
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
									loading="lazy"
									class="mini-feature-image"
								>

								<p class="mini-feature-description">
									{{ t(`product.featureCards.${feature.descriptionKey}.description`) }}
								</p>
							</button>
						</div>
					</div>

					<aside class="product-options" data-testid="product-category-options">
						<section v-if="showPreferredColorSection" class="product-section">
							<h3 class="option-title" data-testid="product-category-color-title">Select your preferred color</h3>
							<div class="color-grid" data-testid="product-category-color-options">
								<button
									v-for="color in availableColorOptions"
									:key="color.key"
									type="button"
									class="color-swatch"
									:class="{ 'is-active': selectedColor === color.key }"
									:aria-label="color.label"
									:data-testid="`product-category-color-option-${color.key}`"
									@click="selectedColor = color.key"
								>
									<span class="color-swatch-tooltip">{{ color.label }}</span>
									<span class="color-swatch-core" :style="color.swatchStyle">
										<UiIcon
											v-if="selectedColor === color.key"
											name="regular-check"
											:size="24"
											class="color-swatch-check"
											:color="color.checkColor"
										/>
									</span>
								</button>
							</div>
						</section>

						<section v-if="!isVinylLettering" class="product-section">
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
									:class="{ 'is-active': !isCustomSize && props.selectedSize === size.key }"
									:data-testid="`product-category-size-option-${size.key}`"
									@click="isCustomSize = false; customWidth = null; customHeight = null; emit('update:selectedSize', size.key)"
								>
									<span class="size-pill-name">{{ size.name }}</span>
									<span class="size-pill-dim">{{ size.dim }}</span>
								</button>

								<!-- Custom size button -->
								<button
									v-if="!isCustomSize"
									type="button"
									class="option-pill option-pill-wide"
									data-testid="product-category-size-option-custom-button"
									@click="enableCustomSize"
								>
									{{ t('product.options.customSize') }}
								</button>

								<!-- Width x Height input -->
								<div
									v-else
									class="option-pill option-pill-wide custom-size-pill"
									:class="{
										'is-active': true,
										'is-input-focused': isCustomSizeFocused
									}"
									data-testid="product-category-size-option-custom-input"
									@click.self="focusWidthInput"
								>
									<input
										ref="customWidthInput"
										:value="customWidth ?? ''"
										type="text"
										inputmode="numeric"
										pattern="[0-9]*"
										placeholder="Width"
										class="custom-size-input"
										@beforeinput="preventNonDigitInput"
										@input="onCustomWidthInput"
										@focus="onCustomSizeFocus"
										@blur="onCustomSizeBlur"
									>

									<span class="size-separator">x</span>

									<input
										:value="customHeight ?? ''"
										type="text"
										inputmode="numeric"
										pattern="[0-9]*"
										placeholder="Height"
										class="custom-size-input"
										@beforeinput="preventNonDigitInput"
										@input="onCustomHeightInput"
										@focus="onCustomSizeFocus"
										@blur="onCustomSizeBlur"
									>
								</div>
							</div>
						</section>

						<section v-if="!isVinylLettering" class="product-section">
							<h3 class="option-title" data-testid="product-category-quantity-title">{{ t('product.options.selectQuantity') }}</h3>
							<div class="option-grid" data-testid="product-category-quantity-options">
								<button
									v-for="qty in props.quantityOptions"
									:key="qty"
									type="button"
									class="option-pill"
									:class="{ 'is-active': !isCustomQty && props.selectedQty === qty }"
									:data-testid="`product-category-quantity-option-${qty}`"
									@click="isCustomQty = false; customQty = null; emit('update:selectedQty', qty)"
								>
									<span class="qty-pill-count">{{ qty.toLocaleString() }}</span>
									<strong class="qty-pill-price">{{ props.formatPrice(props.quantityPrice(qty)) }}</strong>
								</button>
								<button
									v-if="!isCustomQty"
									type="button"
									class="option-pill option-pill-wide"
									data-testid="product-category-quantity-option-custom-button"
									@click="enableCustomQty"
								>
									{{ t('product.options.customQuantity') }}
								</button>

								<div
									v-else
									class="option-pill option-pill-wide custom-size-pill"
									:class="{
										'is-active': true,
										'is-input-focused': isCustomQtyFocused
									}"
									data-testid="product-category-quantity-option-custom-input"
								>
									<input
										ref="customQtyInput"
										:value="formattedCustomQty"
										type="text"
										inputmode="numeric"
										pattern="[0-9]*"
										placeholder="Enter Quantity"
										class="custom-size-input custom-quantity-input"
										@beforeinput="preventNonDigitInput"
										@input="onCustomQtyInput"
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
											'is-input-focused': isVinylSizeFocused
										}"
										data-testid="product-category-vinyl-size-input"
									>
										<input
											:value="vinylWidth"
											type="text"
											inputmode="numeric"
											pattern="[0-9]*"
											class="custom-size-input"
											@beforeinput="preventNonDigitInput"
											@input="onVinylWidthInput"
											@focus="onVinylSizeFocus"
											@blur="onVinylSizeBlur"
										>
										<span class="size-separator">x</span>
										<input
											:value="vinylHeight"
											type="text"
											inputmode="numeric"
											pattern="[0-9]*"
											class="custom-size-input"
											@beforeinput="preventNonDigitInput"
											@input="onVinylHeightInput"
											@focus="onVinylSizeFocus"
											@blur="onVinylSizeBlur"
										>
									</div>
								</div>
							</section>

							<section class="product-section">
								<h3 class="option-title">Select your font</h3>
								<div class="option-grid">
									<div class="option-pill-wide">
										<UiSelect
											v-model="selectedVinylFont"
											:options="vinylFontOptions"
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
										v-for="qty in vinylQuantityOptions"
										:key="qty"
										type="button"
										class="option-pill"
										:class="{ 'is-active': !isCustomQty && props.selectedQty === qty }"
										:data-testid="`product-category-quantity-option-${qty}`"
										@click="isCustomQty = false; customQty = null; emit('update:selectedQty', qty)"
									>
										<span class="qty-pill-count">{{ qty.toLocaleString() }}</span>
										<strong class="qty-pill-price">{{ props.formatPrice(props.quantityPrice(qty)) }}</strong>
									</button>
									<button
										v-if="!isCustomQty"
										type="button"
										class="option-pill option-pill-wide"
										data-testid="product-category-quantity-option-custom-button"
										@click="enableCustomQty"
									>
										{{ t('product.options.customQuantity') }}
									</button>

									<div
										v-else
										class="option-pill option-pill-wide custom-size-pill"
										:class="{
											'is-active': true,
											'is-input-focused': isCustomQtyFocused
										}"
										data-testid="product-category-quantity-option-custom-input"
									>
										<input
											ref="customQtyInput"
											:value="formattedCustomQty"
											type="text"
											inputmode="numeric"
											pattern="[0-9]*"
											placeholder="Enter Quantity"
											class="custom-size-input custom-quantity-input"
											@beforeinput="preventNonDigitInput"
											@input="onCustomQtyInput"
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
										v-if="showDiscountRow"
										class="price-summary-row discount"
										data-testid="product-category-price-discount-row"
									>
										<strong class="price-discount-rate">-{{ Math.round(displayedDiscountRate * 100) }}%</strong>
										<span class="price-summary-strike">{{ props.formatPrice(displayedSubtotal) }}</span>
									</p>
									<p class="price-summary-row total" data-testid="product-category-price-total-row">
										<strong class="price-summary-value">{{ props.formatPrice(displayedTotal) }}</strong>
									</p>
									<p class="price-summary-unit">
										({{ props.formatPrice(displayedUnitPrice) }} per piece)
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
								:disabled="props.navigationInFlight || hasPendingCustomSelection"
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
</style>