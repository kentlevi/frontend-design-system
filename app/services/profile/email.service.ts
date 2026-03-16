import type { ApiResponse } from "~/types/config/api";

/**
 * Send email change OTP
 */
export async function sendEmailChangeOTP(
	payload: Record<string, string>
): Promise<ApiResponse> {
	const { $api } = useNuxtApp()

	return $api.post('/profile/email/change-request', payload)
}