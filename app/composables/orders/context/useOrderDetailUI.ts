export function useOrderDetailUI() {

	/**
	 * State
	 */
	const items_loading = ref(false)
	const payment_loading = ref(false)
	const addresses_loading = ref(false)


	return {
		items_loading,
		payment_loading,
		addresses_loading,
	}
}