import { defineStore } from 'pinia'
import type { ProductSpec, ColorSpec, FontSpec, QuantitySpec, SizeSpec } from '~/types/products/attributes';

export const useAttributesStore = defineStore('attributes', () => {

	const product = ref<ProductSpec>()

	const product_w_color = ref(['transfer-sticker', 'vinyl-lettering'])

	const product_w_font = ref(['vinyl-lettering'])

	const active_lettering_editor = ref([ 'vinyl-lettering' ])

	// Cache for product attributes to enable instant navigation
	const attribute_cache = ref<Record<string, {
		product: ProductSpec,
		sizes: SizeSpec[],
		quantities: QuantitySpec[],
		colors: ColorSpec[],
		fonts: FontSpec[]
	}>>({});

	const sizes = ref<SizeSpec[]>()

	const quantities = ref<QuantitySpec []>()

	const colors = ref<ColorSpec []>()

	const fonts = ref<FontSpec[]>()


	const updateProduct = (prod: ProductSpec) => {
		product.value = prod;
	}

	const updateSizes = (s: SizeSpec[]) => {
		sizes.value = s
	}

	const updateQuantites = (q: QuantitySpec[]) => {
		quantities.value = q
	}

	const updateColors = (c: ColorSpec[]) => {
		colors.value = c
	}

	const updateFonts = (f: FontSpec[]) => {
		fonts.value = f
		saveToCache()
	}

	const saveToCache = () => {
		if (!product.value?.url_slug) return;

		attribute_cache.value[product.value.url_slug] = {
			product: product.value,
			sizes: sizes.value || [],
			quantities: quantities.value || [],
			colors: colors.value || [],
			fonts: fonts.value || []
		};
	}

	const restoreFromCache = (slug: string) => {
		const cached = attribute_cache.value[slug];
		if (!cached) return false;

		product.value = cached.product;
		sizes.value = cached.sizes;
		quantities.value = cached.quantities;
		colors.value = cached.colors;
		fonts.value = cached.fonts;

		return true;
	}


	return {
		product,
		sizes,
		quantities,
		fonts,
		colors,
		product_w_color,
		product_w_font,
		active_lettering_editor,
		attribute_cache,
		updateProduct,
		updateSizes,
		updateQuantites,
		updateColors,
		updateFonts,
		restoreFromCache,
		saveToCache
	}
})