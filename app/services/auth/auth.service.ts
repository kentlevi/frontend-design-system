import type { LoginResponse, LoginPayload, NonMemberLoginVerificationPayload, NonMemberLoginVerificationResponse, SubmitNonMemberVerificationResponse, SubmitNonMemberLoginVerificationPayload, SendResetPasswordLinkPayload } from '~/types/auth/auth'
import type { MeUserResponse } from '~/types/auth/user'
import type { ApiResponse } from "~/types/config/api"

/**
 * Fetch authenticated user
 */
export async function getCurrentAuthenticatedUser(): Promise<MeUserResponse> {
	const { $api } = useNuxtApp()

	return await $api.get('user/me')
}

/**
 * Member: Submit Login
 */
export async function memberLogin(payload: LoginPayload): Promise<LoginResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('auth/login', { ...payload })
}

/**
 * Non Member: Send Verification Code
 */
export async function sendNonMemberLoginVerification(payload: NonMemberLoginVerificationPayload): Promise<NonMemberLoginVerificationResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('auth/login/guest/verification', { ...payload })
}

/**
 * Non Member: Submit Verification Code && Finalize Login
 */
export async function nonMemberSubmitVerification(payload: SubmitNonMemberLoginVerificationPayload): Promise<SubmitNonMemberVerificationResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('auth/login/guest', { ...payload })
}

/**
 * Send reset password link
 */
export async function sendResetPasswordLink(payload: SendResetPasswordLinkPayload): Promise<ApiResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('auth/password/reset-link', { ...payload })
}