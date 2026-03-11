import { reactive, ref } from 'vue'
import { personal_form_defaults } from '~/constants/account/profile'
import {
	map_personal_form_to_payload,
	map_profile_to_personal_form_state,
} from '~/mappers/account/profile/personalForm.mapper'
import {
	fetchPersonalFieldDefinitions,
	updatePersonalForm,
} from '~/services/account/profile/personalForm.service'
import type {
	PersonalFormApiResponse,
	ProfileFieldDefinition,
} from '~/types/account/profile'

export function usePersonalForm() {
	const user_store = useUserStore()
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
			field_definitions.value = await fetchPersonalFieldDefinitions()
			const mapped_form = map_profile_to_personal_form_state(
				field_definitions.value,
				user_store.profile
			)

			form_state.fields = { ...mapped_form.fields }
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
			const payload = map_personal_form_to_payload(form_state)
			api_response.value = await updatePersonalForm(payload)
		} catch (error: unknown) {
			error_message.value = 'Failed to save personal details.'
			throw error
		} finally {
			is_submitting.value = false
		}
	}

	return {
		field_definitions,
		form_state,
		is_loading,
		is_submitting,
		error_message,
		api_response,
		loadPersonalForm,
		submitPersonalForm,
	}
}