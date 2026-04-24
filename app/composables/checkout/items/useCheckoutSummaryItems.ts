import { useCartStore } from "~/stores/core/cart/cart.store"

export const useCheckoutSummaryItems = () => {
	const cart_store = useCartStore()
	const {
		selected_items,
	}=storeToRefs(cart_store)


	return {
		selected_items
	}
}