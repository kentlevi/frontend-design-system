import { useOrderDetailContext } from '~/composables/orders/context/useOrderDetailContext'

export function useOrderDetailActions() {

	/**
	 * Context
	 */
	const { payment_summary } = useOrderDetailContext()


	/**
	 * Computed
	 */
	const payment_status_label = computed(() =>
		payment_summary.value?.payment_status?.name ?? null
	)

	const payment_method_label = computed(() =>
		payment_summary.value?.payment_summary?.payment_method_name ?? null
	)


	return {
		payment_status_label,
		payment_method_label,
	}
}