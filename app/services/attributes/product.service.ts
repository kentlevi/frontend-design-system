import { useSelectionStore } from "~/stores/product"
export const useProductService = () => {
	const selectionStore = useSelectionStore()

	const product = computed(() => selectionStore.product)

	function updateProduct(prod_str: string) {
		selectionStore.updateProduct(prod_str)
	}

	return {
		product,
		updateProduct,
	}
}