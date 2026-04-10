import { useCartService } from '~/services/cart/cart.service'
import type { CartEmptyProduct } from '~/stores/cart/cart.store'

export const useCartEmptyState = () => {
	const cart_service = useCartService('cart-empty-state')

	const items_per_page = 6
	const page_index = ref(0)

	const page_count = computed(() => Math.max(1, Math.ceil(cart_service.empty_discover_products.value.length / items_per_page)))
	const discover_pages = computed(() => {
		const pages: Array<CartEmptyProduct[]> = []
		for (let index = 0; index < cart_service.empty_discover_products.value.length; index += items_per_page) {
			pages.push(cart_service.empty_discover_products.value.slice(index, index + items_per_page))
		}
		return pages.length ? pages : [[]]
	})
	const can_go_prev = computed(() => page_index.value > 0)
	const can_go_next = computed(() => page_index.value < page_count.value - 1)

	const prevPage = () => {
		if (!can_go_prev.value) return
		page_index.value -= 1
	}

	const nextPage = () => {
		if (!can_go_next.value) return
		page_index.value += 1
	}

	watch(
		() => cart_service.empty_discover_products.value.length,
		() => {
			if (page_index.value > page_count.value - 1) {
				page_index.value = Math.max(0, page_count.value - 1)
			}
		}
	)

	return {
		featured_products: cart_service.empty_featured_products,
		page_index,
		discover_pages,
		can_go_prev,
		can_go_next,
		prevPage,
		nextPage,
	}
}