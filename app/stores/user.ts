import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        id: 0,
        code: '',
        email: '',
        onboardingProfile: null as null | {
            firstName: string
            lastName: string
            email: string
            onboarding: boolean
        },
        profile: null as null | {
            id: number
            user_id: number
            file_path_id: number
            file_name: string | null
            user_field_values: {
                id: number
                user_profile_id: number
                country_field_ids?: number
                country_fields_id?: number
                value: string
            }[]
        }
    }),
    actions: {
        setUser(user: any) {
            this.$patch({
                id: user.id,
                code: user.code,
                email: user.email,
                profile: user.profile
            })
        },
        clearUser() {
            this.$patch({
                id: 0,
                code: '',
                email: '',
                profile: null,
                onboardingProfile: null
            })
        },
        setOnboardingProfile(profile: {
            firstName: string
            lastName: string
            email: string
            onboarding: boolean
        }) {
            this.onboardingProfile = profile
        },
        clearOnboardingProfile() {
            this.onboardingProfile = null
        }
    }
})
