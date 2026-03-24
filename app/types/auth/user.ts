import type { ApiResponse } from '~/types/config/api'
import type { PreferenceState } from '../account/preferences'

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
 * Base user state
 */
export interface UserState extends UserIdentity {
	onboardingProfile: OnboardingProfile | null
	profile: UserProfile | null
	preference: PreferenceState
}

/**
 * Basic user identity
 */
export interface UserIdentity {
	id: number
	code: string
	email: string
	country_id: number
	account_type: 'google' | 'facebook' | 'musticker'
}

/**
 * Dynamic user field value
 */
export interface UserFieldValue {
	id: number
	user_profile_id: number
	country_field_id: number
	value?: string
	sort_order: number
}

export interface FilePathValue {
	code: string
	file_path: string
}

/**
 * User profile payload
 */
export interface UserProfile {
	id: number
	user_id: number
	file_path_id: number
	file_path: FilePathValue
	file_name: string | null
	user_field_values: UserFieldValue[]
}

/**
 * /user/me response payload
 */
export interface MeResponse {
	user?: UserIdentity
	profile?: UserProfile | null
}

/**
 * Typed API response
 */
export type MeUserResponse = ApiResponse<MeResponse>