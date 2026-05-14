import { useOrderDetailContext } from '~/composables/orders/context/useOrderDetailContext'
import { useUserOrdersStore } from '~/stores/orders/user-orders.store'

export function useOrdersMain() {

	/**
	 * Context
	 */
	const { selected_id, loadOrderDetail } = useOrderDetailContext()
	const store = useUserOrdersStore()


	/**
	 * Computed
	 */
	const selected_order = computed(() => selected_id.value ? store.findById(selected_id.value) : null)


	/**
	 * Auto-select
	 */
	watchEffect(() => {
		if (selected_id.value !== null) return
		const first = store.ongoing[0] ?? store.action_required[0] ?? store.completed[0]
		if (!first) return
		loadOrderDetail(first.id)
	})


	return {
		selected_order,
	}
}