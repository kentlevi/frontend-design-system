import { useCartService } from "~/services/core/cart/cart.service"

export const useCartPreview = (caller: string) => {

	const cart_service = useCartService('cart-preview')

	const composePreview = async () => {
		cart_service.requestItems()
	}

	return {
		// 🔥 Local States
		caller,

		// 🔥 Methods
		composePreview,
	}
}