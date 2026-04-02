import { defineStore } from 'pinia'
import type { ProductSpec, ColorSpec, FontSpec, QuantitySpec, SizeSpec } from '~/types/products/attributes';

export const useAttributesStore = defineStore('attributes', () => {

	const product = ref<ProductSpec>()

	const product_w_color = ref(['transfer', 'vinyl-lettering'])

	const product_w_font = ref(['vinyl-lettering'])

	const active_lettering_editor = ref([ 'vinyl-lettering' ])

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
		updateProduct,
		updateSizes,
		updateQuantites,
		updateColors,
		updateFonts,
	}
})