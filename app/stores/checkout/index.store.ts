import type { AddressMap, AddressType } from "~/types/address";

/**
 * This store is only for dedicated data needed for checkout process
 */
export const useMainCheckOutStore = defineStore('main_checkout', () => {

	const saved_shipping_addresses = ref<AddressMap[AddressType][]>([])
	const selected_shipping_address = ref<AddressMap[AddressType] | null>(null)

	const selected_billing_address = ref<AddressMap[AddressType] | null>(null)
	const selected_drop_address = ref<AddressMap[AddressType] | null>(null)
	const ship_to_another_address = ref<boolean>(false)

	const selected_shipping_method_id = ref<number | null>(null)
	const selected_payment_method_id = ref<number | null>(null)

	const setSavedShippingAddresses = (addresses: AddressMap[AddressType][]) => {
		saved_shipping_addresses.value = addresses
	}

	const setShippingAddress = (address: AddressMap[AddressType] | null) => {
		selected_shipping_address.value = address
	}

	const setBillingAddress = (address: AddressMap[AddressType] | null) => {
		selected_billing_address.value = address
	}

	const setDropAddress = (address: AddressMap[AddressType] | null) => {
		selected_drop_address.value = address
	}

	const setShippingMethodId = (id: number | null) => {
		selected_shipping_method_id.value = id
	}

	const setPaymentMethodId = (id: number | null) => {
		selected_payment_method_id.value = id
	}

	return {
		saved_shipping_addresses,
		selected_shipping_address,
		selected_billing_address,
		selected_drop_address,
		selected_shipping_method_id,
		selected_payment_method_id,
		ship_to_another_address,

		// expose setters
		setSavedShippingAddresses,
		setShippingAddress,
		setBillingAddress,
		setDropAddress,
		setShippingMethodId,
		setPaymentMethodId
	}
})