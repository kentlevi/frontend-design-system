import { defineStore } from 'pinia'

export interface OnboardingProfile {
    firstName: string
    lastName: string
    email: string
    onboarding: boolean
}

export interface UserFieldValue {
    id: number
    user_profile_id: number
    country_field_ids?: number
    country_fields_id?: number
    value: string
}

export interface UserProfile {
    id: number
    user_id: number
    file_path_id: number
    file_name: string | null
    user_field_values: UserFieldValue[]
}

export interface UserIdentity {
    id: number
    code: string
    email: string
}

export interface UserState extends UserIdentity {
    onboardingProfile: OnboardingProfile | null
    profile: UserProfile | null
}

const initialUserState = (): UserState => ({
    id: 0,
    code: '',
    email: '',
    onboardingProfile: null,
    profile: null,
})

export const useUserStore = defineStore('user', {
    state: (): UserState => initialUserState(),
    actions: {
        setUser(user: UserIdentity & { profile: UserProfile | null }) {
            this.$patch({
                id: user.id,
                code: user.code,
                email: user.email,
                profile: user.profile
            })
        },
        clearUser() {
            this.$patch(initialUserState())
        },
        setOnboardingProfile(profile: OnboardingProfile) {
            this.onboardingProfile = profile
        },
        clearOnboardingProfile() {
            this.onboardingProfile = null
        }
    }
})
