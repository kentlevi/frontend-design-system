import type { OrderDetailItem } from '~/types/order/order-detail'
import { useOrderDetailContext } from '~/composables/orders/context/useOrderDetailContext'

export function useOrderDetailList() {

	/**
	 * Context
	 */
	const { order_items } = useOrderDetailContext()


	/**
	 * Computed
	 */
	const items = computed<OrderDetailItem[]>(() =>
		order_items.value?.order_items ?? []
	)


	return {
		items,
	}
}