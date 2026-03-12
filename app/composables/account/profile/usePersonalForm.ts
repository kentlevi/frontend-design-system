import { reactive, ref } from 'vue'
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

export function usePersonalForm() {
	const user_store = useUserStore()
	const profile_fields_store = useProfileFieldsStore()
	const field_definitions = ref<ProfileFieldDefinition[]>([])
	const form_state = reactive(personal_form_defaults())
	const is_loading = ref(false)
	const is_submitting = ref(false)
	const error_message = ref('')
	const api_response = ref<PersonalFormApiResponse | null>(null)

	async function loadPersonalForm() {
		is_loading.value = true
		error_message.value = ''

		try {
			if (profile_fields_store.dynamic_profile_fields.length === 0) {
				field_definitions.value = await fetchPersonalFieldDefinitions()

				profile_fields_store.setDynamicProfileFields(field_definitions.value)
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
		is_loading,
		is_submitting,
		error_message,
		api_response,
		loadPersonalForm,
		submitPersonalForm,
	}
}