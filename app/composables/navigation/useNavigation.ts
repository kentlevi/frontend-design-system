import { useNavigationStore } from '@/stores/navigation/navigation.store'
import { getProductCategories, getProductsByCategory } from '~/services/navigation/navigation.service'

export function useNavigation() {
	const navigationStore = useNavigationStore()

	/**
	 * Fetch navigation categories from API and store them
	 */
	async function fetchAndStoreCategories(): Promise<boolean> {
		try {
			const response = await getProductCategories()
			const categories = response.data

			if (!categories || categories.length === 0) {
				navigationStore?.clearCategories()
				return false
			}

			navigationStore.setCategories(categories)
			return true
		} catch (err) {
			console.error('Navigation fetch failed:', err)
			navigationStore?.clearCategories()
			return false
		}
	}

	async function fetchAndStoreProducts(url_slug: string): Promise<boolean> {
		try {
			const response = await getProductsByCategory(url_slug)
			const products = response.data

			if(!products || products.length === 0) {
				navigationStore?.clearProducts()
				return false
			}

			navigationStore.setProducts(products)
			return true
		} catch (error) {
			console.error('Products fetch failed:', error)
			navigationStore?.clearProducts()
			return false
		}
	}

	return {
		fetchAndStoreCategories,
		fetchAndStoreProducts
	}
}