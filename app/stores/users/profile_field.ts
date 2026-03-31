import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchPersonalFieldDefinitions } from '~/services/profile/personalForm.service'
import type { ProfileFieldDefinition } from '~/types/account/profile'

/**
 * Profile field store state
 */
export interface ProfileFieldsState {
	dynamic_profile_fields: ProfileFieldDefinition[]
	loaded_country_id: number | null
	is_loading: boolean
	is_loaded: boolean
	error_message: string
	pending_request: Promise<void> | null
}

/**
 * Initial profile field state factory
 */
const initial_profile_fields_state = (): ProfileFieldsState => ({
	dynamic_profile_fields: [],
	loaded_country_id: null,
	is_loading: false,
	is_loaded: false,
	error_message: '',
	pending_request: null,
})

/**
 * Profile fields store
 */
export const useProfileFieldsStore = defineStore('profile_fields', () => {
	/** Initial state snapshot */
	const initial_state = initial_profile_fields_state()

	/** Store state */
	const dynamic_profile_fields = ref<ProfileFieldDefinition[]>(
		initial_state.dynamic_profile_fields
	)
	const loaded_country_id = ref<number | null>(initial_state.loaded_country_id)
	const is_loading = ref<boolean>(initial_state.is_loading)
	const is_loaded = ref<boolean>(initial_state.is_loaded)
	const error_message = ref<string>(initial_state.error_message)
	const pending_request = ref<Promise<void> | null>(initial_state.pending_request)

	/**
	 * Whether store has any field definitions
	 */
	const has_dynamic_profile_fields = computed<boolean>(() => {
		return dynamic_profile_fields.value.length > 0
	})

	/**
	 * Replace dynamic profile fields
	 */
	function setDynamicProfileFields(fields: ProfileFieldDefinition[]) {
		dynamic_profile_fields.value = fields
	}

	/**
	 * Clear dynamic profile fields
	 */
	function clearDynamicProfileFields() {
		dynamic_profile_fields.value = []
		loaded_country_id.value = null
		is_loaded.value = false
		error_message.value = ''
	}

	/**
	 * Fetch dynamic profile fields from backend
	 */
	async function fetchDynamicProfileFields(country_id: number): Promise<void> {
		/** Reuse active request if one already exists */
		if (pending_request.value) {
			return pending_request.value
		}

		pending_request.value = (async () => {
			is_loading.value = true
			error_message.value = ''

			try {
				/** Fetch field definitions from backend */
				const response = await fetchPersonalFieldDefinitions()

				/** Normalize response data */
				const fields = Array.isArray(response.data) ? response.data : []

				/** Store successful result */
				dynamic_profile_fields.value = fields
				loaded_country_id.value = country_id
				is_loaded.value = true
			} catch (error: unknown) {
				/** Reset state on failure */
				dynamic_profile_fields.value = []
				loaded_country_id.value = null
				is_loaded.value = false
				error_message.value = 'Failed to load profile fields.'
				throw error
			} finally {
				/** Always clear loading state and request lock */
				is_loading.value = false
				pending_request.value = null
			}
		})()

		return pending_request.value
	}

	/**
	 * Ensure fields are loaded for current country
	 */
	async function ensureLoaded(
		country_id: number,
		force_refresh = false
	): Promise<void> {
		/** Skip fetch if current country data is already loaded */
		if (
			!force_refresh &&
			is_loaded.value &&
			loaded_country_id.value === country_id
		) {
			return
		}

		await fetchDynamicProfileFields(country_id)
	}

	/**
	 * Reset store state
	 */
	function resetState() {
		const fresh_state = initial_profile_fields_state()

		dynamic_profile_fields.value = fresh_state.dynamic_profile_fields
		loaded_country_id.value = fresh_state.loaded_country_id
		is_loading.value = fresh_state.is_loading
		is_loaded.value = fresh_state.is_loaded
		error_message.value = fresh_state.error_message
		pending_request.value = fresh_state.pending_request
	}

	return {
		/** State */
		dynamic_profile_fields,
		loaded_country_id,
		is_loading,
		is_loaded,
		error_message,
		pending_request,

		/** Getters */
		has_dynamic_profile_fields,

		/** Actions */
		setDynamicProfileFields,
		clearDynamicProfileFields,
		fetchDynamicProfileFields,
		ensureLoaded,
		resetState,
	}
})