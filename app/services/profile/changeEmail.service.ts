import type { SendEmailChangeOtpSuccessData, EmailChangeRequestPayload, VerifyEmailChangePayload } from "~/types/account/changeEmail";
import type { ApiResponse } from "~/types/config/api";

/**
 * Send email change OTP
 */
export async function sendEmailChangeOTP(
	payload: EmailChangeRequestPayload
): Promise<ApiResponse<SendEmailChangeOtpSuccessData>> {
	const { $api } = useNuxtApp()

	return $api.post('/profile/email/change-request', payload)
}

/** Verify Otp sent */
export async function verifyEmailChangeOtp(
	payload: VerifyEmailChangePayload
): Promise<ApiResponse<SendEmailChangeOtpSuccessData>> {
	const { $api } = useNuxtApp()

	return $api.post('/profile/email/change-verify', payload)
}