import { useCartService } from "~/services/core/cart/cart.service"
import { useUploadService } from "~/services/product/upload.service"
import { useCartStore } from "~/stores/core/cart/cart.store"

export const useCartPreview = (caller: string) => {

	const cart_service = useCartService('cart-preview')

	const cart_store = useCartStore()

	const upload_service = useUploadService()

	const is_open = computed({
		get: () => upload_service.is_preview_open.value,
		set: (val) => upload_service.is_preview_open.value = val
	})


	const deleteCartItem = (local_identity : string) => {
		if ( !local_identity )
			return;

		cart_service.setDeletableItems([local_identity])
	}

	return {
		// 🔥 Local States
		caller,
		is_open,
		number_of_items : cart_service.number_of_items,
		loading: cart_service.loading,
		items: cart_service.items,
		grand_total: cart_service.grand_total,

		// 🔥 Methods
		requestItems :cart_service.requestItems,
		formatImage: cart_service.formatImage,
		deleteCartItem,
		editItem: cart_store.assignEditableItem,
		allowArtworkUpdate : cart_service.allowArtworkUpdate,
		allowVariantUpdate : cart_service.allowVariantUpdate,
	}
}