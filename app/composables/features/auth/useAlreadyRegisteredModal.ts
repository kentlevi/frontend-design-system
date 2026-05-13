import { useResetPassword } from '~/composables/auth/useResetPassword'
import { useMemberLogin } from '~/composables/features/account/orders/auth/login/useMemberLogin'
import { useLoginStore } from '~/stores/auth/v2/login.store'

export const useAlreadyRegisteredModal = () => {
	const { t: translate } = useI18n()

	const login_store = useLoginStore()
	const { memberLogin } = useMemberLogin()
	const { handleModalValueChange } = useResetPassword()
	const is_submitting = ref(false)

	const {
		is_already_registered_modal_open,
		member_form,
		show_password,
		email_error,
		email_error_message,
		password_error,
		password_error_message
	} = storeToRefs(login_store)

	const closeModal = () => {
		login_store.closeAlreadyRegisteredModal()
	}

	const setModalOpen = (value: boolean) => {
		if (!value) closeModal()
	}

	const continueLogin = async () => {
		if (is_submitting.value) return

		login_store.setError(false, false, false)
		login_store.setErrorMessages(null, null, null)

		is_submitting.value = true

		try {
			const response = await memberLogin()
			if (response?.success) closeModal()
			return response
		} finally {
			is_submitting.value = false
		}
	}

	const openForgotPassword = () => {
		closeModal()
		handleModalValueChange(true)
	}

	return {
		translate,

		is_open: is_already_registered_modal_open,
		member_form,
		show_password,
		email_error,
		email_error_message,
		password_error,
		password_error_message,
		is_submitting,

		togglePassword: login_store.togglePassword,
		setModalOpen,
		closeModal,
		continueLogin,
		openForgotPassword
	}
}