import type { UserOrderType } from '~/types/order/user-orders'
import { useOrdersListContext } from './context/useOrdersListContext'

type Props = {
	status: UserOrderType
}

const STATUS_LABELS: Record<UserOrderType, string> = {
	ongoing:         'On-Going',
	action_required: 'Action Required',
	completed:       'Completed',
}

export function useOrderList(props: Props) {

	/**
	 * Context
	 */
	const context = useOrdersListContext()


	/**
	 * Computed
	 */
	const orders     = computed(() => context[props.status].value)
	const label      = computed(() => STATUS_LABELS[props.status])
	const has_orders = computed(() => orders.value.length > 0)


	return {
		orders,
		label,
		has_orders,
	}
}