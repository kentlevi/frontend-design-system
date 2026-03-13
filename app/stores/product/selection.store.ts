// stores/selection.ts
import { defineStore } from 'pinia'

interface ProductSelection {
	size	: number
	quantity: number,
	custom_qty?: boolean
}

export const useSelectionStore = defineStore('selection', () => {
	const product = ref<string | null>(null)

	const selections = ref<Record<string, ProductSelection>>({})

	const custom_qty = ref<number | null>(null)

	function updateProduct(prod_str: string) {
		product.value = prod_str
	}

	function setSelection(product: string, size: number, quantity: number) {
		selections.value[product] = { size, quantity }
	}

	function updateSize(product: string, size: number) {
		if (selections.value[product]) {
			selections.value[product].size = size
		}
	}

	function updateQuantity(product: string, quantity: number, custom?: boolean) {
		if (selections.value[product]) {
			selections.value[product].quantity = quantity
			if( custom )
				selections.value[product].custom_qty = true
		}
	}

	function hasSelection(product: string | null): boolean {
		if( !product )
			return false

		return !!selections.value[product]
	}

	return {
		product,
		updateProduct,
		selections,
		setSelection,
		updateSize,
		updateQuantity,
		hasSelection,
		custom_qty
	}
})