import type { SizeOption } from '../../types/products/attributes'
import { useProductStore, useSelectionStore } from '~/stores/product'

export const useProductHandler = () => {

	const selected_size = ref<SizeOption | null>(null)

	const productStore = useProductStore()

	const selectionStore = useSelectionStore()

	const featured_sizes = computed(() => productStore.sizes)

	const featured_quantities = computed(() => productStore.quantities)

	// 📌 Updating selected product
	function updateProduct(prod_str: string) {
		selectionStore.updateProduct(prod_str)
		// 🔥 If the current selected product, has no last selected data
		//	- Will automatically add default
		console.log(prod_str, selectionStore.hasSelection(prod_str))
		if( !selectionStore.hasSelection(prod_str) ) {

			const default_size = featured_sizes.value[0]
			const default_qty = featured_quantities.value[0]

			if( !default_size )
				console.log('⚠️ No size found.')

			if( !default_qty )
				console.log('⚠️ No quantity found.')

			if( default_size && default_qty )
				selectionStore.setSelection(prod_str, default_size.id, default_qty)
		}
	}


	// 📌 Clearing the selected_size
	function clearSize() {
		selected_size.value = null
	}

	// 📌 Size selection
	function selectSize(size: SizeOption) {
		console.log('Size Selected!')
		selected_size.value = size
	}

	function fetchAttributes() {

	}

	return {
		productStore,
		selectionStore,
		updateProduct,
		fetchAttributes,
		clearSize,
		selectSize,
		featured_sizes,
		featured_quantities,
		selected_size
	}
}