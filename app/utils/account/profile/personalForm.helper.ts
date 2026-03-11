import type {
	PersonalFormFields,
	ProfileFieldDefinition,
} from '~/types/account/profile'

/**
 * Build empty fields object from backend field definitions
 */
export function buildEmptyFields(
	field_definitions: ProfileFieldDefinition[]
): PersonalFormFields {
	const fields: PersonalFormFields = {}

	for (const field_definition of field_definitions) {
		fields[field_definition.field_key] = ''
	}

	return fields
}

/**
 * Get existing user field value by field key
 */
export function getProfileFieldValue(
	user_field_values: Array<{
		country_field_id: number,
		value?: string
	}>,
	country_field_id: number
): string {
	const matched_field = user_field_values.find((user_field_value) => {
		return user_field_value.country_field_id === country_field_id
	})

	return matched_field?.value ?? ''
}