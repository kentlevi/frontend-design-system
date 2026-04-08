import { checkoutRequest } from "~/services/checkout/checkout.service"
import { usePaymentStrategy } from "~/composables/payments/usePaymentStrategy"
import type { CheckoutResponse, InitialCheckoutPayload } from "~/types/checkout"
import { useShippingMethod } from "../shipping/useShippingMethod"
import { useUsersStore } from '~/stores/users/users.store';
import { useMainCheckOutStore } from "~/stores/checkout/index.store";

export const useCheckoutFlow = () => {

	const payment = usePaymentStrategy()
	const { state } = storeToRefs(useUsersStore())
	const {
		selected_shipping_method_id,
		selected_shipping_address
	} = storeToRefs(useMainCheckOutStore())

	const initializeSubmitCheckoutParams = (): InitialCheckoutPayload => {
		
		return {
			shipping_method_id: selected_shipping_method_id.value,
			email: state.value.email,
			contact_name: selected_shipping_address.value?.contact_name ?? state.value.email,
			phone_number: "01062000000"
		}
	}

	const submitCheckout = async () => {
		try {
			const params = initializeSubmitCheckoutParams()

			const request = await checkoutRequest(params)

			payment.execute("TOSS", "process", request.data as CheckoutResponse)

		} catch (error) {
			console.error(error)
			payment.execute("TOSS", "error", error)
		}
	}

	return {
		submitCheckout
	}
}