import { deleteUserAddress } from "~/services/profile/address.service"
import { useAddressStore } from "~/stores/address"
import type { AddressMap, AddressType, BillingAddress, DropAddress, ShippingAddress } from "~/types/address"

type UseAddressDeleteFormOptions = {
	shipping_address: Ref<ShippingAddress[]>
	billing_address: Ref<BillingAddress[]>
	drop_address: Ref<DropAddress[]>
	openDeleteDialog: () => void
	closeDeleteDialog: () => void
	openDefaultShippingModal: () => void
}

export function useAddressDeleteForm(options: UseAddressDeleteFormOptions) {

	/**
     * Store
     */
	const address_store = useAddressStore()
	const toast_store = useToastStore()
	const loading_overlay_store = useLoadingOverlayStore()

	const pending_delete_address = ref<AddressMap[AddressType] | null>(null)


	function getReplacementAddresses<T extends AddressType>(type: T): AddressMap[T][] {
		const lists: { [K in AddressType]: AddressMap[K][] } = {
			shipping: options.shipping_address.value,
			billing: options.billing_address.value,
			drop: options.drop_address.value
		}

		// Keep only the requested address type (defensive if upstream data is mixed)
		const list = lists[type].filter(address => address.type === type) as AddressMap[T][]
		const pending = pending_delete_address.value

		if (!pending || pending.type !== type) {
			return list
		}

		return list.filter(address => address.id !== pending.id)
	}

	async function confirmDeleteAddress() {
		const deleting_address = pending_delete_address.value
		if (!deleting_address) return

		const should_show_default_shipping_modal = deleting_address.is_default
			&& getReplacementAddresses(deleting_address.type).length > 0

		if (should_show_default_shipping_modal) {
			cancelDeleteFlow({reset: false})
			options.openDefaultShippingModal()
			return
		}

		startUpdateOverlay()
		cancelDeleteFlow()

		try {
			const response = await deleteUserAddress(deleting_address.id)

			if (response.success) {
				toast_store.handleApiResponse(response)

				address_store.deleteAddress(deleting_address.type, deleting_address.id)
			}

		} catch (_errror: unknown) {
			console.log(_errror);
		} finally {
			loading_overlay_store.stopLoading('delete_address')
		}
	}




	function startDeleteFlow(address: AddressMap[AddressType]) {
		pending_delete_address.value = address
		options.openDeleteDialog()
	}

	function cancelDeleteFlow({reset = true} = {}) {
		options.closeDeleteDialog()

		if (reset) {
			pending_delete_address.value = null
		}
	}

	/** Overlays */
	function startUpdateOverlay() {
		loading_overlay_store.startLoading('delete_address', {
			showCopy: true,
			testId: 'account-profile-upload-avatar-overlay',
			position: 'fixed'
		})
	}

	return {
		pending_delete_address,

		startDeleteFlow,
		cancelDeleteFlow,
		getReplacementAddresses,
		confirmDeleteAddress,
	}

}