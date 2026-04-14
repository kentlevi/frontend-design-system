import { setDefault } from "~/services/profile/address.service";
import { useAddressStore } from "~/stores/address";
import type { AddressMap, AddressType } from "~/types/address";
import { useAddressHelper } from "~/utils/address/index"

type UseAddressDefaultFlowOptions = {
	openConfirmDefaultChangeModal: () => void
}

export function useAddressDefaultFlow(options: UseAddressDefaultFlowOptions) {

	/**
     * Utils
     */
	const { getAddressListByType } = useAddressHelper()

	/**
     * Store
     */
	const address_store = useAddressStore()
	const loading_overlay_store = useLoadingOverlayStore()
	const toast_store = useToastStore()

	const pending_default_address = ref<AddressMap[AddressType] | null>(null)
	const current_default_address = ref<AddressMap[AddressType] | null>(null)

	async function setAddressDefault(type: AddressType, id: number) {
		try {
			const response = await setDefault(id)

			if (response.success) {
				address_store.setDefault(type, id)
			}

			return response
		} catch (_error: unknown) {
			console.log(_error);
		}
	}

	async function setAddressDefaultWithToast(type: AddressType, id: number) {
		startUpdateOverlay()

		try {
			const response = await setAddressDefault(type, id)

			toast_store.handleApiResponse(response)
		} catch (_error: unknown) {
			console.log(_error);
		} finally {
			loading_overlay_store.stopLoading('set_to_default')
		}
	}

	async function startDefaultFlow(selected_address: AddressMap[AddressType]) {
		if (!selected_address.is_default) {
			const existing_default = getAddressListByType(selected_address.type)
				.find((address) => address.is_default && address.id !== selected_address.id)

			if (existing_default) {
				current_default_address.value = existing_default
				pending_default_address.value = selected_address
				options.openConfirmDefaultChangeModal()
				return;
			}
		}

		setAddressDefaultWithToast(selected_address.type, selected_address.id)
	}

	/** Overlays */
	function startUpdateOverlay() {
		loading_overlay_store.startLoading('set_to_default', {
			showCopy: true,
			testId: 'account-address-set-default-overlay',
			position: 'fixed'
		})
	}

	return {
		pending_default_address,
		current_default_address,

		setAddressDefault,
		setAddressDefaultWithToast,
		startDefaultFlow
	}
}