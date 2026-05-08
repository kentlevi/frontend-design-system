import type { ProfileFieldDefinition } from '~/types/account/profile'
import type { ApiResponse } from '~/types/config/api';

/**
 * Fetch dynamic personal field definitions
 */
export async function fetchDynamicFields(
): Promise<ApiResponse<ProfileFieldDefinition[]>> {
	const { $api } = useNuxtApp();

	return $api.get(`/profile/fields`)
}