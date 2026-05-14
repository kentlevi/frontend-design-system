import { loadUserOrders } from '~/services/orders/order.service'

export function useUserOrdersPage() {

	loadUserOrders('ongoing')
	loadUserOrders('action_required')
	loadUserOrders('completed')

}