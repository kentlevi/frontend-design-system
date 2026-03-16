import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { PreferenceState } from '~/types/account/preferences'
import type {
	UserIdentity,
	UserProfile,
	UserFieldValue,
	OnboardingProfile,
	UserState
} from '~/types/auth/user'

/**
 * Initial user state factory
 */
function createInitialUserState(): UserState {
	return {
		id: 0,
		code: '',
		email: '',
		country_id: 0,

		onboardingProfile: null,
		profile: null,

		preference: {
			id: 0,
			user_id: 0,
			offers_emails: false,
			reviews_emails: false,
			confirmations_emails: false,
			unit_of_measurement: 'mm',
			guided_tour_enabled: false,
			created_at: '',
			updated_at: ''
		} as PreferenceState
	}
}

/**
 * User Store
 */
export const useUsersStore = defineStore('users', () => {

	/* --------------------------------------------------------------------------
     * State
     * -------------------------------------------------------------------------- */

	const state = ref<UserState>(createInitialUserState())

	/* --------------------------------------------------------------------------
     * Actions
     * -------------------------------------------------------------------------- */

	/**
     * Set authenticated user
     */
	function setUser(user: UserIdentity & { profile: UserProfile | null }): void {
		state.value.id = user.id
		state.value.code = user.code
		state.value.email = user.email
		state.value.country_id = user.country_id
		state.value.profile = user.profile
	}

	/**
     * Reset entire store
     */
	function clearUser(): void {
		state.value = createInitialUserState()
	}

	/**
     * Set onboarding profile
     */
	function setOnboardingProfile(profile: OnboardingProfile): void {
		state.value.onboardingProfile = profile
	}

	/**
     * Clear onboarding profile
     */
	function clearOnboardingProfile(): void {
		state.value.onboardingProfile = null
	}

	/**
     * Replace profile field values
     */
	function setProfileUserFieldValues(user_field_values: UserFieldValue[]): void {
		if (!state.value.profile) return
		state.value.profile.user_field_values = user_field_values
	}

	/**
     * Update single preference field
     */
	function setPreferenceField<K extends keyof PreferenceState>(
		field_name: K,
		field_value: PreferenceState[K]
	): void {
		state.value.preference[field_name] = field_value
	}

	/**
     * Merge preference fields
     */
	function setPreferenceFields(preference_fields: Partial<PreferenceState>): void {
		state.value.preference = {
			...state.value.preference,
			...preference_fields
		}
	}

	/* --------------------------------------------------------------------------
     * Expose
     * -------------------------------------------------------------------------- */

	return {
		state,

		setUser,
		clearUser,

		setOnboardingProfile,
		clearOnboardingProfile,

		setProfileUserFieldValues,

		setPreferenceField,
		setPreferenceFields
	}
})