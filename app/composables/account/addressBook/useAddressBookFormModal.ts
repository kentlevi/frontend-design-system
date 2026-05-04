import { createUserAddress } from "~/services/user-address/user-address.service"
import { useUserAddressDataContext } from "./context/useUserAddressDataContext"
import { useUserAddressFormStateContext } from "./context/useUserAddressFormStateContext"
import { useUserAddressUIContext } from "./context/useUserAddressUIContext"
import { useAddressHelper } from "~/utils/address"

export function useAddressBookFormModal () {
	/**
     * Contexts
     */
	const {
		active_form,
		form_type,
		form_field_errors,

		updateFormFieldByType,
		updateDynamicFieldByType,
		setFormType,
		resetForm,
		setFormErrors,
	} = useUserAddressFormStateContext()
	const { dynamic_fields, setAddresses } = useUserAddressDataContext()
	const {
		is_submitting,
		form_modal_mode,

		closeFormModal
	} = useUserAddressUIContext()


	/**
     * Stores
     */
	const toast_store = useToastStore()


	/**
     * Helpers
     */
	const { mapApiFieldErrors } = useAddressHelper()


	/**
     * Computed
     */
	const is_default_model = computed({
		get: () => active_form.value.is_default ?? false,
		set: (value: boolean) => {
			updateFormFieldByType(active_form.value.type, {
				field: 'is_default',
				value,
			})
		},
	})


	/**
     * Functions
     */
	function submitForm() {
		if (is_submitting.value) return

		if (form_modal_mode.value === 'create') {
			createAddress()
		}
	}

	async function createAddress() {
		is_submitting.value = true

		const type = form_type.value;
		const payload = { ...active_form.value };
		try {
			const response = await createUserAddress(payload)

			if (response?.success) {
				if (response.data) {
					setAddresses(type, response.data, 'prepend');
				}


				toast_store.handleApiResponse(response)
				closeFormModal()
				resetForm(type);
			} else {
				const next_errors = mapApiFieldErrors(response?.data)
				setFormErrors(type, next_errors)
			}
		} catch (_error: unknown) {
			console.log(_error);
		} finally {
			is_submitting.value = false
		}
	}

	return {
		active_form,
		form_field_errors,
		dynamic_fields,
		is_submitting,
		is_default_model,

		updateFormFieldByType,
		updateDynamicFieldByType,
		setFormType,
		submitForm,
	}
}