import { useQuoteApiService } from "~/services/quote/api.service"
import { useColorService } from "~/services/quote/color.service"
import { useFontService } from "~/services/quote/font.service"
import { useLetteringService } from "~/services/quote/lettering.service"
import { useQuantityService } from "~/services/quote/quantity.service"
import { useQuoteService } from "~/services/quote/quote.service"
import { useSizeService } from "~/services/quote/size.service"
import type { AttributeSelection, ColorSpec, PricingParameters, QuantitySpec, SizeSpec } from "~/types/products/attributes"

export const useQuoteSection = () => {

	const quote_service = useQuoteService('quote-section')

	const quote_api_service = useQuoteApiService()

	const lettering_service = useLetteringService('quote-section')

	const size_service = useSizeService('quote-section')

	const font_service = useFontService('quote-section')

	const color_service = useColorService('quote-section')

	const quantity_service = useQuantityService('quote-section')

	const current_url_slug = ref<string|null>(null)

	const is_custom_size = ref<boolean>(!!quote_service.size.value?.custom)

	const is_custom_qty = ref<boolean>(!!quote_service.quantity.value?.custom)

	const custom_qty_input = ref<HTMLInputElement | null>(null)

	const custom_width_input = ref<HTMLInputElement | null>(null)

	const is_vinylsize_focused = ref<boolean>(false)

	const custom_size = ref<SizeSpec>(lettering_service.default_size_spec.value)

	const lettering_size = ref<SizeSpec>({
		width: 208,
		height: 33,
		custom: false,
		label: 'test',
		src: 'test',
	})

	const custom_quantity = ref<QuantitySpec>({
		custom: true,
		nr: null,
		price: null,
	})


	const prepareComponent = async (url_slug : string) => {
		// Request data from API and assign to attributes state handler
		await initializeFeaturedData(url_slug)

		// Used the fetched data from API to be initialized in all fields
		await provisionResource()
	}

	// Initialize locally
	const initializeFeaturedData = async (url_slug : string) => {

		console.warn('✅ Initializing Featured Data:')

		current_url_slug.value = url_slug

		quote_service.isLoadingFeatures(true)
		quote_service.updateNavigationFlight(true)
		quote_service.isPricingReady(false)
		try {
			// Request data from API
			const requested_featured_data = await quote_api_service.getFeaturedData(url_slug)
			if( !requested_featured_data ) {
				quote_service.isLoadingFeatures(false)
				return
			}
			// Assign to attributes state handler
			await quote_service.assignFeaturedData(requested_featured_data)

		} catch(error) {
			console.error('Featured Data request failed!', error)
			throw error
		} finally {
			quote_service.isLoadingFeatures(false)
			quote_service.updateNavigationFlight(false)
			quote_service.isPricingReady(true)
		}

		return true

	}

	// Distribute resources
	const provisionResource = async () => {
		console.warn('✅ Provision Resource:')

		if( !current_url_slug.value )
			return

		// Existing attributes that was selected in previous products
		const existing_attr = quote_service.recent_selection.value
		console.log('Existing-attr:', existing_attr)

		if( current_url_slug.value) {

			if( existing_attr )
				prepareUsingExistingAttr(existing_attr)
			else
				prepareDefaultAttr()
		}
	}

	// Preparing the default data of each attribute
	const prepareDefaultAttr = async () => {
		if( !current_url_slug.value )
			return

		if( quote_service.has_color_selection.value && color_service.collection.value.length && color_service.collection.value[0])
			color_service.applyDefault(color_service.collection.value[0])

		if( quote_service.has_font_selection.value && font_service.collection.value.length && font_service.collection.value[0])
			font_service.applyDefault(font_service.collection.value[0])


		/** Lettering default size */
		if( quote_service.has_lettering_editor.value )
			size_service.applyDefault(lettering_service.default_size_spec.value)
		/** Product default size */
		else if( size_service.collection?.value?.length && size_service.collection.value[0])
			size_service.applyDefault(size_service.collection.value[0])


		const prices = await quote_api_service.getFeaturedPricing(current_url_slug.value, {
			width: size_service.src.value?.width,
			height: size_service.src.value?.height,
			color_id: color_service.src.value?.id,
			font_id: font_service.src.value?.id,
		} as PricingParameters)

		if( !prices ) {
			console.warn('Unable to retrieve prices.')
			return
		}

		quote_service.bindPrices(prices)
	}

	// Prepare using the exisintg selection of attributes
	const prepareUsingExistingAttr = (existing_attr : AttributeSelection) => {
		const using_lettering_editor = quote_service.has_lettering_editor.value;
		// If current product is using a lettering editor
		if( using_lettering_editor ) {
			if( existing_attr.lettering_text )
				lettering_service.applyDefault(existing_attr.lettering_text)

			if( existing_attr.size.width && existing_attr.size.height )
				custom_size.value = existing_attr.size
			else
				custom_size.value = lettering_service.default_size_spec.value

			size_service.applyDefault({ ...custom_size.value, src: 'quote-section-default' })
		} else {
			size_service.applyDefault({ ...existing_attr.size, src: 'quote-section-existing-attr'})
		}

		font_service.applyDefault(existing_attr.font ?? null)
		color_service.applyDefault(existing_attr.color ?? null)
	}

	/** ✅ Color on click and change */
	const updateColor = (color : ColorSpec) => {
		color_service.update(color)
	}

	/** ✅ Custom size on-change */
	const updateCustomSize = (field_src: string) => {
		size_service.update({ ...custom_size.value, src: field_src})
	}


	// ⚠️ Watching the changes of size from other component
	watch(() => size_service.src, (new_size) => {
		// Only if the lettering editor is active
		// The changes of text in Vinyl Lettering editor will trigger this
		if( quote_service.has_lettering_editor.value && new_size && new_size.value ) {
			if(new_size.value.src && new_size.value.src == 'lettering-text' ) {
				custom_size.value.width 	= new_size.value.width
				custom_size.value.height	= new_size.value.height
			}
		}
	}, {
		immediate: true,
		deep: true
	})

	const hideCustomSize = () => {
		is_custom_size.value = false
	}


	return {
		// 🔥 Services States
		sizes: size_service.collection,
		colors: color_service.collection,
		fonts: font_service.collection,
		quantities: quantity_service.collection,
		has_lettering_editor: quote_service.has_lettering_editor,
		has_color_selection: quote_service.has_color_selection,
		has_font_selection: quote_service.has_font_selection,
		is_loading_features: quote_service.is_loading_features,
		is_pricing_ready: quote_service.is_pricing_ready,
		size : size_service.src,
		lettering: lettering_service.text,
		font: font_service.src,
		color: color_service.src,
		lettering_preview_ready: quote_service.lettering_preview_ready,
		navigation_flight : quote_service.navigation_flight,

		// 🔥 Local States
		current_url_slug,
		is_custom_size,
		custom_size,
		is_custom_qty,
		custom_quantity,
		custom_qty_input,
		custom_width_input,
		is_vinylsize_focused,
		lettering_size,

		// 🔥 Methods
		prepareComponent,
		updateColor,
		updateCustomSize,
		hideCustomSize,
	}
}