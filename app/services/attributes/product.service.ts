import { useNavigationStore } from "~/stores/navigation/navigation.store"
import { useSelectionStore } from "~/stores/product"
export const useProductService = () => {
	const selectionStore = useSelectionStore()

	const navigation_store = useNavigationStore()

	const product = computed(() => selectionStore.product)

	const slug = computed(() => selectionStore.slug)

	function updateProduct(prod_slug: string) {
		if(product && product.value && product.value.url_slug == prod_slug)
			return

		console.log('Updating product:', prod_slug)

		const products = navigation_store.product_state.products

		const p = products.find(e => e.url_slug == prod_slug);
		if(!p) {
			console.warn('No product found store state.')
			
			return
		}

		selectionStore.updateProduct(p)

		return true;
	}

	return {
		slug,
		product,
		updateProduct,
	}
}