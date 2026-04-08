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


	const formatImage = (item: CartItem) => {
		const is_absolute_url = (value: string | null | undefined) =>
			Boolean(value && /^(https?:)?\/\//i.test(value))

		let f = is_absolute_url(item.product_thumbnail)
			? String(item.product_thumbnail)
			: `${config.public.file_url}${item.product_thumbnail}`

		if( item.id && item.artwork_file) {
			f = `${config.public.s3_file_url}${item.file_path}${item.artwork_file}`
		} else if( item.artwork_preview ) {
			f = item.artwork_preview
		}

		return f
	}




	// ðŸ”¥ Default method and initialization of component
	const composePreview = () => {
		console.warn('Compose preview component...')
		cart_service.getCartItems()
	}

	return {
		...cart_service,
		number_of_items,
		items,
		grand_total,
		composePreview,
		formatImage,
	}

}