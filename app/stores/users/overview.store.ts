import type { OverviewData } from "~/types/account/profile"

export const useOverviewStore = defineStore('overview', () => {
	const overview = ref<OverviewData | null>(null)
	const is_loading = ref(false)
	const error = ref<Error | null>(null)

	function setOverview(value: OverviewData | null) {
		overview.value = value
	}

	function setLoading(value: boolean) {
		is_loading.value = value
	}

	function setError(value: Error | null) {
		error.value = value
	}

	function clearCustomerOverviewState() {
		overview.value = null
		is_loading.value = false
		error.value = null
	}

	return {
		overview,
		is_loading,
		error,
		setOverview,
		setLoading,
		setError,
		clearCustomerOverviewState,
	}
})