import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import {
	COUNTRY_TO_API_COUNTRY,
	DEFAULT_COUNTRY,
	resolveSupportedCountry
} from '~/constants/countries'
import type { ProductByCategoryApiItem } from '~/types/products/productByCategory'

interface ProductsResponse {
	success: boolean
	message: string
	data: ProductByCategoryApiItem[]
	meta: Record<string, unknown> | null
	error: unknown
}

export function useProductByCategory(category: string) {
	const route = useRoute()
	const api = useApi()

	const products = ref<ProductByCategoryApiItem[]>([])
	const loading = ref(false)
	const error = ref<unknown>(null)

	const routeCountry =
		resolveSupportedCountry(route.params.country as string) || DEFAULT_COUNTRY

	const apiCountry = COUNTRY_TO_API_COUNTRY[routeCountry]

	const fetchProductsByCategory = async () => {
		loading.value = true
		error.value = null

		try {
			const response = await api<ProductsResponse>(
				`/${apiCountry}/navigation/products/${category}`,
				{
					method: 'GET'
				}
			)

			products.value = response.data || []
		} catch (err) {
			console.error('Product fetch failed:', err)
			error.value = err
			products.value = []
		} finally {
			loading.value = false
		}
	}

	onMounted(() => {
		fetchProductsByCategory()
	})

	return {
		products,
		loading,
		error,
		fetchProductsByCategory
	}
}