import type { CategoriesResponse, ProductsResponse } from '~/types/navigation/navgiation'

/**
 * Fetch authenticated user
 */
export async function getProductCategories(): Promise<CategoriesResponse> {
	const { $api } = useNuxtApp()

	return await $api.get('/navigation/categories')
}

export async function getProductsByCategory(url_slug: string, clear_cache: boolean = false): Promise<ProductsResponse> {
	const { $api } = useNuxtApp()

	return await $api.get(`/navigation/products/${url_slug}`, {
		params: {
			'clear-cache': clear_cache
		}
	})
}