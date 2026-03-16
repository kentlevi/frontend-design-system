import { fetchPreferences, updatePreference } from "~/services/profile/preference.service"
import { useUsersStore } from "~/stores/users/users.store"
import type { PreferenceState } from "~/types/account/preferences"


export function usePreferenceForm() {
	const user_store = useUsersStore()

	/** Form */
	const form_state = reactive<Partial<PreferenceState>>({})

	/** UI states */
	const is_loading = ref(false)
	const is_submitting = ref(false)
	const error_message = ref('')

	async function loadPreferences() {
		is_loading.value = true
		error_message.value = ''

		try {
			const response = await fetchPreferences();

			if (response.data) {
				user_store.setPreferenceFields(response.data);
				Object.assign(form_state, { ...response.data })
			}
		} catch (error: unknown) {
			error_message.value = 'Failed to load preferences.'
			throw error
		} finally {
			is_loading.value = false
		}
	}

	async function updatePreferenceField<K extends keyof PreferenceState>(
		field_name: K,
		field_value: PreferenceState[K]
	) {
		is_submitting.value = true
		error_message.value = ''

		try {
			/** Keep local UI in sync immediately */
			form_state[field_name] = field_value

			/** Send only changed field */
			const payload = { [field_name]: field_value } as Partial<PreferenceState>

			const response = await updatePreference(payload)

			if (response.data) {
				user_store.setPreferenceFields(response.data)
			} else {
				user_store.setPreferenceField(field_name, field_value)
			}
		} catch (error: unknown) {
			error_message.value = 'Failed to update preferences.'
			throw error
		} finally {
			is_submitting.value = false
		}
	}

	return {
		form_state,
		is_loading,
		is_submitting,
		error_message,
		preference: computed(() => user_store.state.preference),
		loadPreferences,
		updatePreferenceField
	}
}