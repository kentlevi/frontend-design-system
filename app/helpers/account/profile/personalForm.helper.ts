import type {
	PersonalFormFields,
	ProfileFieldDefinition,
	ProfileUserFieldValue,
} from '~/types/account/profile'

export function build_empty_fields(
	field_definitions: ProfileFieldDefinition[]
): PersonalFormFields {
	const fields: PersonalFormFields = {}

	for (const field_definition of field_definitions) {
		fields[field_definition.field_key] = ''
	}

	return fields
}

export function get_profile_field_value(
	user_field_values: ProfileUserFieldValue[],
	country_field_id: number
): string {
	const matched_field = user_field_values.find((user_field_value) => {
		return user_field_value.country_field_id === country_field_id
	})

	return matched_field?.value ?? ''
}