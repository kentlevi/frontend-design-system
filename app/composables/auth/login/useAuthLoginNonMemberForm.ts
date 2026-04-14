import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useAuthLoginStore } from '~/stores/auth/login.store'

export function useAuthLoginNonMemberForm() {
	const { t: translate } = useI18n()
	const auth_login_store = useAuthLoginStore()
	const {
		non_member_form,
		is_checkout_mode,
	} = storeToRefs(auth_login_store)

	const hide_order_number = computed(() => is_checkout_mode.value)

	function setNonMemberEmail(value: string) {
		auth_login_store.patchNonMemberForm({
			email: value,
			email_error: '',
			email_has_error: false,
		})
		auth_login_store.patchGuestVerification({
			resend_limit_reached: '',
		})
	}

	function setNonMemberOrderNumber(value: string) {
		auth_login_store.patchNonMemberForm({
			order_number: value,
			order_error: '',
		})
		auth_login_store.patchGuestVerification({
			resend_limit_reached: '',
		})
	}

	return {
		translate,
		non_member_email: computed(() => non_member_form.value.email),
		non_member_order_number: computed(
			() => non_member_form.value.order_number
		),
		non_member_email_error: computed(
			() => non_member_form.value.email_error
		),
		non_member_email_has_error: computed(
			() => non_member_form.value.email_has_error
		),
		non_member_order_error: computed(
			() => non_member_form.value.order_error
		),
		hide_order_number,
		setNonMemberEmail,
		setNonMemberOrderNumber,
	}
}