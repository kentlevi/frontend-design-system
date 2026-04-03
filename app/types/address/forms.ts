import type { AddressLabel } from "./address"

/** Shared fields for all address forms */
export interface BaseAddressForm {
	country_id: number | null
	label: AddressLabel
	contact_name: string
	company: string
	email: string
	is_default: boolean
	notes: string
}

/** Shared fields for forms with address lines */
export interface AddressWithLinesForm extends BaseAddressForm {
	address_line_1: string
	address_line_2: string
	fields: DynamicFieldDefinition
	postcode: string
}

/** Shipping form */
export interface ShippingAddressForm extends AddressWithLinesForm {
	type: 'shipping'
	phone_number: string
}

/** Billing form */
export interface BillingAddressForm extends AddressWithLinesForm {
	type: 'billing'
}

/** Drop form */
export interface DropAddressForm extends BaseAddressForm {
	type: 'drop'
}

/** Map form type by address type */
export interface AddressFormMap {
	shipping: ShippingAddressForm
	billing: BillingAddressForm
	drop: DropAddressForm
}

export type AddressFormState = {
	shipping: AddressFormMap['shipping']
	billing: AddressFormMap['billing']
	drop: AddressFormMap['drop']
}

export type AddressFormField =
    | 'label'
	| 'contact_name'
	| 'company'
	| 'address_line_1'
	| 'address_line_2'
	| 'postcode'
	| 'phone_number'
    | 'email'
    | 'is_default'
	| 'notes'

/** Payload sent by the child when a field changes */
export type UpdateFieldPayload = {
	field: AddressFormField
	value: string | boolean
}

export type UpdateDynamicFieldPayload = {
	field_key: string
	value: string | number
}

/** Concrete forms that have address lines */
export type AddressLineForm = ShippingAddressForm | BillingAddressForm

export type DynamicFieldDefinition = Record<string, string | number>