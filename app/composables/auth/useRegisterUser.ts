import { sendRegisterVerification, submitRegisterVerification } from '~/services/auth/api.service'
import type { RegisterPayload, RegisterVerificationPayload, RegisterVerificationResponse } from '~/types/auth/auth';
import type { ApiResponse } from '~/types/config/api';

export function useRegisterUser() {
	/**
     * send verification otp
     */
	async function sendRegisterVerificationHandler(payload: RegisterVerificationPayload): Promise<RegisterVerificationResponse> {
		try {
			const response = await sendRegisterVerification(payload)

			return response
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: 'send_verification_error',
				data: null,
				meta: null
			} as unknown as RegisterVerificationResponse
		}
	}

	/**
     * submit verification otp
     */
	async function submitRegisterVerificationHandler(payload: RegisterPayload): Promise<ApiResponse> {
		try {
			const response = await submitRegisterVerification(payload)

			return response
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: 'submit_verification_error',
				data: null,
				meta: null
			} as ApiResponse
		}
	}

	return {
		sendRegisterVerificationHandler,
		submitRegisterVerificationHandler
	}
}