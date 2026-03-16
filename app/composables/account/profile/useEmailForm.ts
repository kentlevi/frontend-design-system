import { sendEmailChangeOTP } from "~/services/profile/email.service";
import { normalizeResponseError, type ValidationErrors } from "~/utils/response/response";

export function useEmailForm() {

	const request_sent = ref(false)
	const is_otp_open = ref(false)
	const form_errors = ref<ValidationErrors>({})
	const error_message = ref<string | null>(null)

	/**
     * EMAIL CHANGE MODAL BEHAVIOUR
     */
	const pending_email = ref('')
	const is_email_change_modal = ref(false)
	const email_change_field_ref = ref<HTMLElement | null>(null);
	const email_change_error = ref('')
	const email_change_overlay_mode = ref<'idle' | 'requesting' | 'verifying'>('idle');

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
		resetFields()
		is_email_change_modal.value = false;
	}

	async function confirmEmailChange() {
		request_sent.value = false
		is_otp_open.value = false
		const next_email = pending_email.value.trim();

		resetFields()
		closeEmailChangeModal();
		email_change_overlay_mode.value = 'requesting'

		/** Send OTP */
		const payload = { email: next_email }
		const response = await sendEmailChangeOTP(payload);

		if (response.success) {
			request_sent.value = true
			is_otp_open.value = true
		} else {
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
		}

		email_change_overlay_mode.value = 'idle'
	}

	function resetFields() {
		pending_email.value = ''
		email_change_error.value = ''
		form_errors.value = {}
		error_message.value = null
	}

	function getFirstError(field_name: string): string {
		return form_errors.value[field_name]?.[0] ?? ''
	}

	/**
     * END OF EMAIL CHANGE MODAL BEHAVIOUR
     */


	return {
		pending_email,
		is_email_change_modal,
		email_change_field_ref,
		email_change_error,
		email_change_overlay_mode,

		request_sent,
		is_otp_open,

		openEmailChangeModal,
		closeEmailChangeModal,
		confirmEmailChange
	}
}