import { checkoutRequest } from "~/services/checkout/checkout.service"
import { usePaymentStrategy } from "~/composables/payments/usePaymentStrategy"
import type { InitialCheckoutPayload } from "~/types/checkout"
import { useUsersStore } from '~/stores/users/users.store';
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import type { PaymentCode } from "~/types/payments/payment";
import { useAddressHelper } from '~/utils/address';

export const useCheckoutFlow = () => {

	const payment = usePaymentStrategy()
	const { state } = storeToRefs(useUsersStore())
	const {
		selected_shipping_method_id,
		selected_payment_method,
		selected_shipping_address
	} = storeToRefs(useMainCheckOutStore())

	const {
		shippingPhoneNumber,
	} = useAddressHelper()

	const initializeSubmitCheckoutParams = (): InitialCheckoutPayload => {

		return {
			shipping_method_id: selected_shipping_method_id.value,
			payment_method_code: selected_payment_method.value?.code as PaymentCode,
			email: state.value.email,
			contact_name:
				selected_shipping_address.value?.contact_name ?? state.value.email,
			phone_number:
				selected_shipping_address.value ? shippingPhoneNumber(selected_shipping_address.value) : ''
		}
	}

	const submitCheckout = async () => {
		const params = initializeSubmitCheckoutParams()

		try {
			const response = await checkoutRequest(params)

			payment.execute(params.payment_method_code, "process", response.data)

		} catch (error) {
			console.error(error)

			const normalized_error =
				error instanceof Error ? error : new Error(String(error))

			payment.execute(params.payment_method_code, "error", normalized_error)
		}
	}

	return {
		submitCheckout
	}
}