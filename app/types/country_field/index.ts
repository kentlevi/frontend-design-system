import type { CountryFieldOption } from "../country_field_option"

/** Supported backend input types */
export type InputType =
	| 'text'
	| 'select'
	| 'radio'
	| 'checkbox'
	| 'date'
	| 'number'

export interface CountryField {
	id: number
	country_id: number
	field_key: string
	field_label: string
	sort_order: number
	type: 'address' | 'user_detail'
	input_type: InputType
	is_required: boolean
	options?: CountryFieldOption[]
}