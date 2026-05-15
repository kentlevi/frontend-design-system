import { loadUserOrders } from '~/services/orders/order.service'

export function useUserOrdersPage() {

	loadUserOrders('ongoing')
	loadUserOrders('action_required')
	loadUserOrders('to_receive')
	loadUserOrders('completed')
	loadUserOrders('cancelled')

}