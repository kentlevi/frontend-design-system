import { reactive, ref } from 'vue'
import { personal_form_defaults } from '~/constants/account/profile'
import {
	mapPersonalFormToPayload,
	mapProfileToPersonalFormState,
} from '~/mappers/account/profile/personalForm.mapper'
import {
	fetchPersonalFieldDefinitions,
	updatePersonalForm,
} from '~/services/account/profile/personalForm.service'
import type { ProfileFieldDefinition } from '~/types/account/profile'

export function usePersonalForm() {
	const user_store = useUserStore()

	/** Backend-driven field schema */
	const field_definitions = ref<ProfileFieldDefinition[]>([])

	/** Editable form state */
	const form_state = reactive(personal_form_defaults())

	/** UI state */
	const is_loading = ref(false)
	const is_submitting = ref(false)
	const error_message = ref('')

	/**
	 * Load field schema and hydrate current values
	 */
	async function loadPersonalForm() {
		is_loading.value = true
		error_message.value = ''

		try {
			field_definitions.value = await fetchPersonalFieldDefinitions()

			const mapped_form = mapProfileToPersonalFormState(
				field_definitions.value,
				user_store.profile
			)

			form_state.fields = { ...mapped_form.fields }
		} catch (error: unknown) {
			console.log(error);
			error_message.value = 'Failed to load personal form.'
		} finally {
			is_loading.value = false
		}
	}

	/**
	 * Submit current dynamic fields
	 */
	async function submitPersonalForm() {
		is_submitting.value = true
		error_message.value = ''

		try {
			const payload = mapPersonalFormToPayload(form_state)

			await updatePersonalForm(payload)
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
		loadPersonalForm,
		submitPersonalForm,
	}
}