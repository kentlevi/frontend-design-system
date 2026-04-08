import { checkoutRequest } from "~/services/checkout/checkout.service"
import { usePaymentStrategy } from "~/composables/payments/usePaymentStrategy"
import type { InitialCheckoutPayload } from "~/types/checkout"
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

			const response = await checkoutRequest(params)

			payment.execute("TOSS", "process", response.data)

		} catch (error) {
			console.error(error)
			if (error instanceof Error) {
				payment.execute("TOSS", "error", error)
			} else {
				payment.execute("TOSS", "error", new Error(String(error)))
			}
		}
	}

	return {
		submitCheckout
	}
}