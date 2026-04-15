import { useAddressFormCheckoutContext } from "~/composables/checkout/address/context/addressFormCheckoutContext"
import { useCheckoutCompletion } from "~/composables/checkout/completion/useCheckoutCompletion"
import { completeCheckoutRequest } from "~/services/checkout/checkout.service"
import { useMainCheckOutStore } from "~/stores/checkout/index.store"

export const useBankTransfer = () => {

	const {
		completeCheckout
	} = useCheckoutCompletion({redirectPath: 'checkout/confirmation'})
	const checkout_store = useMainCheckOutStore()

	const { form_state } = useAddressFormCheckoutContext()
	const shipping_form = computed(() => form_state.shipping)
	const billing_form = computed(() => form_state.billing)
	// const drop_form = computed(() => form_state.drop)

	const processBankTransfer = async (order_id:number) => {
		try {
			await completeCheckoutRequest({
				order_id: order_id,
				shipping_address: shipping_form.value,
				billing_address: billing_form.value
			})
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