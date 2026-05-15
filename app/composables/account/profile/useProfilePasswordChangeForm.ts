import { useForgotPasswordFormContext } from '~/composables/account/profile/context/useForgotPasswordFormContext'
import { usePasswordForm } from '~/composables/account/profile/usePasswordForm'

export function useProfilePasswordChangeForm() {

	/**
	 * Composables
	 */
	const {
		current_password,
		new_password,
		new_password_confirmation,
		current_password_error,
		pair_password_error,
		current_password_visible,
		new_password_visible,
		new_password_confirmation_visible,
		is_change_password_enabled,

		clearNewPasswordPairErrors,
		onChangePassword,
	} = usePasswordForm()


	/**
	 * Context
	 */
	const { sendForgotPasswordEmail } = useForgotPasswordFormContext()


	/**
	 * Input handlers
	 */
	function onCurrentPasswordInput(value: string) {
		current_password.value = value
		current_password_error.value = ''
	}

	function onNewPasswordInput(value: string) {
		new_password.value = value
		clearNewPasswordPairErrors()
	}

	function onNewPasswordConfirmationInput(value: string) {
		new_password_confirmation.value = value
		clearNewPasswordPairErrors()
	}


	return {
		current_password,
		new_password,
		new_password_confirmation,
		current_password_error,
		pair_password_error,
		current_password_visible,
		new_password_visible,
		new_password_confirmation_visible,
		is_change_password_enabled,

		onCurrentPasswordInput,
		onNewPasswordInput,
		onNewPasswordConfirmationInput,
		onChangePassword,
		sendForgotPasswordEmail,
	}
}