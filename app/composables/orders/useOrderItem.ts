import type { UserOrder } from '~/types/order/user-orders'
import { useOrderDetailContext } from '~/composables/orders/context/useOrderDetailContext'

type Props = {
	order: UserOrder
}

export function useOrderItem(props: Props) {

	/**
	 * Context
	 */
	const { selected_id } = useOrderDetailContext()


	/**
	 * Computed
	 */
	const formatted_date = computed(() => {
		const d = new Date(props.order.created_at)
		return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
	})

	const is_selected = computed(() => selected_id.value === props.order.id)


	return {
		formatted_date,
		is_selected,
	}
}