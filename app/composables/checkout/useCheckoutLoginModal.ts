import { storeToRefs } from 'pinia'
import { computed, watch, type Ref } from 'vue'
import { useAuthLoginStore } from '~/stores/auth/login.store'

export function useCheckoutLoginModal(
	model_value: Ref<boolean>,
	emit_update_model_value: (value: boolean) => void
) {
	const auth_login_store = useAuthLoginStore()
	const { checkout_state } = storeToRefs(auth_login_store)

	function resetLoginCardState() {
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
	}

	function closeCheckoutModal() {
		auth_login_store.patchCheckoutState({
			is_modal_open: false,
			modal_mode: 'login',
			is_forgot_password_modal_open: false,
			forgot_password_email: '',
			should_restore_login_modal: false,
		})
	}

	function openCheckoutModal() {
		auth_login_store.patchContextState({
			context: 'checkout',
		})
		auth_login_store.patchCheckoutState({
			is_modal_open: true,
			modal_mode: 'login',
			is_forgot_password_modal_open: false,
			forgot_password_email: '',
			should_restore_login_modal: false,
		})
		resetLoginCardState()
	}

	function restoreLoginCard() {
		auth_login_store.patchCheckoutState({
			is_forgot_password_modal_open: false,
			should_restore_login_modal: false,
			modal_mode: 'login',
			is_modal_open: true,
		})
	}

	function handleModalValueChange(value: boolean) {
		if (value) {
			openCheckoutModal()
			return
		}

		closeCheckoutModal()
		resetLoginCardState()
	}

	function handleForgotPasswordModalChange(value: boolean) {
		auth_login_store.patchCheckoutState({
			is_forgot_password_modal_open: value,
		})

		if (!value && checkout_state.value.should_restore_login_modal) {
			restoreLoginCard()
		}
	}

	function openLoginCard() {
		auth_login_store.patchCheckoutState({
			modal_mode: 'login',
		})
	}

	watch(
		model_value,
		(is_open) => {
			if (is_open) {
				openCheckoutModal()
				return
			}

			if (!checkout_state.value.is_forgot_password_modal_open) {
				closeCheckoutModal()
				resetLoginCardState()
			}
		},
		{ immediate: true }
	)

	watch(
		() => checkout_state.value.is_modal_open,
		(is_open) => {
			if (is_open === model_value.value) return
			emit_update_model_value(is_open)
		}
	)

	return {
		checkout_modal_mode: computed(() => checkout_state.value.modal_mode),
		is_checkout_forgot_password_modal_open: computed(
			() => checkout_state.value.is_forgot_password_modal_open
		),
		checkout_forgot_password_email: computed(
			() => checkout_state.value.forgot_password_email
		),
		handleModalValueChange,
		handleForgotPasswordModalChange,
		openLoginCard,
	}
}