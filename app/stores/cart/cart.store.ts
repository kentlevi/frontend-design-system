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

	const featured_data_cache = ref<Record<string, FeaturedDataResponse>>({})

	const edit_modal_loading = ref<boolean>(false)

	const preview_loading = ref<boolean>(false)

	watch(cart_user_id, () => {
		empty()
	})

	const unsave_draft = ref<CartItem []>([])

	const deletion_id = ref<number>(0)

	const empty = () => {
		items.value = []
		number_of_items.value = 0
		grand_total.value = 0
		selected_item.value = null
		featured_data.value = null
		edit_modal_loading.value = false
		preview_loading.value = false
	}

	const addNumber = () => {
		number_of_items.value++
	}

	const reduceNumber = () => {
		number_of_items.value--
	}

	const saveItemLocally = (item: CartItem) => {
		items.value.unshift(item)
		grand_total.value += Number(item.cost)
		addNumber()
	}

	const updateUploadedItem = (local_identity: string, new_id: number) => {
		const index = items.value.findIndex((item) => item.local_identity === local_identity)

		if (index !== -1 && items.value[index]) {
			items.value[index].id = new_id
		}
	}

	const generateLocalIdentity = (): string => {
		let identifier = ''
		let is_duplicate = true

		while (is_duplicate) {
			const timestamp = Date.now()
			const random_part = Math.random().toString(36).substring(2, 6)
			identifier = `mu-${timestamp}-${random_part}`
			is_duplicate = items.value.some((item) => item.local_identity === identifier)
		}

		return identifier
	}

	return {
		items,
		number_of_items,
		grand_total,
		cart_user_id,
		unsave_draft,
		deletion_id,
		selected_item,
		selected_item_id,
		featured_data,
		featured_data_cache,
		edit_modal_loading,
		preview_loading,
		addNumber,
		reduceNumber,
		saveItemLocally,
		updateUploadedItem,
		generateLocalIdentity,
		empty,
	}
}, {
	persist: {
		key: 'mu_cart',
		storage: persistedState.localStorage,
		pick: ['items', 'number_of_items', 'grand_total', 'cart_user_id'],
	}
})