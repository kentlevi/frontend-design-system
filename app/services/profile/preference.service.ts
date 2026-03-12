import type { PreferenceState } from "~/types/account/preferences"

import type { ApiResponse } from "~/types/config/api";

const { $api } = useNuxtApp();
/**
 * Cal backend to fetch user preferences
 */
export async function fetchPreferences(
): Promise<ApiResponse<PreferenceState>> {
	return $api.get(`/profile/preferences`)
}

/**
 * Call backend to update user preference
 */
export async function updatePreference(
	payload: Partial<PreferenceState>
): Promise<ApiResponse<PreferenceState>> {
	return $api.put(`/profile/preferences`, payload)
}