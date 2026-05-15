import { usePreferenceForm } from '~/composables/account/profile/usePreferenceForm'
import type { PreferenceState } from '~/types/account/preferences'

export function useProfileSettingsToggles() {

	/**
	 * Composables
	 */
	const {
		preference_form_state,

		updatePreferenceField,
	} = usePreferenceForm()


	/**
	 * Handlers
	 */
	function onToggle(key: keyof PreferenceState, event: Event) {
		const checked = (event.target as HTMLInputElement).checked
		updatePreferenceField(key, checked)
	}


	return {
		preference_form_state,

		onToggle,
	}
}