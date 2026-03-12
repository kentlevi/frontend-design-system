export function useAppInit() {
	const user_store = useUserStore()
	const profile_fields_store = useProfileFieldsStore()

	/**
	 * Initialize app data needed after authentication
	 */
	async function initUserApp(force_refresh = false): Promise<void> {
		/** No authenticated user yet */
		if (!user_store.profile) {
			return
		}

		const country_id = user_store.country_id

		/** Load country-based field definitions */
		profile_fields_store.ensureLoaded(country_id, force_refresh)

		/** Load other user-scoped data here */
	}

	return {
		initUserApp,
	}
}