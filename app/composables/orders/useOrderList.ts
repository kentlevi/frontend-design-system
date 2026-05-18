import type { UserOrderType } from '~/types/order/user-orders'
import { useOrdersListContext } from './context/useOrdersListContext'
import { ORDER_STATUS_LABELS } from '~/constants/order-detail/status'

type Props = {
	status: UserOrderType
}

export function useOrderList(props: Props) {

	/**
	 * Context
	 */
	const context = useOrdersListContext()


	/**
	 * Computed
	 */
	const orders = computed(() => context[props.status].value)
	const label = computed(() => ORDER_STATUS_LABELS[props.status])
	const is_status_visible = computed(() => context.selected_statuses.value.has(props.status))
	const has_orders = computed(() => orders.value.length > 0 && is_status_visible.value)


	return {
		orders,
		label,
		has_orders,
	}
}