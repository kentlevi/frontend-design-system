import { defineStore } from 'pinia'
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
const initial_user_state = (): UserState => ({
	id: 0,
	code: '',
	email: '',
	country_id: 0,
	onboardingProfile: null,
	profile: null
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