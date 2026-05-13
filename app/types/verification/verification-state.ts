export type VerificationContext =
	'idle' |
	'checkout_guest_contact' |
	'register' |
	'non_member_login'

export type VerificationSession = {
	email?: string | null
	order_number?: string | null
	token?: string | null
	expires_in?: string | number | Date | null
}

export type VerificationModalState = {
	context: VerificationContext
	is_open: boolean
}

export type VerificationState = {
	email: string
	code: string
	error: string
	resend_limit_reached: string
	resend_cooldown_until: number | null
	is_verifying: boolean
	verified_email: string
	session: VerificationSession | null
}