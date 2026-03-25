import type { ApiResponse } from "~/types/config/api";

/**
 * Setup Password
 */
export async function setupPassword(
	payload: Record<string, string>
): Promise<ApiResponse> {
	const { $api } = useNuxtApp();

	return $api.put(`/profile/password/setup`, payload)
}