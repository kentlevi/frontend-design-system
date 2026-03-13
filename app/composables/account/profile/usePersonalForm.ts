import { computed, reactive, ref } from 'vue'
import { personal_form_defaults } from '~/constants/account/profile'
import { mapPersonalFormToUserFieldValues } from '~/helpers/account/profile/personalForm.helper'
import {
	mapProfileToPersonalFormState,
	mapPersonalFormToPayload,
} from '~/mappers/account/profile/personalForm.mapper'
import {
	fetchPersonalFieldDefinitions,
	updatePersonalForm,
} from '~/services/profile/personalForm.service'
import type { PersonalFormApiResponse, ProfileFieldDefinition } from '~/types/account/profile'
import type { ApiResponse } from '~/types/config/api'

export function usePersonalForm() {
	const user_store = useUserStore()
	const profile_fields_store = useProfileFieldsStore()

	const field_definitions = ref<ProfileFieldDefinition[]>([])
	const form_state = reactive(personal_form_defaults())
	const initial_fields = ref<Record<string, string>>({})
	const is_loading = ref(false)
	const is_submitting = ref(false)
	const error_message = ref('')
	const api_response = ref<ApiResponse<PersonalFormApiResponse> | null>(null)
	const has_changes = computed(() => {
		const current_keys = Object.keys(form_state.fields).sort()
		const initial_keys = Object.keys(initial_fields.value).sort()

		if (current_keys.length !== initial_keys.length) return true

		return current_keys.some((key, index) => {
			if (key !== initial_keys[index]) return true
			return (form_state.fields[key] ?? '') !== (initial_fields.value[key] ?? '')
		})
	})
	const has_required_fields = computed(() =>
		field_definitions.value.every((field) => {
			if (!field.is_required) return true
			return String(form_state.fields[field.field_key] ?? '').trim().length > 0
		})
	)

	async function loadPersonalForm() {
		is_loading.value = true
		error_message.value = ''

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
				user_store.profile
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
			error_message.value = 'Failed to load personal form.'
		} finally {
			is_loading.value = false
		}
	}

	async function submitPersonalForm() {
		is_submitting.value = true
		error_message.value = ''

		try {
			/**
             * Build API payload from current form state
             */
			const payload = mapPersonalFormToPayload(form_state)

			/**
             * Save to backend
             */
			api_response.value = await updatePersonalForm(payload)
			/**
             * If save succeeded, sync latest values into Pinia store
             */
			if (api_response?.value?.success) {
				const updated_user_field_values = mapPersonalFormToUserFieldValues(
					profile_fields_store.dynamic_profile_fields,
					form_state.fields,
					user_store.profile
				)

				user_store.setProfileUserFieldValues(updated_user_field_values)
				initial_fields.value = {
					...form_state.fields,
				}
			}

		} catch (error: unknown) {
			error_message.value = 'Failed to save personal details.'
			throw error
		} finally {
			is_submitting.value = false
		}
	}

	return {
		form_state,
		has_changes,
		has_required_fields,
		is_loading,
		is_submitting,
		error_message,
		api_response,
		loadPersonalForm,
		submitPersonalForm,
	}
}