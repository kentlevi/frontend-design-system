import type { AddressMap, AddressType } from "~/types/user-address";
import { useUserAddressDataContext } from "./useUserAddressDataContext";
import { useUserAddressUIContext } from "./useUserAddressUIContext";
import { deleteAddress, setDefault } from "~/services/user-address/user-address.service";

/** Global variable and functions */
export function useUserAddress() {

	/**
     * Contexts
     */
	const {
		shipping_address,
		billing_address,
		drop_address,
		address_store,
	} = useUserAddressDataContext()
	const { closeDeleteDialog, openDefaultShippingModal, closeDefaultShippingModal } = useUserAddressUIContext()


	/**
     * Store
     */
	const toast_store = useToastStore()
	const loading_overlay_store = useLoadingOverlayStore()


	/**
     * Variables
     */
	const editing_address_snapshot = ref<AddressMap[AddressType] | null>(null)
	const pending_delete_address = ref<AddressMap[AddressType] | null>(null)
	const pending_default_address = ref<AddressMap[AddressType] | null>(null)
	const current_default_address = ref<AddressMap[AddressType] | null>(null)


	/**
     * Functions
     */
	function getReplacementAddresses<T extends AddressType>(type: T): AddressMap[T][] {
		const lists: { [K in AddressType]: AddressMap[K][] } = {
			shipping: shipping_address.value,
			billing: billing_address.value,
			drop: drop_address.value
		}

		/** Keep only the requested address type (defensive if upstream data is mixed) */
		const list = lists[type].filter(address => address.type === type) as AddressMap[T][]
		const pending = pending_delete_address.value

		if (!pending || pending.type !== type) {
			return list
		}

		return list.filter(address => address.id !== pending.id)
	}


	function cancelDeleteFlow({reset = true} = {}) {
		closeDeleteDialog()

		if (reset) {
			pending_delete_address.value = null
		}
	}

	async function confirmDeleteAddress({continue_after_selection = false, overlay = true} = {}) {
		const deleting_address = pending_delete_address.value
		if (!deleting_address) return

		/** First pass: when deleting a default address with replacements, pause delete and show selector modal. */
		if (!continue_after_selection) {
			const should_show_default_shipping_modal = deleting_address.is_default
                    && getReplacementAddresses(deleting_address.type).length > 0

			if (should_show_default_shipping_modal) {
				/** Keep pending delete state so Skip/Save can continue the same delete request. */
				cancelDeleteFlow({reset: false})
				openDefaultShippingModal()
				return
			}
		} else {
			/** Second pass (Skip or Save): close selector modal and continue delete immediately. */
			closeDefaultShippingModal()
		}

		/** Close dialog state before API call so UI is clean while request is in-flight. */
		if (overlay) {
			startDeleteOverlay()
		}
		cancelDeleteFlow()

		try {
			const response = await deleteAddress(deleting_address.id)

			if (response?.success) {
				toast_store.handleApiResponse(response)

				/** Keep local store in sync with backend delete result. */
				address_store.deleteAddress(deleting_address.type, deleting_address.id)
			}

		} catch (_errror: unknown) {
			console.log(_errror);
		} finally {
			loading_overlay_store.stopLoading('delete_address')
		}
	}


	async function setAddressDefault(type: AddressType, id: number) {
		try {
			const response = await setDefault(id)

			if (response?.success) {
				address_store.setDefault(type, id)
			}

			pending_default_address.value = null
			current_default_address.value = null
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






	/** Overlays */
	function startUpdateOverlay() {
		loading_overlay_store.startLoading('set_to_default', {
			showCopy: true,
			testId: 'account-address-set-default-overlay',
			position: 'fixed'
		})
	}

	function startDeleteOverlay() {
		loading_overlay_store.startLoading('delete_address', {
			showCopy: true,
			testId: 'account-profile-delete-address-overlay',
			position: 'fixed'
		})
	}


	return {
		editing_address_snapshot,
		pending_delete_address,
		pending_default_address,
		current_default_address,

		getReplacementAddresses,
		cancelDeleteFlow,
		confirmDeleteAddress,
		setAddressDefault,
		setAddressDefaultWithToast,
	}
}