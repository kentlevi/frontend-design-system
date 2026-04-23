import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import type {
	CardUiState,
	CheckoutState,
	ContextState,
	GuestVerificationState,
	MemberFormState,
	MemberPreferencesState,
	NonMemberFormState
} from '~/types/auth/auth-state'

export const useAuthLoginStore = defineStore('auth_login', () => {
	const context_state = reactive(createContextState())
	const checkout_state = reactive(createCheckoutState())
	const member_preferences = reactive(createMemberPreferencesState())
	const card_ui = reactive(createCardUiState())
	const member_form = reactive(createMemberFormState())
	const non_member_form = reactive(createNonMemberFormState())
	const guest_verification = reactive(createGuestVerificationState())

	const is_non_member = computed(
		() => member_preferences.member_type === 'non-member'
	)
	const is_page_login_busy = computed(
		() =>
			card_ui.is_checking_guest_order || card_ui.is_signing_in_member
	)
	const is_checkout_mode = computed(
		() => context_state.context === 'checkout'
	)

	function patchContextState(payload: Partial<ContextState>) {
		Object.assign(context_state, payload)
	}

	function patchCheckoutState(payload: Partial<CheckoutState>) {
		Object.assign(checkout_state, payload)
	}

	function patchMemberPreferences(
		payload: Partial<MemberPreferencesState>
	) {
		Object.assign(member_preferences, payload)
	}

	function patchCardUi(payload: Partial<CardUiState>) {
		Object.assign(card_ui, payload)
	}

	function patchMemberForm(payload: Partial<MemberFormState>) {
		Object.assign(member_form, payload)
	}

	function patchNonMemberForm(payload: Partial<NonMemberFormState>) {
		Object.assign(non_member_form, payload)
	}

	function patchGuestVerification(
		payload: Partial<GuestVerificationState>
	) {
		Object.assign(guest_verification, payload)
	}

	return {
		context_state,
		checkout_state,
		member_preferences,
		card_ui,
		member_form,
		non_member_form,
		guest_verification,
		is_non_member,
		is_page_login_busy,
		is_checkout_mode,
		patchContextState,
		patchCheckoutState,
		patchMemberPreferences,
		patchCardUi,
		patchMemberForm,
		patchNonMemberForm,
		patchGuestVerification,
	}
})

function createContextState(): ContextState {
	return {
		context: 'page',
	}
}

function createCheckoutState(): CheckoutState {
	return {
		modal_mode: 'login',
		is_modal_open: false,
		is_forgot_password_modal_open: false,
		forgot_password_email: '',
		should_restore_login_modal: false,
	}
}

function createMemberPreferencesState(): MemberPreferencesState {
	return {
		member_type: 'member',
		keep_signed_in: false,
		show_password: false,
	}
}

function createCardUiState(): CardUiState {
	return {
		is_forgot_password_modal_open: false,
		is_verification_modal_open: false,
		is_checking_guest_order: false,
		is_signing_in_member: false,
	}
}

function createMemberFormState(): MemberFormState {
	return {
		email: '',
		password: '',
		email_error: '',
		password_error: '',
		invalid_credentials: false,
	}
}

function createNonMemberFormState(): NonMemberFormState {
	return {
		email: '',
		order_number: '',
		email_error: '',
		email_has_error: false,
		order_error: '',
	}
}

function createGuestVerificationState(): GuestVerificationState {
	return {
		is_verifying: false,
		resend_cooldown_remaining: 0,
		email: '',
		order_number: '',
		token: '',
		code: '',
		error: '',
		resend_limit_reached: '',
		session: null,
	}
}