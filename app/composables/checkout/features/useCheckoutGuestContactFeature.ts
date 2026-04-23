import { storeToRefs } from 'pinia'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import {
	getAuthResponseCode,
	getAuthErrorMessage,
	getAuthResponseMessage,
	isValidAuthEmail,
	getAuthResponseSocialProvider,
} from '~/helpers/auth/auth.helper'
import {
	getCooldownSecondsFromResponse,
	isTimestampExpired,
} from '~/composables/auth/verification/useVerificationCooldown'
import { useCheckoutExperienceFeatureContext } from '~/composables/checkout/checkoutExperienceFeatureContext'
import { useDismissibleTooltip } from '~/composables/checkout/features/useDismissibleTooltip'
import {
	loginMemberUser,
	requestNonMemberLoginVerification,
} from '~/services/auth/auth.service'
import {
	GUEST_LOGIN_TOAST_PENDING_KEY,
	HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
	LOGIN_SUCCESS_TOAST_TRIGGER_EVENT,
} from '~/data/home/onboarding'
import { useLoadingOverlayStore } from '~/stores/loading_overlay'
import {
	createVerificationModalState,
	createVerificationState,
	useVerificationStore,
} from '~/stores/verification.store'
import { useToastStore } from '~/stores/toast'

function resolveCooldownUntil(response: unknown): number | null {
	const cooldown_seconds = getCooldownSecondsFromResponse(response)
	return cooldown_seconds > 0
		? Date.now() + cooldown_seconds * 1000
		: null
}

export function useCheckoutGuestContactFeature() {
	const { t: translate } = useI18n()
	const {
		is_member,
		email,
		email_tooltip_open,
		toggleEmailTooltip,
		openLoginModal,
	} = useCheckoutExperienceFeatureContext()
	const loading_overlay_store = useLoadingOverlayStore()
	const toast_store = useToastStore()
	const verification_store = useVerificationStore()
	const { verification_state } = storeToRefs(verification_store)
	const email_tooltip_ref = ref<HTMLElement | null>(null)
	const is_email_already_registered_modal_open = ref(false)
	const is_registered_email_forgot_password_modal_open = ref(false)
	const should_restore_registered_email_modal = ref(false)
	const registered_email_password = ref('')
	const registered_email_password_error = ref('')
	const registered_email_password_visible = ref(false)
	const CHECKOUT_GUEST_VERIFICATION_LOADING_KEY =
		'checkout_guest_contact_verification'
	const registered_email_blank_message = translate(
		'auth.login.validation.fieldBlank'
	)
	const registered_email_credentials_mismatch_message = translate(
		'auth.login.validation.credentialsMismatch'
	)

	useDismissibleTooltip(email_tooltip_ref, email_tooltip_open)

	function openVerificationModal() {
		verification_store.patchModalState({
			context: 'checkout_guest_contact',
			is_open: true,
		})
	}

	function resetVerificationState() {
		verification_store.patchModalState(createVerificationModalState())
		verification_store.patchVerificationState(createVerificationState())
	}

	function resetRegisteredEmailState() {
		registered_email_password.value = ''
		registered_email_password_error.value = ''
		registered_email_password_visible.value = false
	}

	function closeEmailAlreadyRegisteredModal() {
		is_email_already_registered_modal_open.value = false
		should_restore_registered_email_modal.value = false
		resetRegisteredEmailState()
	}

	function setEmailAlreadyRegisteredModalOpen(value: boolean) {
		if (value) {
			is_email_already_registered_modal_open.value = true
			return
		}

		closeEmailAlreadyRegisteredModal()
	}

	function openEmailAlreadyRegisteredModal(_social_provider: string) {
		verification_store.patchModalState({
			is_open: false,
		})
		verification_store.patchVerificationState({
			code: '',
			error: '',
			resend_limit_reached: '',
			resend_cooldown_until: null,
			session: null,
		})
		is_registered_email_forgot_password_modal_open.value = false
		should_restore_registered_email_modal.value = false
		resetRegisteredEmailState()
		is_email_already_registered_modal_open.value = true
	}

	function onRegisteredEmailPasswordInput(value: string) {
		registered_email_password.value = value
		registered_email_password_error.value = ''
	}

	function setRegisteredEmailPasswordVisible(value: boolean) {
		registered_email_password_visible.value = value
	}

	function openRegisteredEmailForgotPasswordModal() {
		should_restore_registered_email_modal.value = true
		is_email_already_registered_modal_open.value = false
		is_registered_email_forgot_password_modal_open.value = true
	}

	function onRegisteredEmailForgotPasswordModalChange(value: boolean) {
		is_registered_email_forgot_password_modal_open.value = value

		if (!value && should_restore_registered_email_modal.value) {
			void restoreRegisteredEmailModal()
		}
	}

	async function restoreRegisteredEmailModal() {
		is_registered_email_forgot_password_modal_open.value = false
		should_restore_registered_email_modal.value = false
		await nextTick()
		is_email_already_registered_modal_open.value = true
	}

	async function continueWithRegisteredEmail() {
		const password_value = registered_email_password.value.trim()

		if (!password_value) {
			registered_email_password_error.value = registered_email_blank_message
			return
		}

		const response = await loginMemberUser({
			email: email.value.trim(),
			password: registered_email_password.value,
			remember_me: false,
		})

		if (!response.success) {
			registered_email_password_error.value =
				registered_email_credentials_mismatch_message
			return response
		}

		if (import.meta.client) {
			window.localStorage.setItem(
				HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
				'1'
			)
			window.localStorage.removeItem(GUEST_LOGIN_TOAST_PENDING_KEY)
			window.dispatchEvent(
				new CustomEvent(LOGIN_SUCCESS_TOAST_TRIGGER_EVENT)
			)
		}

		is_registered_email_forgot_password_modal_open.value = false
		closeEmailAlreadyRegisteredModal()
		resetVerificationState()
		return response
	}

	function setGuestEmail(value: string) {
		email.value = value

		if (is_member.value) return

		const normalized_value = value.trim().toLowerCase()
		const verified_email =
			verification_state.value.verified_email.trim().toLowerCase()
		const session_email =
			(verification_state.value.session?.email || '').trim().toLowerCase()

		if (verified_email && verified_email !== normalized_value) {
			verification_store.patchVerificationState({
				verified_email: '',
			})
		}

		if (session_email && session_email !== normalized_value) {
			verification_store.patchModalState({
				is_open: false,
			})
			verification_store.patchVerificationState({
				code: '',
				error: '',
				resend_limit_reached: '',
				resend_cooldown_until: null,
				session: null,
			})
		}
	}

	async function handleGuestEmailBlur() {
		if (is_member.value) return

		const email_value = email.value.trim()
		if (!email_value || !isValidAuthEmail(email_value)) return

		const normalized_email = email_value.toLowerCase()
		const verified_email =
			verification_state.value.verified_email.trim().toLowerCase()

		if (verified_email === normalized_email) return

		const session_email =
			(verification_state.value.session?.email || '').trim().toLowerCase()
		const session_token =
			(verification_state.value.session?.token || '').trim()
		const can_reuse_session =
			session_email === normalized_email &&
			session_token !== '' &&
			!isTimestampExpired(verification_state.value.session?.expires_in)

		if (can_reuse_session) {
			verification_store.patchVerificationState({
				email: email_value,
				code: '',
				error: '',
				resend_limit_reached: '',
			})
			openVerificationModal()
			return
		}

		try {
			verification_store.patchVerificationState({
				email: email_value,
				code: '',
				error: '',
				resend_limit_reached: '',
				is_verifying: true,
			})
			loading_overlay_store.startLoading(
				CHECKOUT_GUEST_VERIFICATION_LOADING_KEY,
				{
					label: translate('checkout.guest.verifyingTitle'),
					testId: 'checkout-guest-contact-verification-loading-overlay',
					position: 'fixed',
				}
			)

			const response = await requestNonMemberLoginVerification(
				{
					email: email_value,
					order_number: '',
					is_resend: false,
				},
				{
					is_checkout: true,
				}
			)

			if (!response.success) {
				const response_code = getAuthResponseCode(response)
				const social_provider = getAuthResponseSocialProvider(response)
				const response_message =
					getAuthResponseMessage(response) ||
					translate('auth.guestVerification.requestFailed')

				if (response_code === 'max_resend_reached') {
					verification_store.patchVerificationState({
						email: email_value,
						code: '',
						error: '',
						resend_limit_reached: response_message,
						resend_cooldown_until: resolveCooldownUntil(response),
						session: null,
					})
					openVerificationModal()
					return response
				}

				if (response_code === 'already_registered') {
					openEmailAlreadyRegisteredModal(social_provider)
					return response
				}

				toast_store.showToastWithTimer({
					message: response_message,
					tone: 'error',
				})
				return response
			}

			verification_store.patchVerificationState({
				email: email_value,
				code: '',
				error: '',
				resend_limit_reached: '',
				resend_cooldown_until: resolveCooldownUntil(response),
				session: {
					email: email_value,
					token: response.data?.token || null,
					expires_in: response.data?.expires_in || null,
				},
			})
			openVerificationModal()
			return response
		} catch (error) {
			toast_store.showToastWithTimer({
				message:
					getAuthErrorMessage(error) ||
					translate('auth.guestVerification.requestFailed'),
				tone: 'error',
			})
			console.error(error)
			return
		} finally {
			loading_overlay_store.stopLoading(
				CHECKOUT_GUEST_VERIFICATION_LOADING_KEY
			)
			verification_store.patchVerificationState({
				is_verifying: false,
			})
		}
	}

	watch(is_member, (value) => {
		if (!value) return

		is_registered_email_forgot_password_modal_open.value = false
		closeEmailAlreadyRegisteredModal()
		resetVerificationState()
	})

	onBeforeUnmount(() => {
		loading_overlay_store.stopLoading(
			CHECKOUT_GUEST_VERIFICATION_LOADING_KEY
		)
		resetVerificationState()
		is_registered_email_forgot_password_modal_open.value = false
		closeEmailAlreadyRegisteredModal()
	})

	return {
		translate,
		is_member,
		email,
		email_tooltip_open,
		email_tooltip_ref,
		toggleEmailTooltip,
		openLoginModal,
		is_email_already_registered_modal_open,
		registered_email_password,
		registered_email_password_error,
		registered_email_password_visible,
		is_registered_email_forgot_password_modal_open,
		setEmailAlreadyRegisteredModalOpen,
		onRegisteredEmailPasswordInput,
		setRegisteredEmailPasswordVisible,
		continueWithRegisteredEmail,
		openRegisteredEmailForgotPasswordModal,
		onRegisteredEmailForgotPasswordModalChange,
		restoreRegisteredEmailModal,
		setGuestEmail,
		handleGuestEmailBlur,
	}
}