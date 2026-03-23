/**
 * ⚠️ This composable will handle the logic and behavior of Quote Section component
 */

import type { SizeSpec, QuantitySpec, ColorSpec, AttributeSelection } from '~/types/products/attributes'

import { useQuoteSectionService } from '~/services/attributes/quote.section'
import { useCountry } from '../app/country/useCountry'

export const useQuoteSectionHandler = () => {

	// 🔥 Quote section service
	const quoteService = useQuoteSectionService()

	const { country } = useCountry();

	const is_custom_qty = ref<boolean>(!!quoteService.quantity.value?.custom)

	const is_custom_size = ref<boolean>(!!quoteService.size.value?.custom)

	const custom_qty_input = ref<HTMLInputElement | null>(null)

	const custom_width_input = ref<HTMLInputElement | null>(null)

	const is_custom_size_focus = ref(false)

	const is_custom_qty_focus = ref(false)

	const lettering_navigation_flight = ref(false)

	const selected_font = ref<string>('')

	// const pricing_disp = ref({
	// 	ready: false
	// })

	/**
	 * Disable form
	 */
	const clearForm = () => {
		quoteService.clearSelection()
	}

	/**
	 * 📌Initiate the value of all fields in form and set the default value and behaviour
	 * @param prod_slug string — Product URL slug
	 */
	const instatiateForm = async () => {
		console.log('🔥 Preparing form...')

		await assignDefault()
	}

	/**
	 * Assigning the default base on use activity
	 * @param prod_slug string — Product URL Slug
	 */
	const assignDefault = async () => {
		if( !quoteService.slug || !quoteService.slug.value )
			return

		// 📌 Existing attributes
		const existing_attr = quoteService.recentSelection()

		// 🔥 If the current selected product, has already a pre-selected attributes
		if( existing_attr ) {
			preparingExistingSelection(existing_attr)
		}
		/**
		 * 🔥 The user don't have a pre-selected or changes in default attributes
		 * Or the user never visited this product before
		 */
		else {
			prepareDefaultSize()
			hideCustomSize()

			prepareDefaultQty()
			hideCustomQty()

			if( quoteService.has_color_selection.value )
				prepareDefaultColor()

			if( quoteService.has_font_selection.value)
				prepareDefaultFont()
		}
	}

	const preparingExistingSelection = (existing_attr : AttributeSelection) => {
		/** VINYL LETTERING EDITOR */
		if( quoteService.has_lettering_editor.value ) {
			/** Preparing lettering editor's default value */
			/** Which includes the size and its text value */
			prepareLetteringEditor(existing_attr)
		} else {
			preparingExistingSize(existing_attr)
		}

		/** QUANTITY */
		quoteService.defaultQuantity(existing_attr.quantity)
		if( existing_attr.quantity.custom )
			showCustomQty()
		else
			hideCustomQty()

		/** COLOR */
		if( quoteService.has_color_selection.value ) {
			if(
				'color' in existing_attr
				&& existing_attr.color
			) {
				quoteService.defaultColor(existing_attr.color)
			} else {
				prepareDefaultColor()
			}
		}
		/** FONT */
		if( quoteService.has_font_selection.value ) {
			if(
				'font' in existing_attr
				&& existing_attr.font
			) {
				selected_font.value = existing_attr.font.value
				quoteService.defaultFont(existing_attr.font)
			} else {
				prepareDefaultFont()
			}
		}
	}

	const prepareLetteringEditor = (existing_attr : AttributeSelection) => {
		if(  existing_attr.lettering_text ) {
			quoteService.defaultLettering(existing_attr.size, existing_attr.lettering_text)
		}
		else {
			quoteService.defaultSize(existing_attr.size)
		}
	}

	const preparingExistingSize = (existing_attr: AttributeSelection) => {
		/** COMMON SIZE AND QUANTITY FLOW */

		quoteService.defaultSize(existing_attr.size)
		console.log(existing_attr.size.custom)
		if( existing_attr.size.custom )
			showCustomSize()
		else
			hideCustomSize()
	}

	const prepareDefaultSize = () => {
		// Get first size as default
		const default_size = quoteService.featured_sizes.value[0]

		if( default_size )
			quoteService.defaultSize(default_size)
	}

	const prepareDefaultQty = () => {
		// Get first quantity as default
		const default_qty = quoteService.featured_quantities.value[0]

		if( default_qty )
			quoteService.defaultQuantity({
				...default_qty,
				custom: false
			})
	}

	const prepareDefaultColor = () => {
		if( !quoteService.has_color_selection?.value )
			return

		const default_color = quoteService.featured_colors.value[0]

		if( default_color ) {
			quoteService.defaultColor(default_color)
		}
	}

	const prepareDefaultFont = () => {
		if( !quoteService.has_font_selection.value && !quoteService.featured_fonts.value.length )
			return

		const default_font = quoteService.featured_fonts.value[0]
		if( default_font ) {
			selected_font.value = default_font.value
			quoteService.defaultFont(default_font)
		}
	}

	const showCustomSize = async () => {
		is_custom_size.value = true

		await nextTick()

		custom_width_input.value?.focus()
		quoteService.changeCustomSize()
	}

	const hideCustomSize = () => {
		is_custom_size.value = false
	}

	const focusWidthInput = () => {
		custom_width_input.value?.focus()
	}

	const showCustomQty = async () => {
		is_custom_qty.value = true

		await nextTick()

		custom_qty_input.value?.focus()

		/**
		 * This will trigger the @change event,
		 * When the custom field has already a value during toggling the show buttom
		 */
		if( custom_qty_input.value )
			custom_qty_input.value?.dispatchEvent(new Event('change', { bubbles: true }))
	}

	const hideCustomQty = async () => {
		is_custom_qty.value = false
	}

	const formatted_custom_qty = computed(() => {
		if (!quoteService.custom_quantity.value.nr)
			return ''

		return quoteService.custom_quantity.value.nr.toLocaleString()
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
		await quoteService.changeSize(ssize)
	}

	const inputUpdateCustomSize = async () => {
		await quoteService.changeCustomSize()
	}

	const inputUpdateQuantity = async (sqty: QuantitySpec) => {
		hideCustomQty()

		await quoteService.changeQuantity(sqty)
	}

	const inputUpdateCustomQuantity = async (event: Event) => {
		const input = event.target as HTMLInputElement

		// remove commas
		const raw = input.value.replace(/,/g, '')
		const n = Number(raw)

		if (!isNaN(n))
			await quoteService.changeCustomQuantity(n)
	}


	const inputUpdateColor = async (scolor: ColorSpec) => {
		await quoteService.changeColor(scolor)
	}


	const letteringTextInput = ($event : string) => {
		if( quoteService.has_lettering_editor.value ) {
			quoteService.lettering.value.text = $event
			quoteService.letteringUpdate()
		}
	}

	const letteringWidthInput = (event: Event) => {
		const target = event.target as HTMLInputElement
		const next_w = Number(target.value)

		if (!Number.isFinite(next_w) || next_w <= 0) return

		quoteService.lettering.value.active = 'width'
		quoteService.lettering.value.width = next_w
	}

	const letteringHeightInput = (event: Event) => {
		const target = event.target as HTMLInputElement
		const next_h = Number(target.value)

		if (!Number.isFinite(next_h) || next_h <= 0) return

		quoteService.lettering.value.active = 'height'
		quoteService.lettering.value.height = next_h
	}



	watch(selected_font, (new_value) => {
		fontChange(new_value)
	})

	const fontChange = (new_value : string) => {
		const s_font = quoteService.featured_fonts.value.find(e => e.value == new_value);

		if( s_font )
			quoteService.changeFont(s_font)
	}


	const featuredCardChange = (fcard_size_id: number) => {
		if( quoteService.slug.value == 'vinyl-lettering' )
			return

		const s_size = quoteService.featured_sizes.value.find(e => e.id == fcard_size_id)

		if( s_size )
			quoteService.changeSize(s_size)
	}


	return {
		...quoteService,
		is_custom_size,
		custom_width_input,
		is_custom_qty,
		custom_qty_input,
		formatted_custom_qty,
		is_custom_size_focus,
		is_custom_qty_focus,
		lettering_navigation_flight,
		selected_font,
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
		featuredCardChange,
	}
}