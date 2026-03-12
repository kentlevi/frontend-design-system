import type { PreferenceState } from "~/types/account/preferences"

import type { ApiResponse } from "~/types/config/api";
/**
 * Cal backend to fetch user preferences
 */
export async function fetchPreferences(
): Promise<ApiResponse<PreferenceState>> {
	const { $api } = useNuxtApp();

	return $api.get(`/profile/preferences`)
}

/**
 * Call backend to update user preference
 */
export async function updatePreference(
	payload: Partial<PreferenceState>
): Promise<ApiResponse<PreferenceState>> {
	const { $api } = useNuxtApp();

	return $api.put(`/profile/preferences`, payload)
}