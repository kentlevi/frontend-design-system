import type {
	PersonalFormApiResponse,
	ProfileFieldDefinition,
	UpdatePersonalFormPayload,
} from '~/types/account/profile'

import { useCountry } from '~/composables/app/country/useCountry';

/**
 * Fetch dynamic personal field definitions
 */
export async function fetchPersonalFieldDefinitions(): Promise<ProfileFieldDefinition[]> {
	const api = useApi()
	const { apiCountry } = useCountry()

	const response = await api(`/${apiCountry.value}/profile/fields`, {
		method: 'GET',
	})

	return Array.isArray(response?.data) ? response.data : []
}

/**
 * Update personal form fields
 */
export async function updatePersonalForm(
	payload: UpdatePersonalFormPayload
): Promise<PersonalFormApiResponse> {
	const api = useApi()
	const { apiCountry } = useCountry()

	const response = await api(`/${apiCountry.value}/profile/fields`, {
		method: 'PUT',
		body: payload,
	})

	return (response ?? {}) as PersonalFormApiResponse
}