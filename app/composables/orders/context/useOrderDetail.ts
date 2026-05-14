import type { OrderItemsData, OrderPaymentData } from '~/types/order/order-detail'
import type { OrderAddressItem } from '~/types/order/order-address'
import { loadItems, loadPayment, loadAddresses } from '~/services/orders/order-detail.service'

export function useOrderDetail() {

	/**
	 * State
	 */
	const selected_id = ref<number | null>(null)
	const order_items = ref<OrderItemsData | null>(null)
	const payment_summary = ref<OrderPaymentData | null>(null)
	const order_addresses = ref<OrderAddressItem[]>([])

	const items_loading = ref(false)
	const payment_loading = ref(false)
	const addresses_loading = ref(false)


	/**
	 * Functions
	 */
	async function fetchItems(order_id: number) {
		items_loading.value = true

		try {
			const response = await loadItems(order_id)

			if (response?.success && response.data) {
				order_items.value = response.data
			}
		} finally {
			items_loading.value = false
		}
	}

	async function fetchPayment(order_id: number) {
		payment_loading.value = true

		try {
			const response = await loadPayment(order_id)

			if (response?.success && response.data) {
				payment_summary.value = response.data
			}
		} finally {
			payment_loading.value = false
		}
	}

	async function fetchAddresses(order_id: number) {
		addresses_loading.value = true

		try {
			const response = await loadAddresses(order_id)

			if (response?.success && response.data) {
				order_addresses.value = response.data
			}
		} finally {
			addresses_loading.value = false
		}
	}

	function loadOrderDetail(id: number) {
		selected_id.value = id
		order_items.value = null
		payment_summary.value = null
		order_addresses.value = []

		fetchItems(id)
		fetchPayment(id)
		fetchAddresses(id)
	}


	return {
		selected_id,
		order_items,
		payment_summary,
		order_addresses,
		items_loading,
		payment_loading,
		addresses_loading,

		loadOrderDetail,
	}
}