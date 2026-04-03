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

	const addNumber = () => {
		number_of_items.value++
	}

	const reduceNumber = () => {
		number_of_items.value--
	}

	const syncNumber = () => {
		number_of_items.value = items.value.length
	}

	const saveItemLocally = (item: CartItem) => {
		items.value.push(item)
		addNumber()
	}

	const removeItem = (index: number) => {
		// Filter keeps every item EXCEPT the one matching the ID
		items.value.splice(index, 1)
		reduceNumber()
	}


	return {
		items,
		number_of_items,
		grand_total,
		syncNumber,
		saveItemLocally,
		addNumber,
		reduceNumber,
		removeItem,
	}
}, {
	persist: true
})