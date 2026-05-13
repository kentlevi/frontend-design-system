export const useLoginStore = defineStore('login', () => {
    const member_type = ref<'member' | 'non-member'>('member')
    const show_password = ref<boolean>(false)
    const is_already_registered_modal_open = ref<boolean>(false)

    const email_error = ref<boolean>(false)
    const password_error = ref<boolean>(false)
    const order_number_error = ref<boolean>(false)
    const email_error_message = ref<string | null>(null)
    const password_error_message = ref<string | null>(null)
    const order_number_error_message = ref<string | null>(null)

    const member_form = reactive({
        email: '',
        password: '',
        remember_me: false
    })

    const non_member_form = reactive({
        email: '',
        order_number: '',
    })

    const togglePassword = () => {
        show_password.value = !show_password.value
    }

    const setMemberType = (type: 'member' | 'non-member') => {
        member_type.value = type
    }

    const setError = (email: boolean, password: boolean, order_number: boolean) => {
        email_error.value = email
        password_error.value = password
        order_number_error.value = order_number
    }

    const setErrorMessages = (email_message: string | null, password_message: string | null, order_number_message: string | null) => {
        email_error_message.value = email_message
        password_error_message.value = password_message
        order_number_error_message.value = order_number_message
    }

    const openAlreadyRegisteredModal = (email: string) => {
        member_form.email = email
        member_form.password = ''
        email_error.value = false
        password_error.value = false
        email_error_message.value = null
        password_error_message.value = null
        is_already_registered_modal_open.value = true
    }

    const closeAlreadyRegisteredModal = () => {
        is_already_registered_modal_open.value = false
    }

    return {
        member_type,
        setMemberType,

        show_password,
        togglePassword,

        member_form,
        non_member_form,

        setError,
        setErrorMessages,
        email_error,
        email_error_message,
        password_error,
        password_error_message,
        order_number_error,
        order_number_error_message,

        is_already_registered_modal_open,
        openAlreadyRegisteredModal,
        closeAlreadyRegisteredModal
    }
})