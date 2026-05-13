import {
	GUEST_LOGIN_TOAST_PENDING_KEY,
	HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
} from '~/data/home/onboarding'
import {
	getAuthErrorMessage,
	getAuthResponseCode,
	getAuthResponseMessage,
} from '~/helpers/auth/auth.helper'
import {
	fetchAndStoreUser,
	requestNonMemberLoginVerification,
	submitNonMemberLoginVerification,
} from '~/services/auth/auth.service'
import { useLoginStore } from '~/stores/auth/v2/login.store'
import {
	createVerificationModalState,
	createVerificationState,
	useVerificationStore,
} from '~/stores/verification.store'
import { useVerificationCooldown } from '../auth/verification/useVerificationCooldown'
import { useVerificationHelper } from './useVerification.helper'

export const useNonMemberLoginVerification = () => {
	const { t: translate } = useI18n()
	const login_store = useLoginStore()
	const verification_store = useVerificationStore()
	const verification_cooldown = useVerificationCooldown()
	const { non_member_form } = storeToRefs(login_store)
	const { verification_state } = storeToRefs(verification_store)
	const { getFirstVerificationDataError, normalizeVerificationErrorMessage, resolveCooldownUntil } = useVerificationHelper()

	const resend_cooldown_remaining = verification_cooldown.remaining

	function resetVerificationState() {
		verification_store.patchModalState(createVerificationModalState())
		verification_store.patchVerificationState(createVerificationState())
	}

	async function submitNonMemberLoginVerificationCode() {
		const email_value = verification_state.value.email.trim()
		const order_number =
			(verification_state.value.session?.order_number || '').trim()
		const session_token =
			(verification_state.value.session?.token || '').trim()
		const otp_value = verification_state.value.code.trim()

		if (!otp_value) {
			verification_store.patchVerificationState({
				error: translate('auth.guestVerification.codeRequired'),
			})
			return
		}

		if (!email_value || !order_number || !session_token) {
			verification_store.patchVerificationState({
				error: translate('auth.guestVerification.sessionExpired'),
			})
			return
		}

		try {
			verification_store.patchVerificationState({
				is_verifying: true,
				error: '',
			})

			const response = await submitNonMemberLoginVerification({
				email: email_value || null,
				order_number: order_number || null,
				login_token: session_token || null,
				otp: otp_value,
			})

			if (!response.success) {
				const first_data_error = getFirstVerificationDataError(
					response.data as Record<string, unknown> | null | undefined
				)
				verification_store.patchVerificationState({
					error:
						normalizeVerificationErrorMessage(
							first_data_error,
							translate
						) ||
						normalizeVerificationErrorMessage(
							getAuthResponseMessage(response),
							translate
						) ||
						translate('auth.guestVerification.invalidCode'),
				})
				return response
			}

			if (import.meta.client) {
				window.localStorage.setItem(GUEST_LOGIN_TOAST_PENDING_KEY, '1')
				window.localStorage.removeItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY)
			}

			await fetchAndStoreUser()
			non_member_form.value.email = ''
			non_member_form.value.order_number = ''
			login_store.setError(false, false, false)
			login_store.setErrorMessages(null, null, null)
			resetVerificationState()
			return await navigateTo('/')
		} catch (error) {
			verification_store.patchVerificationState({
				error:
					getAuthErrorMessage(error) ||
					translate('auth.guestVerification.invalidCode'),
			})
			console.error(error)
			return
		} finally {
			verification_store.patchVerificationState({
				is_verifying: false,
			})
		}
	}

	async function resendNonMemberLoginVerificationCode() {
		if (resend_cooldown_remaining.value > 0) return

		const email_value =
			(verification_state.value.session?.email ||
				verification_state.value.email ||
				non_member_form.value.email).trim()
		const order_number =
			(verification_state.value.session?.order_number ||
				non_member_form.value.order_number).trim()

		if (!email_value || !order_number) {
			verification_store.patchVerificationState({
				error: translate('auth.guestVerification.sessionExpired'),
			})
			return
		}

		try {
			verification_store.patchVerificationState({
				error: '',
				resend_limit_reached: '',
			})

			const response = await requestNonMemberLoginVerification({
				email: email_value,
				order_number,
				is_resend: true,
			})

			if (!response.success) {
				const response_message =
					getAuthResponseMessage(response) ||
					translate('auth.guestVerification.requestFailed')
				const response_code = getAuthResponseCode(response)

				if (response_code === 'max_resend_reached') {
					verification_store.patchVerificationState({
						resend_limit_reached: response_message,
						error: '',
						resend_cooldown_until: resolveCooldownUntil(response),
					})
				} else {
					verification_store.patchVerificationState({
						error: response_message,
						resend_cooldown_until: resolveCooldownUntil(response),
					})
				}
				return response
			}

			const resolved_token =
				typeof response.data?.token === 'string'
					? response.data.token.trim()
					: ''

			if (!resolved_token) {
				verification_store.patchVerificationState({
					error: translate('auth.verification.invalidCode'),
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
					order_number,
					token: resolved_token,
					expires_in: response.data?.expires_in || null,
				},
			})
			return response
		} catch (error) {
			verification_store.patchVerificationState({
				error:
					getAuthErrorMessage(error) ||
					translate('auth.guestVerification.requestFailed'),
			})
			console.error(error)
			return
		}
	}

	return {
		submitNonMemberLoginVerificationCode,
		resendNonMemberLoginVerificationCode,
	}
}