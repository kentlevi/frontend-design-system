import { defineStore } from 'pinia'
import type { SizeOption } from '../../types/products/attributes'

interface ProductSelection {
	size	: SizeOption
	quantity: number,
	custom_qty?: boolean
}

export const useSelectionStore = defineStore('selection', () => {
	const product = ref<string>()

	const size = ref<SizeOption>()

	const quantity = ref<number>()

	const custom_qty = ref<boolean | false>(false)

	const selections = ref<Record<string, ProductSelection>>({})

	function updateProduct(prod_str: string) {
		product.value = prod_str
	}

	function setSelection(
		sel_prod	: string,
		sel_size	: SizeOption,
		sel_qty		: number,
		c_qty		: boolean = false
	) {
		selections.value[sel_prod] = {
			size		: sel_size,
			quantity	: sel_qty,
			custom_qty	: c_qty
		}
	}

	function updatePreSelected() {
		if( product.value && size.value && quantity.value )
			setSelection(product.value, size.value, quantity.value, (custom_qty ? true : false))
	}

	function setPreSelected(prod: string) {
		const selected = selections.value[prod]

		product.value = prod
		if( selected ) {
			size.value = selected.size
			quantity.value = selected.quantity
			custom_qty.value = selected.custom_qty ? true : false
		}
	}


	function updateSize(
		selected_size : SizeOption
	) {
		size.value = selected_size
		updatePreSelected()
	}

	function updateQuantity(
		selected_qty: number,
		custom?		: boolean
	) {
		quantity.value 		= selected_qty
		custom_qty.value 	= custom ? true : false

		updatePreSelected()
	}

	function hasSelection(product: string): boolean {
		return product in selections.value
	}


	return {
		product,
		size,
		quantity,
		updateProduct,
		selections,
		setSelection,
		updateSize,
		updateQuantity,
		hasSelection,
		custom_qty,
		setPreSelected
	}
})