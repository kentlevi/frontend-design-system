import { defineStore } from 'pinia'
import type { SizeSpec, QuantitySpec, AttributeSelection } from '../../types/products/attributes'

export const useSelectionStore = defineStore('selection', () => {
	const product = ref<string>()

	const size = ref<SizeSpec>()

	const quantity = ref<QuantitySpec>()

	const selections = ref<Record<string, AttributeSelection>>({})

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

	function updateSize( selected_size 	: SizeSpec ) {
		size.value = selected_size

		saveSelection()
	}

	function updateQuantity( selected_qty: QuantitySpec ) {
		quantity.value 		= selected_qty

		saveSelection()
	}

	function assignDefault(attr : AttributeSelection) {
		updateSize(attr.size)
		updateQuantity(attr.quantity)
	}

	return {
		product,
		size,
		quantity,
		selections,
		updateProduct,
		hasSelection,
		saveSelection,
		updateSize,
		updateQuantity,
		assignDefault,
	}
})