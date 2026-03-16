import type { LoginResponse, LoginPayload, NonMemberLoginVerificationPayload, NonMemberLoginVerificationResponse, SubmitNonMemberVerificationResponse, SubmitNonMemberLoginVerificationPayload } from '~/types/auth/auth'
import type { MeUserResponse } from '~/types/auth/user'

/**
 * Fetch authenticated user
 */
export async function getCurrentAuthenticatedUser(): Promise<MeUserResponse> {
	const { $api } = useNuxtApp()

	return await $api.get('user/me')
}

export async function memberLogin(payload: LoginPayload): Promise<LoginResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('auth/login', { ...payload })
}

export async function sendNonMemberLoginVerification(payload: NonMemberLoginVerificationPayload): Promise<NonMemberLoginVerificationResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('auth/login/guest/verification', { ...payload })
}

export async function nonMemberSubmitVerification(payload: SubmitNonMemberLoginVerificationPayload): Promise<SubmitNonMemberVerificationResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('auth/login/guest', { ...payload })
}