import { useNavigationStore } from '@/stores/navigation/navigation.store'
import { getProductCategories, getProductsByCategory } from '~/services/navigation/navigation.service'

/**
 * Shared promise state to prevent concurrent duplicate requests
 */
let pending_category_promise: Promise<boolean> | null = null
const pending_products_promises = new Map<string, Promise<boolean>>()

export function useNavigation() {
	const navigation_store = useNavigationStore()

	/**
	 * Fetch navigation categories from API and store them
	 */
	async function fetchAndStoreCategories(): Promise<boolean> {
		// Return existing promise if already in flight
		if (pending_category_promise) return pending_category_promise

		pending_category_promise = (async () => {
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
			} finally {
				pending_category_promise = null
			}
		})()

		return pending_category_promise
	}

	async function fetchAndStoreProducts(url_slug: string, clear_cache: boolean = false): Promise<boolean> {
		// Check cache first
		const cached_products = navigation_store.product_state[url_slug]
		if (!clear_cache && cached_products && cached_products.length > 0) {
			return true
		}

		// Return existing promise if already in flight for this slug
		const existing_promise = pending_products_promises.get(url_slug)
		if (existing_promise) return existing_promise

		const fetch_promise = (async () => {
			try {
				const response = await getProductsByCategory(url_slug, clear_cache)
				const products = response.data

				if (!products || products.length === 0) {
					return false
				}

				navigation_store.setProducts(url_slug, products)
				return true
			} catch (error) {
				console.error('Products fetch failed:', error)
				return false
			} finally {
				pending_products_promises.delete(url_slug)
			}
		})()

		pending_products_promises.set(url_slug, fetch_promise)
		return fetch_promise
	}

	return {
		fetchAndStoreCategories,
		fetchAndStoreProducts
	}
}