import { memberLogin, nonMemberSubmitVerification, sendNonMemberLoginVerification } from "~/services/auth/auth.service";
import type {
    LoginPayload,
    LoginResponse,
    NonMemberLoginVerificationPayload,
    NonMemberLoginVerificationResponse,
    SubmitNonMemberLoginVerificationPayload,
    SubmitNonMemberVerificationResponse
} from "~/types/auth/auth";
import { useAuthUser } from "./useAuthUser";
import { setGuestLoginToastPending } from "~/helpers/auth/auth.helper";

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

            if (!response.success) {
                return response
            }

            return response
        } catch (error) {
            console.error(error)
            return {
                success: false,
                message: 'non_member_login_error'
            } as NonMemberLoginVerificationResponse
        }
    }

    async function handleSubmitNonMemberLoginVerification(payload: SubmitNonMemberLoginVerificationPayload): Promise<SubmitNonMemberVerificationResponse> {
        try {
            const response = await nonMemberSubmitVerification(payload)

            if (!response.success) {
                return response
            }

            return response
        } catch (error) {
            console.error(error)
            return {
                success: false,
                message: 'non_member_login_verification_error'
            } as SubmitNonMemberVerificationResponse
        }
    }

    return {
        handleMemberLogin,
        handleNonMemberVerification,
        handleSubmitNonMemberLoginVerification
    }
}

function storeAuthCookie(is_guest: boolean | number, remember_me: boolean | number) {
    const TOKEN_DURATION_SHORT = 60 * 60 * 24 * 3; // 3 days
    const TOKEN_DURATION_LONG = 60 * 60 * 24 * 90; // 90 days

    const tokenDuration = remember_me ? TOKEN_DURATION_LONG : TOKEN_DURATION_SHORT;

    const guestLoginModeCookie = useCookie<string | number | null>('guest_login_mode', {
        maxAge: tokenDuration,
        sameSite: 'lax',
        path: '/',
    });

    guestLoginModeCookie.value = is_guest ? 1 : 0;
}