import { sendRegisterVerification } from "~/services/auth/api.service"
import { useLoginStore } from "~/stores/auth/v2/login.store"
import { useRegisterStore } from "~/stores/auth/v2/register.store"
import { useVerificationStore } from "~/stores/verification.store"
import type { RegisterVerificationResponse } from "~/types/auth/auth"
import { useVerificationHelper } from "~/composables/verification/useVerification.helper"

const getFirstFieldMessage = (payload: unknown, key: string) => {
	if (!payload || typeof payload !== 'object') return ''

	const field = (payload as Record<string, unknown>)[key]

	if (Array.isArray(field)) {
		return String(field[0] ?? '').trim()
	}

	if (typeof field === 'string') {
		return field.trim()
	}

	return ''
}

const isEmailAlreadyRegisteredResponse = (response: RegisterVerificationResponse) => {
	const response_data = response.data as Record<string, unknown> | undefined

	if (response_data?.code === 'email_already_registered') return true

	return /already been taken/i.test(getFirstFieldMessage(response.data, 'email'))
}

export const useRegister = () => {
	const { t: translate } = useI18n()

	const register_store = useRegisterStore()
	const login_store = useLoginStore()
	const verification_store = useVerificationStore()
	const loading_overlay = useLoadingOverlayStore()
	const { resolveCooldownUntil } = useVerificationHelper()

	const { register_form } = storeToRefs(register_store)

	const register = async () => {
		const validated = validateRegisterForm()

		if (!validated) return

		try {
			loading_overlay.showOverlay('register')
			const response = await sendRegisterVerification({
				given_name: register_form.value.first_name,
				family_name: register_form.value.last_name,
				email: register_form.value.email,
				password: register_form.value.password,
				terms_of_service: register_form.value.agree_terms ? 1 : 0,
				newsletter: register_form.value.opt_in_promos ? 1 : 0,
			})

			if (!response.success) {
				loading_overlay.hideOverlay('register')

				if (isEmailAlreadyRegisteredResponse(response)) {
					login_store.openAlreadyRegisteredModal(register_form.value.email)
					return response
				}

				if (getFirstFieldMessage(response.data, 'email')) {
					register_store.setError(false, true, false, false)
					register_store.setErrorMessages(
						null,
						translate('auth.register.validation.emailInvalid'),
						null,
						null
					)
				}

				return response
			}

			verification_store.patchVerificationState({
				email: response.data?.email || register_form.value.email,
				code: '',
				error: '',
				resend_limit_reached: '',
				resend_cooldown_until: resolveCooldownUntil(response),
				session: {
					email: response.data?.email || register_form.value.email,
					token: response.data?.token || null,
					expires_in: response.data?.expires_in || null,
				},
			})
			verification_store.patchModalState({
				context: 'register',
				is_open: true,
			})
			loading_overlay.hideOverlay('register')
			return response
		} catch (error) {
			console.error('Register failed:', error)
			loading_overlay.hideOverlay('register')
		}
	}

	const validateRegisterForm = () => {
		const { first_name, email, password, agree_terms } = register_form.value

		if (!first_name || !email || !password || !agree_terms) {
			register_store.setError(!first_name, !email, !password, !agree_terms)
			register_store.setErrorMessages(
				!first_name ? translate('auth.register.validation.fieldBlank') : null,
				!email ? translate('auth.register.validation.fieldBlank') : null,
				!password ? translate('auth.register.validation.fieldBlank') : null,
				!agree_terms ? translate('auth.register.validation.termsRequired') : null
			)
			return false
		}

		return true
	}

	return {
		register,
		validateRegisterForm
	}
}