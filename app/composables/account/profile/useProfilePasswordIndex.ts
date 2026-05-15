import { provideForgotPasswordForm } from '~/composables/account/profile/context/useForgotPasswordFormContext'
import { provideSetupPassword } from '~/composables/account/profile/context/useSetupPasswordContext'
import { useSocialAccount } from '~/composables/account/profile/useSocialAccount'

export function useProfilePasswordIndex() {

	/**
	 * Composables
	 */
	const { social } = useSocialAccount()


	/**
	 * Provide contexts
	 */
	const {
		has_password,

		setup_password,
		setup_password_confirmation,
		setup_password_error,
		setup_password_visible,
		setup_password_confirmation_visible,
		is_setup_password_modal_open,
		is_setup_password_enabled,

		clearSetupPasswordPairErrors,
		onSetupPassword,
		closeSetupPasswordModal,
	} = provideSetupPassword()

	const {
		is_forgot_password_modal_open,
		forgot_password_request_send,

		closeForgotPasswordModal,
	} = provideForgotPasswordForm()


	return {
		social,
		has_password,

		setup_password,
		setup_password_confirmation,
		setup_password_error,
		setup_password_visible,
		setup_password_confirmation_visible,
		is_setup_password_modal_open,
		is_setup_password_enabled,

		is_forgot_password_modal_open,
		forgot_password_request_send,

		clearSetupPasswordPairErrors,
		onSetupPassword,
		closeSetupPasswordModal,

		closeForgotPasswordModal,
	}
}