import { useNavigationStore } from "~/stores/navigation/navigation.store"
import { fetchCategories, fetchProducts } from "./api.service"

export const getAndStoreCategories = async () => {
	const response = await fetchCategories()

	if (!response.success) {
		return response
	}

	useNavigationStore().setCategories(response.data ?? [])

	return response
}

export const getAndStoreProducts = async (url_slug: string, clear_cache: boolean = false) => {
	const response = await fetchProducts(url_slug, clear_cache)

	if (!response.success) {
		return response
	}

	useNavigationStore().setProducts(url_slug, response.data ?? [])

	return response
}