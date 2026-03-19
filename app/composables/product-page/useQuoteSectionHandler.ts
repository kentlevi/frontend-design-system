/**
 * ⚠️ This composable will handle the logic and behavior of Quote Section component
 */

import type { SizeSpec, QuantitySpec } from '~/types/products/attributes'

import { useQuoteSectionService } from '~/services/attributes/quote.section'
import { useCountry } from '../app/country/useCountry';

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

	/**
	 * 📌Initiate the value of all fields in form and set the default value and behaviour
	 * @param prod_str string — Product URL slug
	 */
	async function instatiateForm(prod_str: string) {
		console.log('🔥 Preparing form...')
		quoteService.updateProduct(prod_str)

		await assignDefault(prod_str)
	}

	/**
	 * Assigning the default base on use activity
	 * @param prod_str string — Product URL Slug
	 */
	async function assignDefault(prod_str : string) {
		// 📌 Existing attributes
		const existing_attr = quoteService.recentSelection(prod_str)

		// 🔥 If the current selected product, has already a pre-selected attributes
		if( existing_attr ) {
			quoteService.defaultSize(existing_attr.size)
			if( existing_attr.size.custom )
				showCustomSize()
			else
				hideCustomSize()

			quoteService.defaultQuantity(existing_attr.quantity)
			if( existing_attr.quantity.custom )
				showCustomQty()
			else
				hideCustomQty()
		}
		// 🔥 The user don't have a pre-selected or changes in default attributes
		else {
			prepareDefaultSize()
			hideCustomSize()

			prepareDefaultQty()
			hideCustomQty()
		}
	}

	function prepareDefaultSize() {
		// Get first size as default
		const default_size = quoteService.featured_sizes.value[0]

		if( default_size )
			quoteService.defaultSize(default_size)
	}

	function prepareDefaultQty() {
		// Get first quantity as default
		const default_qty = quoteService.featured_quantities.value[0]

		if( default_qty )
			quoteService.defaultQuantity({
				...default_qty,
				custom: false
			})
	}

	async function showCustomSize() {
		is_custom_size.value = true

		await nextTick()

		custom_width_input.value?.focus()
	}

	function hideCustomSize() {
		is_custom_size.value = false
	}

	const focusWidthInput = () => {
		custom_width_input.value?.focus()
	}

	async function showCustomQty() {
		is_custom_qty.value = true

		await nextTick()

		custom_qty_input.value?.focus()
	}

	async function hideCustomQty() {
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

	/**
	 * Handles every changes in quote section component
	 * @param attr — Name/Key of attribute that has changes
	 * @param data — Data that contains the changes.
	 */
	async function update(
		attr: string,
		data?: SizeSpec | QuantitySpec | InputEvent | null
	) {
		const request_pricing = ref<boolean>(false)

		switch (attr) {

			// 📌 Handling size changes
			case 'size':
				if (data && 'width' in data && 'height' in data) {
					hideCustomSize()
					await quoteService.changeSize(data)
				}
				else {
					console.log('⚠️ Invalid size data structure!')
					return
				}

				request_pricing.value = true
				break;





			// 📌 Handling custom size changes
			case 'custom-size':
				console.log('Custom Size')
				await quoteService.changeCustomSize()
				request_pricing.value = true
				break;





			// 📌 Handling quantity changes
			case 'quantity':
				console.log('Quantity', data)
				if( data && 'nr' in data && 'price' in data ) {
					// hide custom field when use select featured options of quantities
					hideCustomQty()

					await quoteService.changeQuantity(data)
				}
				else {
					console.log('⚠️ Invalid quantity data structure!')
					return
				}
				break;





			// 📌 Handling custom quantity changes
			case 'custom-quantity':
				console.log('Custom Quantity', data)
				if( data instanceof InputEvent) {
					await quoteService.changeCustomQuantity(data)
					request_pricing.value = true
				} else {
					console.log('⚠️ Invalid custom quantity data structure!')
					return
				}
				break;






			default:
				console.log('No process!!!')
				break;
		}






		if( request_pricing.value ) {
			console.log('Request pricing!!!')
		}
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
		instatiateForm,
		showCustomSize,
		hideCustomSize,
		focusWidthInput,
		showCustomQty,
		hideCustomQty,
		update,
		formatPrice,
		onCustomSizeFocus,
		onCustomSizeBlur,
		onCustomQtyFocus,
		onCustomQtyBlur,
	}
}