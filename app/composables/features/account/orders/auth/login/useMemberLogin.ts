import { loginMemberUser } from "~/services/auth/auth.service"
import { useLoginStore } from "~/stores/auth/v2/login.store"

export const useMemberLogin = () => {
	const { t: translate } = useI18n()

	const login_store = useLoginStore()
	const loading_overlay = useLoadingOverlayStore()

	const {
		member_form,
	} = storeToRefs(login_store)

	const memberLogin = async () => {
		const validated = validateMemberForm()

		if (!validated) return

		try {
			loading_overlay.showOverlay('login')
			const response = await loginMemberUser(member_form.value)

			if (!response.success) {
				loading_overlay.hideOverlay('login')
				if (response.data?.code === 'invalid_credentials') {
					login_store.setError(true, true, false)
					login_store.setErrorMessages(
						translate('auth.login.validation.credentialsMismatch'),
						null,
						null
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

			loading_overlay.hideOverlay('login')
			return response
		} catch (error) {
			console.error('Login failed:', error)
			loading_overlay.hideOverlay('login')
		}
	}

	const validateMemberForm = () => {
		const { email, password } = member_form.value

		if (!email || !password) {
			login_store.setError(!email, !password, false)
			login_store.setErrorMessages(
				!email ? translate('auth.login.validation.fieldBlank') : null,
				!password ? translate('auth.login.validation.fieldBlank') : null,
				null
			)
			return false
		}

		return true
	}

	return {
		memberLogin,
		validateMemberForm
	}
}