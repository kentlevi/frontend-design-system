import { useCheckoutCompletion } from "~/composables/checkout/completion/useCheckoutCompletion"
import { useMainCheckOutStore } from "~/stores/checkout/index.store"

export const useBankTransfer = () => {

	const {
		completeCheckout
	} = useCheckoutCompletion({redirectPath: 'checkout/confirmation'})
	const checkout_store = useMainCheckOutStore()

	const processBankTransfer = async (order_id:number) => {
		try {
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