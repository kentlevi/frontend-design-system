import { useCartService } from "~/services/cart/cart.service"

export const useCartPreviewHandler = (caller : string = 'unknown') => {
	const { t } = useI18n()
	console.log('Caller:', caller)

	const cart_service = useCartService()

	const open_deletion_modal = computed(() => Boolean(cart_service.deletion_id.value))
	const editing_item = computed(() => Boolean(cart_service.selected_item.value))
	const deletionTitle = computed(() => t('cart.cartPage.deleteItemTitle'))
	const deletionDescription = computed(() => t('cart.cartPage.deleteItemDescription'))
	const deletionConfirmLabel = computed(() => t('cart.cartPage.removeConfirm'))

	// 🔥 Default method and initialization of component
	const composePreview = () => {
		console.warn('Compose preview component...')
		cart_service.getCartItems(true)
	}

	const confirmDeleteItem = async () => {
		if (cart_service.deletion_id.value) {
			cart_service.requestDeletion(cart_service.deletion_id.value)
			cart_service.setForDeleteItem(0)
		}
	}

	const closeDeleteModal = () => {
		cart_service.setForDeleteItem(0)
	}

	return {
		...cart_service,
		open_deletion_modal,
		editing_item,
		deletionTitle,
		deletionDescription,
		deletionConfirmLabel,
		composePreview,
		confirmDeleteItem,
		closeDeleteModal,
	}

}