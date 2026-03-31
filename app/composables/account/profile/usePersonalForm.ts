import { computed, reactive, ref } from 'vue'
import { personal_form_defaults } from '~/constants/profile'
import { mapPersonalFormToUserFieldValues } from '~/helpers/account/profile/personalForm.helper'
import { mapProfileToPersonalFormState, mapPersonalFormToPayload } from '~/mappers/account/profile/personalForm.mapper'
import { fetchPersonalFieldDefinitions, updatePersonalForm } from '~/services/profile/personalForm.service'
import { useUsersStore } from '~/stores/users/users.store'
import type { PersonalFormApiResponse, ProfileFieldDefinition } from '~/types/account/profile'
import type { ApiResponse } from '~/types/config/api'

export function usePersonalForm() {
	/** Store */
	const user_store = useUsersStore()
	const profile_fields_store = useProfileFieldsStore()
	const toast_store = useToastStore()
	const loading_overlay_store = useLoadingOverlayStore()

	const dynamic_profile_fields = computed(() => profile_fields_store.dynamic_profile_fields)

	const field_definitions = ref<ProfileFieldDefinition[]>([])
	const form_state = reactive(personal_form_defaults())
	const initial_fields = ref<Record<string, string>>({})
	const is_loading = ref(false)
	const is_updating = ref(false)
	const field_errors = ref<Record<string, string>>({})

	const has_changes = computed(() => {
		clearFieldErrors()

		const current_keys = Object.keys(form_state.fields).sort()
		const initial_keys = Object.keys(initial_fields.value).sort()

		if (current_keys.length !== initial_keys.length) return true

		return current_keys.some((key, index) => {
			if (key !== initial_keys[index]) return true
			return (form_state.fields[key] ?? '') !== (initial_fields.value[key] ?? '')
		})
	})

	async function loadPersonalForm() {
		is_loading.value = true

		try {
			if (profile_fields_store.dynamic_profile_fields.length === 0) {
				const response = await fetchPersonalFieldDefinitions()

				if (response.data) {
					field_definitions.value = response.data

					profile_fields_store.setDynamicProfileFields(field_definitions.value)
				}
			} else {
				field_definitions.value = profile_fields_store.dynamic_profile_fields
			}
			/**
             * Map values to its fields
             */
			const mapped_form = mapProfileToPersonalFormState(
				field_definitions.value,
				user_store.state.profile
			)

			/**
             * Keep fallback values for fields that have no mapped value yet
             */
			form_state.fields = {
				...mapped_form.fields,
			}
			initial_fields.value = {
				...mapped_form.fields,
			}
		} catch (_error: unknown) {
			console.log(_error);
		} finally {
			is_loading.value = false
		}
	}

	async function submitPersonalForm() {
		is_updating.value = true
		startRequestOverlay()

		try {
			/**
             * Build API payload from current form state
             */
			const payload = mapPersonalFormToPayload(form_state)

			/**
             * Save to backend
             */
			const response = await updatePersonalForm(payload)
			/**
             * If save succeeded, sync latest values into Pinia store
             */
			if (response.success) {
				const updated_user_field_values = mapPersonalFormToUserFieldValues(
					profile_fields_store.dynamic_profile_fields,
					form_state.fields,
					user_store.state.profile
				)

				user_store.setProfileUserFieldValues(updated_user_field_values)
				initial_fields.value = {
					...form_state.fields,
				}

				toast_store.handleApiResponse(response)
				return
			}

			/**
			 * Handle validation errors from backend
			 */
			setFieldErrorsFromResponse(response)
		} catch (error: unknown) {
			console.log(error);
			toast_store.showUpdateError()
		} finally {
			is_updating.value = false
			loading_overlay_store.stopLoading('update_personal')
		}
	}

	/**
	 * Reset all field-level validation errors
	 */
	function clearFieldErrors() {
		field_errors.value = {}
	}

	/**
	 * Convert backend validation errors into:
	 * {
	 *   first_name: 'First name is required.',
	 *   last_name: 'Last name is required.'
	 * }
	 */
	function setFieldErrorsFromResponse(response: ApiResponse<PersonalFormApiResponse> | null) {
		clearFieldErrors()

		const response_data = response?.data

		/**
		 * Guard: only continue when backend returned validation data
		 */
		if (!response_data || typeof response_data !== 'object' || Array.isArray(response_data)) {
			return
		}

		/**
		 * Expected backend shape:
		 * {
		 *   "fields.first_name": ["First name is required."],
		 *   "fields.last_name": ["Last name is required."]
		 * }
		 */
		for (const [key, value] of Object.entries(response_data as Record<string, unknown>)) {
			/**
			 * Only handle dynamic field validation keys
			 */
			if (!key.startsWith('fields.')) {
				continue
			}

			/**
			 * Convert "fields.first_name" -> "first_name"
			 */
			const field_key = key.replace(/^fields\./, '')

			/**
			 * Get the first validation message
			 */
			if (Array.isArray(value) && typeof value[0] === 'string') {
				field_errors.value[field_key] = value[0]
				continue
			}

			if (typeof value === 'string') {
				field_errors.value[field_key] = value
			}
		}
	}




	/**
	 * Start request overlay
	 */
	function startRequestOverlay() {
		loading_overlay_store.startLoading('update_personal', {
			showCopy: true,
			testId: 'account-profile-saving-overlay',
			position: 'fixed'
		})
	}

	return {
		form_state,
		has_changes,
		is_loading,
		is_updating,
		field_errors,
		dynamic_profile_fields,

		loadPersonalForm,
		submitPersonalForm,
	}
}