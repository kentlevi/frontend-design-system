import { transferCartItemsFromPreviousUser } from '~/services/cart/transfer-cart.service'
import { useTransferCartStore } from '~/stores/cart/transfer-cart.store'
import { useUsersStore } from '~/stores/users/users.store'

export function useTransferCart() {
	const transfer_cart_store = useTransferCartStore()
	const user_store = useUsersStore()
	const { previous_user_id, is_transferring } = storeToRefs(transfer_cart_store)
	const { state } = storeToRefs(user_store)

	const captureCurrentUserAsPrevious = () => {
		const current_user_id = state.value.id

		if (!current_user_id) {
			transfer_cart_store.setPreviousUserId(null)
			return
		}

		transfer_cart_store.setPreviousUserId(current_user_id)
	}

	const clearPreviousUserId = () => {
		transfer_cart_store.setPreviousUserId(null)
	}

	const runTransferCart = async () => {
		return transferCartItemsFromPreviousUser()
	}

	return {
		previous_user_id,
		is_transferring,
		captureCurrentUserAsPrevious,
		clearPreviousUserId,
		runTransferCart,
	}
}
