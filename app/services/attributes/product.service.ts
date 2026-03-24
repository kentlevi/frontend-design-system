import { useSelectionStore } from "~/stores/product"
export const useProductService = () => {
	const selectionStore = useSelectionStore()

	const product = computed(() => selectionStore.product)

	const slug = computed(() => selectionStore.slug)

	function updateProduct(prod_slug: string) {
		console.log('Updating product:', prod_slug)
		selectionStore.updateProduct(prod_slug)
	}

	return {
		slug,
		product,
		updateProduct,
	}
}