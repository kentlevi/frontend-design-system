import { useOrderDetailContext } from '~/composables/orders/context/useOrderDetailContext'
import { useOrdersListContext } from '~/composables/orders/context/useOrdersListContext'
import { useUserOrdersStore } from '~/stores/orders/user-orders.store'

export function useOrdersMain() {

	/**
	 * Context
	 */
	const {
		selected_id,
		loadOrderDetail,
		items_loading,
		payment_loading,
		addresses_loading,
	} = useOrderDetailContext()

	const { is_loading: is_orders_fetching } = useOrdersListContext()


	/**
	 * Store
	 */
	const user_orders_store = useUserOrdersStore()


	/**
	 * Computed
	 */
	const selected_order = computed(() => selected_id.value ? user_orders_store.findById(selected_id.value) : null)

	const is_loading = computed(() =>
		items_loading.value || payment_loading.value || addresses_loading.value
	)


	/**
	 * Auto-select
	 */
	watchEffect(() => {
		if (selected_id.value !== null) return
		if (is_orders_fetching.value) return

		const first = user_orders_store.ongoing[0]
			?? user_orders_store.action_required[0]
			?? user_orders_store.to_receive[0]
			?? user_orders_store.completed[0]
			?? user_orders_store.cancelled[0]
		if (!first) return
		loadOrderDetail(first.id)
	})


	return {
		selected_order,
		is_loading,
	}
}