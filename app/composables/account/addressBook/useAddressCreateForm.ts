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

	const { mapApiFieldErrors } = useAddressHelper()

	/**
     * Store
     */
	const address_store = useAddressStore()
	const toast_store = useToastStore()
	const loading_overlay_store = useLoadingOverlayStore()

	/**
     * Functions
     */
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
				const next_errors = mapApiFieldErrors(response.data)
				options.form_field_errors.value = next_errors
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
		options.resetForm(options.form_type.value)
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
	}
}