import { sendResetPasswordLink } from '~/services/auth/auth.service'
import type { SendResetPasswordLinkPayload } from '~/types/auth/auth';
import type { ApiResponse } from '~/types/config/api';

export function usePasswordReset() {
    /**
     * Fetch authenticated user and store it
     */
    async function sendResetPasswordLinkHandler(payload: SendResetPasswordLinkPayload): Promise<ApiResponse> {
        try {
            const response = await sendResetPasswordLink(payload)

            return response
        } catch {
            return {
                success: false,
                message: 'send_verification_error',
                data: null,
                meta: null
            } as ApiResponse
        }
    }

    return {
        sendResetPasswordLinkHandler
    }
}