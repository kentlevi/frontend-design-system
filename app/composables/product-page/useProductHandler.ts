import { useProductStore, useSelectionStore } from '~/stores/product'
import type { SizeOption } from '~/types/products/attributes'

export const useProductHandler = () => {

	const productStore = useProductStore()

	const selectionStore = useSelectionStore()

	const featured_sizes = computed(() => productStore.sizes)

	const featured_quantities = computed(() => productStore.quantities)

	const product = computed(() => selectionStore.product)

	const size = computed(() => selectionStore.size)

	const quantity = computed(() => selectionStore.quantity)

	// 📌 Updating selected product
	function updateProduct(prod_str: string) {
		selectionStore.updateProduct(prod_str)

		// 🔥 If the current selected product, has no last selected data
		if( selectionStore.hasSelection(prod_str) ) {
			selectionStore.setPreSelected(prod_str)
		} else {
			const default_size = featured_sizes.value[0]
			const default_qty = featured_quantities.value[0]

			if( !default_size )
				console.warn('⚠️ No size found.')

			if( !default_qty )
				console.warn('⚠️ No quantity found.')

			if( default_size && default_qty ) {
				selectionStore.setSelection(
					prod_str,
					default_size,
					default_qty,
					false
				)

				selectionStore.setPreSelected(prod_str)
			}
		}
	}

	// 📌 [Size] on-change
	function onChangeSize(selected_size: SizeOption) {
		selectionStore.updateSize(selected_size)
	}

	// 📌 [Quantity] on-change
	function onChangeQuantity(selected_qty: number) {
		selectionStore.updateQuantity(selected_qty)
	}

	function fetchAttributes() {

	}

	return {
		productStore,
		selectionStore,
		fetchAttributes,
		updateProduct,
		onChangeSize,
		onChangeQuantity,
		featured_sizes,
		featured_quantities,
		product,
		size,
		quantity,
	}
}