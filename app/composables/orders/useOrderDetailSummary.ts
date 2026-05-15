import { formatPrice } from '~/utils/currency/formatPrice'
import { useOrderDetailContext } from '~/composables/orders/context/useOrderDetailContext'

export function useOrderDetailSummary() {

	/**
	 * Context
	 */
	const { payment_summary, payment_loading } = useOrderDetailContext()


	/**
	 * Computed
	 */
	const summary_data = computed(() => payment_summary.value?.payment_summary ?? null)

	const subtotal = computed(() => formatPrice(summary_data.value?.subtotal_cost))

	const shipping = computed(() => formatPrice(summary_data.value?.shipping_cost))

	const discount = computed(() => `-${formatPrice(summary_data.value?.total_discount)}`)

	const total = computed(() => formatPrice(summary_data.value?.total_cost))


	return {
		summary_data,
		subtotal,
		shipping,
		discount,
		total,
		payment_loading,
	}
}