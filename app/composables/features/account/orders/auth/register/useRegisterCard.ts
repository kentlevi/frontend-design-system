import { useRegister } from "./useRegister"
import { useRegisterStore } from "~/stores/auth/v2/register.store"

export const useRegisterCard = () => {
	const { t: translate } = useI18n()

	const register_store = useRegisterStore()
	const { register } = useRegister()

	const {
		register_form,
		show_password,
		first_name_error,
		first_name_error_message,
		email_error,
		email_error_message,
		password_error,
		password_error_message,
		terms_error,
		terms_error_message,
	} = storeToRefs(register_store)

	const submitRegister = async () => {
		register_store.setError(false, false, false, false)
		register_store.setErrorMessages(null, null, null, null)
		return await register()
	}

	return {
		translate,

		register_form,
		show_password,
		togglePassword: register_store.togglePassword,

		submitRegister,

		first_name_error,
		first_name_error_message,
		email_error,
		email_error_message,
		password_error,
		password_error_message,
		terms_error,
		terms_error_message,
	}
}