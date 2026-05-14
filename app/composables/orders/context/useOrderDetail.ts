import type { OrderItemsData, OrderPaymentData } from '~/types/order/order-detail'
import type { OrderAddressItem } from '~/types/order/order-address'

export function useOrderDetail() {

	/**
	 * State
	 */
	const selected_id = ref<number | null>(null)
	const order_items = ref<OrderItemsData | null>(null)
	const payment_summary = ref<OrderPaymentData | null>(null)
	const order_addresses = ref<OrderAddressItem[]>([])


	return {
		selected_id,
		order_items,
		payment_summary,
		order_addresses,
	}
}