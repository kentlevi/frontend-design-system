import { useNavigationStore } from '@/stores/navigation/navigation.store'
import { getProductCategories, getProductsByCategory } from '~/services/navigation/navigation.service'

export function useNavigation() {
	const navigation_store = useNavigationStore()

	/**
	 * Fetch navigation categories from API and store them
	 */
	async function fetchAndStoreCategories(): Promise<boolean> {
		try {
			const response = await getProductCategories()
			const categories = response.data

			if (!categories || categories.length === 0) {
				navigation_store?.clearCategories()
				return false
			}

			navigation_store.setCategories(categories)
			return true
		} catch (err) {
			console.error('Navigation fetch failed:', err)
			navigation_store?.clearCategories()
			return false
		}
	}

	async function fetchAndStoreProducts(url_slug: string, clear_cache: boolean = false): Promise<boolean> {
		try {
			const response = await getProductsByCategory(url_slug, clear_cache)
			const products = response.data

			if(!products || products.length === 0) {
				navigation_store?.clearProducts()
				return false
			}

			navigation_store.setProducts(products)
			return true
		} catch (error) {
			console.error('Products fetch failed:', error)
			navigation_store?.clearProducts()
			return false
		}
	}

	return {
		fetchAndStoreCategories,
		fetchAndStoreProducts
	}
}