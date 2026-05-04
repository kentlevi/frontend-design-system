import { addressFormDefaults } from "~/factories/address"
import { useAddressFieldStore } from "~/stores/user-address"
import type { AddressFormState, AddressType, DynamicFieldDefinition, UpdateDynamicFieldPayload, UpdateFieldPayload } from "~/types/user-address"

export function useUserAddressFormState() {


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
	const form_field_errors = ref<Record<AddressType, Record<string, string>>>({
		shipping: {},
		billing: {},
		drop: {},
	})

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
		form_field_errors.value = ({
			shipping: {},
			billing: {},
			drop: {},
		})
	}

	function clearFormFieldError(type: AddressType, field: string) {
		delete form_field_errors.value[type]?.[field]
	}

	function setFormErrors(type: AddressType, errors: Record<string, string>) {
		form_field_errors.value[type] = errors
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
		clearFormFieldError(type, payload.field)
	}

	function updateDynamicFieldByType(
		type: AddressType,
		payload: UpdateDynamicFieldPayload
	) {
		const form = form_state[type]

		if (form.type === 'drop') return

		form.fields[payload.field_key] = payload.value
		clearFormFieldError(type, `fields.${payload.field_key}`)
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
		setFormErrors,

		updateFormFieldByType,
		updateDynamicFieldByType,

		resetForm,
	}
}