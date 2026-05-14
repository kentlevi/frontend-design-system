import { fetchOverview } from './api.service'
import { useOverviewStore } from '~/stores/users/overview.store'

export function useGetOverview() {
	const overview_store = useOverviewStore()
	const { overview, is_loading, error } = storeToRefs(overview_store)
	const { setOverview, setLoading, setError } = overview_store

	async function getOverview() {
		setLoading(true)
		setError(null)

		try {
			const response = await fetchOverview()

			setOverview(response?.data ?? null)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}

	return {
		overview,
		is_loading,
		error,
		getOverview,
	}
}