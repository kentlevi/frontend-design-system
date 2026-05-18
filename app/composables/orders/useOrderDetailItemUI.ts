import { useUploadArtworkModal } from '~/composables/features/account/orders/useUploadArtworkModal'
import { useReplaceArtworkModal } from '~/composables/features/account/orders/useReplaceArtworkModal'
import { useArtworkDetailModal } from '~/composables/features/account/orders/useArtworkDetailModal'

export function useOrderDetailItemUI() {

	/**
	 * State
	 */
	const { open_modal } = useUploadArtworkModal()
	const { open_modal: open_replace_artwork_modal } = useReplaceArtworkModal()
	const { open_modal: open_artwork_detail_modal } = useArtworkDetailModal()


	/**
	 * Functions
	 */
	function handleUploadArtwork() {
		open_modal()
	}

	function handleReplaceArtwork() {
		open_replace_artwork_modal()
	}

	function handleViewArtwork() {
		open_artwork_detail_modal()
	}


	return {
		handleUploadArtwork,
		handleReplaceArtwork,
		handleViewArtwork,
	}
}