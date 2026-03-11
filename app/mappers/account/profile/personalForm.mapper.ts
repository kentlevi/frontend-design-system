import {
	buildEmptyFields,
	getProfileFieldValue,
} from '~/utils/account/profile/personalForm.helper'
import type {
	PersonalFormState,
	ProfileFieldDefinition,
	UpdatePersonalFormPayload,
} from '~/types/account/profile'

/**
 * Map backend schema + saved user values into editable form state
 */
export function mapProfileToPersonalFormState(
	field_definitions: ProfileFieldDefinition[],
	profile: {
		user_field_values?: Array<{
			country_field_id: number
			value?: string
		}>
	} | null
): PersonalFormState {
	const user_field_values = profile?.user_field_values ?? []
	const fields = buildEmptyFields(field_definitions)

	for (const field_definition of field_definitions) {
		fields[field_definition.field_key] = getProfileFieldValue(
			user_field_values,
			field_definition.id
		)
	}

	return {
		fields,
	}
}

/**
 * Map current form draft into backend payload
 */
export function mapPersonalFormToPayload(
	form_state: PersonalFormState
): UpdatePersonalFormPayload {
	return {
		fields: form_state.fields,
	}
}