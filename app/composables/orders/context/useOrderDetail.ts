import type { OrderItemsData, OrderPaymentData } from '~/types/order/order-detail'
import type { OrderAddressItem } from '~/types/order/order-address'
import { loadItems, loadPayment, loadAddresses } from '~/services/orders/order-detail.service'
import { useCountry } from '~/composables/app/country/useCountry'

export function useOrderDetail() {

	/**
	 * Route
	 */
	const route = useRoute()
	const { withCountry } = useCountry()


	/**
	 * State
	 */
	const order_items = ref<OrderItemsData | null>(null)
	const payment_summary = ref<OrderPaymentData | null>(null)
	const order_addresses = ref<OrderAddressItem[]>([])

	const items_loading = ref(false)
	const payment_loading = ref(false)
	const addresses_loading = ref(false)

	const has_selected = ref(false)


	/**
	 * Computed
	 */
	const selected_id = computed<number | null>(() => {
		const raw = route.params.id
		const value = Array.isArray(raw) ? raw[0] : raw
		const id = Number(value)
		return Number.isFinite(id) && id > 0 ? id : null
	})


	/**
	 * Functions
	 */
	async function fetchItems(order_id: number) {
		items_loading.value = true

		try {
			const response = await loadItems(order_id)

			if (order_id !== selected_id.value) return

			if (response?.success && response.data) {
				order_items.value = response.data
			}
		} finally {
			if (order_id === selected_id.value) {
				items_loading.value = false
			}
		}
	}

	async function fetchPayment(order_id: number) {
		payment_loading.value = true

		try {
			const response = await loadPayment(order_id)

			if (order_id !== selected_id.value) return

			if (response?.success && response.data) {
				payment_summary.value = response.data
			}
		} finally {
			if (order_id === selected_id.value) {
				payment_loading.value = false
			}
		}
	}

	async function fetchAddresses(order_id: number) {
		addresses_loading.value = true

		try {
			const response = await loadAddresses(order_id)

			if (order_id !== selected_id.value) return

			if (response?.success && response.data) {
				order_addresses.value = response.data
			}
		} finally {
			if (order_id === selected_id.value) {
				addresses_loading.value = false
			}
		}
	}

	function loadOrderDetail(id: number) {
		has_selected.value = true
		navigateTo(withCountry(`/account/orders/${id}`))
	}


	/**
	 * Watch selected_id → trigger fetches
	 */
	watch(selected_id, (id) => {
		if (id === null) return

		order_items.value = null
		payment_summary.value = null
		order_addresses.value = []

		fetchItems(id)
		fetchPayment(id)
		fetchAddresses(id)
	}, { immediate: true })


	return {
		selected_id,
		order_items,
		payment_summary,
		order_addresses,
		items_loading,
		payment_loading,
		addresses_loading,
		has_selected,

		loadOrderDetail,
		fetchItems,
	}
}