import { addUserAddress } from "~/services/profile/address.service";
import { useAddressStore } from "~/stores/address";
import type { AddressFormMap, AddressFormState, AddressType } from "~/types/address";
import type { ComputedRef, Ref } from "vue";
import { useAddressHelper } from "~/utils/address";

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

	const is_submitting = ref(false)
	const { mapApiFieldErrors } = useAddressHelper()

	/**
     * Store
     */
	const address_store = useAddressStore()
	const toast_store = useToastStore()

	/**
     * Functions
     */
	async function createAddress() {
		is_submitting.value = true

		const type = options.form_type.value;
		const payload = { ...options.active_form.value };
		try {
			const response = await addUserAddress(payload)

			if (response?.success) {
				if (response.data) {
					address_store.setAddresses(type, response.data, 'prepend');
				}


				toast_store.handleApiResponse(response)
				options.closeFormModal()
				options.resetForm(type);
			} else {
				const next_errors = mapApiFieldErrors(response.data)
				options.form_field_errors.value = next_errors
			}
		} catch (_error: unknown) {
			console.log(_error);
		} finally {
			is_submitting.value = false
		}
	}

	function prepareCreateModal() {
		options.resetForm(options.form_type.value)
		options.clearFormFieldErrors()
		options.populateDynamicFields(options.form_type.value)
	}

	return {
		is_submitting,
		createAddress,
		prepareCreateModal,
	}
}