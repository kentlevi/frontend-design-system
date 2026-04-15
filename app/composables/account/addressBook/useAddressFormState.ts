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

	const shipping_form = computed(() => form_state.shipping)
	const billing_form = computed(() => form_state.billing)
	const drop_form = computed(() => form_state.drop)


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



	/**
     * Update Form Fields by Type
     */
	function updateFormFieldByType(
		type: AddressType,
		payload: UpdateFieldPayload
	) {
		Object.assign(form_state[type], {
			[payload.field]: payload.value
		})
		clearFormFieldError(payload.field)
	}

	function updateDynamicFieldByType(
		type: AddressType,
		payload: UpdateDynamicFieldPayload
	) {
		const form = form_state[type]

		if (form.type === 'drop') return

		form.fields[payload.field_key] = payload.value
		clearFormFieldError(`fields.${payload.field_key}`)
	}

	return {
		form_state,
		form_type,
		active_form,
		form_field_errors,
		shipping_form,
		billing_form,
		drop_form,

		setFormType,
		populateDynamicFields,
		clearFormFieldError,
		clearFormFieldErrors,

		updateFormFieldByType,
		updateDynamicFieldByType,

		resetForm,
	}
}