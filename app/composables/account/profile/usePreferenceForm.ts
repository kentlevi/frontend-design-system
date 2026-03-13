import { fetchPreferences, updatePreference } from "~/services/profile/preference.service"
import type { PreferenceState } from "~/types/account/preferences"


export function usePreferenceForm() {
	const user_store = useUserStore()

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
		preference: computed(() => user_store.preference),
		loadPreferences,
		updatePreferenceField
	}
}


// import type {
// 	PreferenceFormState,
// 	UpdatePreferencePayload,
// 	UpdatePreferenceResponse
// } from '~/types/account/preference'
// import { updatePreference } from '~/services/account/preference'

// export function usePreferenceForm() {
// 	const user_store = useUserStore()

// 	/** Form values shown in UI */
// 	const form_state = reactive<PreferenceFormState>({
// 		promotions: false,
// 		reviews: false,
// 		confirmations: false,
// 		unit: 'metric',
// 	})

// 	/** UI states */
// 	const is_submitting = ref(false)
// 	const error_message = ref('')
// 	const api_response = ref<UpdatePreferenceResponse | null>(null)

// 	/**
// 	 * Fill form from store data
// 	 */
// 	function loadPreferenceForm() {
// 		form_state.promotions = Boolean(user_store.profile?.promotions ?? false)
// 		form_state.reviews = Boolean(user_store.profile?.reviews ?? false)
// 		form_state.confirmations = Boolean(user_store.profile?.confirmations ?? false)
// 		form_state.unit = user_store.profile?.unit ?? 'metric'
// 	}

// 	/**
// 	 * Convert form state to API payload
// 	 */
// 	function mapPreferenceFormToPayload(): UpdatePreferencePayload {
// 		return {
// 			promotions: form_state.promotions,
// 			reviews: form_state.reviews,
// 			confirmations: form_state.confirmations,
// 			unit: form_state.unit,
// 		}
// 	}

// 	/**
// 	 * Save current preference values
// 	 */
// 	async function submitPreferenceForm() {
// 		is_submitting.value = true
// 		error_message.value = ''

// 		try {
// 			const payload = mapPreferenceFormToPayload()

// 			api_response.value = await updatePreference(payload)

// 			/**
// 			 * Patch local store after successful save
// 			 * Prefer backend response data if available
// 			 */
// 			if (user_store.profile) {
// 				user_store.profile = {
// 					...user_store.profile,
// 					promotions: api_response.value.data?.promotions ?? form_state.promotions,
// 					reviews: api_response.value.data?.reviews ?? form_state.reviews,
// 					confirmations: api_response.value.data?.confirmations ?? form_state.confirmations,
// 					unit: api_response.value.data?.unit ?? form_state.unit,
// 				}
// 			}
// 		} catch (error: unknown) {
// 			error_message.value = 'Failed to update preferences.'
// 			throw error
// 		} finally {
// 			is_submitting.value = false
// 		}
// 	}

// 	return {
// 		form_state,
// 		is_submitting,
// 		error_message,
// 		api_response,
// 		loadPreferenceForm,
// 		submitPreferenceForm,
// 	}
// }