import type { ApiResponse } from "~/types/config/api"

export async function changePassword(
	payload: Record<string, string>
): Promise<ApiResponse> {
	const { $api } = useNuxtApp()

	return $api.put('/profile/password', payload)
}