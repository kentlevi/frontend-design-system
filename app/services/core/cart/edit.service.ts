import { useCartStore } from "~/stores/core/cart/cart.store"

export const useCartItemEditService = (caller : string) => {
	const cart_store = useCartStore()

	const is_open = computed(() => Boolean(cart_store.editable_item) )

	const active_item = computed(() => cart_store.editable_item )


	return {
		// 🔥 States
		caller,
		is_open,
		active_item,

		// 🔥 Methods
		unsetEditableItem: cart_store.unsetEditableItem,
	}
}