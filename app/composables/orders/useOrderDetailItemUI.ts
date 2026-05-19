import type { OrderDetailItem } from '~/types/order/order-detail'
import { useUploadArtworkModalContext } from '~/composables/features/account/orders/context/useUploadArtworkModalContext'
import { useReplaceArtworkModal } from '~/composables/features/account/orders/useReplaceArtworkModal'
import { useArtworkDetailModal } from '~/composables/features/account/orders/useArtworkDetailModal'

type Props = {
	item: OrderDetailItem
}

export function useOrderDetailItemUI(props: Props) {

	/**
	 * State
	 */
	const { open_modal } = useUploadArtworkModalContext()
	const { open_modal: open_replace_artwork_modal } = useReplaceArtworkModal()
	const { open_modal: open_artwork_detail_modal } = useArtworkDetailModal()


	/**
	 * Functions
	 */
	function handleUploadArtwork() {
		open_modal(props.item)
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