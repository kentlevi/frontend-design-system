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

	const shipping_ship_to_another_address = ref(false)
	const drop_shipping_ship_to_another_address = ref(false);
	const billing_use_different_address = ref(false);

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

	const on_page = ref<string | null>(null)

	const selected_shipping_method_id = ref<number | null>(null)
	const selected_payment_method = ref<AvailablePaymentMethods | null>(null)

	const checkout_ready = ref<boolean>(false)

	const patchGuestContactState = (
		payload: Partial<typeof guest_contact_state>
	) => {
		Object.assign(guest_contact_state, payload)
	}

	const setShippingAddressId = (id: number | null) => {
		selected_shipping_address_id.value = id
	}

	const setBillingAddressId = (id: number | null) => {
		selected_billing_address_id.value = id
	}

	const setDropAddressId = (id: number | null) => {
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
		setShippingAddressId(null)
		setBillingAddressId(null)
		setDropAddressId(null)
		shipping_ship_to_another_address.value = false
		drop_shipping_ship_to_another_address.value = false
		billing_use_different_address.value = false
		on_page.value = null

		/** Remove persisted state */
		localStorage.removeItem('mu_checkout')
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
		checkout_ready,
		form_state,
		form_type,
		form_field_errors,
		active_form,
		shipping_form,
		billing_form,
		drop_form,
		shipping_ship_to_another_address,
		drop_shipping_ship_to_another_address,
		billing_use_different_address,
		on_page,

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
}, {
	persist: {
		key: 'mu_checkout',
		storage: persistedState.localStorage,
		pick: [
			'form_state',
			'selected_shipping_address_id',
			'selected_billing_address_id',
			'selected_drop_address_id',
			'on_page',
			'shipping_ship_to_another_address',
			'drop_shipping_ship_to_another_address',
			'billing_use_different_address'
		]
	}
})