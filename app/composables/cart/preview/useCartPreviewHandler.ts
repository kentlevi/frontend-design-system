import { useCartService } from "~/services/cart/cart.service"
import { useCartStore } from "~/stores/cart"
import type { CartItem } from "~/types/cart/cart"

export const useCartPreviewHandler = () => {

	const cart_store = useCartStore()

	const cart_service = useCartService()

	const config = useRuntimeConfig()

	const number_of_items = computed(() => cart_store.number_of_items)

	const items =  computed(() => cart_store.items)

	const grand_total = computed(() => cart_store.grand_total)

	const page = ref<number>(1)

	const per_page = ref<number>(10)

	const formatImage = (item: CartItem) => {
		let f = `${config.public.file_url}${item.product_thumbnail}`

		if( item.id && item.artwork_file) {
			f = `${config.public.s3_file_url}${item.file_path}${item.artwork_file}`
		} else if( item.artwork_preview ) {
			f = item.artwork_preview
		}

		return f
	}

	const getCartItems = async () => {
		const cart_items = await cart_service.requestCartItems(page.value, per_page.value)
		if( !cart_items || !cart_items.length )
			return

		cart_store.populateItems(cart_items)
	}




	// 🔥 Default method and initialization of component
	const composePreview = () => {
		console.warn('Compose preview component...')
		getCartItems()
	}

	return {
		...cart_service,
		number_of_items,
		items,
		grand_total,
		page,
		per_page,
		composePreview,
		formatImage,
		getCartItems,
	}

}