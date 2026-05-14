import type { UserOrder } from '~/types/order/user-orders'

type Props = {
	order: UserOrder
}

export function useOrderItem(props: Props) {

	/**
	 * Computed
	 */
	const formatted_date = computed(() => {
		const d = new Date(props.order.created_at)
		return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
	})


	return {
		formatted_date,
	}
}