import { fetchDynamicFields } from "~/services/profile/address.service"
import type { AddressDynamicFields } from "~/types/address"


export const useAddressFieldStore = defineStore('dynamic_address_fields', () => {

	/** Store state */
	const dynamic_address_fields = ref<AddressDynamicFields[]>([])

	/** Fetch address dynamic fields */
	async function getDynamicFields() {
		try {
			/** Fetch dynamic fields from backend */
			const response = await fetchDynamicFields()

			/** Normalize fields */
			const fields = Array.isArray(response.data) ? response.data : []

			dynamic_address_fields.value = fields
		} catch {
			console.log('error');
		}
	}

	return {
		/** State */
		dynamic_address_fields,

		/** Actions */
		getDynamicFields
	}
})