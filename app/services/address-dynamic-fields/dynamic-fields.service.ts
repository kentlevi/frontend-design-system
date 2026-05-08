import { useAddressFieldStore } from "~/stores/user-address";
import { fetchDynamicFields } from "./api.service";

let dynamic_fields_request: Promise<void> | null = null

export async function ensureDynamicFields() {
	const store = useAddressFieldStore()

	if (store.has_fetched_dynamic_fields) return

	if (dynamic_fields_request) {
		await dynamic_fields_request
		return
	}

	dynamic_fields_request = (async () => {
		try {
			const response = await fetchDynamicFields()

			if (response.success) {
				store.setUserAddressDynamicFields(
					Array.isArray(response.data) ? response.data : []
				)

				store.has_fetched_dynamic_fields = true
			}
		} catch (error) {
			console.log('error', error)
		} finally {
			dynamic_fields_request = null
		}
	})()

	await dynamic_fields_request
}