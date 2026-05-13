import { requestNonMemberLoginVerification } from "~/services/auth/auth.service"
import { useLoginStore } from "~/stores/auth/v2/login.store"
import { useVerificationStore } from "~/stores/verification.store"
import { useVerificationHelper } from "~/composables/verification/useVerification.helper"

export const useNonMemberLogin = () => {
	const { t: translate } = useI18n()

	const login_store = useLoginStore()
	const verification_store = useVerificationStore()
	const loading_overlay = useLoadingOverlayStore()
	const { resolveCooldownUntil } = useVerificationHelper()

	const {
		non_member_form,
	} = storeToRefs(login_store)

	const nonMemberLogin = async () => {
		const validated = validateNonMemberForm()

		if (!validated) return

		try {
			loading_overlay.showOverlay('login')
			const response = await requestNonMemberLoginVerification(non_member_form.value)

			if (!response.success) {
				loading_overlay.hideOverlay('login')

				if (response.data?.code === 'max_resend_reached') {
					verification_store.patchVerificationState({
						email: non_member_form.value.email,
						code: '',
						error: '',
						resend_limit_reached: response.message || translate('auth.verification.invalidCode'),
						resend_cooldown_until: resolveCooldownUntil(response),
						session: {
							email: non_member_form.value.email,
							order_number: non_member_form.value.order_number,
							token: null,
							expires_in: null,
						},
					})
					verification_store.patchModalState({
						context: 'non_member_login',
						is_open: true,
					})
					return response
				}

				if (
					response.data?.code === 'order_not_found' ||
                    response.data?.code === 'email_already_registered'
				) {
					login_store.setError(false, false, true)
					login_store.setErrorMessages(
						null,
						null,
						translate('auth.login.validation.orderNotFound')
					)
				}

				if (response.data?.email) {
					login_store.setError(true, false, false)
					login_store.setErrorMessages(
						translate('auth.login.validation.emailInvalid'),
						null,
						null
					)
				}

				return response
			}

			if (response.data?.code === 'login_success') {
				loading_overlay.hideOverlay('login')
				return navigateTo('/')
			}

			verification_store.patchVerificationState({
				email: response.data?.email || non_member_form.value.email,
				code: '',
				error: '',
				resend_limit_reached: '',
				resend_cooldown_until: resolveCooldownUntil(response),
				session: {
					email: response.data?.email || non_member_form.value.email,
					order_number: non_member_form.value.order_number,
					token: response.data?.token || null,
					expires_in: response.data?.expires_in || null,
				},
			})
			verification_store.patchModalState({
				context: 'non_member_login',
				is_open: true,
			})
			loading_overlay.hideOverlay('login')
			return response
		} catch (error) {
			console.error('Login failed:', error)
			loading_overlay.hideOverlay('login')
		}
	}

	const validateNonMemberForm = () => {
		const { email, order_number } = non_member_form.value

		if (!email || !order_number) {
			login_store.setErrorMessages(
				!email ? translate('auth.login.emailRequired') : null,
				null,
				!order_number ? translate('auth.login.orderNumberRequired') : null
			)
			return false
		}

		return true
	}

	return {
		nonMemberLogin,
		validateNonMemberForm
	}
}