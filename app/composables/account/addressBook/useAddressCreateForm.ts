import { addressFormDefaults } from "~/factories/address";
import { addUserAddress } from "~/services/profile/address.service";
import { useAddressFieldStore, useAddressStore } from "~/stores/address";
import type { AddFormState, AddressFormMap, AddressType, DynamicFieldDefinition, UpdateDynamicFieldPayload, UpdateFieldPayload } from "~/types/address";

type UseAddressCreateFormOptions = {
	openFormModal: () => void
	closeFormModal: () => void
}

export function useAddressCreateForm(options: UseAddressCreateFormOptions) {
	/**
     * Store
     */
	const address_field_store = useAddressFieldStore()
	const address_store = useAddressStore()
	const toast_store = useToastStore()
	const loading_overlay_store = useLoadingOverlayStore()

	/**
     * Variables
     */

	/** Forms */
	const form_state = reactive<AddFormState>({
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

	function hasAddressLines(form: AddressFormMap[AddressType]) {
		return form.type !== 'drop'
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

	function validateForm() {
		const next_errors: Record<string, string> = {}
		const required_message = 'Required.'
		const current_form = active_form.value

		if (!current_form.contact_name.trim()) {
			next_errors.contact_name = required_message
		}

		if (hasAddressLines(current_form)) {
			if (!current_form.address_line_1.trim()) {
				next_errors.address_line_1 = required_message
			}

			if (!current_form.postcode.trim()) {
				next_errors.postcode = required_message
			}

			if (current_form.type === 'shipping' && !current_form.phone_number.trim()) {
				next_errors.phone_number = required_message
			}

			address_field_store.dynamic_address_fields.forEach((field) => {
				if (!field.is_required) return

				const value = current_form.fields[field.field_key]
				const normalized_value = typeof value === 'number'
					? String(value)
					: (value ?? '').toString().trim()

				if (!normalized_value) {
					next_errors[`fields.${field.field_key}`] = required_message
				}
			})
		}

		form_field_errors.value = next_errors

		return Object.keys(next_errors).length === 0
	}

	async function createAddress() {
		options.closeFormModal()
		startRequestOverlay()

		const type = form_type.value;
		const payload = { ...active_form.value };
		try {
			const response = await addUserAddress(payload)

			if (response?.success) {
				if (response.data) {
					address_store.setAddresses(type, response.data, 'prepend');
				}

				resetForm(type);
			} else {
				options.openFormModal();
			}

			toast_store.handleApiResponse(response)
		} catch (_error: unknown) {
			console.log(_error);
			options.openFormModal();
		} finally {
			loading_overlay_store.stopLoading('add_address')
		}
	}

	function prepareCreateModal() {
		clearFormFieldErrors()
		populateDynamicFields(form_type.value)
	}

	/** Overlays */
	function startRequestOverlay() {
		loading_overlay_store.startLoading('add_address', {
			showCopy: true,
			testId: 'account-profile-upload-avatar-overlay',
			position: 'fixed'
		})
	}

	return {
		form_state,
		form_type,
		active_form,
		form_field_errors,

		createAddress,
		prepareCreateModal,
		setFormType,
		resetForm,
		clearFormFieldErrors,
		validateForm,
		updateActiveFormField,
		updateDynamicField,
	}
}