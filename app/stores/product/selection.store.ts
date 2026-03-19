import { defineStore } from 'pinia'
import type { SizeSpec, QuantitySpec, AttributeSelection } from '../../types/products/attributes'

export const useSelectionStore = defineStore('attr-selection', () => {

	const selections = ref<Record<string, AttributeSelection>>({})

	const product = ref<string>()

	const size = ref<SizeSpec>()

	const quantity = ref<QuantitySpec>()

	const shipping_fee = ref<number>(0)

	const discount_perce = ref<number>(0)

	const discounted_price = ref<number>(0)

	const price = ref<number>(0)

	const unit_price = ref<number>(0)

	function updateProduct(prod_str: string) {
		product.value = prod_str
	}

	function hasSelection(prod_str: string): AttributeSelection | null {
		return selections.value[prod_str] ?? null
	}

	function saveSelection() {
		if( product.value && size.value && quantity.value) {
			selections.value[product.value] = {
				size: size.value,
				quantity: quantity.value
			}
		}
	}

	function updateSize( selected_size 	: SizeSpec, default_value?: boolean ) {
		size.value = selected_size

		if( !default_value ) // only store selection when the use selects everything
			saveSelection()
	}

	function updateQuantity( selected_qty: QuantitySpec, default_value?: boolean ) {
		quantity.value 		= selected_qty

		if( !default_value ) // only store selection when the use selects everything
			saveSelection()
	}

	function calculateUnitPrice(selected_qty: QuantitySpec) {
		if( selected_qty && 'nr' in selected_qty && 'price' in selected_qty )
			return selected_qty.nr > 0 ? selected_qty.price / selected_qty.nr : 0
		else
			return 0
	}

	return {
		product,
		size,
		quantity,
		selections,
		shipping_fee,
		discount_perce,
		discounted_price,
		price,
		unit_price,
		updateProduct,
		hasSelection,
		saveSelection,
		updateSize,
		updateQuantity,
		calculateUnitPrice,
	}
})