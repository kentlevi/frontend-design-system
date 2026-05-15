import type { CountryField } from '~/types/country_field'

export type OrderAddressType = keyof OrderAddressMap
export type OrderAddressItem = OrderAddressMap[OrderAddressType]
export type OrderAddressLabel = 'home' | 'office' | 'client'

export interface BaseOrderAddress {
	id: number
	order_id: number
	label: OrderAddressLabel
	contact_name: string
	company?: string
	email: string
}

export interface OrderAddressWithLines extends BaseOrderAddress {
	address_line_1: string
	address_line_2?: string
	postcode: string
	dynamic_fields: OrderAddressFieldDefinition[]
}

export interface OrderAddressDynamicFields extends CountryField {
	type: 'address'
}

export interface OrderAddressFieldDefinition extends OrderAddressDynamicFields {
	value: string
}

export interface OrderShippingAddress extends OrderAddressWithLines {
	type: 'shipping'
	phone_number: string
}

export interface OrderBillingAddress extends OrderAddressWithLines {
	type: 'billing'
}

export interface OrderDropAddress extends BaseOrderAddress {
	type: 'drop'
}

export interface OrderAddressMap {
	shipping: OrderShippingAddress
	billing: OrderBillingAddress
	drop: OrderDropAddress
}