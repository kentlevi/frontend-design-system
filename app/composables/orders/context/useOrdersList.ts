import { useUserOrdersStore } from "~/stores/orders/user-orders.store"

export function useOrdersList() {

	/**
	 * Stores
	 */
	const user_orders_store = useUserOrdersStore()


	/**
	 * Computed
	 */
	const ongoing         = computed(() => user_orders_store.ongoing)
	const action_required = computed(() => user_orders_store.action_required)
	const to_receive      = computed(() => user_orders_store.to_receive)
	const completed       = computed(() => user_orders_store.completed)
	const cancelled       = computed(() => user_orders_store.cancelled)
	const is_loading      = computed(() =>
		user_orders_store.isLoading('fetch', 'ongoing') ||
		user_orders_store.isLoading('fetch', 'action_required') ||
		user_orders_store.isLoading('fetch', 'to_receive') ||
		user_orders_store.isLoading('fetch', 'completed') ||
		user_orders_store.isLoading('fetch', 'cancelled')
	)


	return {
		ongoing,
		action_required,
		to_receive,
		completed,
		cancelled,
		is_loading,
	}
}