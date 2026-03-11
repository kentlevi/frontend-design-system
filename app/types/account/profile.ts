/** Supported backend field group */
export type ProfileFieldGroup = 'user_detail' | 'address'

/** Supported backend input types */
export type ProfileInputType =
	| 'text'
	| 'select'
	| 'radio'
	| 'checkbox'
	| 'date'
	| 'number'

/** Field definition returned by backend */
export interface ProfileFieldDefinition {
	id: number
	country_id: number
	field_key: string
	field_label: string
	type: ProfileFieldGroup
	input_type: ProfileInputType
	sort_order: number
	is_required: boolean
}

/** Generic form values keyed by field_key */
export type PersonalFormFields = Record<string, string>

/** Personal form state */
export interface PersonalFormState {
	fields: PersonalFormFields
}

/** Submit payload */
export interface UpdatePersonalFormPayload {
	fields: PersonalFormFields
}