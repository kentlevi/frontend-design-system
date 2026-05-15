import { useSetupPasswordContext } from '~/composables/account/profile/context/useSetupPasswordContext'

export function useProfilePasswordSetupPrompt() {

	/**
	 * Context
	 */
	const { openSetupPasswordModal } = useSetupPasswordContext()


	return {
		openSetupPasswordModal,
	}
}