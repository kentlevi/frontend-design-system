import { useNavigationStore } from '@/stores/navigation/navigation.store'
import { getAndStoreProducts } from '~/services/navigation/navigation.service'
import { useCountry } from '../app/country/useCountry'

/**
 * Shared promise state to prevent concurrent duplicate requests
 */
const pending_products_promises = new Map<string, Promise<boolean>>()
let pending_picker_route_animation = false

export const queuePickerRouteAnimation = () => {
	pending_picker_route_animation = true
}

export const hasQueuedPickerRouteAnimation = () => pending_picker_route_animation

export const clearQueuedPickerRouteAnimation = () => {
	pending_picker_route_animation = false
}

export const useNavigation = () => {
	const navigation_store = useNavigationStore()
	const { category_state, product_state, selected_product_id } = storeToRefs(navigation_store)
	const { withCountry } = useCountry()
	const route = useRoute()
	const router = useRouter()

	const selected_category = computed(() => {
		const category = route.params.category
		if (Array.isArray(category)) return category[0] || ''
		return category || ''
	})

	const selected_product_slug = computed(() => {
		const product = route.params.product
		if (Array.isArray(product)) return product[0] || ''
		return product || ''
	})

	const category_data = computed(() =>
		category_state.value.categories.find((item) => item.url_slug === selected_category.value) || null
	)

	const current_category_slug = computed(() => category_data.value?.url_slug ?? selected_category.value ?? '')

	const current_category_products = computed(() => {
		if (!current_category_slug.value) return []
		return product_state.value[current_category_slug.value] ?? []
	})

	const syncSelectedProductId = (products: { id: number; url_slug: string }[]) => {
		if (!products.length) return

		if (selected_product_slug.value) {
			const matched_product = products.find((product) => product.url_slug === selected_product_slug.value)
			if (matched_product) {
				if (selected_product_id.value !== matched_product.id) {
					navigation_store.setSelectedProductId(matched_product.id)
				}
				return
			}
		}

		if (selected_product_id.value === null) {
			navigation_store.setSelectedProductId(products[0].id)
		}
	}

	const fetchAndStoreProducts = async (url_slug: string, clear_cache: boolean = false): Promise<boolean> => {
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

				syncSelectedProductId(products)

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

	const selectProduct = (id: number, slug: string, category: string) => {
		const route_product = route.params.product
		const current_slug = Array.isArray(route_product) ? route_product[0] : route_product

		if (typeof current_slug === 'string' && current_slug === slug) {
			return Promise.resolve()
		}

		const target_path = withCountry(`/${category}/${slug}`)

		navigation_store.setSelectedProductId(id)
		queuePickerRouteAnimation()

		return router.push(target_path)
	}

	watch(
		() => [current_category_slug.value, selected_product_slug.value, current_category_products.value] as const,
		([category_slug, route_product_slug, products]) => {
			if (!category_slug || !products.length) return
			if (!route_product_slug && selected_product_id.value !== null) return
			syncSelectedProductId(products)
		},
		{ immediate: true }
	)

	return {
		category_data,
		selected_category,
		selected_product_id,
		product_state,
		fetchAndStoreProducts,
		selectProduct
	}
}