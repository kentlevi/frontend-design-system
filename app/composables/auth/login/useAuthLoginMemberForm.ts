import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useAuthLoginStore } from '~/stores/auth/login.store'

export function useAuthLoginMemberForm() {
	const { t: translate } = useI18n()
	const auth_login_store = useAuthLoginStore()
	const {
		member_preferences,
		member_form,
		is_checkout_mode,
	} = storeToRefs(auth_login_store)

	function togglePassword() {
		auth_login_store.patchMemberPreferences({
			show_password: !member_preferences.value.show_password,
		})
	}

	function setKeepSignedIn(value: boolean) {
		auth_login_store.patchMemberPreferences({
			keep_signed_in: value,
		})
	}

	function setMemberEmail(value: string) {
		auth_login_store.patchMemberForm({
			email: value,
			email_error: '',
			invalid_credentials: false,
		})
	}

	function setMemberPassword(value: string) {
		auth_login_store.patchMemberForm({
			password: value,
			password_error: '',
			email_error: '',
			invalid_credentials: false,
		})
	}

	function openForgotPassword() {
		if (is_checkout_mode.value) {
			auth_login_store.patchCheckoutState({
				forgot_password_email: member_form.value.email,
				should_restore_login_modal: true,
				is_modal_open: false,
				is_forgot_password_modal_open: true,
			})
			return
		}

		auth_login_store.patchCardUi({
			is_forgot_password_modal_open: true,
		})
	}

	return {
		translate,
		show_password: computed(
			() => member_preferences.value.show_password
		),
		keep_signed_in: computed(
			() => member_preferences.value.keep_signed_in
		),
		member_email: computed(() => member_form.value.email),
		member_password: computed(() => member_form.value.password),
		member_email_error: computed(() => member_form.value.email_error),
		member_password_error: computed(
			() => member_form.value.password_error
		),
		member_invalid_credentials: computed(
			() => member_form.value.invalid_credentials
		),
		togglePassword,
		setKeepSignedIn,
		setMemberEmail,
		setMemberPassword,
		openForgotPassword,
	}
}