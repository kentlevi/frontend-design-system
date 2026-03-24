/** Successful OTP request payload */
export interface SendEmailChangeOtpSuccessData {
	email: string
	token: string
	expires_in: string
	otp_sent: boolean
	cooldown_remaining: number
}

export interface EmailChangeRequestPayload extends Record<string, unknown> {
	email: string
	is_resend?: boolean
}

export interface VerifyEmailChangePayload extends Record<string, unknown> {
	email: string
	otp: string
}