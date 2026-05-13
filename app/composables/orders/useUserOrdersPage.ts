import { loadUserOrders } from '~/services/orders/order.service'

export function useUserOrdersPage() {

	loadUserOrders('ongoing')
	loadUserOrders('action-required')
	loadUserOrders('completed')

}