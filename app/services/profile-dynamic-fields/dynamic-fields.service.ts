import { fetchDynamicFields } from "./api.service";
import { useProfileFieldsStore } from "~/stores/users/profile_field.store";

let dynamic_fields_request: Promise<void> | null = null

export async function ensureDynamicFields() {
	const store = useProfileFieldsStore()

	if (store.has_fetched_dynamic_fields) return

	if (dynamic_fields_request) {
		await dynamic_fields_request
		return
	}

	dynamic_fields_request = (async () => {
		store.startLoading('fetch')

		try {
			const response = await fetchDynamicFields()

			if (response.success) {
				store.setProfileDynamicFields(
					Array.isArray(response.data) ? response.data : []
				)

				store.has_fetched_dynamic_fields = true
			}
		} catch (error) {
			console.log('error', error)
		} finally {
			store.stopLoading('fetch')
			dynamic_fields_request = null
		}
	})()

	await dynamic_fields_request
}