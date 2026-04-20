import { debounce } from "lodash-es"
import { useQuoteApiService } from "~/services/quote/api.service"
import { useColorService } from "~/services/quote/color.service"
import { useFontService } from "~/services/quote/font.service"
import { useLetteringService } from "~/services/quote/lettering.service"
import { useQuantityService } from "~/services/quote/quantity.service"
import { useQuoteService } from "~/services/quote/quote.service"
import { useSizeService } from "~/services/quote/size.service"
import type { AttributeSelection, ColorSpec, FontSpec, PricingParameters, QuantitySpec, SizeSpec } from "~/types/products/attributes"
import { useCountry } from "../app/country/useCountry"
import { formatCurrencyByCountry } from '~/utils/currency';
import { usePricingService } from "~/services/quote/pricing.service"

export const useQuoteSection = () => {

	const { country } = useCountry()

	const quote_service = useQuoteService('quote-section')

	const quote_api_service = useQuoteApiService()

	const lettering_service = useLetteringService('quote-section')

	const size_service = useSizeService('quote-section')

	const font_service = useFontService('quote-section')

	const color_service = useColorService('quote-section')

	const quantity_service = useQuantityService('quote-section')

	const pricing_service = usePricingService('quote-section')

	const current_url_slug = ref<string|null>(null)

	const is_custom_size = ref<boolean>(!!quote_service.size.value?.custom)

	const is_custom_qty = ref<boolean>(!!quote_service.quantity.value?.custom)

	const custom_qty_input = ref<HTMLInputElement | null>(null)

	const is_custom_qty_focus = ref(false)

	const is_custom_size_focus = ref(false)

	const custom_width_input = ref<HTMLInputElement | null>(null)

	const custom_size = ref<SizeSpec>(lettering_service.default_size_spec.value)

	const custom_quantity = ref<QuantitySpec>({
		custom: true,
		nr: null,
		price: null,
	})

	const pricing_ready = computed(() => quantity_service.src.value?.price )

	const selection_navigation_in_flight = ref<boolean>(false)


	/**
	 * Initialized a raw string variable due to component structure
	 * UiSelect only append a single variable or index inside
	 * That is why watching the changes of its value require to update in service state
	 */
	const selected_font = ref<string>("Antique Olive");

	/** Starting point in every product selection */
	const prepareComponent = async (url_slug : string) => {
		// Request data from API and assign to attributes state handler
		selection_navigation_in_flight.value = true
		resetAllField()
		await initializeFeaturedData(url_slug)

		// Used the fetched data from API to be initialized in all fields
		await provisionResource()
		selection_navigation_in_flight.value = false
	}

	/** Initialize locally */
	const initializeFeaturedData = async (url_slug : string) => {
		current_url_slug.value = url_slug

		quote_service.isLoadingFeatures(true)
		quote_service.updateNavigationFlight(true)
		pricing_service.isPricingReady(false)

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
			pricing_service.isPricingReady(true)
		}

		return true

	}

	/** Distribute resources */
	const provisionResource = async () => {
		if( !current_url_slug.value )
			return

		// Existing attributes that was selected in previous products
		const existing_attr = quote_service.recent_selection.value

		if( current_url_slug.value) {
			if( existing_attr )
				await prepareUsingExistingAttr(existing_attr)
			else
				await prepareDefaultAttr()

		}
	}

	const updatePrices = debounce( async(update_from : string) => {
		console.warn(`Updating prices - [${update_from}]!!!`)
		await initializePriceList()

		const first_def = quantity_service.collection
			&& quantity_service.collection.value
			&& quantity_service.collection.value.length
			? quantity_service.collection.value[0]
			: null

		if(!quantity_service.src.value && first_def) {
			quantity_service.update(first_def)
		}

		if( quantity_service.src.value )
			pricing_service.define(quantity_service.src.value)
	}, 250)

	const initializePriceList = async () => {
		if( !current_url_slug.value )
			return

		const data = await quote_api_service.getFeaturedPricing(current_url_slug.value, {
			width	: size_service.src.value?.width,
			height	: size_service.src.value?.height,
			color_id: quote_service.has_color_selection.value ? color_service.src.value?.id : null,
			font_id	: quote_service.has_font_selection.value ? font_service.src.value?.id : null,
		} as PricingParameters)

		if( !data ) {
			console.warn('Unable to retrieve prices.')
			return
		}

		/** Bind prices */
		await pricing_service.bindPrices(data)

		if( !data.prices.length )
			return

		const matched_quantity = data.prices.find(e => e.nr == quantity_service.src.value?.nr )
		if( matched_quantity )
			quantity_service.update(matched_quantity)
		else
			quantity_service.update(data.prices[0] as QuantitySpec)
	}


	// Preparing the default data of each attribute
	const prepareDefaultAttr = async () => {
		if( !current_url_slug.value )
			return

		if( quote_service.has_color_selection.value && color_service.collection.value.length && color_service.collection.value[0])
			color_service.assignDefault(color_service.collection.value[0])

		if( quote_service.has_font_selection.value && font_service.collection.value.length && font_service.collection.value[0]) {
			const matched_font = font_service.collection.value[0]
			font_service.assignDefault(matched_font)
			selected_font.value = matched_font.value
		}


		/** Lettering default size */
		if( quote_service.has_lettering_editor.value )
			size_service.assignDefault(lettering_service.default_size_spec.value)
		/** Product default size */
		else if( size_service.collection?.value?.length && size_service.collection.value[0])
			size_service.assignDefault(size_service.collection.value[0])

	}

	// Prepare using the exisintg selection of attributes
	const prepareUsingExistingAttr = async (existing_attr : AttributeSelection) => {
		const using_lettering_editor = quote_service.has_lettering_editor.value;
		// If current product is using a lettering editor
		if( using_lettering_editor ) {
			if( existing_attr.lettering_text )
				lettering_service.assignDefault(existing_attr.lettering_text)

			if( existing_attr.size.width && existing_attr.size.height )
				custom_size.value = existing_attr.size
			else
				custom_size.value = lettering_service.default_size_spec.value

			size_service.assignDefault({ ...custom_size.value, src: 'quote-section-default' })
		} else {
			size_service.assignDefault({ ...existing_attr.size, src: 'quote-section-existing-attr'})

			if( existing_attr.size.custom ) {
				custom_size.value = existing_attr.size
				setCustomSizeVisible()
			}
		}

		font_service.assignDefault(existing_attr.font ?? null)
		if ( existing_attr.font )
			selected_font.value = existing_attr.font.value

		color_service.assignDefault(existing_attr.color ?? null)
		quantity_service.assignDefault(existing_attr.quantity ?? null)

		if( existing_attr.quantity ) {

			if( quantity_service.collection.value )
				pricing_service.defineLimits(quantity_service.collection.value)

			pricing_service.define(existing_attr.quantity)
		}
	}

	/** ✅ Color on click and change */
	const updateColor = (color : ColorSpec) => {
		color_service.update(color)
		updatePrices('color')
	}

	/** ✅ Font on click and change */
	const updateFont = (font : FontSpec) => {
		font_service.update(font)
	}

	/** ✅ Custom size on-change */
	const updateCustomSize = (field_src: string) => {
		if( field_src == 'lettering-size-field' ) {
			custom_size.value.custom = true
			custom_size.value.label = 'Vinyl-Lettering'
		} else {
			custom_size.value.custom = true
			custom_size.value.label = 'Custom-Size'
		}

		size_service.update({ ...custom_size.value, src: field_src})
	}


	const hideCustomSize = () => {
		is_custom_size.value = false
	}

	const toggleCustomQuantityField = () => {
		is_custom_qty.value = !is_custom_qty.value
	}

	const formatPrice = (value : number) => {
		return formatCurrencyByCountry(value, country.value)
	}

	const is_vinylsize_focused = ref(false)
	const is_font_focused = ref(false)

	const onVinylSizeFocus = () => { is_vinylsize_focused.value = true }
	const onVinylSizeBlur = () => { is_vinylsize_focused.value = false }

	const onVinylFontFocus = () => { is_font_focused.value = true }
	const onVinylFontBlur = () => { is_font_focused.value = false }

	const onCustomQtyFocus = () => {
		is_custom_qty_focus.value = true
	}

	const onCustomQtyBlur = () => {
		is_custom_qty_focus.value = false
	}

	const onCustomSizeFocus = () => {
		is_custom_size_focus.value = true
	}

	const hideCustomQty = async () => {
		is_custom_qty.value = false
	}

	const onCustomSizeBlur = () => {
		is_custom_size_focus.value = false
	}

	const updateCustomQuantity = async (event: Event) => {
		const input = event.target as HTMLInputElement

		const filtered_char = input.value.replace(/[^0-9]/g, '')

		if( filtered_char === '' ) {
			custom_quantity.value.nr = null

			quantity_service.update(custom_quantity.value)
			return
		}

		// remove commas
		const raw = filtered_char.replace(/,/g, '')
		const n = Number(raw)

		if (n && !isNaN(n)) {
			custom_quantity.value.nr = n

			quantity_service.update(custom_quantity.value)
			// Calculate the price
			recalculateTotalPrice()
		}
	}

	const recalculateTotalPrice = () => {
		console.warn('Recalculation')
		const n = custom_quantity.value.nr
		if( !n )
			return

		// Calculate the price
		const quantities = quantity_service.collection.value ?? []

		const matched = quantities.find(e => e.nr == n)

		if( matched ) {
			custom_quantity.value.price = matched.price
		} else {
			const price_computation = pricing_service.getCustomPrice(n, quantities)

			if( price_computation && price_computation.price)
				custom_quantity.value.price = price_computation.price
		}

		pricing_service.define(custom_quantity.value)
		quantity_service.update(custom_quantity.value)
		// pricing_service.
	}

	const formatted_custom_qty = computed(() => {
		if (!custom_quantity.value.nr)
			return ''

		return custom_quantity.value.nr.toLocaleString()
	})

	const updateSelectedQuantity = async (sqty: QuantitySpec) => {
		hideCustomQty()

		pricing_service.define(sqty)
		await quantity_service.update(sqty)
	}

	const updateSize = async (ssize: SizeSpec) => {
		hideCustomSize()
		await size_service.update(ssize)
	}

	const resetCustomSize = () => {
		custom_size.value.width = null
		custom_size.value.height = null
	}

	const showCustomSize = async () => {
		resetCustomSize()
		await setCustomSizeVisible()
	}

	const setCustomSizeVisible = async () => {
		is_custom_size.value = true

		await nextTick()

		custom_width_input.value?.focus()
		custom_width_input.value?.select()
	}

	const focusWidthInput = () => {
		custom_width_input.value?.focus()
		custom_width_input.value?.select()
	}

	const resetAllField = () => {
		is_custom_size.value = false
		is_custom_qty.value = false
		is_custom_qty_focus.value = false
		is_custom_size_focus.value = false
		resetCustomSize()
		quote_service.resetAllSelection()
	}

	


	// ⚠️ Watching the changes of size
	watch(() => size_service.src, (new_size) => {
		if( !new_size || !new_size?.value )
			return

		const source = new_size.value?.src

		/**
		 * Only if the lettering editor is active from other component
		 * The changes of text in Vinyl Lettering editor will trigger this
		 */
		if( quote_service.has_lettering_editor.value && new_size && new_size.value ) {
			if(source && source == 'lettering-editor' ) {
				custom_size.value.width 	= new_size.value.width
				custom_size.value.height	= new_size.value.height
			}
		}

		updatePrices('size')
	}, {
		immediate: true,
		deep: true
	})


	watch(() => selected_font.value, (new_font) => {
		const collection = font_service.collection.value
		const matched = collection.find(f => f.value == new_font)

		if( matched ) {
			font_service.update(matched)
			updatePrices('font')
		}
	})


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
		quantity: quantity_service.src,
		lettering_preview_ready: quote_service.lettering_preview_ready,
		navigation_flight : quote_service.navigation_flight,
		total_price : pricing_service.total,
		discount_rate: pricing_service.discount_rate,
		sub_total: pricing_service.sub_total,
		unit_price: pricing_service.unit_price,

		// 🔥 Local States
		current_url_slug,
		is_custom_size,
		custom_size,
		is_custom_qty,
		custom_quantity,
		custom_qty_input,
		custom_width_input,
		is_vinylsize_focused,
		is_font_focused,
		selected_font,
		is_custom_qty_focus,
		is_custom_size_focus,
		formatted_custom_qty,
		pricing_ready,
		selection_navigation_in_flight,

		// 🔥 Methods
		prepareComponent,
		updateColor,
		updateCustomSize,
		hideCustomSize,
		toggleCustomQuantityField,
		formatPrice,
		updateFont,
		onVinylSizeFocus,
		onVinylSizeBlur,
		onVinylFontFocus,
		onVinylFontBlur,
		updateCustomQuantity,
		onCustomQtyFocus,
		onCustomQtyBlur,
		onCustomSizeFocus,
		onCustomSizeBlur,
		updateSelectedQuantity,
		hideCustomQty,
		updateSize,
		showCustomSize,
		focusWidthInput,
		resetAllField,
	}
}