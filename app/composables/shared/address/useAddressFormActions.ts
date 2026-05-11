// composables/useAddressFormActions.ts
import { addressFormDefaults } from "~/factories/address"
import { useAddressFieldStore } from "~/stores/user-address"
import type { AddressType, AddressFormState, DynamicFieldDefinition, UpdateDynamicFieldPayload, UpdateFieldPayload } from "~/types/user-address"


interface AddressFormContext {
	form_state: AddressFormState
	form_type: Ref<AddressType>
	form_field_errors: Ref<Record<AddressType, Record<string, string>>>
}


export function useAddressFormActions(context: AddressFormContext) {
	const address_field_store = useAddressFieldStore()


	const { form_state, form_type, form_field_errors } = context


	function populateDynamicFields(target_type: AddressType) {
		if (target_type === 'drop') return
		if (Object.keys(form_state[target_type].fields).length !== 0) return

		const mappedFields = address_field_store.dynamic_address_fields.reduce((acc, field) => {
			acc[field.field_key] = ''
			return acc
		}, {} as DynamicFieldDefinition)

		form_state[target_type].fields = mappedFields
	}

	function setFormType(type: AddressType) {
		form_type.value = type
		clearFormFieldErrors()
		populateDynamicFields(type)
	}

	function resetForm(type?: AddressType) {
		const target_type = type ?? form_type.value
		Object.assign(form_state[target_type], addressFormDefaults(target_type))
		clearFormFieldErrors()
		populateDynamicFields(target_type)
	}

	function clearFormFieldErrors() {
		form_field_errors.value = { shipping: {}, billing: {}, drop: {} }
	}

	function clearFormFieldError(type: AddressType, field: string) {
		delete form_field_errors.value[type]?.[field]
	}

	function setFormErrors(type: AddressType, errors: Record<string, string>) {
		form_field_errors.value[type] = errors
	}

	function updateFormFieldByType(type: AddressType, payload: UpdateFieldPayload) {
		Object.assign(form_state[type], { [payload.field]: payload.value })
		clearFormFieldError(type, payload.field)
	}

	function updateDynamicFieldByType(type: AddressType, payload: UpdateDynamicFieldPayload) {
		const form = form_state[type]
		if (form.type === 'drop') return
		form.fields[payload.field_key] = payload.value
		clearFormFieldError(type, `fields.${payload.field_key}`)
	}

	return {
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