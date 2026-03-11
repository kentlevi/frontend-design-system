import {
	build_empty_fields,
	get_profile_field_value,
} from '~/helpers/account/profile/personalForm.helper'
import type {
	PersonalFormProfile,
	PersonalFormState,
	ProfileFieldDefinition,
	UpdatePersonalFormPayload,
} from '~/types/account/profile'

export function map_profile_to_personal_form_state(
	field_definitions: ProfileFieldDefinition[],
	profile: PersonalFormProfile | null
): PersonalFormState {
	const user_field_values = profile?.user_field_values ?? []
	const fields = build_empty_fields(field_definitions)

	for (const field_definition of field_definitions) {
		fields[field_definition.field_key] = get_profile_field_value(
			user_field_values,
			field_definition.id
		)
	}

	return {
		fields,
	}
}

export function map_personal_form_to_payload(
	form_state: PersonalFormState
): UpdatePersonalFormPayload {
	return {
		fields: form_state.fields,
	}
}