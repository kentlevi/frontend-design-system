import type { AddressFormMap, AddressType, AddressWithLinesForm, BaseAddressForm } from "~/types/address"

/** Create a fresh default address form based on type */
export function addressFormDefaults<T extends AddressType>(
	type: T
): AddressFormMap[T] {
	/** Base defaults shared by all address forms */
	const base_defaults: BaseAddressForm = {
		country_id: null,
		label: 'home',
		contact_name: '',
		company: '',
		is_default: false,
		notes: '',
		email: '',
		fields: {},
	}

	/** Defaults for address forms with lines */
	const line_defaults: AddressWithLinesForm = {
		...base_defaults,
		address_line_1: '',
		address_line_2: '',
		postcode: '',
	}

	switch (type) {
		case 'shipping':
			return {
				...line_defaults,
				type: 'shipping',
				phone_number: '',
			} as AddressFormMap[T]

		case 'billing':
			return {
				...line_defaults,
				type: 'billing',
			} as AddressFormMap[T]

		case 'drop':
			return {
				...base_defaults,
				type: 'drop',
			} as AddressFormMap[T]

		default:
			throw new Error(`Unsupported address type: ${type}`)
	}
}