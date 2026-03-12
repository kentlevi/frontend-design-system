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

/** Saved user field value from the profile payload */
export interface ProfileUserFieldValue {
	country_field_id: number
	value?: string
}

/** Minimal user profile shape required by the personal form */
export interface PersonalFormProfile {
	user_field_values?: ProfileUserFieldValue[]
}

/** Generic form values keyed by field_key */
export type PersonalFormFields = Record<string, string>

/** Personal form state */
export interface PersonalFormState {
	fields: PersonalFormFields
}

/** Submit payload */
export interface UpdatePersonalFormPayload extends Record<string, unknown> {
	fields: PersonalFormFields
}

/** Personal form update response */
export interface PersonalFormApiResponse extends Record<string, unknown> {
	message?: string
}

export type AccountUnit = 'millimeter' | 'inch'

export interface AccountMockUser {
	firstName: string
	lastName: string
	email: string
}