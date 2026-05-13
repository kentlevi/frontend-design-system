import { useLoginStore } from "~/stores/auth/v2/login.store"
import { useMemberLogin } from "./useMemberLogin"
import { useNonMemberLogin } from "./useNonMemberLogin"

export const useLoginCard = () => {
    const { t: translate } = useI18n()

    const login_store = useLoginStore()

    const { memberLogin } = useMemberLogin()
    const { nonMemberLogin } = useNonMemberLogin()

    const {
        member_type,
        show_password,
        member_form,
        non_member_form,
        email_error,
        email_error_message,
        password_error,
        password_error_message,
        order_number_error,
        order_number_error_message
    } = storeToRefs(login_store)

    const submitLogin = async () => {
        login_store.setError(false, false, false)
        login_store.setErrorMessages(null, null, null)

        if (member_type.value === 'member') {
            return await memberLogin()
        } else if (member_type.value === 'non-member') {
            return await nonMemberLogin()
        }

        return console.error('Invalid member type:', member_type.value)
    }

    return {
        translate,

        member_type,
        show_password,
        togglePassword: login_store.togglePassword,
        setMemberType: login_store.setMemberType,

        submitLogin,

        member_form,
        non_member_form,

        email_error,
        email_error_message,
        password_error,
        password_error_message,
        order_number_error,
        order_number_error_message
    }
}