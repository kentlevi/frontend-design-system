import { addressFormDefaults } from "~/factories/address"
import { useMainCheckOutStore } from "~/stores/checkout/index.store"
import { useAddressFieldStore } from "~/stores/user-address"
import type { AddressType, DynamicFieldDefinition, UpdateDynamicFieldPayload, UpdateFieldPayload } from "~/types/user-address"

export function useUserAddressFormState() {


	/**
     * Store
     */
	const address_field_store = useAddressFieldStore()
	const checkout_store = useMainCheckOutStore()


	/**
     * Functions
     */

	/** Transform store fields into form fields with empty values */
	function populateDynamicFields(target_type: AddressType) {
		if (target_type === 'drop') return

		// Check if object is empty (not array length)
		if (Object.keys(checkout_store.form_state[target_type].fields).length !== 0) return;

		// Use reduce to create object, not map for array
		const mappedFields = address_field_store.dynamic_address_fields.reduce((acc, field) => {
			acc[field.field_key] = ''  // Set empty string as default
			return acc
		}, {} as DynamicFieldDefinition)

		checkout_store.form_state[target_type].fields = mappedFields
	}


	/** Change the active form type */
	function setFormType(type: AddressType) {
		checkout_store.form_type = type
		clearFormFieldErrors()
		populateDynamicFields(type)
	}

	function resetForm(type?: AddressType) {
		const target_type = type ?? checkout_store.form_type

		Object.assign(
			checkout_store.form_state[target_type],
			addressFormDefaults(target_type)
		)

		clearFormFieldErrors()
		populateDynamicFields(target_type)
	}

	function clearFormFieldErrors() {
		checkout_store.form_field_errors = ({
			shipping: {},
			billing: {},
			drop: {},
		})
	}

	function clearFormFieldError(type: AddressType, field: string) {
		delete checkout_store.form_field_errors[type]?.[field]
	}

	function setFormErrors(type: AddressType, errors: Record<string, string>) {
		checkout_store.form_field_errors[type] = errors
	}



	/**
     * Update Form Fields by Type
     */
	function updateFormFieldByType(
		type: AddressType,
		payload: UpdateFieldPayload
	) {
		Object.assign(checkout_store.form_state[type], {
			[payload.field]: payload.value
		})
		clearFormFieldError(type, payload.field)
	}

	function updateDynamicFieldByType(
		type: AddressType,
		payload: UpdateDynamicFieldPayload
	) {
		const form = checkout_store.form_state[type]

		if (form.type === 'drop') return

		form.fields[payload.field_key] = payload.value
		clearFormFieldError(type, `fields.${payload.field_key}`)
	}

	return {
		...storeToRefs(checkout_store),

		setFormType,
		populateDynamicFields,
		clearFormFieldError,
		clearFormFieldErrors,
		setFormErrors,

		updateFormFieldByType,
		updateDynamicFieldByType,

		resetForm,
	}
}