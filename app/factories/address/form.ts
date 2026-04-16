import type { AddressDynamicFields, AddressFormMap, AddressMap, AddressType, AddressWithLinesForm, BaseAddressForm, DynamicFieldDefinition } from "~/types/user-address"

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
	}

	/** Defaults for address forms with lines */
	const line_defaults: AddressWithLinesForm = {
		...base_defaults,
		address_line_1: '',
		address_line_2: '',
		fields: {},
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

export function mapAddressToForm(
	address: AddressMap[AddressType],
	dynamic_address_fields: AddressDynamicFields[]
): AddressFormMap[AddressType] {

	if (address.type === 'drop') {
		return {
			type: 'drop',
			country_id: address.country_id,
			label: address.label,
			contact_name: address.contact_name,
			company: address.company ?? '',
			email: address.email ?? '',
			is_default: address.is_default,
			notes: address.notes ?? '',
		} as AddressFormMap['drop']
	}

	/**
	 * Resolve dynamic fields that have a value of option_id
	 * else return text_value
	 */
	const fields = address.dynamic_fields.reduce((acc, field) => {
		if (field.input_type !== 'text') {
			const dynamic_field = dynamic_address_fields.find((dynamic_field) => {
				return dynamic_field.field_key === field.field_key
			})

			const matched_option = dynamic_field?.options?.find((option) => {
				return option.value === (field.value ?? '')
			})

			acc[field.field_key] = matched_option?.id ?? field.value ?? ''
			return acc
		}

		acc[field.field_key] = field.value ?? ''
		return acc
	}, {} as DynamicFieldDefinition)

	if (address.type === 'shipping') {
		return {
			type: 'shipping',
			country_id: address.country_id,
			label: address.label,
			contact_name: address.contact_name,
			company: address.company ?? '',
			email: address.email ?? '',
			is_default: address.is_default,
			notes: address.notes ?? '',
			address_line_1: address.address_line_1,
			address_line_2: address.address_line_2 ?? '',
			fields,
			postcode: address.postcode,
			phone_number: address.phone_number ?? '',
		} as AddressFormMap['shipping']
	}

	return {
		type: 'billing',
		country_id: address.country_id,
		label: address.label,
		contact_name: address.contact_name,
		company: address.company ?? '',
		email: address.email ?? '',
		is_default: address.is_default,
		notes: address.notes ?? '',
		address_line_1: address.address_line_1,
		address_line_2: address.address_line_2 ?? '',
		fields,
		postcode: address.postcode,
	} as AddressFormMap['billing']
}