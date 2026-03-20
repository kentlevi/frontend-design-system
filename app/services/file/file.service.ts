import type { ApiResponse } from "~/types/config/api";
import type { UploadPathResolvePayload, UploadPathResolveResult } from "~/types/file/file";

/**
 * Cal backend to get aws presigned url
 */
export async function getUploadPath(
	payload: UploadPathResolvePayload
): Promise<ApiResponse<UploadPathResolveResult>> {
	const { $api } = useNuxtApp();

	return $api.get(`/file/upload-path`,{
		params: payload
	})
}