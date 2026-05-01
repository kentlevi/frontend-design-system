import { useCartService } from "~/services/core/cart/cart.service"

/**
 * Handles all executions/processes/watchers that required by the other component
 */
export const useSystemOperations = () => {
	const cart_service = useCartService('system')

	/**
	 * First method to execute when the system loads
	 */
	const startup = async () => {
		if( cart_service.is_authenticated.value ) {
			await cart_service.emptyCart(true) // except unsave items
			await cart_service.sendUnsaveToServer() // sending unsave items to server
			await cart_service.calculateCartItems() // calculate all saved items
		} else {
			await cart_service.emptyCart(true)
		}
	}

	// 📌 Run methods in client-side only
	onMounted(async () => {

		// 🔥 Watching authentication status
		watch(() => cart_service.is_authenticated.value, async () => {
			await startup()
		})

	})

	return {
		// 🔥 Methods
		startup,
	}
}