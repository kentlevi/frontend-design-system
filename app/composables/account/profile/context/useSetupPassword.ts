import { setupPassword } from "~/services/profile/setupPassword.service"
import { useUsersStore } from "~/stores/users/users.store"
import { normalizeResponseError } from "~/utils/response/response"

export function useSetupPassword() {
	/** Store */
	const user_store = useUsersStore()
	const toast_store = useToastStore()
	const loading_overlay_store = useLoadingOverlayStore()
	// const SETUP_PASSWORD_SUBMIT_DELAY_MS = 700

	// const { t: translate } = useI18n()

	const setup_password_error = ref('')
	const setup_password_confirmation_error = ref('')

	const setup_password = ref('')
	const setup_password_confirmation = ref('')
	const setup_password_visible = ref(false)
	const setup_password_confirmation_visible = ref(false)
	const is_setup_password_modal_open = ref(false)

	const is_setup_password_enabled = computed(() => (
		Boolean(setup_password.value.trim()) &&
		Boolean(setup_password_confirmation.value.trim())
	))

	const has_password = computed(() => user_store.state.has_password)

	async function onSetupPassword() {
		clearSetupPasswordErrors()
		startSetupPasswordOverlay()
		closeSetupPasswordModal(false)

		try {
			const payload = {
				password: setup_password.value,
				password_confirmation: setup_password_confirmation.value
			}

			const response = await setupPassword(payload);

			if (response.success) {
				toast_store.handleApiResponse(response)

				user_store.patchUser({ has_password: true })

				closeSetupPasswordModal()
				clearSetupPasswordState()
			} else {
				openSetupPasswordModal()
				const normalized_error = normalizeResponseError(response)

				if (normalized_error?.errors) {
					setup_password_error.value = normalized_error?.errors?.password?.[0] ?? '';
				}
			}
		} catch (_error: unknown) {
			console.error(_error);
		} finally {
			loading_overlay_store.stopLoading('setup_password')
		}
	}

	function clearSetupPasswordPairErrors() {
		setup_password_error.value = ''
		setup_password_confirmation_error.value = ''
	}

	function clearSetupPasswordErrors() {
		setup_password_error.value = ''
		setup_password_confirmation_error.value = ''
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

	function closeSetupPasswordModal(reset = true) {
		is_setup_password_modal_open.value = false
		if (reset) {
			clearSetupPasswordState()
		}
	}



	/** Overlays */
	function startSetupPasswordOverlay() {
		loading_overlay_store.startLoading('setup_password', {
			showCopy: true,
			testId: 'account-profile-password-change-page-overlay',
			position: 'fixed'
		})
	}

	return {
		has_password,
		setup_password_error,
		setup_password_confirmation_error,
		is_setup_password_enabled,
		setup_password,
		setup_password_confirmation,
		setup_password_visible,
		setup_password_confirmation_visible,
		is_setup_password_modal_open,

		clearSetupPasswordPairErrors,
		onSetupPassword,
		openSetupPasswordModal,
		closeSetupPasswordModal,
	}
}