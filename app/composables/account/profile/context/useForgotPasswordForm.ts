import { sendLink } from "~/services/profile/forgotPassword.service";
import { useUsersStore } from "~/stores/users/users.store"

export function useForgotPasswordForm() {
	/** Store */
	const user_store = useUsersStore()
	const loading_overlay_store = useLoadingOverlayStore()

	const is_forgot_password_modal_open = ref(false)
	const forgot_password_request_send = ref(false)

	/**
     * Send password reset link
     * and open modal
     */
	async function sendForgotPasswordEmail() {
		startSendPasswordResetEmailOverlay()

		try {
			const payload = {
				email: user_store.state.email
			}

			const response = await sendLink(payload)

			if (response.success) {
				openForgotPasswordModal()
				requestSent()
			} else {
				requestFailed()
			}
		} catch (_error: unknown) {
			console.log(_error);
		} finally {
			loading_overlay_store.stopLoading('send_reset_password_email')
		}
	}



	/** Open modal */
	function openForgotPasswordModal() {
		is_forgot_password_modal_open.value = true
	}

	/** Close modal */
	function closeForgotPasswordModal() {
		is_forgot_password_modal_open.value = false
		forgot_password_request_send.value = false;
	}

	function requestSent() {
		forgot_password_request_send.value = true;
	}

	function requestFailed() {
		forgot_password_request_send.value = false;
	}





	/** Overlays */
	function startSendPasswordResetEmailOverlay() {
		loading_overlay_store.startLoading('send_reset_password_email', {
			showCopy: true,
			testId: 'account-profile-forgot-password-page-overlay',
			position: 'fixed'
		})
	}

	return {
		is_forgot_password_modal_open,
		forgot_password_request_send,

		sendForgotPasswordEmail,
		closeForgotPasswordModal
	}
}