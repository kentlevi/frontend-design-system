import { sendEmailChangeOTP, verifyEmailChangeOtp } from "~/services/profile/changeEmail.service";
import { useLoadingOverlayStore } from "~/stores/loading_overlay";
import { useToastStore } from "~/stores/toast";
import { useUsersStore } from "~/stores/users/users.store";
import type { SendEmailChangeOtpSuccessData } from "~/types/account/changeEmail";
import type { ApiResponse } from "~/types/config/api";
import { normalizeResponseError, type ValidationErrors } from "~/utils/response/response";

export function useChangeEmailForm() {

	/** Store */
	const user_store = useUsersStore()
	const toast_store = useToastStore()
	const loading_overlay_store = useLoadingOverlayStore()


	/** Response Error handlers */
	const form_errors = ref<ValidationErrors>({})
	const error_message = ref<string | null>(null)

	const email = ref(user_store.state.email)

	/** OTP MODAL BEHAVIOR */
	const is_otp_open = ref(false)
	const email_change_otp_code = ref('')
	const email_change_otp_error = ref('')
	const limit_reached_error = ref('')
	const resend_cooldown = ref(0)

	/**
	 * EMAIL CHANGE MODAL BEHAVIOUR
	*/
	const pending_email = ref('')
	const is_email_change_modal = ref(false)
	const email_change_field_ref = ref<HTMLElement | null>(null);
	const email_change_error = ref('')
	const email_change_overlay_mode = ref<'idle' | 'requesting' | 'verifying'>('idle');
	const request_sent = ref(false)


	/** Open modal */
	function openEmailChangeModal() {
		is_email_change_modal.value = true;

		/** Focus on input after open */
		void nextTick(() => {
			email_change_field_ref.value?.querySelector('input')?.focus();
		});
	}

	/** Close Modal */
	function closeEmailChangeModal() {
		resetEmailFields()
		is_email_change_modal.value = false;
	}

	async function confirmEmailChange() {
		request_sent.value = false
		is_otp_open.value = false
		const next_email = pending_email.value.trim();

		resetEmailFields()
		closeEmailChangeModal();

		/** Loader */
		loading_overlay_store.startLoading('request_email_change', {
			label: 'Verifying Your Information...',
			description: "Just a moment! We're making sure everything looks perfect.",
			showCopy: true,
			testId: 'account-profile-email-change-page-overlay',
			position: 'fixed'
		})

		try {
			/** Send OTP */
			const payload = { email: next_email }
			const response = await sendEmailChangeOTP(payload);

			if (response.success) {
				request_sent.value = true
				is_otp_open.value = true

				/** Set pending email to use in Otp verification */
				pending_email.value = next_email

				return
			}

			/** If max limit reached, still proceed to the otp modal but show the limit reached error */
			if (skipLimitReached(response, next_email)) {
				return;
			}

			/** Below is all error handling */
			const normalized_error = normalizeResponseError(response)

			if (normalized_error?.errors) {
				form_errors.value = normalized_error.errors
			} else if (normalized_error) {
				error_message.value = normalized_error.message
			}

			/** If not backend request validation error, get default message */
			email_change_error.value = getFirstError('email') || error_message.value || ''

			/** Keep modal open to show errors */
			openEmailChangeModal()
		}  catch (_error: unknown) {
			error_message.value = 'Failed to send otp.'
		} finally {
			loading_overlay_store.stopLoading('request_email_change')
		}
	}

	/**
	 * Handle max resend reached flow
	 *
	 * Returns:
	 * - true  => caller should stop further execution
	 * - false => caller should continue normal error handling
	 */
	function skipLimitReached(response: ApiResponse<SendEmailChangeOtpSuccessData>, next_email: string) {
		if (limitReached(response)) {
			request_sent.value = true
			is_otp_open.value = true

			/** Set pending email to use in Otp verification */
			pending_email.value = next_email

			/** Still store the error message */
			limit_reached_error.value = response?.message ?? ''

			return true
		}

		return false
	}

	function getResendCooldown(response: ApiResponse<SendEmailChangeOtpSuccessData>) {
		resend_cooldown.value = response?.data?.cooldown_remaining ?? 0
	}

	function resetEmailFields() {
		pending_email.value = ''
		email_change_error.value = ''
		form_errors.value = {}
		error_message.value = null
	}








	/** Open OTP modal */
	function openOtpModal() {
		is_otp_open.value = true
	}

	/** Close OTP modal */
	function closeOtpModal() {
		is_otp_open.value = false

		resetOtpFields()
	}

	/** Verify Otp modal */
	async function verifyOtp() {
		closeOtpModal()

		loading_overlay_store.startLoading('verify_email_change', {
			showCopy: true,
			testId: 'account-profile-email-change-page-overlay',
			position: 'fixed'
		})

		try {
			const payload = {
				email: pending_email.value,
				otp: email_change_otp_code.value
			}

			const response = await verifyEmailChangeOtp(payload)

			if (response.success) {
				/** Show success toast */
				toast_store.handleApiResponse(response, 3000)

				/** Set user store email */
				user_store.patchUser({ email: payload.email })

				/** Set local email to sync frontend */
				email.value = user_store.state.email

				/** Reset fields after success */
				resetEmailFields()
				resetOtpFields()
			} else {
				const normalized_error = normalizeResponseError(response)

				if (limitReached(response)) {
					limit_reached_error.value = normalized_error?.message ?? ''
				} else {
					if (normalized_error?.errors) {
						form_errors.value = normalized_error.errors
					} else if (normalized_error) {
						error_message.value = normalized_error.message
					}

					/** If not backend request validation error, get default message */
					email_change_otp_error.value = getFirstError('otp') || error_message.value || ''
				}

				/** Keep modal open to show errors */
				openOtpModal()
			}
		} catch (_error: unknown) {
			error_message.value = 'Failed to verify.'
		} finally {
			loading_overlay_store.stopLoading('verify_email_change')
		}
	}

	/** Resend email change otp */
	async function resendOtp() {
		try {
			/** Send OTP */
			const payload = { email: pending_email.value }
			const response = await sendEmailChangeOTP(payload);

			getResendCooldown(response)

			if (limitReached(response)) {
				limit_reached_error.value = response?.message ?? ''
			}
		} catch (_error: unknown) {
			error_message.value = 'Failed to resend.'
		}
	}

	function limitReached(response: ApiResponse) {
		return (!response.success && response?.meta?.code === 'max_resend_reached')
	}

	function resetOtpFields() {
		email_change_otp_error.value = ''
		form_errors.value = {}
		error_message.value = null
		limit_reached_error.value = ''
		email_change_otp_code.value = ''
	}










	function getFirstError(field_name: string): string {
		return form_errors.value[field_name]?.[0] ?? ''
	}


	return {
		email,

		pending_email,
		is_email_change_modal,
		email_change_field_ref,
		email_change_error,
		email_change_overlay_mode,

		request_sent,
		is_otp_open,
		email_change_otp_code,
		email_change_otp_error,
		limit_reached_error,
		resend_cooldown,

		openEmailChangeModal,
		closeEmailChangeModal,
		confirmEmailChange,

		verifyOtp,
		resendOtp,
	}
}