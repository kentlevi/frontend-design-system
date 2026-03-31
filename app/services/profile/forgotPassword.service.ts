import type { ApiResponse } from "~/types/config/api";

/**
 * Send password change link
 */
export async function sendLink(
	payload: Record<string, string>
): Promise<ApiResponse> {
	const { $api } = useNuxtApp()

	return $api.post('/profile/password/change-request', payload)
}