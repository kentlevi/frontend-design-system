import { defineStore } from 'pinia'

/**
 * Onboarding profile payload
 */
export interface OnboardingProfile {
	firstName: string
	lastName: string
	email: string
	onboarding: boolean
}

/**
 * Dynamic user field value
 */
export interface UserFieldValue {
	id: number
	user_profile_id: number
	country_field_id: number
	country_field_ids?: number | null
	country_fields_id?: number | null
	country_field?: {
		field_key?: string | null
	} | null
	value?: string
}

/**
 * User profile payload
 */
export interface UserProfile {
	id: number
	user_id: number
	file_path_id: number
	file_name: string | null
	user_field_values: UserFieldValue[]
}

/**
 * Basic user identity
 */
export interface UserIdentity {
	id: number
	code: string
	email: string
	country_id: number
}

/**
 * Base user state
 */
export interface UserState extends UserIdentity {
	onboardingProfile: OnboardingProfile | null
	profile: UserProfile | null
}

/**
 * Initial user state factory
 */
const initial_user_state = (): UserState => ({
	id: 0,
	code: '',
	email: '',
	country_id: 0,
	onboardingProfile: null,
	profile: null,
})

/**
 * User store
 */
export const useUserStore = defineStore('user', {
	/**
	 * Store state
	 */
	state: (): UserState => initial_user_state(),

	/**
	 * Store actions
	 */
	actions: {
		/**
		 * Set authenticated user data
		 */
		setUser(user: UserIdentity & { profile: UserProfile | null }) {
			this.$patch({
				id: user.id,
				code: user.code,
				email: user.email,
				country_id: user.country_id,
				profile: user.profile,
			})
		},

		/**
		 * Reset entire user store
		 */
		clearUser() {
			this.$patch(initial_user_state())
		},

		/**
		 * Set onboarding profile data
		 */
		setOnboardingProfile(profile: OnboardingProfile) {
			this.onboardingProfile = profile
		},

		/**
		 * Clear onboarding profile data
		 */
		clearOnboardingProfile() {
			this.onboardingProfile = null
		},

		/**
         * Replace profile user field values
         */
		setProfileUserFieldValues(user_field_values: UserFieldValue[]) {
			if (!this.profile) return

			this.profile.user_field_values = user_field_values
		},
	},
})