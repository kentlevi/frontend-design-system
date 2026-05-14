import type { UserOrder } from '~/types/order/user-orders'
import { useOrderDetailContext } from '~/composables/orders/context/useOrderDetailContext'
import { useOrderDetailUIContext } from '~/composables/orders/context/useOrderDetailUIContext'
import { loadItems, loadPayment, loadAddresses } from '~/services/orders/order-detail.service'

type Props = {
	order: UserOrder
}

export function useOrderItemUI(props: Props) {

	/**
	 * Context
	 */
	const { selected_id, order_items, payment_summary, order_addresses } = useOrderDetailContext()
	const { items_loading, payment_loading, addresses_loading } = useOrderDetailUIContext()


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

	function handleClick() {
		const id = props.order.id

		selected_id.value = id
		order_items.value = null
		payment_summary.value = null
		order_addresses.value = []

		fetchItems(id)
		fetchPayment(id)
		fetchAddresses(id)
	}


	return {
		handleClick,
	}
}