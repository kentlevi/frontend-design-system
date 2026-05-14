import { useOrderDetailContext } from '~/composables/orders/context/useOrderDetailContext'
import { useUserOrdersStore } from '~/stores/orders/user-orders.store'

export function useOrdersMain() {

	/**
	 * Context
	 */
	const { selected_id } = useOrderDetailContext()
	const orders_store = useUserOrdersStore()


	/**
	 * Computed
	 */
	const selected_order = computed(() => selected_id.value ? orders_store.findById(selected_id.value) : null)


	return {
		selected_order,
	}
}