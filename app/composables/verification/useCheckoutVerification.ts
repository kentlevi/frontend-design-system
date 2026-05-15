import {
	fetchAndStoreUser,
	requestNonMemberLoginVerification,
	submitNonMemberLoginVerification,
} from '~/services/auth/auth.service'
import { useVerificationHelper } from './useVerification.helper'
import {
	getAuthErrorMessage,
	getAuthResponseCode,
	getAuthResponseMessage,
} from '~/helpers/auth/auth.helper'
import { useVerificationCooldown } from '../auth/verification/useVerificationCooldown'

export const useCheckoutVerification = () => {
	const { t: translate } = useI18n()
	const verification_store = useVerificationStore()
	const verification_cooldown = useVerificationCooldown()
	const { verification_state } = storeToRefs(verification_store)
	const { getFirstVerificationDataError, normalizeVerificationErrorMessage, resolveCooldownUntil } = useVerificationHelper()

	const resend_cooldown_remaining = verification_cooldown.remaining

	async function submitCheckoutGuestContactVerification() {
		const email_value = verification_state.value.email.trim()
		const otp_value = verification_state.value.code.trim()
		const session_token =
			(verification_state.value.session?.token || '').trim()

		if (!otp_value) {
			verification_store.patchVerificationState({
				error: translate('auth.guestVerification.codeRequired'),
			})
			return
		}

		if (!email_value || !session_token) {
			verification_store.patchVerificationState({
				error: translate('auth.guestVerification.requestFailed'),
			})
			return
		}

		try {
			verification_store.patchVerificationState({
				is_verifying: true,
				error: '',
			})

			const response = await submitNonMemberLoginVerification(
				{
					email: email_value || null,
					order_number: null,
					login_token: session_token || null,
					otp: otp_value,
				},
				{
					is_checkout: true,
				}
			)

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

			await fetchAndStoreUser()

			verification_store.patchVerificationState({
				code: '',
				error: '',
				resend_limit_reached: '',
				resend_cooldown_until: null,
				verified_email: email_value,
				session: null,
			})
			verification_store.patchModalState({
				is_open: false,
			})
			return response
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

	async function resendCheckoutGuestContactVerification() {
		if (resend_cooldown_remaining.value > 0) return

		const email_value =
			(verification_state.value.session?.email ||
                verification_state.value.email).trim()

		if (!email_value) {
			verification_store.patchVerificationState({
				error: translate('auth.guestVerification.requestFailed'),
			})
			return
		}

		try {
			verification_store.patchVerificationState({
				error: '',
				resend_limit_reached: '',
			})

			const response = await requestNonMemberLoginVerification(
				{
					email: email_value,
					order_number: '',
					is_resend: true,
				},
				{
					is_checkout: true,
				}
			)

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
		submitCheckoutGuestContactVerification,
		resendCheckoutGuestContactVerification
	}
}