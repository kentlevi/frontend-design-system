import type {
	LoginResponse,
	LoginPayload,
	CheckoutNonMemberLoginVerificationPayload,
	NonMemberLoginVerificationPayload,
	NonMemberLoginVerificationResponse,
	SubmitNonMemberLoginVerificationPayload,
	RegisterVerificationPayload,
	RegisterPayload,
	RegisterVerificationResponse,
	SocialLoginPayload,
	SocialRedirectResponse,
	OnboardingPayload
} from '~/types/auth/auth'
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
export async function nonMemberSubmitVerification(payload: SubmitNonMemberLoginVerificationPayload): Promise<ApiResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('auth/login/guest', { ...payload })
}

/**
 * Registration: Send Verification Code
 */
export async function sendRegisterVerification(payload: RegisterVerificationPayload): Promise<RegisterVerificationResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('auth/register/verification', { ...payload })
}

/**
 * Registration: Submit Verification Code
 */
export async function submitRegisterVerification(payload: RegisterPayload): Promise<ApiResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('auth/register', { ...payload })
}

/**
 * Login: Social Login Redirect to provider page
 */
export async function socialRedirect(payload: SocialLoginPayload): Promise<SocialRedirectResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('auth/social/redirect', { ...payload })
}

/**
 * Logout user
 */
export async function logout(): Promise<ApiResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('auth/logout');
}

/**
 * Onboarding
 */
export async function completeOnboarding(payload: OnboardingPayload): Promise<ApiResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('user/complete-onboarding', { ...payload })
}

/**
 * Checkout send verification code
 */
export async function sendCheckoutNonMemberLoginVerification(payload: CheckoutNonMemberLoginVerificationPayload): Promise<NonMemberLoginVerificationResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('auth/checkout/guest/verification', { ...payload })
}

/**
 * Checkout non member submit verification
 */
export async function checkoutNonMemberSubmitVerification(payload: SubmitNonMemberLoginVerificationPayload): Promise<ApiResponse> {
	const { $api } = useNuxtApp()

	return await $api.post('auth/checkout/guest', { ...payload })
}