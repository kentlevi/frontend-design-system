type EmailChangeConfirmHandler = (new_email: string) => Promise<unknown> | unknown

export const useEmailChangeStore = defineStore('checkout-email-change', () => {
    const is_open = ref<boolean>(false)

    const email_change_form = reactive({
        new_email: '',
    })

    const email_error = ref<boolean>(false)
    const email_error_message = ref<string | null>(null)

    const is_submitting = ref<boolean>(false)

    const on_confirm_handler = ref<EmailChangeConfirmHandler | null>(null)

    const setOnConfirm = (handler: EmailChangeConfirmHandler | null) => {
        on_confirm_handler.value = handler
    }

    const setError = (has_error: boolean, message: string | null) => {
        email_error.value = has_error
        email_error_message.value = message
    }

    const openModal = (current_email: string = '') => {
        email_change_form.new_email = current_email
        email_error.value = false
        email_error_message.value = null
        is_submitting.value = false
        is_open.value = true
    }

    const closeModal = () => {
        is_open.value = false
        email_change_form.new_email = ''
        email_error.value = false
        email_error_message.value = null
        is_submitting.value = false
    }

    return {
        is_open,
        email_change_form,
        email_error,
        email_error_message,
        is_submitting,
        on_confirm_handler,

        setOnConfirm,
        setError,
        openModal,
        closeModal,
    }
})
