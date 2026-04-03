import { addressFormDefaults } from "~/factories/address"
import { useAddressFieldStore } from "~/stores/address"
import type { AddressFormState, AddressType, DynamicFieldDefinition, UpdateDynamicFieldPayload, UpdateFieldPayload } from "~/types/address"

export function useAddressFormState() {


	/**
     * Store
     */
	const address_field_store = useAddressFieldStore()


	/** Forms */
	const form_state = reactive<AddressFormState>({
		shipping: addressFormDefaults('shipping'),
		billing: addressFormDefaults('billing'),
		drop: addressFormDefaults('drop'),
	})
	const form_type = ref<AddressType>('shipping')
	const active_form = computed(() => form_state[form_type.value])
	const form_field_errors = ref<Record<string, string>>({})


	/**
     * Functions
     */

	/** Transform store fields into form fields with empty values */
	function populateDynamicFields(target_type: AddressType) {
		if (target_type === 'drop') return

		// Check if object is empty (not array length)
		if (Object.keys(form_state[target_type].fields).length !== 0) return;

		// Use reduce to create object, not map for array
		const mappedFields = address_field_store.dynamic_address_fields.reduce((acc, field) => {
			acc[field.field_key] = ''  // Set empty string as default
			return acc
		}, {} as DynamicFieldDefinition)

		form_state[target_type].fields = mappedFields
	}

	/** Update the active form field from the modal */
	function updateActiveFormField(payload: UpdateFieldPayload) {
		/** Write into the parent-owned form state */
		Object.assign(active_form.value, {
			[payload.field]: payload.value,
		})

		clearFormFieldError(payload.field)
	}

	/** Update one dynamic field value in the active form */
	function updateDynamicField(payload: UpdateDynamicFieldPayload) {
		if (active_form.value.type === 'drop') return
		active_form.value.fields[payload.field_key] = payload.value
		clearFormFieldError(`fields.${payload.field_key}`)
	}

	/** Change the active form type */
	function setFormType(type: AddressType) {
		form_type.value = type
		clearFormFieldErrors()
		populateDynamicFields(type)
	}

	function resetForm(type?: AddressType) {
		const target_type = type ?? form_type.value

		Object.assign(
			form_state[target_type],
			addressFormDefaults(target_type)
		)

		clearFormFieldErrors()
		populateDynamicFields(target_type)
	}

	function clearFormFieldErrors() {
		form_field_errors.value = {}
	}

	function clearFormFieldError(field_key: string) {
		if (!form_field_errors.value[field_key]) return

		form_field_errors.value = Object.fromEntries(
			Object.entries(form_field_errors.value).filter(([key]) => key !== field_key)
		)
	}

	return {
		form_state,
		form_type,
		active_form,
		form_field_errors,

		setFormType,
		populateDynamicFields,
		clearFormFieldError,
		clearFormFieldErrors,
		updateActiveFormField,
		updateDynamicField,
		resetForm,
	}
}