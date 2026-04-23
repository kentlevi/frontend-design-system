import { useAuthLoginStore } from '~/stores/auth/login.store'

export function useAuthLoginPage() {
	const { t: translate } = useI18n()
	const auth_login_store = useAuthLoginStore()

	auth_login_store.patchContextState({
		context: 'page',
	})
	auth_login_store.patchCheckoutState({
		is_modal_open: false,
		modal_mode: 'login',
		is_forgot_password_modal_open: false,
		forgot_password_email: '',
		should_restore_login_modal: false,
	})
	auth_login_store.patchMemberPreferences({
		member_type: 'member',
		keep_signed_in: false,
		show_password: false,
	})
	auth_login_store.patchCardUi({
		is_forgot_password_modal_open: false,
		is_verification_modal_open: false,
		is_checking_guest_order: false,
		is_signing_in_member: false,
	})
	auth_login_store.patchMemberForm({
		email: '',
		password: '',
		email_error: '',
		password_error: '',
		invalid_credentials: false,
	})
	auth_login_store.patchNonMemberForm({
		email: '',
		order_number: '',
		email_error: '',
		email_has_error: false,
		order_error: '',
	})
	auth_login_store.patchGuestVerification({
		is_verifying: false,
		resend_cooldown_remaining: 0,
		email: '',
		order_number: '',
		token: '',
		code: '',
		error: '',
		resend_limit_reached: '',
		session: null,
	})

	return {
		translate,
	}
}