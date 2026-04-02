import type { AddressMap, AddressType, BillingAddress, DropAddress, ShippingAddress } from "~/types/address"

export const useAddressStore = defineStore('address', () => {
	const shipping_address = ref<ShippingAddress[]>([])
	const billing_address = ref<BillingAddress[]>([])
	const drop_address = ref<DropAddress[]>([])

	const address_refs: { [K in AddressType]: Ref<AddressMap[K][]> } = {
		shipping: shipping_address,
		billing: billing_address,
		drop: drop_address
	}

	function setAddresses<T extends AddressType>(
		type: T,
		value: AddressMap[T] | AddressMap[T][],
		mode: 'replace' | 'append' = 'replace'
	) {
		/** Always work with an array */
		const normalized_value = Array.isArray(value) ? value : [value]

		/** Get the exact matching ref */
		const target = address_refs[type]

		/** Replace existing data */
		if (mode === 'replace') {
			target.value = [...normalized_value]
			return
		}

		/** Append new data */
		target.value.push(...normalized_value)
	}

	function updateAddress<T extends AddressType>(
		type: T,
		value: AddressMap[T]
	) {
		const target = address_refs[type]
		const target_index = target.value.findIndex(address => address.id === value.id)

		if (target_index === -1) return

		target.value.splice(target_index, 1, value)
	}

	return {
		shipping_address,
		billing_address,
		drop_address,

		setAddresses,
		updateAddress,
	}
})