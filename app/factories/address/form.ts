import type { AddressDynamicFields, AddressFieldDefinition, AddressFormMap, AddressMap, AddressType, AddressWithLinesForm, BaseAddressForm, BillingAddress, DropAddress, DynamicFieldDefinition, ShippingAddress } from "~/types/user-address"

/** Create a fresh default address form based on type */
export function addressFormDefaults<T extends AddressType>(
	type: T
): AddressFormMap[T] {
	/** Base defaults shared by all address forms */
	const base_defaults: BaseAddressForm = {
		id: null,
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
			id: address.id ?? null,
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
			id: address.id ?? null,
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
		id: address.id ?? null,
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

type MappedAddress = Omit<AddressMap[AddressType], 'id' | 'user_id' | 'country'>

export function mapFormToAddress(
	form: AddressFormMap[AddressType],
	dynamic_address_fields: AddressDynamicFields[]
): MappedAddress {

	const base = {
		id: form.id,
		country_id: form.country_id,
		label: form.label,
		contact_name: form.contact_name,
		company: form.company || undefined,
		email: form.email || undefined,
		is_default: form.is_default,
		notes: form.notes || undefined,
	}

	if (form.type === 'drop') {
		return { ...base, type: 'drop' } as Omit<DropAddress, 'id' | 'user_id' | 'country'>
	}

	const dynamic_fields = Object.entries(form.fields).reduce((acc, [field_key, field_value]) => {
		const dynamic_field = dynamic_address_fields.find((d) => d.field_key === field_key)

		if (!dynamic_field) return acc

		if (dynamic_field.input_type !== 'text') {
			const matched_option = dynamic_field.options?.find((option) => option.id === field_value)
			acc.push({ ...dynamic_field, value: matched_option?.value ?? String(field_value) })
			return acc
		}

		acc.push({ ...dynamic_field, value: String(field_value) })
		return acc
	}, [] as AddressFieldDefinition[])

	const base_with_lines = {
		...base,
		address_line_1: form.address_line_1,
		address_line_2: form.address_line_2 || undefined,
		dynamic_fields,
		postcode: form.postcode,
	}

	if (form.type === 'shipping') {
		return {
			...base_with_lines,
			type: 'shipping',
			phone_number: form.phone_number || undefined,
		} as Omit<ShippingAddress, 'id' | 'user_id' | 'country'>
	}

	return { ...base_with_lines, type: 'billing' } as Omit<BillingAddress, 'id' | 'user_id' | 'country'>
}