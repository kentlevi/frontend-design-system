import type { CartItem } from '~/types/cart/cart'
export const useCartStore = defineStore('cart', () => {


	const items = ref<CartItem[]>([])

	const number_of_items = ref<number>(0)

	const grand_total = ref<number>(0)

	const cart_user_id = ref<number | null>(null)

	const updateUserId = (new_id: number | null) => {

		if( cart_user_id.value != new_id ) {
			cart_user_id.value = new_id
			empty()
		}
	}

	const syncNumber = (total_count: number, total_cost: number) => {
		number_of_items.value = Number(total_count)
		grand_total.value = Number(total_cost)
	}


	const saveItemLocally = (item: CartItem) => {
		items.value.unshift(item)
		grand_total.value += Number(item.cost)
		addNumber()
	}

	const unsaveDraft = ref<CartItem []>([])

	const populateItems = (cart_items: Partial<CartItem>[]) => {
		const local_drafts = items.value.filter(item => item.id === null)

		// 3. Prevent duplication:
		// If a draft was just saved, its local_identity will now be in the server data.
		const incoming_identities = new Set(cart_items.map(i => i.local_identity))

		const unique_drafts = local_drafts.filter(
			draft => !incoming_identities.has(draft.local_identity)
		)
		unsaveDraft.value = unique_drafts;

		items.value = [...unique_drafts, ...cart_items] as CartItem[]
	}

	const removeItem = (item_id: number | null, local_identity?: string | null) => {
		if( item_id ) // Removing item with the given item index
			items.value = items.value.filter(item => item.id != item_id)
		else if( local_identity ) // Removing the one matching the ID
			items.value = items.value.filter(item => item.local_identity != local_identity)

		reduceNumber()
	}

	const updateUploadedItem = (local_identity: string, new_id: number) => {
		const index = items.value.findIndex(i => i.local_identity === local_identity)

		if( index !== -1 && items.value[index] ) {
			items.value[index].id = new_id
			if( items.value[index]?.artwork_preview )
				items.value[index].artwork_preview = null
		}
	}

	const empty = () => {
		items.value = []
		number_of_items.value = 0
		grand_total.value = 0
	}

	const addNumber = () => {
		number_of_items.value++
	}

	const reduceNumber = () => {
		number_of_items.value--
	}

	const generateLocalIdentity = (): string => {
		let identifier: string = ''
		let is_duplicate = true

		while (is_duplicate) {
			// Create a short unique string (e.g., "sj-1712401234-a7b2")
			const timestamp = Date.now()
			const randomPart = Math.random().toString(36).substring(2, 6)
			identifier = `mu-${timestamp}-${randomPart}`

			// Check if this ID already exists in your current items array
			is_duplicate = items.value.some(item => item.local_identity === identifier)
		}

		return identifier
	}


	return {
		items,
		number_of_items,
		grand_total,
		cart_user_id,
		unsaveDraft,
		syncNumber,
		addNumber,
		reduceNumber,
		saveItemLocally,
		removeItem,
		updateUploadedItem,
		empty,
		populateItems,
		generateLocalIdentity,
		updateUserId,
	}
}, {
	persist: {
		key: 'mu_cart',
		storage: persistedState.localStorage,
		pick: ['items', 'number_of_items', 'grand_total', 'cart_user_id'],
	}
})