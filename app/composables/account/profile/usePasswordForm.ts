import { changePassword } from "~/services/profile/changePassword.service"
import { normalizeResponseError } from "~/utils/response/response"

export function usePasswordForm() {
	const SETUP_PASSWORD_SUBMIT_DELAY_MS = 700

	/** Store */
	const toast_store = useToastStore()
	const loading_overlay_store = useLoadingOverlayStore()
	const { t } = useI18n()

	const current_password = ref('')
	const new_password = ref('')
	const new_password_confirmation = ref('')

	/** Error variables */
	const current_password_error = ref('')
	const new_password_confirmation_error = ref('')
	const pair_password_error = ref('')
	const setup_password_error = ref('')
	const setup_password_confirmation_error = ref('')

	/** UI interaction */
	const current_password_visible = ref(false)
	const new_password_visible = ref(false)
	const new_password_confirmation_visible = ref(false)
	const setup_password = ref('')
	const setup_password_confirmation = ref('')
	const setup_password_visible = ref(false)
	const setup_password_confirmation_visible = ref(false)
	const is_setup_password_modal_open = ref(false)
	const is_setup_password_submitting = ref(false)
	const has_social_password_ready = ref(false)

	const is_change_password_enabled = computed(() => (
		Boolean(current_password.value.trim()) &&
		Boolean(new_password.value.trim()) &&
		Boolean(new_password_confirmation.value.trim())
	))
	const is_setup_password_enabled = computed(() => (
		Boolean(setup_password.value.trim()) &&
		Boolean(setup_password_confirmation.value.trim())
	))

	function isStrongPassword(value: string): boolean {
		if (value.length < 6) return false

		if (/^[a-z]+$/.test(value)) return false

		return true
	}

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
				toast_store.handleApiResponse(response)

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

	async function onSetupPassword() {
		clearSetupPasswordErrors();
		is_setup_password_submitting.value = true

		try {
			const next_password = setup_password.value.trim()
			const next_password_confirmation = setup_password_confirmation.value.trim()

			if (!next_password || !next_password_confirmation) {
				setup_password_error.value = t('auth.reset.errors.fillBoth')
				return
			}

			if (!isStrongPassword(next_password)) {
				setup_password_error.value = t('auth.reset.errors.passwordRequirements')
				return
			}

			if (next_password !== next_password_confirmation) {
				setup_password_confirmation_error.value = t('auth.reset.errors.mismatch')
				return
			}

			await new Promise((resolve) => setTimeout(resolve, SETUP_PASSWORD_SUBMIT_DELAY_MS))

			is_setup_password_submitting.value = false
			has_social_password_ready.value = true
			closeSetupPasswordModal()
			clearSetupPasswordState()
			clearPasswordState()
		} catch (_error: unknown) {
			console.error(_error);
		} finally {
			is_setup_password_submitting.value = false
		}
	}

	function clearNewPasswordPairErrors() {
		pair_password_error.value = '';
	}

	function clearSetupPasswordPairErrors() {
		setup_password_error.value = ''
		setup_password_confirmation_error.value = ''
	}

	function clearPasswordErrors() {
		current_password_error.value = '';
		pair_password_error.value = '';
		new_password_confirmation_error.value = '';
	}

	function clearSetupPasswordErrors() {
		setup_password_error.value = ''
		setup_password_confirmation_error.value = ''
	}

	function clearPasswordState() {
		current_password.value = ''
		new_password.value = ''
		new_password_confirmation.value = ''
	}

	function clearSetupPasswordState() {
		setup_password.value = ''
		setup_password_confirmation.value = ''
		setup_password_visible.value = false
		setup_password_confirmation_visible.value = false
		clearSetupPasswordErrors()
	}

	function openSetupPasswordModal() {
		is_setup_password_modal_open.value = true
	}

	function closeSetupPasswordModal() {
		is_setup_password_modal_open.value = false
		clearSetupPasswordState()
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
		setup_password_error,
		setup_password_confirmation_error,

		/** Computed */
		is_change_password_enabled,
		is_setup_password_enabled,

		current_password_visible,
		new_password_visible,
		new_password_confirmation_visible,
		setup_password,
		setup_password_confirmation,
		setup_password_visible,
		setup_password_confirmation_visible,
		is_setup_password_modal_open,
		is_setup_password_submitting,
		has_social_password_ready,

		clearNewPasswordPairErrors,
		clearSetupPasswordPairErrors,
		onChangePassword,
		onSetupPassword,
		openSetupPasswordModal,
		closeSetupPasswordModal,
	}
}