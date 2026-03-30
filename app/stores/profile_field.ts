import { defineStore } from 'pinia'
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
export const useProfileFieldsStore = defineStore('profile_fields', {
	/**
	 * Store state
	 */
	state: (): ProfileFieldsState => initial_profile_fields_state(),

	/**
	 * Store getters
	 */
	getters: {
		/**
		 * Whether store has any field definitions
		 */
		has_dynamic_profile_fields: (state): boolean =>
			state.dynamic_profile_fields.length > 0,
	},

	/**
	 * Store actions
	 */
	actions: {
		/**
		 * Replace dynamic profile fields
		 */
		setDynamicProfileFields(fields: ProfileFieldDefinition[]) {
			this.dynamic_profile_fields = fields
		},

		/**
		 * Clear dynamic profile fields
		 */
		clearDynamicProfileFields() {
			this.dynamic_profile_fields = []
			this.loaded_country_id = null
			this.is_loaded = false
			this.error_message = ''
		},

		/**
		 * Fetch dynamic profile fields from backend
		 */
		async fetchDynamicProfileFields(country_id: number): Promise<void> {
			if (this.pending_request) {
				return this.pending_request
			}

			this.pending_request = (async () => {
				this.is_loading = true
				this.error_message = ''

				try {
					const response = await fetchPersonalFieldDefinitions()
					const fields = Array.isArray(response.data) ? response.data : []

					this.dynamic_profile_fields = fields
					this.loaded_country_id = country_id
					this.is_loaded = true
				} catch (error: unknown) {
					this.dynamic_profile_fields = []
					this.loaded_country_id = null
					this.is_loaded = false
					this.error_message = 'Failed to load profile fields.'
					throw error
				} finally {
					this.is_loading = false
					this.pending_request = null
				}
			})()

			return this.pending_request
		},

		/**
		 * Ensure fields are loaded for current country
		 */
		async ensureLoaded(country_id: number, force_refresh = false): Promise<void> {
			if (
				!force_refresh &&
				this.is_loaded &&
				this.loaded_country_id === country_id
			) {
				return
			}

			await this.fetchDynamicProfileFields(country_id)
		},

		/**
		 * Reset store state
		 */
		resetState() {
			this.$patch(initial_profile_fields_state())
		},
	},
})