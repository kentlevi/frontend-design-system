import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { PreferenceState } from '~/types/account/preferences'
import type {
	UserIdentity,
	UserProfile,
	UserFieldValue,
	OnboardingProfile,
	UserState,
	RoleState
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
		social: null,
		has_password: false,
		role: {
			code: '',
			name: ''
		} as RoleState,

		onboardingProfile: null,
		profile: null,

		preference: {
			id: 0,
			user_id: 0,
			offers_emails: false,
			reviews_emails: false,
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
     * Getters
     * -------------------------------------------------------------------------- */

	const is_authenticated = computed(() => !!state.value.id)
	const role_code = computed(() => state.value.role?.code)

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
		state.value.social = user.social
		state.value.has_password = user.has_password
		state.value.role = user.role
	}

	/**
     * Update only provided user fields
     */
	function patchUser(user: Partial<UserIdentity & { profile: UserProfile | null }>): void {
		if (user.id !== undefined) state.value.id = user.id
		if (user.code !== undefined) state.value.code = user.code
		if (user.email !== undefined) state.value.email = user.email
		if (user.country_id !== undefined) state.value.country_id = user.country_id
		if (user.profile !== undefined) state.value.profile = user.profile
		if (user.social !== undefined) state.value.social = user.social
		if (user.has_password !== undefined) state.value.has_password = user.has_password
		if (user.role !== undefined) state.value.role = user.role
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

	function setProfileField<K extends keyof UserProfile>(
		field_name: K,
		field_value: UserProfile[K]
	): void {
		/** Stop if profile is not yet available */
		if (!state.value.profile) return

		/** Update only the requested profile field */
		state.value.profile[field_name] = field_value
	}

	/* --------------------------------------------------------------------------
     * Expose
     * -------------------------------------------------------------------------- */

	return {
		state,
		is_authenticated,
		role_code,

		setUser,
		patchUser,
		clearUser,

		setOnboardingProfile,
		clearOnboardingProfile,

		setProfileUserFieldValues,

		setPreferenceField,
		setPreferenceFields,

		setProfileField
	}
})