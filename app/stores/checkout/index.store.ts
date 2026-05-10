import { addressFormDefaults } from "~/factories/address"
import type { AvailablePaymentMethods } from "~/types/payments/payment"
import type { AddressFormState, AddressType } from "~/types/user-address"

/**
 * This store is only for dedicated data needed for checkout process
 */
export const useMainCheckOutStore = defineStore('main_checkout', () => {

	const guest_contact_state = reactive({
		email: '',
		verified_email: '',
	})


	/** Address */
	const selected_shipping_address_id = ref<number | null>(null)
	const selected_billing_address_id = ref<number | null>(null)
	const selected_drop_address_id = ref<number | null>(null)
	const ship_to_another_address = ref<boolean>(false)

	const form_state = reactive<AddressFormState>({
		shipping: addressFormDefaults('shipping'),
		billing: addressFormDefaults('billing'),
		drop: addressFormDefaults('drop'),
	})
	const form_type = ref<AddressType>('shipping')
	const form_field_errors = ref<Record<AddressType, Record<string, string>>>({
		shipping: {},
		billing: {},
		drop: {},
	})

	const active_form = computed(() => form_state[form_type.value])
	const shipping_form = computed(() => form_state.shipping)
	const billing_form = computed(() => form_state.billing)
	const drop_form = computed(() => form_state.drop)
	/** End of Address */

	const selected_shipping_method_id = ref<number | null>(null)
	const selected_payment_method = ref<AvailablePaymentMethods | null>(null)

	const checkout_ready = ref<boolean>(false)

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

	const setCheckoutReady = (value: boolean) => {
		checkout_ready.value = value
	}

	/**
	 * Clean up states that are set during checkout process after a successful complete checkout request
	 */
	const cleanCheckoutStatesOnSuccess = () => {
		selected_payment_method.value = null
		ship_to_another_address.value = false
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
		checkout_ready,
		form_state,
		form_type,
		form_field_errors,
		active_form,
		shipping_form,
		billing_form,
		drop_form,

		// expose setters
		patchGuestContactState,
		setShippingAddressId,
		setBillingAddressId,
		setDropAddressId,
		setShippingMethodId,
		setPaymentMethod,
		setCheckoutReady,
		cleanCheckoutStatesOnSuccess,

		clearShippingAddressId,
		clearBillingAddressId,
		clearDropAddressId,
	}
})