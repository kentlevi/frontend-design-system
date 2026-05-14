import { useOrderDetailStore } from '~/stores/orders/order-detail.store'
import { fetchOrderAddresses, fetchOrderItems, fetchOrderPayment } from './api.service'

export async function loadItems(order_id: number) {
	const store = useOrderDetailStore()

	if (store.isLoading('fetch_items')) return

	store.startLoading('fetch_items')

	try {
		const response = await fetchOrderItems(order_id)

		return response
	} catch (error) {
		console.log('error', error)
	} finally {
		store.stopLoading('fetch_items')
	}
}

export async function loadPayment(order_id: number) {
	const store = useOrderDetailStore()

	if (store.isLoading('fetch_payment')) return

	store.startLoading('fetch_payment')

	try {
		const response = await fetchOrderPayment(order_id)

		return response
	} catch (error) {
		console.log('error', error)
	} finally {
		store.stopLoading('fetch_payment')
	}
}

export async function loadAddresses(order_id: number) {
	const store = useOrderDetailStore()

	if (store.isLoading('fetch_addresses')) return

	store.startLoading('fetch_addresses')

	try {
		const response = await fetchOrderAddresses(order_id)

		return response
	} catch (error) {
		console.log('error', error)
	} finally {
		store.stopLoading('fetch_addresses')
	}
}