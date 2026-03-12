import { defineStore } from 'pinia'
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
const initial_user_state = (): UserState => ({
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
	} as PreferenceState,
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

		/**
		 * Set a single preference field
		 */
		setPreferenceField<K extends keyof PreferenceState>(
			field_name: K,
			field_value: PreferenceState[K]
		) {
			this.preference[field_name] = field_value
		},

		/**
		 * Merge multiple preference fields
		 */
		setPreferenceFields(preference_fields: Partial<PreferenceState>) {
			this.preference = {
				...this.preference,
				...preference_fields,
			}
		},
	},
})