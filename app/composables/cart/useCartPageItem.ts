import { useCartService } from "~/services/cart/cart.service"
import { useCartStore } from "~/stores/cart"

export const useCartPageItem = (caller : string) => {

	const cart_service = useCartService()

	const cart_store = useCartStore()

	const openDeleteModal = (ids: (string|number)[]) => {
		if( !ids || !ids.length )
			return

		cart_service.setForDeleteItems(ids)
	}

	const setAllSelected = (all_checked  : boolean ) => {
		cart_service.all_selected.value = all_checked
	}

	const getArtworkActionLabel = (has_artwork: boolean) =>
		has_artwork ? useI18n().t('cart.cartPage.changeArtwork') : useI18n().t('cart.cartPage.addArtwork')

	const openEditSize = (item_id: string) => {
		cart_service.openEditSizeModal(item_id)
	}

	return {
		// 🔥 Store states
		...storeToRefs(cart_store),

		// 🔥 States
		caller,

		// 🔥 Methods
		openDeleteModal,
		toggleSelection: cart_service.toggleSelection,
		formatImage: cart_service.formatImage,
		setAllSelected,
		getArtworkActionLabel,
		openEditSize,
	}
}