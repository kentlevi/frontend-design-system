import type {
	ProfileFieldDefinition,
	UpdatePersonalFormPayload,
} from '~/types/account/profile'

import { useCountry } from '~/composables/app/useCountry';

/**
 * Fetch dynamic personal field definitions
 */
export async function fetchPersonalFieldDefinitions(): Promise<ProfileFieldDefinition[]> {
	const api = useApi()
	const { apiCountry } = useCountry()

	const response = await api(`/${apiCountry.value}/profile/fields`, {
		method: 'GET',
	})

	/** Adjust this based on your actual API response shape */
	return response.data ?? []
}

/**
 * Update personal form fields
 */
export async function updatePersonalForm(
	payload: UpdatePersonalFormPayload
): Promise<unknown> {
	const api = useApi()
	const { apiCountry } = useCountry()

	return await api(`/${apiCountry.value}/profile-fields`, {
		method: 'PUT',
		body: payload,
	})
}