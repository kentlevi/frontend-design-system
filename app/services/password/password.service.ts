import type {
	SendResetPasswordLinkPayload,
	SubmitResetPasswordPayload,
	ValidateTokenPayload,
} from '~/types/auth/password';
import type { ApiResponse } from '~/types/config/api';
import {
	sendResetPasswordLink as sendResetPasswordLinkRequest,
	submitResetPassword as submitResetPasswordRequest,
	validateToken as validateTokenRequest,
} from '~/services/password/api.service';
import { fetchAndStoreUser } from '~/services/auth/auth.service';

/**
 * Send reset password link
 */
export async function sendResetPasswordLink(
	payload: SendResetPasswordLinkPayload
): Promise<ApiResponse> {
	try {
		return await sendResetPasswordLinkRequest(payload);
	} catch {
		return {
			success: false,
			message: 'send_verification_error',
			data: null,
			meta: null,
		} as ApiResponse;
	}
}

/**
 * Submit reset password and refresh authenticated user state
 */
export async function submitResetPassword(
	payload: SubmitResetPasswordPayload
): Promise<ApiResponse> {
	try {
		const response = await submitResetPasswordRequest(payload);

		if (response.success) {
			await fetchAndStoreUser();
		}

		return response;
	} catch {
		return {
			success: false,
			message: 'reset_password_error',
			data: null,
			meta: null,
		} as ApiResponse;
	}
}

/**
 * Validate token
 */
export async function validateToken(
	payload: ValidateTokenPayload
): Promise<ApiResponse> {
	try {
		return await validateTokenRequest(payload);
	} catch {
		return {
			success: false,
			message: 'validate_token_error',
			data: null,
			meta: null,
		} as ApiResponse;
	}
}