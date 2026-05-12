import { useAddressGeneral } from "~/composables/checkout/address/useAddressGeneral"
import { useCheckoutCompletion } from "~/composables/checkout/completion/useCheckoutCompletion"
import { completeCheckoutRequest } from "~/services/checkout/checkout.service"
import { useMainCheckOutStore } from "~/stores/checkout/index.store"
import { useCartStore } from "~/stores/cart"

export const useBankTransfer = () => {

	const {
		completeCheckout
	} = useCheckoutCompletion({redirectPath: 'checkout/confirmation'})
	const checkout_store = useMainCheckOutStore()
	const {
		selected_ids
	} = storeToRefs(useCartStore())

	/** Contexts */
	const { buildCompleteCheckoutPayload } = useAddressGeneral()

	const processBankTransfer = async (order_id:number) => {
		try {
			const payload = {
				...buildCompleteCheckoutPayload(order_id),
				selected_cart_ids : selected_ids.value
			}
			await completeCheckoutRequest(payload)
			checkout_store.cleanCheckoutStates()
			completeCheckout(true, order_id)
		} catch (error) {
			console.error('Checkout completion failed:', error)
		}
	}

	const processBankTransferError = (error?: Error) => {
		console.log('Something went wrong', error)
	}
	return {
		processBankTransfer,
		processBankTransferError
	}
}