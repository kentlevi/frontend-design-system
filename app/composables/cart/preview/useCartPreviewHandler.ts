import { useCartStore } from "~/stores/cart"

export const useCartPreviewHandler = () => {

	const cart_store = useCartStore()

	const config = useRuntimeConfig()

	const number_of_items = computed(() => cart_store.number_of_items)

	const items =  computed(() => cart_store.items)

	const grand_total = computed(() => cart_store.grand_total)

	const syncItemNumber = () => {
		console.warn('Syncronizing the number of items...')

		cart_store.syncNumber()
	}

	const formatImage = (img_str: string) => {
		return `${config.public.file_url}${img_str}`
	}

	const removeCartItem = (index: number, item_id: number | string) => {
		cart_store.removeItem(index)

		console.warn(`Deleting cart ${item_id}`)
	}



















	// 🔥 Default method and initialization of component
	const composePreview = () => {
		syncItemNumber()
	}

	return {
		number_of_items,
		items,
		grand_total,
		composePreview,
		syncItemNumber,
		formatImage,
		removeCartItem,
	}

}