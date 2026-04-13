import { addressFormDefaults } from "~/factories/address";
import type { AddressFormMap, AddressMap, AddressType } from "~/types/address";
import type { AvailablePaymentMethods } from "~/types/payments/payment"

/**
 * This store is only for dedicated data needed for checkout process
 */
export const useMainCheckOutStore = defineStore('main_checkout', () => {

	const saved_shipping_addresses = ref<AddressMap[AddressType][]>([])
	const selected_shipping_address = ref<AddressFormMap[AddressType]>(addressFormDefaults('shipping'))
	const selected_shipping_address_id = ref<number | null>(null)
	const selected_billing_address = ref<AddressFormMap[AddressType]>(addressFormDefaults('billing'))
	const selected_billing_address_id = ref<number | null>(null)
	const selected_drop_address = ref<AddressFormMap[AddressType]>(addressFormDefaults('drop'))
	const selected_drop_address_id = ref<number | null>(null)
	const ship_to_another_address = ref<boolean>(false)
	const is_shipping_billing = ref<boolean>(true)
	const selected_shipping_method_id = ref<number | null>(null)
	const selected_payment_method = ref<AvailablePaymentMethods | null>(null)

	const setSavedShippingAddresses = (addresses: AddressMap[AddressType][]) => {
		saved_shipping_addresses.value = addresses
	}

	const setShippingAddress = (address_form: AddressFormMap[AddressType]) => {
		selected_shipping_address.value = address_form
	}

	const setShippingAddressId = (id: number) => {
		selected_shipping_address_id.value = id
	}

	const setBillingAddress = (address: AddressFormMap[AddressType]) => {
		selected_billing_address.value = address
	}

	const setBillingAddressId = (id: number) => {
		selected_billing_address_id.value = id
	}

	const setDropAddress = (address: AddressFormMap[AddressType]) => {
		selected_drop_address.value = address
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
		is_shipping_billing.value = true
		ship_to_another_address.value = false
		selected_shipping_method_id.value = null
	}

	const clearShippingAddress = () => {
		console.log('clearing shipping address data');
		selected_shipping_address.value = addressFormDefaults('shipping')
		selected_shipping_address_id.value = null
	}

	return {
		saved_shipping_addresses,
		selected_shipping_address,
		selected_shipping_address_id,
		selected_billing_address,
		selected_drop_address,
		selected_shipping_method_id,
		selected_payment_method,
		ship_to_another_address,
		is_shipping_billing,

		// expose setters
		setSavedShippingAddresses,
		setShippingAddress,
		setShippingAddressId,
		setBillingAddress,
		setBillingAddressId,
		setDropAddress,
		setDropAddressId,
		setShippingMethodId,
		setPaymentMethod,
		cleanCheckoutStatesOnSuccess,

		clearShippingAddress
	}
})