import type { UserOrder } from '~/types/order/user-orders'
import { useOrderDetailContext } from '~/composables/orders/context/useOrderDetailContext'

type Props = {
	order: UserOrder
}

export function useOrderItemUI(props: Props) {

	/**
	 * Context
	 */
	const { loadOrderDetail } = useOrderDetailContext()


	/**
	 * Functions
	 */
	function handleClick() {
		loadOrderDetail(props.order.id)
	}


	return {
		handleClick,
	}
}