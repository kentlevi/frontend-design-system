import {
	buildEmptyFields,
	getProfileFieldValue,
} from '~/helpers/account/profile/personalForm.helper'
import type {
	PersonalFormProfile,
	PersonalFormState,
	ProfileFieldDefinition,
	UpdatePersonalFormPayload,
} from '~/types/account/profile'

export function mapProfileToPersonalFormState(
	field_definitions: ProfileFieldDefinition[],
	profile: PersonalFormProfile | null
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

export function mapPersonalFormToPayload(
	form_state: PersonalFormState
): UpdatePersonalFormPayload {
	return {
		fields: form_state.fields,
	}
}