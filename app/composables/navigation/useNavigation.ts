import { useNavigationStore } from '@/stores/navigation/navigation.store'
import { getAndStoreProducts } from '~/services/navigation/navigation.service'

/**
 * Shared promise state to prevent concurrent duplicate requests
 */
let pending_category_promise: Promise<boolean> | null = null
const pending_products_promises = new Map<string, Promise<boolean>>()

export function useNavigation() {
	const navigation_store = useNavigationStore()

	async function fetchAndStoreProducts(url_slug: string, clear_cache: boolean = false): Promise<boolean> {
		// Return existing promise if already in flight for this slug
		const existing_promise = pending_products_promises.get(url_slug)
		if (existing_promise) return existing_promise

		const fetch_promise = (async () => {
			try {
				const response = await getAndStoreProducts(url_slug, clear_cache)
				const products = response.data

				if (!products || products.length === 0) {
					return false
				}

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
		fetchAndStoreProducts
	}
}