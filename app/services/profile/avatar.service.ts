import type { ApiResponse } from "~/types/config/api";

/**
 * Cal backend to get aws presigned url
 */
export async function saveAvatar(
	file_name: string
): Promise<ApiResponse> {
	const { $api } = useNuxtApp();

	return $api.put(`/profile/avatar/save`, { file_name })
}

/**
 * Delete profile avatar
 */
export async function deleteAvatar(
): Promise<ApiResponse> {
	const { $api } = useNuxtApp();

	return $api.delete(`/profile/avatar/delete`)
}