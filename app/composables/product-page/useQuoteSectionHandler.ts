/**
 * ⚠️ This composable will handle the logic and behavior of Quote Section component
 */

import type { SizeSpec, QuantitySpec, ColorSpec, AttributeSelection } from '~/types/products/attributes'

import { useQuoteSectionService } from '~/services/attributes/quote.section'
import { useCountry } from '../app/country/useCountry'

export const useQuoteSectionHandler = () => {

	// 🔥 Quote section service
	const quote_service = useQuoteSectionService()

	const { country } = useCountry();

	const is_custom_qty = ref<boolean>(!!quote_service.quantity.value?.custom)

	const is_custom_size = ref<boolean>(!!quote_service.size.value?.custom)

	const custom_qty_input = ref<HTMLInputElement | null>(null)

	const custom_width_input = ref<HTMLInputElement | null>(null)

	const is_custom_size_focus = ref(false)

	const is_custom_qty_focus = ref(false)

	const lettering_navigation_flight = ref(false)

	const selected_font = ref<string>('')

	/**
	 * Disable form
	 */
	const clearForm = () => {
		quote_service.clearSelection()
	}

	type InitializeFormOptions = {
		interactive?: boolean
	}

	/**
	 * 📌Initiate the value of all fields in form and set the default value and behaviour
	 * @param prod_slug string — Product URL slug
	 */
	const instatiateForm = async (prod_slug: string, { interactive = true }: InitializeFormOptions = {}) => {
		console.warn('🔥 Preparing form...')

		// 📌 Existing attributes
		const existing_attr = quote_service.recentSelection(prod_slug)

		// 🔥 If the current selected product, has already a pre-selected attributes
		if( quote_service.url_slug &&  existing_attr ) {
			await quote_service.updateFeaturedData(prod_slug)

			preparingExistingSelection(existing_attr, { interactive })
		}
		/**
		 * 🔥 The user don't have a pre-selected or changes in default attributes
		 * Or the user never visited this product before
		 */
		else {
			await quote_service.updateFeaturedData(prod_slug)

			prepareAllDefault()
		}
	}

	const prepareAllDefault = async () => {
		prepareDefaultSize()
		hideCustomSize()

		prepareDefaultQty()
		hideCustomQty()

		if( quote_service.has_color_selection.value )
			prepareDefaultColor()

		if( quote_service.has_font_selection.value)
			prepareDefaultFont()
	}

	const preparingExistingSelection = (
		existing_attr : AttributeSelection,
		{ interactive = true }: InitializeFormOptions = {}
	) => {
		/** VINYL LETTERING EDITOR */
		if( quote_service.has_lettering_editor.value ) {
			/** Preparing lettering editor's default value */
			/** Which includes the size and its text value */
			prepareLetteringEditor(existing_attr)
		} else {
			preparingExistingSize(existing_attr, { interactive })
		}

		/** QUANTITY */
		quote_service.defaultQuantity(existing_attr.quantity)
		if( existing_attr.quantity.custom )
			setCustomQtyVisible({ interactive })
		else
			hideCustomQty()

		/** COLOR */
		if( quote_service.has_color_selection.value ) {
			if(
				'color' in existing_attr
				&& existing_attr.color
			) {
				quote_service.defaultColor(existing_attr.color)
			} else {
				prepareDefaultColor()
			}
		}
		/** FONT */
		if( quote_service.has_font_selection.value ) {
			if(
				'font' in existing_attr
				&& existing_attr.font
			) {
				selected_font.value = existing_attr.font.value
				quote_service.defaultFont(existing_attr.font)
			} else {
				prepareDefaultFont()
			}
		}
	}

	const prepareLetteringEditor = (existing_attr : AttributeSelection) => {
		if(  existing_attr.lettering_text) {
			quote_service.defaultLettering(existing_attr.size, existing_attr.lettering_text)
		}
		else {
			quote_service.defaultSize(existing_attr.size)
		}
	}

	const preparingExistingSize = (
		existing_attr: AttributeSelection,
		{ interactive = true }: InitializeFormOptions = {}
	) => {
		/** COMMON SIZE AND QUANTITY FLOW */

		quote_service.defaultSize(existing_attr.size)

		if( existing_attr.size.custom )
			setCustomSizeVisible({ interactive })
		else
			hideCustomSize()
	}

	const prepareDefaultSize = () => {
		if( !quote_service.featured_sizes.value?.length )
			return

		// Get first size as default
		const default_size = quote_service.featured_sizes.value[0]

		if( default_size )
			quote_service.defaultSize(default_size)
	}

	const prepareDefaultQty = () => {
		if( !quote_service.featured_quantities.value )
			return

		// Get first quantity as default
		const default_qty = quote_service.featured_quantities.value[0]

		if( default_qty )
			quote_service.defaultQuantity({
				...default_qty,
				custom: false
			})
	}

	const prepareDefaultColor = () => {
		if( !quote_service.has_color_selection?.value )
			return

		const default_color = quote_service.featured_colors.value[0]

		if( default_color ) {
			quote_service.defaultColor(default_color)
		}
	}

	const prepareDefaultFont = () => {
		if( !quote_service.has_font_selection.value && !quote_service.featured_fonts.value.length )
			return

		const default_font = quote_service.featured_fonts.value[0]
		if( default_font ) {
			selected_font.value = default_font.value
			quote_service.defaultFont(default_font)
		}
	}

	const setCustomSizeVisible = async ({ interactive = true }: InitializeFormOptions = {}) => {
		is_custom_size.value = true
		quote_service.changeCustomSize()

		if( !interactive )
			return

		await nextTick()

		custom_width_input.value?.focus()
	}

	const showCustomSize = async () => {
		await setCustomSizeVisible()
	}

	const hideCustomSize = () => {
		is_custom_size.value = false
	}

	const focusWidthInput = () => {
		custom_width_input.value?.focus()
	}

	const setCustomQtyVisible = async ({ interactive = true }: InitializeFormOptions = {}) => {
		is_custom_qty.value = true

		if( !interactive )
			return

		await nextTick()

		custom_qty_input.value?.focus()

		/**
		 * This will trigger the @change event,
		 * When the custom field has already a value during toggling the show buttom
		 */
		if( custom_qty_input.value )
			custom_qty_input.value?.dispatchEvent(new Event('change', { bubbles: true }))
	}

	const showCustomQty = async () => {
		await setCustomQtyVisible()
	}

	const hideCustomQty = async () => {
		is_custom_qty.value = false
	}

	const formatted_custom_qty = computed(() => {
		if (!quote_service.custom_quantity.value.nr)
			return ''

		return quote_service.custom_quantity.value.nr.toLocaleString()
	})

	const formatPrice = (price: number) => { return formatCurrencyByCountry(price, country.value) }

	const onCustomSizeFocus = () => {
		is_custom_size_focus.value = true
	}

	const onCustomSizeBlur = () => {
		is_custom_size_focus.value = false
	}

	const onCustomQtyFocus = () => {
		is_custom_qty_focus.value = true
	}

	const onCustomQtyBlur = () => {
		is_custom_qty_focus.value = false
	}


	const inputUpdateSize = async (ssize: SizeSpec) => {
		hideCustomSize()
		await quote_service.changeSize(ssize)
	}

	const inputUpdateCustomSize = async () => {
		await quote_service.changeCustomSize()
	}

	const inputUpdateQuantity = async (sqty: QuantitySpec) => {
		hideCustomQty()

		await quote_service.changeQuantity(sqty)
	}

	const inputUpdateCustomQuantity = async (event: Event) => {
		const input = event.target as HTMLInputElement

		const filtered_char = input.value.replace(/[^0-9]/g, '')

		if( filtered_char === '' ) {
			quote_service.custom_quantity.value.nr = null
			return
		}

		// remove commas
		const raw = filtered_char.replace(/,/g, '')
		const n = Number(raw)

		if (!isNaN(n))
			await quote_service.changeCustomQuantity(n)
	}


	const inputUpdateColor = async (scolor: ColorSpec) => {
		await quote_service.changeColor(scolor)
	}


	const letteringTextInput = ($event : string) => {
		if( quote_service.has_lettering_editor.value ) {
			quote_service.lettering.value.text = $event
			quote_service.letteringUpdate()
		}
	}

	const letteringWidthInput = (event: Event) => {
		const target = event.target as HTMLInputElement
		const next_w = Number(target.value)

		if (!Number.isFinite(next_w) || next_w <= 0) return

		quote_service.lettering.value.active = 'width'
		quote_service.lettering.value.width = next_w
	}

	const letteringHeightInput = (event: Event) => {
		const target = event.target as HTMLInputElement
		const next_h = Number(target.value)

		if (!Number.isFinite(next_h) || next_h <= 0) return

		quote_service.lettering.value.active = 'height'
		quote_service.lettering.value.height = next_h
	}



	watch(selected_font, (new_value) => {
		fontChange(new_value)
	})

	const fontChange = (new_value : string) => {
		const s_font = quote_service.featured_fonts.value.find(e => e.value == new_value);

		if( s_font )
			quote_service.changeFont(s_font)
	}



	const is_vinylsize_focused = ref(false)
	const is_font_focused = ref(false)

	const onVinylSizeFocus = () => { is_vinylsize_focused.value = true }
	const onVinylSizeBlur = () => { is_vinylsize_focused.value = false }

	const onVinylFontFocus = () => { is_font_focused.value = true }
	const onVinylFontBlur = () => { is_font_focused.value = false }


	return {
		...quote_service,
		is_custom_size,
		custom_width_input,
		is_custom_qty,
		custom_qty_input,
		formatted_custom_qty,
		is_custom_size_focus,
		is_custom_qty_focus,
		lettering_navigation_flight,
		selected_font,
		is_vinylsize_focused,
		is_font_focused,
		fontChange,
		instatiateForm,
		clearForm,
		showCustomSize,
		hideCustomSize,
		focusWidthInput,
		showCustomQty,
		hideCustomQty,
		inputUpdateSize,
		inputUpdateCustomSize,
		inputUpdateQuantity,
		inputUpdateCustomQuantity,
		formatPrice,
		onCustomSizeFocus,
		onCustomSizeBlur,
		onCustomQtyFocus,
		onCustomQtyBlur,
		inputUpdateColor,
		prepareDefaultColor,
		letteringTextInput,
		letteringWidthInput,
		letteringHeightInput,
		onVinylSizeFocus,
		onVinylSizeBlur,
		onVinylFontFocus,
		onVinylFontBlur,
	}
}