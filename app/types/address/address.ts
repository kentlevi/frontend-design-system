import type { CountryField } from "../country_field"

export type AddressType = keyof AddressMap
export type AddressLabel = 'home' | 'office' | 'client'

export interface BaseAddress {
	id: number
	user_id: number
	country_id: number
	label: AddressLabel
	contact_name: string
	company?: string
	email?: string
	is_default: boolean
	notes?: string
}

export interface AddressWithLines extends BaseAddress {
	address_line_1: string
	address_line_2?: string
	dynamic_fields: AddressFieldDefinition[]
	postcode: string
}

export interface ShippingAddress extends AddressWithLines {
	phone_number: string
	type: 'shipping'
}

export interface BillingAddress extends AddressWithLines {
	type: 'billing'
}

export interface DropAddress extends BaseAddress {
	type: 'drop'
}

export interface AddressMap {
	shipping: ShippingAddress
	billing: BillingAddress
	drop: DropAddress
}

export interface AddressDynamicFields extends CountryField {
	type: 'address'
}

export interface AddressFieldDefinition extends AddressDynamicFields {
	value: string
}