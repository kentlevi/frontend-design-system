import type { OrderDetailItem } from '~/types/order/order-detail'
import { useOrderDetailItemDisplay } from './useOrderDetailItemDisplay'

type Props = {
	item: OrderDetailItem
	index: number
}

export function useOrderDetailItem(props: Props) {

	/**
	 * Display
	 */
	const {
		cart_item,
		item_number,
		image_src,
		product,
		formatted_size,
		quantity,
		formatted_cost,
		status_label,
		needs_artwork,
	} = useOrderDetailItemDisplay({
		item: () => props.item,
		index: () => props.index,
	})


	return {
		cart_item,
		item_number,
		image_src,
		product,
		formatted_size,
		quantity,
		formatted_cost,
		status_label,
		needs_artwork,
	}
}