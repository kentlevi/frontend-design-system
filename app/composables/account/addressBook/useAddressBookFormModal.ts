import { createUserAddress, updateAddress } from "~/services/user-address/user-address.service"
import { useUserAddressDataContext } from "./context/useUserAddressDataContext"
import { useUserAddressFormStateContext } from "./context/useUserAddressFormStateContext"
import { useUserAddressUIContext } from "./context/useUserAddressUIContext"
import { useAddressHelper } from "~/utils/address"
import { mapAddressToForm } from "~/factories/address"
import type { CountryField } from "~/types/country_field"
import { useUserAddressContext } from "./context/useUserAddressContext"

export function useAddressBookFormModal () {
	/**
     * Contexts
     */
	const {
		form_state,
		active_form,
		form_type,
		form_field_errors,

		updateFormFieldByType,
		updateDynamicFieldByType,
		setFormType,
		resetForm,
		setFormErrors,
		clearFormFieldErrors,
	} = useUserAddressFormStateContext()
	const {
		dynamic_fields,
		is_submitting,

		address_store,
		address_field_store,

	} = useUserAddressDataContext()
	const { editing_address_snapshot } = useUserAddressContext()
	const {
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
     * Watchers
     */
	watch((form_modal_mode), (mode) => {
		if (mode === 'edit') {
			if (!editing_address_snapshot.value) return

			form_type.value = editing_address_snapshot.value.type

			const mapped_form = mapAddressToForm(editing_address_snapshot.value, dynamic_fields.value)

			Object.assign(active_form.value, mapped_form)

			clearFormFieldErrors()
		}
	})


	/**
     * Functions
     */
	function submitForm() {
		if (form_modal_mode.value === 'create') {
			createAddress()
		} else {
			editAddress()
		}
	}

	async function createAddress() {
		const type = form_type.value;
		const payload = { ...active_form.value };
		try {
			const response = await createUserAddress(payload)

			if (response?.success) {
				if (response.data) {
					address_store.setAddresses(type, response.data, 'prepend');
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
		}
	}

	async function editAddress() {
		if (!editing_address_snapshot.value) return

		const type = form_type.value
		const editing_address = editing_address_snapshot.value
		const payload = { ...active_form.value };

		try {
			const response = await updateAddress(editing_address?.id, payload)

			if (response?.success) {
				if (type === 'drop') {
					address_store.updateAddress(type, {
						...editing_address,
						...form_state.drop,
						id: editing_address.id,
						country_id: editing_address.country_id,
					})
				} else {
					const { fields, ...form } = form_state[type]

					address_store.updateAddress(type, {
						...editing_address,
						...form,
						id: editing_address.id,
						country_id: editing_address.country_id,
						dynamic_fields: address_field_store.dynamic_address_fields.map(field => ({
							...field,
							value: String(getValue(field, fields[field.field_key] ?? '')),
						})),
					})
				}

				toast_store.handleApiResponse(response)
				closeFormModal()
				resetEditState()
			} else {
				const next_errors = mapApiFieldErrors(response?.data)
				setFormErrors(type, next_errors)
			}
		} catch (_error: unknown) {
			console.log(_error);
		}
	}

	function getValue(field: CountryField, field_value: string | number) {

		if (field.input_type !== 'text') {
			const value = field.options?.find((option) => option.id === field_value)

			return value?.value ?? ''
		}

		return field_value
	}

	function resetEditState() {
		editing_address_snapshot.value = null
		clearFormFieldErrors()
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