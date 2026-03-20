import type { UploadWithPresignedUrlPayload, UploadWithPresignedUrlResult } from "~/types/aws/aws";
import type { ApiResponse } from "~/types/config/api";

/**
 * Cal backend to get aws presigned url
 */
export async function getPresignedUrl(
	payload: UploadWithPresignedUrlPayload
): Promise<ApiResponse<UploadWithPresignedUrlResult>> {
	const { $api } = useNuxtApp();

	return $api.get(`/aws/pre-signed-url`,{
		params: payload
	})
}