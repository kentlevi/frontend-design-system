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


	const drop_shipping_enabled = ref(false);
	const use_shipping_as_billing = ref(true);

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

	const selected_shipping_method_id = ref<number | null>(null)
	const selected_payment_method = ref<AvailablePaymentMethods | null>(null)
	const checkout_started_at = ref<number | null>(null)

	// True while a payment is being processed (popup open / awaiting result).
	// The submit button reads this together with data-loading flags to decide
	// whether to disable itself.
	const is_processing = ref<boolean>(false)
	const payment_window_open = ref<boolean>(false)

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

	const setProcessing = (value: boolean) => {
		is_processing.value = value
	}

	const setPaymentWindowOpen = (value: boolean) => {
		payment_window_open.value = value
	}

	const setCheckoutStartedAt = () => {
		checkout_started_at.value = Math.floor(Date.now() / 1000)
	}

	/**
	 * Clean up states that are set during checkout process after a successful complete checkout request
	 */
	const cleanCheckoutStates = () => {
		selected_payment_method.value = null
		checkout_started_at.value = null
		setShippingAddressId(null)
		setBillingAddressId(null)
		setDropAddressId(null)
		drop_shipping_enabled.value = false
		use_shipping_as_billing.value = true
		shipping_ship_to_another_address.value = false
		drop_shipping_ship_to_another_address.value = false
		billing_use_different_address.value = false

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
		is_processing,
		payment_window_open,
		form_state,
		form_type,
		form_field_errors,
		active_form,
		shipping_form,
		billing_form,
		drop_form,
		drop_shipping_enabled,
		use_shipping_as_billing,
		shipping_ship_to_another_address,
		drop_shipping_ship_to_another_address,
		billing_use_different_address,

		checkout_started_at,

		// expose setters
		patchGuestContactState,
		setCheckoutStartedAt,
		setShippingAddressId,
		setBillingAddressId,
		setDropAddressId,
		setShippingMethodId,
		setPaymentMethod,
		setProcessing,
		setPaymentWindowOpen,
		cleanCheckoutStates,

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
			'drop_shipping_enabled',
			'use_shipping_as_billing',
			'shipping_ship_to_another_address',
			'drop_shipping_ship_to_another_address',
			'billing_use_different_address'
		],
		afterHydrate: (ctx) => {
			const raw = localStorage.getItem('mu_checkout')
			const parsed = raw ? JSON.parse(raw) : {}

			// Reset booleans to match SSR defaults
			ctx.store.drop_shipping_enabled = false
			ctx.store.use_shipping_as_billing = true
			ctx.store.shipping_ship_to_another_address = false
			ctx.store.drop_shipping_ship_to_another_address = false
			ctx.store.billing_use_different_address = false

			// Reset form_state to defaults so SSR and client match
			Object.assign(ctx.store.form_state.shipping, addressFormDefaults('shipping'))
			Object.assign(ctx.store.form_state.billing, addressFormDefaults('billing'))
			Object.assign(ctx.store.form_state.drop, addressFormDefaults('drop'))

			// Defer restore until Nuxt has finished hydrating. nextTick is a microtask
			// and fires between async component / Suspense resolutions, restoring
			// values before Vue compares server HTML — onNuxtReady waits for the
			// full app mount.
			onNuxtReady(() => {
				ctx.store.drop_shipping_enabled = parsed.drop_shipping_enabled ?? false
				ctx.store.use_shipping_as_billing = parsed.use_shipping_as_billing ?? true
				ctx.store.shipping_ship_to_another_address = parsed.shipping_ship_to_another_address ?? false
				ctx.store.drop_shipping_ship_to_another_address = parsed.drop_shipping_ship_to_another_address ?? false
				ctx.store.billing_use_different_address = parsed.billing_use_different_address ?? false

				if (parsed.form_state) {
					Object.assign(ctx.store.form_state.shipping, parsed.form_state.shipping)
					Object.assign(ctx.store.form_state.billing, parsed.form_state.billing)
					Object.assign(ctx.store.form_state.drop, parsed.form_state.drop)
				}
			})
		}
	}
})