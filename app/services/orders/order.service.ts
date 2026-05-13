import { fetchUserOrders } from './api.service'
import { useUserOrdersStore } from '~/stores/orders/user-orders.store'
import type { UserOrderType } from '~/types/order/user-orders'

export async function loadUserOrders(type: UserOrderType) {
	const store = useUserOrdersStore()

	if (store.isLoading('fetch', type)) return

	store.startLoading('fetch', type)

	try {
		const response = await fetchUserOrders(type)

		if (response.success && response.data) {
			store.setOrders(type, response.data)
		}
	} catch (error) {
		console.log('error', error)
	} finally {
		store.stopLoading('fetch', type)
	}
}