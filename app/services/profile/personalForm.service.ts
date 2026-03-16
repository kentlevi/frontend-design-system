import type {
	PersonalFormApiResponse,
	ProfileFieldDefinition,
	UpdatePersonalFormPayload,
} from '~/types/account/profile'
import type { ApiResponse } from '~/types/config/api';

/**
 * Fetch dynamic personal field definitions
 */
export async function fetchPersonalFieldDefinitions(
): Promise<ApiResponse<ProfileFieldDefinition[]>> {
	const { $api } = useNuxtApp();

	return $api.get(`/profile/fields`)
}

/**
 * Update personal form fields
 */
export async function updatePersonalForm(
	payload: UpdatePersonalFormPayload
): Promise<ApiResponse<PersonalFormApiResponse>> {
	const { $api } = useNuxtApp();

	return $api.put(`/profile/fields`, payload)
}