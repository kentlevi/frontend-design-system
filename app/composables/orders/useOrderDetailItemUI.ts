import { useUploadArtworkModal } from '~/composables/features/account/orders/useUploadArtworkModal'

export function useOrderDetailItemUI() {

	/**
	 * State
	 */
	const { open_modal } = useUploadArtworkModal()


	/**
	 * Functions
	 */
	function handleUploadArtwork() {
		open_modal()
	}


	return {
		handleUploadArtwork,
	}
}