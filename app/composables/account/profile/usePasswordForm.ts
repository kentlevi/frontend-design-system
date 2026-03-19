import { changePassword } from "~/services/profile/changePassword.service"
import { normalizeResponseError } from "~/utils/response/response"

export function usePasswordForm() {
	/** Store */
	const toast_store = useToastStore()
	const loading_overlay_store = useLoadingOverlayStore()

	const current_password = ref('')
	const new_password = ref('')
	const new_password_confirmation = ref('')

	/** Error variables */
	const current_password_error = ref('')
	const new_password_confirmation_error = ref('')
	const pair_password_error = ref('')

	/** UI interaction */
	const current_password_visible = ref(false)
	const new_password_visible = ref(false)
	const new_password_confirmation_visible = ref(false)

	const is_change_password_enabled = computed(() => (
		Boolean(current_password.value.trim()) &&
		Boolean(new_password.value.trim()) &&
		Boolean(new_password_confirmation.value.trim())
	))


	async function onChangePassword() {
		clearPasswordErrors();

		try {
			const payload = {
				current_password: current_password.value,
				new_password: new_password.value,
				new_password_confirmation: new_password_confirmation.value
			}

			startChangePasswordOverlay()
			const response = await changePassword(payload)

			if (response.success) {
				toast_store.handleApiResponse(response, 3000)

				clearPasswordState()
			} else {
				const normalized_error = normalizeResponseError(response)

				if (normalized_error?.errors) {
					current_password_error.value = normalized_error?.errors?.current_password?.[0] ?? '';
					pair_password_error.value = normalized_error?.errors?.new_password?.[0] ?? '';
				}
			}
		} catch (_error: unknown) {
			console.error(_error);
		} finally {
			loading_overlay_store.stopLoading('change_password')
		}
	}

	function clearNewPasswordPairErrors() {
		pair_password_error.value = '';
	}

	function clearPasswordErrors() {
		current_password_error.value = '';
		pair_password_error.value = '';
		new_password_confirmation_error.value = '';
	}

	function clearPasswordState() {
		current_password.value = ''
		new_password.value = ''
		new_password_confirmation.value = ''
	}





	/** Overlays */
	function startChangePasswordOverlay() {
		loading_overlay_store.startLoading('change_password', {
			showCopy: true,
			testId: 'account-profile-password-change-page-overlay',
			position: 'fixed'
		})
	}


	return {
		current_password,
		new_password,
		new_password_confirmation,
		current_password_error,
		new_password_confirmation_error,
		pair_password_error,

		/** Computed */
		is_change_password_enabled,

		current_password_visible,
		new_password_visible,
		new_password_confirmation_visible,

		clearNewPasswordPairErrors,
		onChangePassword,
	}
}