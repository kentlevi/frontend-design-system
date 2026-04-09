import type { CartItem } from '~/types/cart/cart'
import { useUsersStore } from '../users/users.store'
import type { FeaturedDataResponse } from '~/types/products/attributes'

export const useCartStore = defineStore('cart', () => {

	const user_store = useUsersStore()

	const items = ref<CartItem[]>([])

	const number_of_items = ref<number>(0)

	const grand_total = ref<number>(0)

	const cart_user_id = computed(() => user_store.state?.id ?? null)

	const selected_item = ref<CartItem | null>(null)

	const selected_item_id = computed(() => selected_item.value && selected_item.value.id ? selected_item.value.id : null )

	const featured_data = ref<FeaturedDataResponse | null>(null)

	watch(cart_user_id, () => {
		empty()
	})

	const unsave_draft = ref<CartItem []>([])

	const deletion_id = ref<number>(0)
	const deletion_ids = ref<string[]>([])

	const setForDeleteItem = (id: number) => {
		deletion_id.value = id
		deletion_ids.value = []
	}

	const setForDeleteItems = (ids: string[]) => {
		deletion_ids.value = ids
		deletion_id.value = 0
	}

	const removeByIds = (ids: string[]) => {
		items.value = items.value.filter(item => !ids.includes(String(item.id)))
		// Update totals accordingly (simple decrement for now, or trigger re-calculation)
		number_of_items.value = items.value.length
		grand_total.value = items.value.reduce((sum, item) => sum + Number(item.cost), 0)
	}

	const empty = () => {
		items.value = []
		number_of_items.value = 0
		grand_total.value = 0
	}

	return {
		items,
		number_of_items,
		grand_total,
		cart_user_id,
		unsave_draft,
		deletion_id,
		deletion_ids,
		selected_item,
		selected_item_id,
		featured_data,
		setForDeleteItem,
		setForDeleteItems,
		removeByIds,
		empty,
	}
}, {
	persist: {
		key: 'mu_cart',
		storage: persistedState.localStorage,
		pick: ['items', 'number_of_items', 'grand_total', 'cart_user_id'],
	}
})