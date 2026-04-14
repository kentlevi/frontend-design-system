import type { LoginMemberType } from '~/types/auth/auth'

export type AuthLoginContext = 'page' | 'checkout'
export type CheckoutAuthModalMode = 'login' | 'register'

export type NonMemberVerificationSession = {
	email?: string | null
	order_number?: string | null
	token?: string | null
	expires_in?: string | number | Date | null
}

export type ContextState = {
	context: AuthLoginContext
}

export type CheckoutState = {
	modal_mode: CheckoutAuthModalMode
	is_modal_open: boolean
	is_forgot_password_modal_open: boolean
	forgot_password_email: string
	should_restore_login_modal: boolean
}

export type MemberPreferencesState = {
	member_type: LoginMemberType
	keep_signed_in: boolean
	show_password: boolean
}

export type CardUiState = {
	is_forgot_password_modal_open: boolean
	is_verification_modal_open: boolean
	is_checking_guest_order: boolean
	is_signing_in_member: boolean
}

export type MemberFormState = {
	email: string
	password: string
	email_error: string
	password_error: string
	invalid_credentials: boolean
}

export type NonMemberFormState = {
	email: string
	order_number: string
	email_error: string
	email_has_error: boolean
	order_error: string
}

export type GuestVerificationState = {
	is_verifying: boolean
	resend_cooldown_remaining: number
	email: string
	order_number: string
	token: string
	code: string
	error: string
	resend_limit_reached: string
	session: NonMemberVerificationSession | null
}