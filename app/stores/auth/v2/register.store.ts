export const useRegisterStore = defineStore('register', () => {
	const register_form = reactive({
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		agree_terms: false,
		opt_in_promos: false,
	})

	const show_password = ref<boolean>(false)

	const first_name_error = ref<boolean>(false)
	const email_error = ref<boolean>(false)
	const password_error = ref<boolean>(false)
	const terms_error = ref<boolean>(false)

	const first_name_error_message = ref<string | null>(null)
	const email_error_message = ref<string | null>(null)
	const password_error_message = ref<string | null>(null)
	const terms_error_message = ref<string | null>(null)

	const togglePassword = () => {
		show_password.value = !show_password.value
	}

	const setError = (
		first_name: boolean,
		email: boolean,
		password: boolean,
		terms: boolean
	) => {
		first_name_error.value = first_name
		email_error.value = email
		password_error.value = password
		terms_error.value = terms
	}

	const setErrorMessages = (
		first_name_message: string | null,
		email_message: string | null,
		password_message: string | null,
		terms_message: string | null
	) => {
		first_name_error_message.value = first_name_message
		email_error_message.value = email_message
		password_error_message.value = password_message
		terms_error_message.value = terms_message
	}

	const resetForm = () => {
		register_form.first_name = ''
		register_form.last_name = ''
		register_form.email = ''
		register_form.password = ''
		register_form.agree_terms = false
		register_form.opt_in_promos = false
		show_password.value = false
		setError(false, false, false, false)
		setErrorMessages(null, null, null, null)
	}

	return {
		register_form,

		show_password,
		togglePassword,

		setError,
		setErrorMessages,
		resetForm,

		first_name_error,
		first_name_error_message,
		email_error,
		email_error_message,
		password_error,
		password_error_message,
		terms_error,
		terms_error_message,
	}
})