import type { AvailablePaymentMethods } from "~/types/payments/payment"

/**
 * This store is only for dedicated data needed for checkout process
 */
export const useMainCheckOutStore = defineStore('main_checkout', () => {

	const guest_contact_state = reactive({
		email: '',
		verified_email: '',
	})
	const selected_shipping_address_id = ref<number | null>(null)
	const selected_billing_address_id = ref<number | null>(null)
	const selected_drop_address_id = ref<number | null>(null)

	const ship_to_another_address = ref<boolean>(false)
	const selected_shipping_method_id = ref<number | null>(null)
	const selected_payment_method = ref<AvailablePaymentMethods | null>(null)

	const patchGuestContactState = (
		payload: Partial<typeof guest_contact_state>
	) => {
		Object.assign(guest_contact_state, payload)
	}

	const setShippingAddressId = (id: number) => {
		selected_shipping_address_id.value = id
	}

	const setBillingAddressId = (id: number) => {
		selected_billing_address_id.value = id
	}

	const setDropAddressId = (id: number) => {
		selected_drop_address_id.value = id
	}

	const setShippingMethodId = (id: number | null) => {
		selected_shipping_method_id.value = id
	}

	const setPaymentMethod = (data: AvailablePaymentMethods | null) => {
		selected_payment_method.value = data
	}

	/**
	 * Clean up states that are set during checkout process after a successful complete checkout request
	 */
	const cleanCheckoutStatesOnSuccess = () => {
		selected_payment_method.value = null
		ship_to_another_address.value = false
		selected_shipping_method_id.value = null
		clearShippingAddressId()
		clearBillingAddressId()
		clearDropAddressId()
	}

	const clearShippingAddressId = () => {
		selected_shipping_address_id.value = null
	}

	const clearBillingAddressId = () => {
		selected_billing_address_id.value = null
	}

	const clearDropAddressId = () => {
		selected_drop_address_id.value = null
	}

	return {
		guest_contact_state,
		selected_shipping_address_id,
		selected_billing_address_id,
		selected_drop_address_id,
		selected_shipping_method_id,
		selected_payment_method,
		ship_to_another_address,

		// expose setters
		patchGuestContactState,
		setShippingAddressId,
		setBillingAddressId,
		setDropAddressId,
		setShippingMethodId,
		setPaymentMethod,
		cleanCheckoutStatesOnSuccess,

		clearShippingAddressId,
		clearBillingAddressId,
		clearDropAddressId,
	}
})