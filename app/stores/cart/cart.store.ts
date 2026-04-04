import type { CartItem } from '~/types/cart/cart'
export const useCartStore = defineStore('cart', () => {

	const items = ref<CartItem[]>([])

	const number_of_items = ref<number>(0)

	const grand_total = computed(() => {
		return items.value.reduce((total, item) => {
			// Standardize to 0 if values are missing to avoid NaN
			const price = item.preview?.price ?? 0

			return total + price
		}, 0)
	})


	const syncNumber = (nr: number) => {
		number_of_items.value = nr
	}

	const saveItemLocally = (item: CartItem) => {
		items.value.push(item)
		addNumber()
	}

	const removeItem = (index: number | null, local_identity?: string | number) => {
		if( index != null && index >= 0 ) // Removing item with the given item index
			items.value.splice(index, 1)
		else if( local_identity && index === null ) // Removing the one matching the ID
			items.value = items.value.filter(item => item.id !== local_identity)

		reduceNumber()
	}

	const updateUploadedItem = (item_id: string | null, new_id: number) => {
		const index = items.value.findIndex(i => i.id === item_id)

		if( index !== -1 && items.value[index] )
			items.value[index].id = new_id
	}

	const empty = () => {
		items.value = []
		number_of_items.value = 0
	}

	const addNumber = () => {
		number_of_items.value++
	}

	const reduceNumber = () => {
		number_of_items.value--
	}


	return {
		items,
		number_of_items,
		grand_total,
		syncNumber,
		addNumber,
		reduceNumber,
		saveItemLocally,
		removeItem,
		updateUploadedItem,
		empty,
	}
}, {
	persist: true
})