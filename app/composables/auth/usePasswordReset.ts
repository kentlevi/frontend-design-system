import {
	sendResetPasswordLink,
	submitResetPassword,
	validateToken,
} from '~/services/password/password.service';
import type {
	SendResetPasswordLinkPayload,
	SubmitResetPasswordPayload,
	ValidateTokenPayload,
} from '~/types/auth/password';
import type { ApiResponse } from '~/types/config/api';

export function usePasswordReset() {
	async function sendResetPasswordLinkHandler(
		payload: SendResetPasswordLinkPayload
	): Promise<ApiResponse> {
		return await sendResetPasswordLink(payload);
	}

	async function submitResetPasswordHandler(
		payload: SubmitResetPasswordPayload
	): Promise<ApiResponse> {
		return await submitResetPassword(payload);
	}

	async function validateTokenHandler(
		payload: ValidateTokenPayload
	): Promise<ApiResponse> {
		return await validateToken(payload);
	}

	return {
		sendResetPasswordLinkHandler,
		submitResetPasswordHandler,
		validateTokenHandler,
	};
}