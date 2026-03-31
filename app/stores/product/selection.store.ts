import { defineStore } from 'pinia'
import type { SizeSpec, QuantitySpec, AttributeSelection, ColorSpec, FontSpec } from '../../types/products/attributes'

export const useSelectionStore = defineStore('attr-selection', () => {


	const selections = ref<Record<string, AttributeSelection>>({})

	const url_slug = ref<string>()

	const product_config_mapping_id = ref<number>()

	const size = ref<SizeSpec>()

	const quantity = ref<QuantitySpec>()

	const color = ref<ColorSpec | null>()

	const font = ref<FontSpec | null>()

	const lettering_text = ref('')

	const shipping_fee = ref<number>(0)

	const discount_perce = ref<number>(0)

	const discounted_price = ref<number>(0)

	const price = ref<number>(0)

	const unit_price = ref<number>(0)

	const updateMappingID = (mapping_id: number) => {
		product_config_mapping_id.value = mapping_id
	}

	const updateProductSlug = (p_slug: string) => {
		url_slug.value = p_slug
	}

	const hasSelection = (slug: string): AttributeSelection | null => {
		return selections.value[slug] ?? null
	}

	const saveSelection = () => {
		if( !url_slug.value || !size.value || !quantity.value)
			return

		const selected_color = color && color?.value ? color.value : null

		const selected_lettering_text = lettering_text && lettering_text?.value ? lettering_text.value : null

		const selected_font = font && font?.value ? font.value : null

		selections.value[url_slug.value] = {
			size			: size.value,
			quantity		: quantity.value,
			color			: selected_color,
			font			: selected_font,
			lettering_text	: selected_lettering_text,
		}
	}

	const updateSize = ( selected_size 	: SizeSpec, default_value?: boolean ) => {
		size.value = selected_size

		if( !default_value ) // only store selection when the use selects everything
			saveSelection()
	}

	const updateQuantity = ( selected_qty: QuantitySpec, default_value?: boolean ) => {
		quantity.value 		= selected_qty

		if( !default_value ) // only store selection when the use selects everything
			saveSelection()
	}

	const calculateUnitPrice = (selected_qty: QuantitySpec) => {
		if( selected_qty
			&& 'nr' in selected_qty
			&& 'price' in selected_qty
			&& selected_qty.nr
			&& selected_qty.price
		)
			return selected_qty.nr > 0 ? selected_qty.price / selected_qty.nr : 0
		else
			return 0
	}

	const updateColor = (selected_color: ColorSpec, default_value?: boolean) => {
		color.value = selected_color

		if(!default_value)
			saveSelection()
	}

	const updateFont = (selected_font: FontSpec, default_value?: boolean) => {
		font.value = selected_font

		if(!default_value)
			saveSelection()
	}

	const updateLetteringText = (txt: string, default_value?: boolean) => {
		lettering_text.value = txt

		if(!default_value)
			saveSelection()
	}

	const clearSelection = () => {
		url_slug.value = undefined
		size.value = undefined
		quantity.value = undefined
		color.value = null
		font.value = null
		lettering_text.value = ''
	}

	return {
		product_config_mapping_id,
		url_slug,
		size,
		quantity,
		color,
		font,
		lettering_text,
		selections,
		shipping_fee,
		discount_perce,
		discounted_price,
		price,
		unit_price,
		updateMappingID,
		updateProductSlug,
		clearSelection,
		hasSelection,
		saveSelection,
		updateSize,
		updateQuantity,
		calculateUnitPrice,
		updateColor,
		updateFont,
		updateLetteringText,
	}
})