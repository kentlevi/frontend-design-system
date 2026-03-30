import type { Ref } from 'vue'
import { useVerificationCooldown } from '~/composables/auth/verification/useVerificationCooldown'
import { sendEmailChangeOTP, verifyEmailChangeOtp } from '~/services/profile/changeEmail.service'
import { useLoadingOverlayStore } from '~/stores/loading_overlay'
import { useToastStore } from '~/stores/toast'
import { useUsersStore } from '~/stores/users/users.store'
import type { SendEmailChangeOtpSuccessData } from '~/types/account/changeEmail'
import type { ApiResponse } from '~/types/config/api'
import {
	normalizeResponseError,
	type ValidationErrors
} from '~/utils/response/response'

export function useChangeEmailForm() {

	/** OTP Cooldown handler */
	const {
		remaining,
		applyFromResponse
	} = useVerificationCooldown()

	/** Store */
	const user_store = useUsersStore()
	const toast_store = useToastStore()
	const loading_overlay_store = useLoadingOverlayStore()

	/** Response state */
	const form_errors = ref<ValidationErrors>({})
	const error_message = ref<string | null>(null)

	/** Current email shown in UI */
	const email = ref(user_store.state.email)

	/** Email change modal state */
	const pending_email = ref('')
	const is_email_change_modal = ref(false)
	const email_change_error = ref('')
	const request_sent = ref(false)

	/** OTP modal state */
	const is_otp_open = ref(false)
	const email_change_otp_code = ref('')
	const email_change_otp_error = ref('')
	const limit_reached_error = ref('')

	/**
     * Clear limit reached error once cooldown ends
     */
	watch(remaining, (new_remaining) => {
	/** Stop if there is no active limit error */
		if (!limit_reached_error.value) return

		/** Clear error once cooldown is finished */
		if (new_remaining <= 0) {
			limit_reached_error.value = ''
		}
	})

	/**
	 * Open email change modal
	 */
	function openEmailChangeModal() {
		is_email_change_modal.value = true
	}

	/**
	 * Close email change modal
	 */
	function closeEmailChangeModal(reset = true) {
		is_email_change_modal.value = false
		if (reset) {
			resetEmailState()
			clearResponseState()
		}
	}

	/**
	 * Open OTP modal
	 */
	function openOtpModal() {
		is_otp_open.value = true
	}

	/**
	 * Close OTP modal
	 */
	function closeOtpModal(reset = true) {
		is_otp_open.value = false
		if (reset) {
			resetOtpState()
			clearResponseState()
			resetRequestState()
		}
	}

	/**
	 * Confirm email change request
	 */
	async function confirmEmailChange() {
		const next_email = pending_email.value.trim()

		clearResponseState()
		resetRequestState()

		closeEmailChangeModal(false)

		startRequestOverlay()

		try {
			const payload = { email: next_email }
			const response = await sendEmailChangeOTP(payload)

			/** Get cooldown_remaining from api response */
			applyFromResponse(response)

			/** Success: move user to OTP step */
			if (response.success) {
				pending_email.value = next_email
				request_sent.value = true
				is_email_change_modal.value = false
				is_otp_open.value = true
				return
			}

			/**
			 * Max resend reached:
			 * still allow OTP modal to open, but show lock message
			 */
			if (handleLimitReached(response, next_email)) {
				return
			}

			/** Validation or normal backend error */
			applyResponseError(response, 'email', email_change_error)

			/**
			 * Keep email modal open so the user
			 * does not lose the email they typed
			 * and display errors
			 */
			openEmailChangeModal()
		} catch (_error: unknown) {
			error_message.value = 'Failed to send OTP.'
			email_change_error.value = error_message.value
		} finally {
			loading_overlay_store.stopLoading('request_email_change')
		}
	}

	/**
	 * Verify OTP for email change
	 */
	async function verifyOtp() {
		clearResponseState()
		email_change_otp_error.value = ''

		closeOtpModal(false)
		startVerifyOverlay()

		try {
			const payload = {
				email: pending_email.value,
				otp: email_change_otp_code.value
			}

			const response = await verifyEmailChangeOtp(payload)

			if (response.success) {
				/** Show success toast */
				toast_store.handleApiResponse(response)

				/** Sync user store */
				user_store.patchUser({ email: payload.email })
				email.value = user_store.state.email

				/** Close flow after success */
				closeOtpModal()
				resetAllState()
				return
			}

			/** Limit handling, kept for defensive safety */
			if (limitReached(response)) {
				limit_reached_error.value = response.message ?? ''
				return
			}

			/** Validation or normal backend error */
			applyResponseError(response, 'otp', email_change_otp_error)

			/**
			 * Keep otp modal open
			 * to display errors
			 */
			openOtpModal()
		} catch (_error: unknown) {
			error_message.value = 'Failed to verify.'
			email_change_otp_error.value = error_message.value
		} finally {
			loading_overlay_store.stopLoading('verify_email_change')
		}
	}

	/**
	 * Resend email change OTP
	 */
	async function resendOtp() {
		clearResponseState()
		email_change_otp_error.value = ''
		limit_reached_error.value = ''

		try {
			/** Set initial cooldown value */
			remaining.value = 60

			const payload = { email: pending_email.value, is_resend: true }
			const response = await sendEmailChangeOTP(payload)

			/** Get cooldown_remaining from api response */
			applyFromResponse(response)

			if (response.success) {
				request_sent.value = true
				return
			}

			if (limitReached(response)) {
				limit_reached_error.value = response.message ?? ''
				return
			}

			applyResponseError(response, 'otp', email_change_otp_error)
		} catch (_error: unknown) {
			error_message.value = 'Failed to resend.'
			email_change_otp_error.value = error_message.value
		}
	}

	/**
	 * Shared backend error applier
	 */
	function applyResponseError(
		response: ApiResponse,
		field_name: string,
		target_error: Ref<string>
	) {
		const normalized_error = normalizeResponseError(response)

		if (!normalized_error) {
			error_message.value = response.message ?? 'Something went wrong.'
			target_error.value = error_message.value
			return
		}

		if (normalized_error.errors) {
			form_errors.value = normalized_error.errors
		} else {
			error_message.value = normalized_error.message
		}

		target_error.value =
			getFirstError(field_name) ||
			normalized_error.message ||
			response.message ||
			''
	}

	/**
	 * Handle max resend reached
	 *
	 * Returns:
	 * - true  => stop caller flow
	 * - false => continue normal error handling
	 */
	function handleLimitReached(
		response: ApiResponse<SendEmailChangeOtpSuccessData>,
		next_email: string
	): boolean {
		if (!limitReached(response)) {
			return false
		}

		pending_email.value = next_email
		request_sent.value = true
		is_email_change_modal.value = false
		is_otp_open.value = true
		limit_reached_error.value = response.message ?? ''

		return true
	}


	/**
	 * Check whether response is max resend reached
	 *
	 * Supports either:
	 * - meta.code
	 */
	function limitReached(response: ApiResponse): boolean {
		return ( !response.success && response.meta?.code === 'max_resend_reached' )
	}

	/**
	 * Clear common response state
	 */
	function clearResponseState() {
		form_errors.value = {}
		error_message.value = null
	}

	/**
	 * Reset email step state
	 */
	function resetEmailState() {
		pending_email.value = ''
		email_change_error.value = ''
	}

	/**
	 * Reset OTP step state
	 */
	function resetOtpState() {
		email_change_otp_code.value = ''
		email_change_otp_error.value = ''
		limit_reached_error.value = ''
	}

	/**
	 * Reset request flags
	 */
	function resetRequestState() {
		request_sent.value = false
	}

	/**
	 * Reset everything in this flow
	 */
	function resetAllState() {
		clearResponseState()
		resetEmailState()
		resetOtpState()
		resetRequestState()
	}

	/**
	 * Get first validation error for a field
	 */
	function getFirstError(field_name: string): string {
		return form_errors.value[field_name]?.[0] ?? ''
	}

	/**
	 * Start request overlay
	 */
	function startRequestOverlay() {
		loading_overlay_store.startLoading('request_email_change', {
			label: 'Verifying Your Information...',
			description: "Just a moment! We're making sure everything looks perfect.",
			showCopy: true,
			testId: 'account-profile-email-change-page-overlay',
			position: 'fixed'
		})
	}

	/**
	 * Start verify overlay
	 */
	function startVerifyOverlay() {
		loading_overlay_store.startLoading('verify_email_change', {
			showCopy: true,
			testId: 'account-profile-email-change-page-overlay',
			position: 'fixed'
		})
	}

	return {
		email,

		pending_email,
		is_email_change_modal,
		email_change_error,

		request_sent,
		is_otp_open,
		email_change_otp_code,
		email_change_otp_error,
		limit_reached_error,

		remaining,

		openEmailChangeModal,
		closeEmailChangeModal,
		openOtpModal,
		closeOtpModal,
		confirmEmailChange,
		verifyOtp,
		resendOtp
	}
}