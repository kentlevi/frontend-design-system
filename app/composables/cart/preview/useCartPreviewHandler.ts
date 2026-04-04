import { useCartStore } from "~/stores/cart"

export const useCartPreviewHandler = () => {

	const cart_store = useCartStore()

	const config = useRuntimeConfig()

	const number_of_items = computed(() => cart_store.number_of_items)

	const items =  computed(() => cart_store.items)

	const grand_total = computed(() => cart_store.grand_total)

	const formatImage = (img_str: string) => {
		if (!img_str.startsWith('data:'))
			return `${config.public.file_url}${img_str}`
		else
			return img_str
	}

	const removeCartItem = (index: number, item_id: number | string) => {
		cart_store.removeItem(index)

		console.warn(`Deleting item ${item_id}`)
	}




	// 🔥 Default method and initialization of component
	const composePreview = () => {
		console.warn('Compose preview component...')
	}

	return {
		number_of_items,
		items,
		grand_total,
		composePreview,
		formatImage,
		removeCartItem,
	}

}