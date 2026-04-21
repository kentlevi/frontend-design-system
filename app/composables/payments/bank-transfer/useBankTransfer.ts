import { useAddressGeneral } from "~/composables/checkout/address/useAddressGeneral"
import { useCheckoutCompletion } from "~/composables/checkout/completion/useCheckoutCompletion"
import { completeCheckoutRequest } from "~/services/checkout/checkout.service"
import { useMainCheckOutStore } from "~/stores/checkout/index.store"

export const useBankTransfer = () => {

	const {
		completeCheckout
	} = useCheckoutCompletion({redirectPath: 'checkout/confirmation'})
	const checkout_store = useMainCheckOutStore()

	/** Contexts */
	const { buildCompleteCheckoutPayload } = useAddressGeneral()

	const processBankTransfer = async (order_id:number) => {
		try {
			await completeCheckoutRequest(
				buildCompleteCheckoutPayload(order_id)
			)
			checkout_store.cleanCheckoutStatesOnSuccess()
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