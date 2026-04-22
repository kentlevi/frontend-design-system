import { defineStore } from 'pinia'
import type { SizeSpec, QuantitySpec, AttributeSelection, ColorSpec, FontSpec } from '../../types/products/attributes'
import type VinylLetteringDesigner from '~/components/products/product-category/VinylLetteringDesigner.vue'

export const useSelectionStore = defineStore('attr-selection', () => {

	const selections = ref<Record<string, AttributeSelection>>({})

	const url_slug = ref<string>()

	const product_config_mapping_id = ref<number>()

	const product_variant_id = ref<number>()

	const size = ref<SizeSpec>()

	const quantity = ref<QuantitySpec>()

	const color = ref<ColorSpec | null>(null)

	const font = ref<FontSpec | null>(null)

	const lettering_text = ref<string>('')

	const lettering_flag = ref<string>('')

	const lettering_file = ref<File>()

	const shipping_fee = ref<number>(0)

	const discount_perce = ref<number>(0)

	const discounted_price = ref<number>(0)

	const price = ref<number>(0)

	const unit_price = ref<number>(0)

	const lettering_preview_ready = ref<boolean>(false)

	const navigation_flight = ref<boolean>(false)

	const product_navigation_in_flight = ref<boolean>(false)

	const is_loading_features = ref<boolean>(false)

	const is_pricing_ready = ref<boolean>(false)

	const lettering_editor_ref = ref<InstanceType<typeof VinylLetteringDesigner> | null>(null)

	const instruction = ref<string>('')

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
		if( !url_slug.value || !size.value || !quantity.value )
			return

		const selected_color = color && color?.value ? color.value : null

		const selected_lettering_text = lettering_text && lettering_text?.value ? lettering_text.value : null

		const selected_lettering_file = lettering_file && lettering_file?.value ? lettering_file.value : null

		const selected_font = font && font?.value ? font.value : null

		selections.value[url_slug.value] = {
			size			: size.value,
			quantity		: quantity.value,
			color			: selected_color,
			font			: selected_font,
			lettering_text	: selected_lettering_text,
			lettering_file 	: selected_lettering_file,
		}
	}

	/** ✅ Updating the state of size */
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

	const updateColor = (selected_color: ColorSpec | null, default_value?: boolean) => {
		color.value = selected_color

		if(!default_value)
			saveSelection()
	}

	const updateFont = (selected_font: FontSpec | null, default_value?: boolean) => {
		font.value = selected_font

		if(!default_value)
			saveSelection()
	}

	/**
	 * ✅ Update the state of lettering text
	 */
	const updateLetteringText = (txt: string, default_value: boolean = false) => {
		lettering_text.value = txt

		lettering_flag.value = default_value ? 'default' : 'edited'

		if(!default_value)
			saveSelection()
	}

	const updateLetteringFile = (f : File) => {
		lettering_file.value = f

		saveSelection()
	}

	const clearLetteringState = () => {
		lettering_text.value = ''
		lettering_file.value = undefined
	}

	const clearSelection = () => {
		url_slug.value = undefined
		size.value = undefined
		quantity.value = undefined
		color.value = null
		font.value = null
		lettering_text.value = ''
		lettering_file.value = undefined
	}


	const updateLetteringPreviewFlag= (v : boolean ) => {
		lettering_preview_ready.value = v
	}

	const updateNavigationFlight = (v : boolean) => {
		navigation_flight.value = v
	}

	const updateVariantID = (variant_id : number) => {
		product_variant_id.value = variant_id
	}

	const updateLoadingFeaturesFlag = (v : boolean) => {
		is_loading_features.value = v
	}

	const updatePricingFlag = (v : boolean) => {
		is_pricing_ready.value = v
	}

	const updateProductSelectionFlight = (v : boolean) => {
		product_navigation_in_flight.value = v
	}

	const reset = () => {
		url_slug.value = ''
		product_variant_id.value = 0
		color.value = null
		font.value = null
		lettering_text.value = ''
	}

	const updateLetteringEditorRef = (instance: InstanceType<typeof VinylLetteringDesigner> | null) => {
		console.log(instance)
		lettering_editor_ref.value = instance;
	}

	return {
		product_config_mapping_id,
		product_variant_id,
		url_slug,
		size,
		quantity,
		color,
		font,
		lettering_text,
		lettering_file,
		selections,
		shipping_fee,
		discount_perce,
		discounted_price,
		price,
		unit_price,
		lettering_preview_ready,
		navigation_flight,
		product_navigation_in_flight,
		is_loading_features,
		is_pricing_ready,
		lettering_flag,
		lettering_editor_ref,
		instruction,
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
		updateLetteringFile,
		clearLetteringState,
		updateLetteringPreviewFlag,
		updateNavigationFlight,
		updateVariantID,
		updateLoadingFeaturesFlag,
		updatePricingFlag,
		reset,
		updateProductSelectionFlight,
		updateLetteringEditorRef,
	}
})