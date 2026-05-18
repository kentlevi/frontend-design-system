import type { UserOrder } from '~/types/order/user-orders'
import { useOrderDetailContext } from '~/composables/orders/context/useOrderDetailContext'

type Props = {
	order: UserOrder
}

export function useOrderItemUI(props: Props) {

	/**
	 * Context
	 */
	const { selected_id, loadOrderDetail } = useOrderDetailContext()


	/**
	 * Functions
	 */
	function handleClick() {
		if (selected_id.value === props.order.id) return

		loadOrderDetail(props.order.id)
	}


	return {
		handleClick,
	}
}