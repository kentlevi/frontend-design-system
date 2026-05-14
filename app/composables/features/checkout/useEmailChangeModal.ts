import { isValidAuthEmail } from '~/helpers/auth/auth.helper'
import { useEmailChangeStore } from '~/stores/checkout/email-change.store'

export const useEmailChangeModal = () => {
	const { t: translate } = useI18n()

	const email_change_store = useEmailChangeStore()

	const {
		is_open,
		email_change_form,
		email_error,
		email_error_message,
		is_submitting,
	} = storeToRefs(email_change_store)

	const closeModal = () => {
		email_change_store.closeModal()
	}

	const setModalOpen = (value: boolean) => {
		if (!value) closeModal()
	}

	const onEmailInput = () => {
		if (email_error.value) {
			email_change_store.setError(false, null)
		}
	}

	const confirmEmailChange = async () => {
		if (is_submitting.value) return

		const new_email = email_change_form.value.new_email.trim()

		if (!new_email) {
			email_change_store.setError(
				true,
				translate('auth.login.validation.fieldBlank')
			)
			return
		}

		if (!isValidAuthEmail(new_email)) {
			email_change_store.setError(
				true,
				translate('auth.login.validation.emailInvalid')
			)
			return
		}

		const handler = email_change_store.on_confirm_handler
		if (!handler) {
			closeModal()
			return
		}

		is_submitting.value = true
		try {
			await handler(new_email)
			closeModal()
		} finally {
			is_submitting.value = false
		}
	}

	return {
		translate,

		is_open,
		email_change_form,
		email_error,
		email_error_message,
		is_submitting,

		setModalOpen,
		closeModal,
		onEmailInput,
		confirmEmailChange,
	}
}