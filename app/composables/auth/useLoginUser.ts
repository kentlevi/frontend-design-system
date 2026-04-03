import { memberLogin, nonMemberSubmitVerification, sendCheckoutNonMemberLoginVerification, sendNonMemberLoginVerification, socialRedirect } from "~/services/auth/auth.service";
import type {
	LoginPayload,
	LoginResponse,
	NonMemberLoginVerificationPayload,
	NonMemberLoginVerificationResponse,
	SocialLoginPayload,
	SocialRedirectResponse,
	SubmitNonMemberLoginVerificationPayload
} from "~/types/auth/auth";
import { useAuthUser } from "./useAuthUser";
import { setGuestLoginToastPending } from "~/helpers/auth/auth.helper";
import type { ApiResponse } from "~/types/config/api";

export function useLoginUser() {
	async function handleMemberLogin(payload: LoginPayload): Promise<LoginResponse> {
		try {
			const response = await memberLogin(payload)

			if (!response.success) {
				return response
			}

			storeAuthCookie(false, payload.remember_me)

			setGuestLoginToastPending()

			const { fetchAndStoreUser } = useAuthUser()
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

	async function handleNonMemberVerification(payload: NonMemberLoginVerificationPayload): Promise<NonMemberLoginVerificationResponse> {
		try {
			const response = await sendNonMemberLoginVerification(payload)

			return response
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: 'non_member_login_error'
			} as NonMemberLoginVerificationResponse
		}
	}

	async function handleSubmitNonMemberLoginVerification(payload: SubmitNonMemberLoginVerificationPayload): Promise<ApiResponse> {
		try {
			const response = await nonMemberSubmitVerification(payload)

			return response
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: 'non_member_login_verification_error'
			} as ApiResponse
		}
	}

	async function handleSocialLogin(payload: SocialLoginPayload): Promise<SocialRedirectResponse> {
		try {
			const response = await socialRedirect(payload)

			return response
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: 'social_login_error'
			} as SocialRedirectResponse
		}
	}

	async function handleCheckoutNonMemberVerification(payload: { email: string }): Promise<NonMemberLoginVerificationResponse> {
		try {
			const response = await sendCheckoutNonMemberLoginVerification(payload)

			return response
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: 'checkout_non_member_login_error'
			} as NonMemberLoginVerificationResponse
		}
	}

	async function handleCheckoutSubmitNonMemberLoginVerification(payload: SubmitNonMemberLoginVerificationPayload): Promise<ApiResponse> {
		try {
			const response = await handleSubmitNonMemberLoginVerification(payload)
			return response
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: 'checkout_non_member_login_verification_error'
			} as ApiResponse
		}
	}

	return {
		handleMemberLogin,
		handleNonMemberVerification,
		handleSubmitNonMemberLoginVerification,
		handleSocialLogin
	}
}

function storeAuthCookie(is_guest: boolean | number, remember_me: boolean | number) {
	const TOKEN_DURATION_SHORT = 60 * 60 * 24 * 3; // 3 days
	const TOKEN_DURATION_LONG = 60 * 60 * 24 * 90; // 90 days

	const token_duration = remember_me ? TOKEN_DURATION_LONG : TOKEN_DURATION_SHORT;

	const guest_login_mode_cookie = useCookie<string | number | null>('guest_login_mode', {
		maxAge: token_duration,
		sameSite: 'lax',
		path: '/',
	});

	guest_login_mode_cookie.value = is_guest ? 1 : 0;
}