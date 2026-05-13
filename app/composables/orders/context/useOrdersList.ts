import { useUserOrdersStore } from "~/stores/orders/user-orders.store"

export function useOrdersList() {

	/**
     * Stores
     */
	const store = useUserOrdersStore()


	/**
     * Computed
     */
	const ongoing         = computed(() => store.ongoing)
	const action_required = computed(() => store.action_required)
	const completed       = computed(() => store.completed)
	const is_loading = computed(() =>
		store.isLoading('fetch', 'ongoing') ||
		store.isLoading('fetch', 'action-required') ||
		store.isLoading('fetch', 'completed')
	)


	return {
		ongoing,
		action_required,
		completed,
		is_loading,
	}
}