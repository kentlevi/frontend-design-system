import { useCartService } from "~/services/core/cart/cart.service"

export const useCartPageItem = (caller : string) => {

	const cart_service = useCartService('cart-page-item')

	const setAllSelected = (v : boolean) => {
		cart_service.all_selected.value = v
	}

	const deleteSelectedItems = (local_identity: string | null = null) => {
		const deletable = ref<string[]>([])

		if( local_identity )
			deletable.value.push(local_identity)
		else
			deletable.value = cart_service.selected_ids.value

		cart_service.setDeletableItems(deletable.value)
	}

	return {
		// 🔥 Store states
		items		: cart_service.items,
		selected_ids: cart_service.selected_ids,
		all_selected: cart_service.all_selected,

		// 🔥 States
		caller,

		// 🔥 Methods
		setAllSelected,
		deleteSelectedItems,
		formatImage		: cart_service.formatImage,
		toggleSelection : cart_service.toggleSelection,
		selectAllItem 	: cart_service.selectAllItem,
	}
}