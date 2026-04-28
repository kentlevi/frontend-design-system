import type { AddressDynamicFields } from "~/types/user-address"


export const useAddressFieldStore = defineStore('dynamic_address_fields', () => {

	/** Store state */
	const dynamic_address_fields = ref<AddressDynamicFields[]>([])
	const has_fetched_dynamic_fields = ref(false)

	/** Functions */
	function setUserAddressDynamicFields(fields: AddressDynamicFields[]) {
		dynamic_address_fields.value = fields
	}






	/** Loader */
	type Action = 'fetch'

	const loader_map = ref<Record<string, boolean>>({})

	function getKey(action: Action) {
		return action
	}

	function isLoading(action: Action) {
		return !!loader_map.value[getKey(action)]
	}

	function startLoading(action: Action) {
		loader_map.value[getKey(action)] = true
	}

	function stopLoading(action: Action) {
		loader_map.value[getKey(action)] = false
	}

	return {
		/** State */
		dynamic_address_fields,
		has_fetched_dynamic_fields,

		/** Actions */
		setUserAddressDynamicFields,

		/** Loaders */
		isLoading,
		startLoading,
		stopLoading,
	}
})