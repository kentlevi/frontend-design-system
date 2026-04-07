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

	/** Sort one address list and keep default entries first */
	function sortAddressesByDefault<T extends AddressType>(type: T) {
		const target = address_refs[type]

		target.value.sort((a, b) => {
			return Number(b.is_default) - Number(a.is_default)
		})
	}

	function setAddresses<T extends AddressType>(
		type: T,
		value: AddressMap[T] | AddressMap[T][],
		mode: 'replace' | 'append' | 'prepend' = 'replace'
	) {
		/** Always work with an array */
		const normalized_value = Array.isArray(value) ? value : [value]

		/** Get the exact matching ref */
		const target = address_refs[type]

		/** Keep one default address per type when we append/prepend */
		if (mode !== 'replace') {
			const has_default = normalized_value.some((address) => address.is_default)

			if (has_default) {
				target.value.forEach((address) => {
					address.is_default = false
				})
			}
		}

		/** Replace existing data */
		if (mode === 'replace') {
			target.value = [...normalized_value]
		} else if (mode === 'prepend') {
			/** Prepend new data */
			target.value.unshift(...normalized_value)
		} else {
			/** Append new data */
			target.value.push(...normalized_value)
		}

		sortAddressesByDefault(type)
	}

	function deleteAddress<T extends AddressType>(
		type: T,
		id: number
	) {
		const target = address_refs[type]

		target.value = target.value.filter(address => address.id !== id)

		sortAddressesByDefault(type)
	}

	function updateAddress<T extends AddressType>(
		type: T,
		value: AddressMap[T]
	) {
		const target = address_refs[type]
		const target_index = target.value.findIndex(address => address.id === value.id)

		if (target_index === -1) return

		target.value.splice(target_index, 1, value)
		sortAddressesByDefault(type)
	}

	function setDefault<T extends AddressType>(
		type: T,
		id: number
	) {
		const target = address_refs[type]

		target.value = target.value.map((address) => ({
			...address,
			is_default: address.id === id
		}))

		sortAddressesByDefault(type)
	}

	return {
		shipping_address,
		billing_address,
		drop_address,

		sortAddressesByDefault,
		setAddresses,
		updateAddress,
		deleteAddress,
		setDefault,
	}
})