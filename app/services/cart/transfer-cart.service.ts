import { postTransferCart } from './api.service'
import { useTransferCartStore } from '~/stores/cart/transfer-cart.store'
import type { ApiResponse } from '~/types/config/api'

export const transferCartItemsFromPreviousUser = async (): Promise<ApiResponse | null> => {
	const transfer_cart_store = useTransferCartStore()
	const { previous_user_id } = storeToRefs(transfer_cart_store)

	if (previous_user_id.value === null) return null

	try {
		transfer_cart_store.setIsTransferring(true)

		const response = await postTransferCart({
			previous_user_id: previous_user_id.value,
		})

		return response
	} catch (error) {
		console.error(error)
		return error as unknown as ApiResponse
	} finally {
		transfer_cart_store.setIsTransferring(false)
		transfer_cart_store.setPreviousUserId(null)
	}
}