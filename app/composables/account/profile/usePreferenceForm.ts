import { fetchPreferences, updatePreference } from "~/services/profile/preference.service"
import { useUsersStore } from "~/stores/users/users.store"
import type { PreferenceState } from "~/types/account/preferences"

const form_state = reactive<Partial<PreferenceState>>({})
const is_loading = ref(false)
const is_loaded = ref(false)
const pending_request = ref<Promise<void> | null>(null)
const is_submitting = ref(false)
const error_message = ref('')

export function usePreferenceForm() {
	const user_store = useUsersStore()

	async function loadPreferences() {
		if (pending_request.value) {
			return pending_request.value
		}

		if (is_loaded.value) {
			Object.assign(form_state, { ...user_store.state.preference })
			return
		}

		pending_request.value = (async () => {
			is_loading.value = true
			error_message.value = ''

			try {
				const response = await fetchPreferences();

				if (response.data) {
					user_store.setPreferenceFields(response.data);
					Object.assign(form_state, { ...response.data })
					is_loaded.value = true
				}
			} catch (error: unknown) {
				error_message.value = 'Failed to load preferences.'
				throw error
			} finally {
				is_loading.value = false
				pending_request.value = null
			}
		})()

		return pending_request.value
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
		is_loaded,
		is_submitting,
		error_message,
		preference: computed(() => user_store.state.preference),
		loadPreferences,
		updatePreferenceField
	}
}