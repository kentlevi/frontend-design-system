import { checkoutRequest } from "~/services/checkout/checkout.service"
import { usePaymentStrategy } from "~/composables/payments/usePaymentStrategy"
import type { InitialCheckoutPayload } from "~/types/checkout"
import { useUsersStore } from '~/stores/users/users.store';
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import type { PaymentCode } from "~/types/payments/payment";
import { useAddressFormCheckoutContext } from "../address/context/addressFormCheckoutContext";
import { validateAddress } from "~/services/address/address.service";
import { useAddressHelper } from "~/utils/address";

export const useCheckoutFlow = () => {

	const { mapApiFieldErrors } = useAddressHelper()

	const payment = usePaymentStrategy()
	const { state } = storeToRefs(useUsersStore())
	const {
		guest_contact_state,
		selected_shipping_method_id,
		selected_payment_method,

	} = storeToRefs(useMainCheckOutStore())

	const {
		shipping_form,

		setFormErrors
	} = useAddressFormCheckoutContext()

	async function initValidateAddresses() {
		const response = await validateAddress(shipping_form.value)

		if (!response?.success) {
			const next_errors = mapApiFieldErrors(response?.data)
			setFormErrors(shipping_form.value.type, next_errors)
		}

	}

	const initializeSubmitCheckoutParams = (): InitialCheckoutPayload => {

		initValidateAddresses()

		return {
			shipping_method_id: selected_shipping_method_id.value,
			payment_method_code: selected_payment_method.value?.code as PaymentCode,
			email: state.value.id !== 0
				? state.value.email
				: guest_contact_state.value.email,
			contact_name:
				shipping_form.value?.contact_name
				?? (state.value.id !== 0
					? state.value.email
					: guest_contact_state.value.email),
			phone_number:
				shipping_form.value.phone_number
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