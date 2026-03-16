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

/**
 * Map current form state into user field values
 */
export function mapPersonalFormToUserFieldValues(
	fields: ProfileFieldDefinition[],
	form_fields: Record<string, unknown>,
	profile: UserProfile | null
): UserFieldValue[] {
	return fields.map((field) => {
		/**
		 * Try to keep existing record metadata
		 */
		const existing_field_value = profile?.user_field_values.find(
			(user_field_value) => user_field_value.country_field_id === field.id
		)

		return {
			id: existing_field_value?.id ?? 0,
			user_profile_id: profile?.id ?? 0,
			country_field_id: field.id,
			value: String(form_fields[field.field_key] ?? ''),
		}
	})
}