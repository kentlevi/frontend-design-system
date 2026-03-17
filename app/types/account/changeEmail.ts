/** Successful OTP request payload */
export interface SendEmailChangeOtpSuccessData {
	email: string
	token: string
	expires_in: string
	otp_sent: boolean
	cooldown_remaining: number
}