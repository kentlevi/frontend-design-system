import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCountry } from '~/composables/app/country/useCountry'
import {
	isTimestampExpired,
	useVerificationCooldown,
} from '~/composables/auth/verification/useVerificationCooldown'
import {
	GUEST_LOGIN_TOAST_PENDING_KEY,
	HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
	LOGIN_SUCCESS_TOAST_TRIGGER_EVENT,
} from '~/data/home/onboarding'
import {
	getAuthErrorMessage,
	getAuthResponseCode,
	getAuthResponseMessage,
	getAuthResponseMessageCode,
	isValidAuthEmail,
	setGuestLoginToastPending,
} from '~/helpers/auth/auth.helper'
import {
	fetchAndStoreUser,
	loginMemberUser,
	requestNonMemberLoginVerification,
	submitNonMemberLoginVerification,
} from '~/services/auth/auth.service'
import { useAuthLoginStore } from '~/stores/auth/login.store'
import { useLoadingOverlayStore } from '~/stores/loading_overlay'
import { resolvePostLoginRedirect } from '~/utils/auth/redirect'

export function useAuthLoginCard() {
	const route = useRoute()
	const { t: translate } = useI18n()
	const { withCountry } = useCountry()
	const auth_login_store = useAuthLoginStore()
	const loading_overlay_store = useLoadingOverlayStore()
	const LOGIN_CARD_LOADING_KEY = 'auth_login_card'
	const {
		member_preferences,
		card_ui,
		member_form,
		non_member_form,
		guest_verification,
		is_non_member,
		is_page_login_busy,
		is_checkout_mode,
	} = storeToRefs(auth_login_store)

	const guest_resend_cooldown = useVerificationCooldown()

	const submit_label = computed(() => {
		const is_login_page = route.path === withCountry('/auth/login')

		if (is_non_member.value) {
			return is_login_page
				? translate('auth.login.checkOrder')
				: translate('auth.login.signIn')
		}

		return translate('auth.login.signIn')
	})

	const show_close_button = computed(() => is_checkout_mode.value)
	const register_as_action = computed(() => is_checkout_mode.value)
	const member_type = computed(() => member_preferences.value.member_type)
	const is_forgot_password_modal_open = computed(
		() => card_ui.value.is_forgot_password_modal_open
	)
	const is_verification_modal_open = computed(
		() => card_ui.value.is_verification_modal_open
	)
	const is_guest_verifying = computed(
		() => guest_verification.value.is_verifying
	)
	const guest_resend_cooldown_remaining = computed(
		() => guest_verification.value.resend_cooldown_remaining
	)
	const guest_verification_email = computed(
		() => guest_verification.value.email
	)
	const guest_verification_order_number = computed(
		() => guest_verification.value.order_number
	)
	const guest_verification_token = computed(
		() => guest_verification.value.token
	)
	const guest_verification_code = computed(
		() => guest_verification.value.code
	)
	const guest_verification_error = computed(
		() => guest_verification.value.error
	)
	const resend_limit_reached = computed(
		() => guest_verification.value.resend_limit_reached
	)
	const member_email = computed(() => member_form.value.email)

	const post_login_redirect = computed(() =>
		resolvePostLoginRedirect(getRedirectCandidate(), withCountry)
	)

	function getRedirectCandidate() {
		const query_redirect = Array.isArray(route.query.redirect)
			? route.query.redirect[0]
			: route.query.redirect
		if (query_redirect) return query_redirect
		if (!import.meta.client) return null
		return window.history.state?.back ?? null
	}

	function clearGuestResendCooldownTimer() {
		guest_resend_cooldown.clear()
	}

	function syncPageLoginOverlay() {
		if (!is_page_login_busy.value) {
			loading_overlay_store.stopLoading(LOGIN_CARD_LOADING_KEY)
			return
		}

		loading_overlay_store.startLoading(LOGIN_CARD_LOADING_KEY, {
			label: is_non_member.value
				? translate('auth.login.checkOrder')
				: translate('auth.login.signIn'),
			testId: 'auth-login-check-order-loading-overlay',
			position: 'fixed',
		})
	}

	function setGuestResendCooldownFromResponse(response: unknown) {
		guest_resend_cooldown.applyFromResponse(response)
	}

	function hasExpiredVerificationSession() {
		if (!guest_verification.value.session) return true
		return isTimestampExpired(guest_verification.value.session.expires_in)
	}

	function clearErrors() {
		auth_login_store.patchMemberForm({
			email_error: '',
			password_error: '',
			invalid_credentials: false,
		})
		auth_login_store.patchNonMemberForm({
			email_error: '',
			email_has_error: false,
			order_error: '',
		})
		auth_login_store.patchGuestVerification({
			error: '',
			resend_limit_reached: '',
		})
	}

	function resetGuestVerificationModalState() {
		auth_login_store.patchGuestVerification({
			code: '',
			error: '',
			resend_limit_reached: '',
			is_verifying: false,
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

	function setMemberType(value: typeof member_preferences.value.member_type) {
		auth_login_store.patchMemberPreferences({
			member_type: value,
		})
	}

	function setForgotPasswordModalOpen(value: boolean) {
		auth_login_store.patchCardUi({
			is_forgot_password_modal_open: value,
		})
	}

	function setVerificationModalOpen(value: boolean) {
		auth_login_store.patchCardUi({
			is_verification_modal_open: value,
		})
	}

	function setGuestVerificationCode(value: string) {
		auth_login_store.patchGuestVerification({
			code: value,
		})
	}

	function handleVerificationModalChange(value: boolean) {
		setVerificationModalOpen(value)

		if (value) return

		resetGuestVerificationModalState()
	}

	function handleClose() {
		if (!is_checkout_mode.value) return

		closeCheckoutModal()
	}

	function openRegister() {
		if (!is_checkout_mode.value) return

		auth_login_store.patchCheckoutState({
			modal_mode: 'register',
		})
	}

	function handleApiError(error: unknown, fallback_message: string) {
		return getAuthErrorMessage(error) || fallback_message
	}

	async function fetchGuestUserProfile() {
		setGuestLoginToastPending()
		await fetchAndStoreUser()
	}

	function validateMember() {
		clearErrors()

		if (!member_form.value.email.trim()) {
			auth_login_store.patchMemberForm({
				email_error: translate('auth.login.validation.fieldBlank'),
			})
		} else if (!isValidAuthEmail(member_form.value.email.trim())) {
			auth_login_store.patchMemberForm({
				email_error: translate('auth.login.validation.emailInvalid'),
			})
		}

		if (!member_form.value.password.trim()) {
			auth_login_store.patchMemberForm({
				password_error: translate('auth.login.validation.fieldBlank'),
			})
		}

		return (
			!member_form.value.email_error &&
			!member_form.value.password_error
		)
	}

	function validateNonMember() {
		auth_login_store.patchNonMemberForm({
			email_error: '',
			email_has_error: false,
			order_error: '',
		})

		if (!non_member_form.value.email.trim()) {
			auth_login_store.patchNonMemberForm({
				email_error: translate('auth.login.validation.fieldBlank'),
				email_has_error: true,
			})
		} else if (!isValidAuthEmail(non_member_form.value.email.trim())) {
			auth_login_store.patchNonMemberForm({
				email_error: translate('auth.login.validation.emailInvalid'),
				email_has_error: true,
			})
		}

		if (
			!is_checkout_mode.value &&
			!non_member_form.value.order_number.trim()
		) {
			auth_login_store.patchNonMemberForm({
				order_error: translate('auth.login.validation.fieldBlank'),
			})
		}

		return (
			!non_member_form.value.email_error &&
			!non_member_form.value.order_error
		)
	}

	async function handleMemberLogin() {
		if (!validateMember()) return

		try {
			auth_login_store.patchCardUi({
				is_signing_in_member: true,
			})

			const response = await loginMemberUser({
				email: member_form.value.email.trim(),
				password: member_form.value.password.trim(),
				remember_me: member_preferences.value.keep_signed_in,
			})

			if (!response.success) {
				auth_login_store.patchMemberForm({
					email_error: translate(
						'auth.login.validation.credentialsMismatch'
					),
					password_error: '',
					invalid_credentials: true,
				})
				return response
			}

			auth_login_store.patchMemberForm({
				invalid_credentials: false,
			})

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

			if (is_checkout_mode.value) {
				closeCheckoutModal()
				return response
			}

			return await navigateTo(post_login_redirect.value)
		} finally {
			auth_login_store.patchCardUi({
				is_signing_in_member: false,
			})
		}
	}

	async function handleNonMemberLogin() {
		if (!validateNonMember()) return

		const email_value = non_member_form.value.email.trim()
		const order_number = non_member_form.value.order_number.trim()
		const session_email =
			(guest_verification.value.session?.email || '').trim().toLowerCase()
		const session_order_number =
			(guest_verification.value.session?.order_number || '').trim()
		const session_token =
			(guest_verification.value.session?.token || '').trim()
		const can_skip_verification_request =
			guest_verification.value.resend_cooldown_remaining > 0 &&
			!hasExpiredVerificationSession() &&
			session_email === email_value.toLowerCase() &&
			session_order_number === order_number &&
			session_token !== ''

		if (can_skip_verification_request) {
			auth_login_store.patchGuestVerification({
				email: email_value,
				order_number,
				token: session_token,
			})
			auth_login_store.patchCardUi({
				is_verification_modal_open: true,
			})
			return
		}

		try {
			auth_login_store.patchCardUi({
				is_checking_guest_order: true,
			})
			auth_login_store.patchGuestVerification({
				is_verifying: true,
			})

			const response = await requestNonMemberLoginVerification(
				{
					email: email_value,
					order_number,
					is_resend: false,
				},
				{
					is_checkout: is_checkout_mode.value,
				}
			)

			const response_message = getAuthResponseMessage(response)
			const message_code = getAuthResponseMessageCode(response)

			if (!response.success) {
				const code = getAuthResponseCode(response)
				const message = getAuthResponseMessage(response)

				if (code === 'max_resend_reached') {
					auth_login_store.patchGuestVerification({
						resend_limit_reached:
							message || translate('auth.verification.invalidCode'),
						error: '',
					})
					auth_login_store.patchNonMemberForm({
						email_error: '',
						order_error: '',
					})
					auth_login_store.patchCardUi({
						is_verification_modal_open: true,
					})
					setGuestResendCooldownFromResponse(response)
					return response
				}
			}

			if (response.success && message_code === 'login_success') {
				await fetchGuestUserProfile()

				if (is_checkout_mode.value) {
					closeCheckoutModal()
					return response
				}

				return await navigateTo(post_login_redirect.value)
			}

			if (!response.success) {
				auth_login_store.patchNonMemberForm({
					email_error: '',
					email_has_error: true,
					order_error: translate('auth.login.validation.orderNotFound'),
				})

				if (message_code === 'max_resend_reached') {
					auth_login_store.patchGuestVerification({
						resend_limit_reached: response_message,
						error: '',
					})
					setGuestResendCooldownFromResponse(response)
				} else {
					auth_login_store.patchGuestVerification({
						error: response_message,
					})
				}

				return response
			}

			auth_login_store.patchGuestVerification({
				email: email_value,
				order_number,
				token: (response.data?.token || '').trim(),
				error: '',
				resend_limit_reached: '',
				session: {
					email: email_value,
					order_number,
					token: response.data?.token || null,
					expires_in: response.data?.expires_in || null,
				},
			})
			auth_login_store.patchCardUi({
				is_verification_modal_open: true,
			})
			setGuestResendCooldownFromResponse(response)
		} catch (error) {
			auth_login_store.patchGuestVerification({
				error: handleApiError(
					error,
					translate('auth.guestVerification.invalidCode')
				),
			})
			console.error(error)
		} finally {
			auth_login_store.patchCardUi({
				is_checking_guest_order: false,
			})
			auth_login_store.patchGuestVerification({
				is_verifying: false,
			})
		}
	}

	async function submitGuestVerification() {
		auth_login_store.patchGuestVerification({
			error: '',
		})

		try {
			auth_login_store.patchGuestVerification({
				is_verifying: true,
			})

			const response = await submitNonMemberLoginVerification(
				{
					email: guest_verification.value.email.trim() || null,
					order_number:
						guest_verification.value.order_number.trim() || null,
					login_token: guest_verification.value.token.trim() || null,
					otp: guest_verification.value.code.trim(),
				},
				{
					is_checkout: is_checkout_mode.value,
				}
			)

			if (!response.success) {
				auth_login_store.patchGuestVerification({
					error:
						response.message ||
						translate('auth.guestVerification.invalidCode'),
				})
				return response
			}

			await fetchGuestUserProfile()
			auth_login_store.patchGuestVerification({
				session: null,
				token: '',
			})
			auth_login_store.patchCardUi({
				is_verification_modal_open: false,
			})

			if (is_checkout_mode.value) {
				closeCheckoutModal()
				return response
			}

			return await navigateTo(post_login_redirect.value)
		} catch (error) {
			console.error(error)
			return
		} finally {
			auth_login_store.patchGuestVerification({
				is_verifying: false,
			})
		}
	}

	async function resendGuestVerification() {
		if (guest_verification.value.resend_cooldown_remaining > 0) return

		const session_email =
			(guest_verification.value.session?.email || '').trim()
		const session_order_number =
			(guest_verification.value.session?.order_number || '').trim()

		if (!session_email || !session_order_number) {
			auth_login_store.patchGuestVerification({
				error: translate('auth.guestVerification.sessionExpired'),
			})
			return
		}

		try {
			auth_login_store.patchGuestVerification({
				is_verifying: true,
			})

			const response = await requestNonMemberLoginVerification(
				{
					email: session_email,
					order_number: session_order_number,
					is_resend: true,
				},
				{
					is_checkout: is_checkout_mode.value,
				}
			)

			if (!response.success) {
				const response_message = getAuthResponseMessage(response)
				const message_code = getAuthResponseMessageCode(response)

				if (message_code === 'max_resend_reached') {
					auth_login_store.patchGuestVerification({
						resend_limit_reached: response_message,
						error: '',
					})
					setGuestResendCooldownFromResponse(response)
				} else {
					auth_login_store.patchGuestVerification({
						error: response_message,
					})
				}

				return response
			}

			auth_login_store.patchGuestVerification({
				email: session_email,
				order_number: session_order_number,
				token: (response.data?.token || '').trim(),
				error: '',
				resend_limit_reached: '',
				session: {
					email: session_email,
					order_number: session_order_number,
					token: response.data?.token || null,
					expires_in: response.data?.expires_in || null,
				},
			})
			setGuestResendCooldownFromResponse(response)
			return response
		} catch (error) {
			console.error(error)
			return
		} finally {
			auth_login_store.patchGuestVerification({
				is_verifying: false,
			})
		}
	}

	async function submitLogin() {
		clearErrors()

		if (!is_non_member.value) {
			return handleMemberLogin()
		}

		return handleNonMemberLogin()
	}

	watch(member_type, () => {
		clearErrors()
		auth_login_store.patchGuestVerification({
			resend_limit_reached: '',
		})
	})

	watch(
		[is_page_login_busy, is_non_member],
		() => {
			syncPageLoginOverlay()
		},
		{ immediate: true }
	)

	watch(
		guest_resend_cooldown.remaining,
		(value) => {
			auth_login_store.patchGuestVerification({
				resend_cooldown_remaining: value,
			})

			if (value <= 0) {
				auth_login_store.patchGuestVerification({
					resend_limit_reached: '',
				})
			}
		},
		{ immediate: true }
	)

	onMounted(() => {
		if (is_checkout_mode.value) return

		const modal_query = Array.isArray(route.query.modal)
			? route.query.modal[0]
			: route.query.modal
		const should_open_forgot_password =
			modal_query === 'forgot-password' || modal_query === 'reset-password'

		if (!should_open_forgot_password) return

		const email_query = Array.isArray(route.query.email)
			? route.query.email[0]
			: route.query.email

		if (typeof email_query === 'string' && email_query.trim()) {
			auth_login_store.patchMemberForm({
				email: email_query,
			})
		}

		auth_login_store.patchCardUi({
			is_forgot_password_modal_open: true,
		})
	})

	onBeforeUnmount(() => {
		clearGuestResendCooldownTimer()
		loading_overlay_store.stopLoading(LOGIN_CARD_LOADING_KEY)
	})

	return {
		translate,
		member_type,
		is_non_member,
		submit_label,
		is_verification_modal_open,
		is_forgot_password_modal_open,
		is_page_login_busy,
		guest_verification_email,
		guest_verification_order_number,
		guest_verification_token,
		guest_verification_code,
		guest_verification_error,
		resend_limit_reached,
		is_guest_verifying,
		guest_resend_cooldown_remaining,
		member_email,
		show_close_button,
		register_as_action,
		setMemberType,
		setForgotPasswordModalOpen,
		handleVerificationModalChange,
		setGuestVerificationCode,
		submitLogin,
		submitGuestVerification,
		resendGuestVerification,
		handleClose,
		openRegister,
	}
}