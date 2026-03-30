import { sendResetPasswordLink, submitResetPassword, validateToken } from '~/services/password/password.service'
import type { SendResetPasswordLinkPayload, SubmitResetPasswordPayload, ValidateTokenPayload } from '~/types/auth/password';
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

	async function submitResetPasswordHandler(payload: SubmitResetPasswordPayload): Promise<ApiResponse> {
		try {
			const response = await submitResetPassword(payload)

			return response
		} catch {
			return {
				success: false,
				message: 'reset_password_error',
				data: null,
				meta: null
			}
		}
	}

	async function validateTokenHandler(payload: ValidateTokenPayload): Promise<ApiResponse> {
		try {
			const response = await validateToken(payload)

			return response
		} catch {
			return {
				success: false,
				message: 'validate_token_error',
				data: null,
				meta: null
			}
		}
	}

	return {
		sendResetPasswordLinkHandler,
		submitResetPasswordHandler,
		validateTokenHandler
	}
}