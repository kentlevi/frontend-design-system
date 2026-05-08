export function useAppInit() {
	const user_store = ref<{ profile?: unknown; country_id?: string } | null>(null)
	const profile_fields_store = {
		ensureLoaded: (_country_id?: string, _force_refresh = false) => {},
	}

	/**
	 * Initialize app data needed after authentication
	 */
	async function initUserApp(force_refresh = false): Promise<void> {
		/** No authenticated user yet */
		if (!user_store.value?.profile) {
			return
		}

		const country_id = user_store.value.country_id

		/** Load country-based field definitions */
		profile_fields_store.ensureLoaded(country_id, force_refresh)

		/** Load other user-scoped data here */
	}

	return {
		initUserApp,
	}
}
