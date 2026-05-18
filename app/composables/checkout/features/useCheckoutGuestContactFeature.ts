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
import { useEmailChangeStore } from '~/stores/checkout/email-change.store'
import { useLoadingOverlayStore } from '~/stores/loading_overlay'
import { useMainCheckOutStore } from '~/stores/checkout/index.store'
import {
	createVerificationModalState,
	createVerificationState,
	useVerificationStore,
} from '~/stores/verification.store'
import { useToastStore } from '~/stores/toast'
import { useUsersStore } from '~/stores/users/users.store'
import { loadAddresses } from '~/services/user-address/user-address.service'
import { ensureDynamicFields } from '~/services/address-dynamic-fields/dynamic-fields.service'

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
		email: checkout_email,
		email_tooltip_open,
		toggleEmailTooltip,
		openLoginModal,
	} = useCheckoutExperienceFeatureContext()
	const loading_overlay_store = useLoadingOverlayStore()
	const toast_store = useToastStore()
	const checkout_store = useMainCheckOutStore()
	const verification_store = useVerificationStore()
	const user_store = useUsersStore()
	const email_change_store = useEmailChangeStore()
	const { verification_state, modal_state: verification_modal_state } =
		storeToRefs(verification_store)
	const { state, is_authenticated, role_code } = storeToRefs(user_store)
	const email = ref(checkout_email.value)
	const email_tooltip_ref = ref<HTMLElement | null>(null)
	const email_field_ref = ref<HTMLElement | null>(null)
	const email_input_ref = ref<{ focusInput: () => void } | null>(null)
	const is_guest_email_editing = ref(false)
	const email_before_edit = ref('')
	const is_finalizing_guest_email_edit = ref(false)
	const is_email_already_registered_modal_open = ref(false)
	const is_registered_email_forgot_password_modal_open = ref(false)
	const should_restore_registered_email_modal = ref(false)
	const registered_email_password = ref('')
	const registered_email_password_error = ref('')
	const registered_email_password_visible = ref(false)
	const registered_email_social_provider = ref('')
	const CHECKOUT_GUEST_VERIFICATION_LOADING_KEY =
		'checkout_guest_contact_verification'
	const registered_email_blank_message = translate(
		'auth.login.validation.fieldBlank'
	)
	const registered_email_credentials_mismatch_message = translate(
		'auth.login.validation.credentialsMismatch'
	)

	useDismissibleTooltip(email_tooltip_ref, email_tooltip_open)

	const is_authenticated_non_member = computed(
		() => is_authenticated.value && role_code.value === 'NON_MEMBER'
	)
	const is_guest_email_locked = computed(
		() => is_authenticated_non_member.value && !is_guest_email_editing.value
	)

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
		registered_email_social_provider.value = ''
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

		if (is_authenticated_non_member.value) {
			const account_email = getCurrentAccountEmail()
			if (
				account_email &&
				normalizeEmail(email.value) !== normalizeEmail(account_email)
			) {
				setGuestEmail(account_email)
			}
		}

		closeEmailAlreadyRegisteredModal()
	}

	function openEmailAlreadyRegisteredModal(social_provider: string) {
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
		registered_email_social_provider.value = social_provider
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

		loadAddresses('shipping')
		loadAddresses('billing')
		loadAddresses('drop')
		await ensureDynamicFields()

		is_registered_email_forgot_password_modal_open.value = false
		closeEmailAlreadyRegisteredModal()
		resetVerificationState()
		return response
	}

	function normalizeEmail(value: string) {
		return value.trim().toLowerCase()
	}

	function getCurrentAccountEmail() {
		return state.value.email || checkout_email.value
	}

	function syncCheckoutEmail(value: string) {
		email.value = value
		checkout_email.value = value

		if (is_authenticated_non_member.value) {
			checkout_store.patchGuestContactState({
				email: value,
			})
		}
	}

	function isUserStateEmail(value: string) {
		const normalized_user_email = normalizeEmail(state.value.email)

		return (
			normalized_user_email !== '' &&
			normalizeEmail(value) === normalized_user_email
		)
	}

	function setGuestEmail(value: string) {
		syncCheckoutEmail(value)

		if (isUserStateEmail(value)) return

		const normalized_value = normalizeEmail(value)
		const verified_email =
			normalizeEmail(verification_state.value.verified_email)
		const session_email =
			normalizeEmail(verification_state.value.session?.email || '')

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

	function openEmailChangeModal() {
		if (!is_authenticated_non_member.value) return

		email_before_edit.value = email.value.trim()
		email_change_store.openModal('')
	}

	async function confirmEmailChange(new_email: string) {
		is_guest_email_editing.value = true
		try {
			syncCheckoutEmail(new_email)
			await requestGuestEmailVerification()
		} finally {
			is_guest_email_editing.value = false
		}
	}

	async function finishGuestEmailEdit() {
		if (
			!is_authenticated_non_member.value ||
			!is_guest_email_editing.value ||
			is_finalizing_guest_email_edit.value
		) {
			return
		}

		is_finalizing_guest_email_edit.value = true

		try {
			const previous_email = email_before_edit.value.trim()
			const email_value = email.value.trim()
			const email_has_changed =
				normalizeEmail(email_value) !== normalizeEmail(previous_email)

			if (!email_has_changed) {
				syncCheckoutEmail(previous_email)
				is_guest_email_editing.value = false
				return
			}

			if (!email_value || !isValidAuthEmail(email_value)) {
				return
			}

			is_guest_email_editing.value = false
			await requestGuestEmailVerification()
		} finally {
			is_finalizing_guest_email_edit.value = false
		}
	}

	function handleDocumentPointerDown(event: PointerEvent) {
		if (!is_guest_email_editing.value) return

		const target = event.target
		if (!(target instanceof Node)) return
		if (email_field_ref.value?.contains(target)) return

		void finishGuestEmailEdit()
	}

	async function handleGuestEmailBlur() {
		if (is_authenticated_non_member.value) {
			await finishGuestEmailEdit()
			return
		}

		await requestGuestEmailVerification()
	}

	async function requestGuestEmailVerification() {
		const email_value = email.value.trim()

		if (isUserStateEmail(email_value)) return

		if (!email_value || !isValidAuthEmail(email_value)) return

		const normalized_email = normalizeEmail(email_value)
		const verified_email =
			normalizeEmail(verification_state.value.verified_email)

		if (verified_email === normalized_email) return

		const session_email =
			normalizeEmail(verification_state.value.session?.email || '')
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

				if (response_code === 'email_already_registered') {
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

			if (response.data?.code !== 'login_success') {
				openVerificationModal()
			}

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

		syncCheckoutEmail(getCurrentAccountEmail())
		is_registered_email_forgot_password_modal_open.value = false
		closeEmailAlreadyRegisteredModal()
		resetVerificationState()
	})

	watch(
		() => verification_modal_state.value.is_open,
		(is_open, was_open) => {
			if (!was_open || is_open) return
			if (verification_modal_state.value.context !== 'checkout_guest_contact') return
			if (!is_authenticated_non_member.value) return
			if (is_email_already_registered_modal_open.value) return

			const account_email = getCurrentAccountEmail()
			if (!account_email) return
			if (normalizeEmail(email.value) === normalizeEmail(account_email)) return

			setGuestEmail(account_email)
		}
	)

	watch(
		[is_authenticated_non_member, () => state.value.email, checkout_email],
		([is_non_member]) => {
			if (is_guest_email_editing.value) return

			if (is_non_member) {
				syncCheckoutEmail(getCurrentAccountEmail())
				return
			}

			email.value = checkout_email.value
		},
		{ immediate: true }
	)

	onMounted(() => {
		email_change_store.setOnConfirm(confirmEmailChange)

		if (!import.meta.client) return
		document.addEventListener('pointerdown', handleDocumentPointerDown)
	})

	onBeforeUnmount(() => {
		if (import.meta.client) {
			document.removeEventListener('pointerdown', handleDocumentPointerDown)
		}

		email_change_store.setOnConfirm(null)
		email_change_store.closeModal()

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
		email_field_ref,
		email_input_ref,
		is_authenticated_non_member,
		is_guest_email_locked,
		toggleEmailTooltip,
		openLoginModal,
		is_email_already_registered_modal_open,
		registered_email_password,
		registered_email_password_error,
		registered_email_password_visible,
		registered_email_social_provider,
		is_registered_email_forgot_password_modal_open,
		setEmailAlreadyRegisteredModalOpen,
		onRegisteredEmailPasswordInput,
		setRegisteredEmailPasswordVisible,
		continueWithRegisteredEmail,
		openRegisteredEmailForgotPasswordModal,
		onRegisteredEmailForgotPasswordModalChange,
		restoreRegisteredEmailModal,
		setGuestEmail,
		openEmailChangeModal,
		handleGuestEmailBlur,
	}
}