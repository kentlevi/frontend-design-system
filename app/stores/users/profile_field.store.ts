import type { ProfileFieldDefinition } from "~/types/account/profile"

export const useProfileFieldsStore = defineStore('dynamic_profile_fields', () => {

	/** Store state */
	const dynamic_profile_fields = ref<ProfileFieldDefinition[]>([])
	const has_fetched_dynamic_fields = ref(false)

	/** Functions */
	function setProfileDynamicFields(fields: ProfileFieldDefinition[]) {
		dynamic_profile_fields.value = fields
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
		dynamic_profile_fields,
		has_fetched_dynamic_fields,

		/** Actions */
		setProfileDynamicFields,

		/** Loaders */
		isLoading,
		startLoading,
		stopLoading,
	}
})