import type {
    SendResetPasswordLinkPayload,
    SubmitResetPasswordPayload,
    ValidateTokenPayload
} from '~/types/auth/password'
import type { ApiResponse } from "~/types/config/api"

/**
 * Send reset password link
 */
export async function sendResetPasswordLink(payload: SendResetPasswordLinkPayload): Promise<ApiResponse> {
    const { $api } = useNuxtApp()

    return await $api.post('auth/password/reset-link', { ...payload })
}

/**
 * Submit reset password
 */
export async function submitResetPassword(payload: SubmitResetPasswordPayload): Promise<ApiResponse> {
    const { $api } = useNuxtApp()

    return await $api.post('auth/password/reset', { ...payload })
}

/**
 * Validate Token
 */
export async function validateToken(payload: ValidateTokenPayload): Promise<ApiResponse> {
    const { $api } = useNuxtApp()

    return await $api.post('auth/password/reset/validate-token', { ...payload })
}