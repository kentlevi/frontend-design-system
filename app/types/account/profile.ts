import type { CountryField } from "../country_field"

/** Field definition returned by backend */
export interface ProfileFieldDefinition extends CountryField {
	type: 'user_detail'
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