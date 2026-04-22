import { useUsersStore } from "~/stores/users/users.store";
import type { CartItem } from "~/types/cart/cart";

export const useCartStore = defineStore('cart', () => {

	const user_store = useUsersStore()

	const items = ref<CartItem[]>([])

	const loading = ref<boolean>(true)

	const number_of_items = ref<number>(0)

	const grand_total = ref<number>(0)

	const selected_ids = ref<string[]>([])

	const cart_user_id = computed(() => user_store.state?.id ?? null)

	const selected_item = ref<CartItem | null>(null)

	const selected_item_id = computed(() => selected_item.value && selected_item.value.id ? selected_item.value.id : null)

	const all_selected = computed({
		get: () => items.value.length > 0 && selected_ids.value.length === items.value.length,
		set: (checked: boolean) => {
			selected_ids.value = checked ? items.value.map((row) => row.local_identity) : [];
		},
	});

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

		// Default check the new item
		const itemId = item.id ? String(item.id) : (item.local_identity || 'unknown');
		if (!selected_ids.value.includes(itemId)) {
			selected_ids.value.push(itemId);
		}
	}

	const addSelected = (local_identity: string) => {
		if (!selected_ids.value.includes(local_identity))
			selected_ids.value.push(local_identity);
	}

	const removeSelected = (local_identity: string) => {
		// Filter creates a new array without the item, if it exists
		selected_ids.value = selected_ids.value.filter(id => id !== local_identity);
	};

	const updateUploadedItem = (local_identity: string, new_id: number) => {
		const index = items.value.findIndex((i: CartItem) => i.local_identity === local_identity)

		if( index !== -1 && items.value[index] ) {
			items.value[index].id = new_id
			if( items.value[index]?.artwork_preview )
				items.value[index].artwork_preview = null
		}
	}

	return {
		// 🔥 States
		items,
		loading,
		number_of_items,
		grand_total,
		selected_ids,
		cart_user_id,
		selected_item,
		selected_item_id,
		all_selected,

		// 🔥 Methods
		addNumber,
		reduceNumber,
		saveItemLocally,
		addSelected,
		removeSelected,
		updateUploadedItem,
	}
}, {
	persist: {
		key: 'mu_cart',
		storage: persistedState.localStorage,
		pick: ['items', 'number_of_items', 'grand_total', 'selected_ids', 'has_initialized_demo'],
	}
})