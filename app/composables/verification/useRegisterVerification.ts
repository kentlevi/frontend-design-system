import { HOME_WELCOME_POPOVER_PENDING_KEY } from '~/data/home/onboarding'
import {
	getAuthErrorMessage,
	getAuthResponseCode,
	getAuthResponseMessage,
} from '~/helpers/auth/auth.helper'
import { sendRegisterVerification, submitRegisterVerification } from '~/services/auth/api.service'
import { fetchAndStoreUser } from '~/services/auth/auth.service'
import { useRegisterStore } from '~/stores/auth/v2/register.store'
import {
	createVerificationModalState,
	createVerificationState,
	useVerificationStore,
} from '~/stores/verification.store'
import { useCountry } from '../app/country/useCountry'
import { useVerificationCooldown } from '../auth/verification/useVerificationCooldown'
import { useVerificationHelper } from './useVerification.helper'

export const useRegisterVerification = () => {
	const { t: translate } = useI18n()
	const { withCountry } = useCountry()
	const register_store = useRegisterStore()
	const verification_store = useVerificationStore()
	const verification_cooldown = useVerificationCooldown()
	const { register_form } = storeToRefs(register_store)
	const { verification_state } = storeToRefs(verification_store)
	const { getFirstVerificationDataError, normalizeVerificationErrorMessage, resolveCooldownUntil } = useVerificationHelper()

	const resend_cooldown_remaining = verification_cooldown.remaining

	async function submitRegisterVerificationCode() {
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

			const response = await submitRegisterVerification({
				email: email_value || null,
				registration_token: session_token || null,
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
						translate('auth.verification.invalidCode'),
				})
				return response
			}

			await fetchAndStoreUser()

			if (import.meta.client) {
				window.localStorage.setItem(HOME_WELCOME_POPOVER_PENDING_KEY, '1')
			}

			register_store.resetForm()
			verification_store.patchModalState(createVerificationModalState())
			verification_store.patchVerificationState(createVerificationState())

			await navigateTo(withCountry('/auth/profile'))
			return response
		} catch (error) {
			verification_store.patchVerificationState({
				error:
					getAuthErrorMessage(error) ||
					translate('auth.verification.invalidCode'),
			})
			console.error(error)
			return
		} finally {
			verification_store.patchVerificationState({
				is_verifying: false,
			})
		}
	}

	async function resendRegisterVerificationCode() {
		if (resend_cooldown_remaining.value > 0) return

		const form = register_form.value
		const email_value =
			(verification_state.value.session?.email ||
				verification_state.value.email ||
				form.email).trim()

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

			const response = await sendRegisterVerification({
				given_name: form.first_name,
				family_name: form.last_name,
				email: email_value,
				password: form.password,
				terms_of_service: form.agree_terms ? 1 : 0,
				newsletter: form.opt_in_promos ? 1 : 0,
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
		submitRegisterVerificationCode,
		resendRegisterVerificationCode,
	}
}