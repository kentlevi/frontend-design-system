import { deleteUserAddress } from "~/services/profile/address.service"
import type { AddressMap, AddressType, BillingAddress, DropAddress, ShippingAddress } from "~/types/address"

type UseAddressDeleteFormOptions = {
	shipping_address: Ref<ShippingAddress[]>
	billing_address: Ref<BillingAddress[]>
	drop_address: Ref<DropAddress[]>
	openDefaultShippingModal: () => void
	closeDeleteAddressModal: () => void
}

export function useAddressDeleteForm(options: UseAddressDeleteFormOptions) {

	/**
     * Store
     */
	const toast_store = useToastStore()
	const loading_overlay_store = useLoadingOverlayStore()

	const pending_delete_address = ref<AddressMap[AddressType] | null>(null)


	function getReplacementAddresses(type: AddressType) {
		const lists = {
			shipping: options.shipping_address.value,
			billing: options.billing_address.value,
			drop: options.drop_address.value
		}

		const list = lists[type];
		const pending = pending_delete_address.value

		if (!pending || pending.type !== type) {
			return list
		}

		return list.filter(address => address.id !== pending.id)
	}

	async function confirmDeleteAddress() {
		const deleting_address = pending_delete_address.value
		if (!deleting_address) return

		options.closeDeleteAddressModal()
		startUpdateOverlay()

		const should_show_default_shipping_modal = deleting_address.is_default && getReplacementAddresses(deleting_address.type).length > 0

		if (should_show_default_shipping_modal) {
			options.openDefaultShippingModal()
			return
		}

		try {
			const response = await deleteUserAddress(deleting_address.id)

			if (response.success) {
				toast_store.handleApiResponse(response)
			}

		} catch (_errror: unknown) {
			console.log(_errror);
		} finally {
			loading_overlay_store.stopLoading('delete_address')
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

		getReplacementAddresses,
		confirmDeleteAddress,
	}

}