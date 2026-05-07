import { personal_form_defaults } from "~/constants/profile";
import { mapPersonalFormToUserFieldValues } from "~/helpers/account/profile/personalForm.helper";
import { mapPersonalFormToPayload, mapProfileToPersonalFormState } from "~/mappers/account/profile/personalForm.mapper";
import { ensureDynamicFields } from "~/services/profile-dynamic-fields/dynamic-fields.service";
import { editPersonalDetails } from "~/services/profile/profile.service";
import { useProfileFieldStore } from "~/stores/users/profile_field.store";
import { useUsersStore } from "~/stores/users/users.store";

export function useProfilePersonal() {

	/**
     * Stores
     */
	const user_store = useUsersStore()
	const profile_fields_store = useProfileFieldStore()
	const loading_overlay_store = useLoadingOverlayStore()
	const toast_store = useToastStore()


	/**
     * Computed
     */
	const user_profile = computed(() => user_store.state.profile)
	const dynamic_profile_fields = computed(() => profile_fields_store.dynamic_profile_fields)
	const has_changes = computed(() => {
		const current_keys = Object.keys(form_state.fields).sort()
		const initial_keys = Object.keys(initial_fields.value).sort()

		if (current_keys.length !== initial_keys.length) return true

		return current_keys.some((key, index) => {
			if (key !== initial_keys[index]) return true

			return (form_state.fields[key] ?? '') !== (initial_fields.value[key] ?? '')
		})
	})
	const is_updating = computed(() => user_store.isLoading('update', 'dynamic_fields'))


	/**
     * Variables
     */
	const form_state = reactive(personal_form_defaults())
	const initial_fields = ref<Record<string, string>>({})
	const field_errors = ref<Record<string, string>>({})


	/**
     * Functions
     */
	function fillFormState() {
		const mapped_form = mapProfileToPersonalFormState(
			dynamic_profile_fields.value,
			user_profile.value
		)

		form_state.fields = { ...mapped_form.fields }
		initial_fields.value = { ...form_state.fields }
	}

	async function submitPersonalForm() {
		clearFieldErrors()
		startRequestOverlay()

		try {
		/** Build API paylaod from current form state */
			const payload = mapPersonalFormToPayload(form_state)

			const response = await editPersonalDetails(payload)

			if (response?.success) {
				const updated_user_field_values = mapPersonalFormToUserFieldValues(
					dynamic_profile_fields.value,
					form_state.fields,
					user_profile.value
				)

				user_store.setProfileUserFieldValues(updated_user_field_values)
				initial_fields.value = { ...form_state.fields }
				toast_store.handleApiResponse(response)
				return
			}

			/** Handle validation errors from backend */
			setFieldErrorsFromResponse(response?.data)
		} finally {
			loading_overlay_store.stopLoading('update_personal')
		}
	}

	function setFieldErrorsFromResponse(
		data: unknown
	) {
		/** Guard: only continue when backend returned validation data */
		if (!data || typeof data !== 'object' || Array.isArray(data)) return

		/**
		 * Expected backend shape:
		 * {
		 *   "fields.first_name": ["First name is required."],
		 *   "fields.last_name": ["Last name is required."]
		 * }
		 */
		for (const [key, value] of Object.entries(data as Record<string, unknown>)){
			if (Array.isArray(value)) {
				field_errors.value[key] = String(value[0])
				continue
			}
		}
	}

	function clearFieldErrors() {
		field_errors.value = {}
	}


	/**
	 * Overlays
	 */
	function startRequestOverlay() {
		loading_overlay_store.startLoading('update_personal', {
			showCopy: true,
			testId: 'account-profile-saving-overlay',
			position: 'fixed'
		})
	}

	onMounted(async() => {
		await ensureDynamicFields()
		fillFormState()
	})

	return {
		form_state,
		field_errors,
		dynamic_profile_fields,
		has_changes,

		submitPersonalForm,

		/** Loaders */
		is_updating,
	}
}