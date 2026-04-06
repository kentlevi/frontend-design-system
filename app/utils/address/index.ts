import { useAddressStore } from "~/stores/address"
import type { AddressType } from "~/types/address"

export function useAddressHelper() {
	const address_store = useAddressStore()

	function getAddressListByType(type: AddressType) {
		if (type === 'shipping') return address_store.shipping_address
		if (type === 'billing') return address_store.billing_address
		return address_store.drop_address
	}

	return {
		getAddressListByType
	}
}