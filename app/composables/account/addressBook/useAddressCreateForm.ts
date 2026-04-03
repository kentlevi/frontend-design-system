import { addUserAddress } from "~/services/profile/address.service";
import { useAddressFieldStore, useAddressStore } from "~/stores/address";
import type { AddressFormMap, AddressFormState, AddressType } from "~/types/address";
import type { ComputedRef, Ref } from "vue";

type UseAddressCreateFormOptions = {
	openCreateFormModal: () => void
	closeFormModal: () => void
	resetForm: (type: AddressType) => void
	clearFormFieldErrors: () => void
	populateDynamicFields: (target_type: AddressType) => void
	form_state: AddressFormState
	form_type: Ref<AddressType>
	active_form: ComputedRef<AddressFormMap[AddressType]>
	form_field_errors: Ref<Record<string, string>>
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
     * Functions
     */

	function hasAddressLines(form: AddressFormMap[AddressType]) {
		return form.type !== 'drop'
	}

	function validateForm() {
		const next_errors: Record<string, string> = {}
		const required_message = 'Required.'
		const current_form = options.active_form.value

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

		options.form_field_errors.value = next_errors

		return Object.keys(next_errors).length === 0
	}

	async function createAddress() {
		options.closeFormModal()
		startRequestOverlay()

		const type = options.form_type.value;
		const payload = { ...options.active_form.value };
		try {
			const response = await addUserAddress(payload)

			if (response?.success) {
				if (response.data) {
					address_store.setAddresses(type, response.data, 'prepend');
				}

				options.resetForm(type);
			} else {
				options.openCreateFormModal();
			}

			toast_store.handleApiResponse(response)
		} catch (_error: unknown) {
			console.log(_error);
			options.openCreateFormModal();
		} finally {
			loading_overlay_store.stopLoading('add_address')
		}
	}

	function prepareCreateModal() {
		options.clearFormFieldErrors()
		options.populateDynamicFields(options.form_type.value)
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
		createAddress,
		prepareCreateModal,
		validateForm,
	}
}