import { useCartService } from "~/services/core/cart/cart.service"
import { useCartItemEditService } from "~/services/core/cart/edit.service"
import type { SizeSpec } from "~/types/products/attributes"

export const useEditItemHandler = (caller : string) => {

	const cart_service = useCartService('cart-edit-item-handler')

	const cart_edit_service = useCartItemEditService('cart-edit-item-handler')


	const closeModal = () => {
		cart_edit_service.unsetEditableItem()
	}
	// ⚠️ Static & temporary
	const updateItemSize = () => {
		console.log(1)
	}
	const updateItemQty = () => {
		console.log(1)
	}

	const show_quantity = ref<boolean>(true)

	const sizes = ref<SizeSpec []>([])

	return {
		// 🔥 States
		caller,
		show_quantity,
		sizes,
		is_open : cart_edit_service.is_open,
		active_item : cart_edit_service.active_item,

		// 🔥 Service Methods
		formatImage : cart_service.formatImage,


		// 🔥 Methods
		updateItemSize,
		updateItemQty,
		closeModal,
	}
}