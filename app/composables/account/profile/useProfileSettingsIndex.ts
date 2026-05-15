import { usePreferenceForm } from '~/composables/account/profile/usePreferenceForm'

export function useProfileSettingsIndex() {

	/**
	 * Pre-load preferences
	 */
	usePreferenceForm()
}