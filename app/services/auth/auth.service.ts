import type {
	LoginPayload,
	LoginResponse,
	NonMemberLoginVerificationPayload,
	NonMemberLoginVerificationResponse,
	SocialLoginPayload,
	SocialRedirectResponse,
	SubmitNonMemberLoginVerificationPayload,
} from '~/types/auth/auth'
import type { ApiResponse } from '~/types/config/api'
import {
	checkoutNonMemberSubmitVerification,
	getCurrentAuthenticatedUser,
	logout,
	memberLogin,
	nonMemberSubmitVerification,
	sendCheckoutNonMemberLoginVerification,
	sendNonMemberLoginVerification,
	socialRedirect,
} from '~/services/auth/api.service'
import { useUsersStore } from '~/stores/users/users.store'

export const fetchAndStoreUser = async () => {
	const user_store = useUsersStore()
	user_store.auth_state_loading = true

	try {
		const response = await getCurrentAuthenticatedUser()

		const user = response.data?.user
		const profile = response.data?.profile ?? null

		if (!user) {
			user_store.clearUser()
			return false
		}

		user_store.setUser({
			...user,
			profile,
		})

		return true
	} catch {
		user_store.clearUser()
		return false
	} finally {
		user_store.auth_state_loading = false
		user_store.auth_state_ready = true
	}
}

export const logoutUser = async () => {
	const user_store = useUsersStore()

	try {
		const response = await logout()

		if (!response.success) {
			return false
		}

		user_store.clearUser()
		user_store.auth_state_loading = false
		user_store.auth_state_ready = true

		await navigateTo('/')

		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

export const loginMemberUser = async (
	payload: LoginPayload
): Promise<LoginResponse> => {
	try {
		const response = await memberLogin(payload)

		if (!response.success) {
			return response
		}

		storeAuthCookie(false, payload.remember_me)
		await fetchAndStoreUser()

		return response
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: 'login_error',
		} as LoginResponse
	}
}

export const requestNonMemberLoginVerification = async (
	payload: NonMemberLoginVerificationPayload,
	options: { is_checkout?: boolean } = {}
): Promise<NonMemberLoginVerificationResponse> => {
	try {
		if (options.is_checkout) {
			return await sendCheckoutNonMemberLoginVerification({
				email: payload.email,
				is_resend: payload.is_resend ? true : false
			})
		}

		return await sendNonMemberLoginVerification(payload)
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: 'non_member_login_error',
		} as NonMemberLoginVerificationResponse
	}
}

export const submitNonMemberLoginVerification = async (
	payload: SubmitNonMemberLoginVerificationPayload,
	options: { is_checkout?: boolean } = {}
): Promise<ApiResponse> => {
	try {
		if (options.is_checkout) {
			return await checkoutNonMemberSubmitVerification(payload)
		}

		return await nonMemberSubmitVerification(payload)
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: 'non_member_login_verification_error',
		} as ApiResponse
	}
}

export const requestSocialLoginRedirect = async (
	payload: SocialLoginPayload
): Promise<SocialRedirectResponse> => {
	try {
		return await socialRedirect(payload)
	} catch (error) {
		console.error(error)
		return {
			success: false,
			message: 'social_login_error',
		} as SocialRedirectResponse
	}
}

function storeAuthCookie(
	is_guest: boolean | number,
	remember_me: boolean | number
) {
	const token_duration_short = 60 * 60 * 24 * 3
	const token_duration_long = 60 * 60 * 24 * 90
	const token_duration = remember_me
		? token_duration_long
		: token_duration_short

	const guest_login_mode_cookie = useCookie<string | number | null>(
		'guest_login_mode',
		{
			maxAge: token_duration,
			sameSite: 'lax',
			path: '/',
		}
	)

	guest_login_mode_cookie.value = is_guest ? 1 : 0
}