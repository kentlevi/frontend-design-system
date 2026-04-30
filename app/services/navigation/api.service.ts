import type { CategoriesResponse, ProductsResponse } from '~/types/navigation/navgiation'

/**
 * Fetch authenticated user
 */
export async function fetchCategories(): Promise<CategoriesResponse> {
	const { $api } = useNuxtApp()

	return await $api.get('/navigation/categories')
}

export async function fetchProducts(url_slug: string, clear_cache: boolean = false): Promise<ProductsResponse> {
	const { $api } = useNuxtApp()
	const params = clear_cache
		? { 'clear-cache': 'true' }
		: undefined

	return await $api.get(`/navigation/products/${url_slug}`, {
		params
	})
}