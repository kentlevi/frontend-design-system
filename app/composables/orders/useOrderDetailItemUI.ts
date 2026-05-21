import type { OrderDetailItem } from '~/types/order/order-detail'
import { useUploadArtworkModalContext } from '~/composables/features/account/orders/context/useUploadArtworkModalContext'
import { useReplaceArtworkModal } from '~/composables/features/account/orders/useReplaceArtworkModal'
import { useArtworkDetailModal } from '~/composables/features/account/orders/useArtworkDetailModal'
import { loadArtworkActivity } from '~/services/orders/artwork.service'

type Props = {
	item: OrderDetailItem
	index: number
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
		open_modal(props.item, props.index)
	}

	function handleReplaceArtwork() {
		open_replace_artwork_modal()
	}

	function handleViewArtwork() {
		open_artwork_detail_modal()
		loadArtworkActivity(props.item.cart_item_id)
	}


	return {
		handleUploadArtwork,
		handleReplaceArtwork,
		handleViewArtwork,
	}
}