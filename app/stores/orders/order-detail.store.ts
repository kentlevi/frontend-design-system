export const useOrderDetailStore = defineStore('order-detail', () => {
	type OrderDetailAction = 'fetch_items' | 'fetch_payment' | 'fetch_addresses'

	const loader_map = ref<Record<string, boolean>>({})

	function isLoading(action: OrderDetailAction) {
		return !!loader_map.value[action]
	}

	function startLoading(action: OrderDetailAction) {
		loader_map.value[action] = true
	}

	function stopLoading(action: OrderDetailAction) {
		loader_map.value[action] = false
	}

	return {
		isLoading,
		startLoading,
		stopLoading,
	}
})