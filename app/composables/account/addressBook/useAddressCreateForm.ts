import { addUserAddress } from "~/services/user-address/api.service";
import { useUserAddressStore } from "~/stores/user-address";
import type { AddressFormMap, AddressFormState, AddressType } from "~/types/user-address";
import type { ComputedRef, Ref } from "vue";
import { useAddressHelper } from "~/utils/address";

type UseAddressCreateFormOptions = {
	openCreateFormModal: () => void
	closeFormModal: () => void
	resetForm: (type: AddressType) => void
	clearFormFieldErrors: () => void
	populateDynamicFields: (target_type: AddressType) => void
	setFormErrors: (type: AddressType, errors: Record<string, string>) => void
	form_state: AddressFormState
	form_type: Ref<AddressType>
	active_form: ComputedRef<AddressFormMap[AddressType]>
}

export function useAddressCreateForm(options: UseAddressCreateFormOptions) {

	const is_submitting = ref(false)
	const { mapApiFieldErrors } = useAddressHelper()

	/**
     * Store
     */
	const address_store = useUserAddressStore()
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
				options.setFormErrors(type, next_errors)
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