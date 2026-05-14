import { checkoutRequest } from "~/services/checkout/checkout.service"
import { usePaymentStrategy } from "~/composables/payments/usePaymentStrategy"
import type { InitialCheckoutPayload } from "~/types/checkout"
import { useUsersStore } from '~/stores/users/users.store';
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import type { PaymentCode } from "~/types/payments/payment";
import { useUserAddressFormStateCheckoutContext } from "../address/context/addressFormCheckoutContext";
import { validateAddress } from "~/services/address/address.service";
import { useAddressHelper } from "~/utils/address";
import type { BillingAddressForm, DropAddressForm, ShippingAddressForm } from "~/types/user-address";
import { useCartStore } from "~/stores/core/cart/cart.store";
import { ensureDynamicFields } from "~/services/address-dynamic-fields/dynamic-fields.service";
import { useAppliedCouponStore } from "~/stores/coupon/applied_coupon.store";
import { loadAddresses } from "~/services/user-address/user-address.service";

export const useCheckoutFlow = () => {

	const { mapApiFieldErrors } = useAddressHelper()

	const payment = usePaymentStrategy()
	const { state } = storeToRefs(useUsersStore())
	const checkout_store = useMainCheckOutStore()
	const {
		guest_contact_state,
		checkout_ready,
		selected_shipping_method_id,
		selected_payment_method,
		drop_shipping_enabled,
		use_shipping_as_billing,
	} = storeToRefs(checkout_store)
	const {
		selected_real_ids,
	} = storeToRefs(useCartStore())
	const {
		coupon
	} = storeToRefs(useAppliedCouponStore())

	const {
		shipping_form,
		drop_form,
		billing_form,

		setFormErrors,
		clearFormFieldErrors
	} = useUserAddressFormStateCheckoutContext()




	async function validateAddresses(): Promise<boolean> {
		clearFormFieldErrors()

		const forms_to_validate: Array<
		ShippingAddressForm | BillingAddressForm | DropAddressForm
		> = [shipping_form.value]

		if (drop_shipping_enabled.value) {
			forms_to_validate.push(drop_form.value)
		}

		if (!use_shipping_as_billing.value) {
			forms_to_validate.push(billing_form.value)
		}

		const results = await Promise.all(
			forms_to_validate.map(async (form) => {
				const response = await validateAddress(form)

				if (!response?.success) {
					const next_errors = mapApiFieldErrors(response?.data)
					setFormErrors(form.type, next_errors)
					return false
				}

				return true
			})
		)

		return !results.some(result => !result)
	}

	const buildCheckoutPayload = (): InitialCheckoutPayload => {

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
				shipping_form.value.phone_number,
			selected_cart_ids: selected_real_ids.value,
			coupon_id: coupon.value?.id ?? null
		}
	}




	const submitCheckout = async () => {

		const is_valid = await validateAddresses()

		if (!is_valid) return

		const params = buildCheckoutPayload()

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

	const { is_authenticated } = storeToRefs(useUsersStore())

	watch(is_authenticated, async () => {
		if (is_authenticated.value) {
			await ensureDynamicFields();
			await loadAddresses('shipping');
			await loadAddresses('billing');
			await loadAddresses('drop');
		}
	})

	return {
		checkout_ready,
		submitCheckout
	}
}