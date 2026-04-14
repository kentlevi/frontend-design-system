import { defineStore } from 'pinia'
import { reactive } from 'vue'

type VerificationContext = 'idle' | 'checkout_guest_contact'

type VerificationSession = {
	email?: string | null
	token?: string | null
	expires_in?: string | number | Date | null
}

type VerificationModalState = {
	context: VerificationContext
	is_open: boolean
}

type VerificationState = {
	email: string
	code: string
	error: string
	resend_limit_reached: string
	resend_cooldown_until: number | null
	is_verifying: boolean
	verified_email: string
	session: VerificationSession | null
}

function createVerificationModalState(): VerificationModalState {
	return {
		context: 'idle',
		is_open: false,
	}
}

function createVerificationState(): VerificationState {
	return {
		email: '',
		code: '',
		error: '',
		resend_limit_reached: '',
		resend_cooldown_until: null,
		is_verifying: false,
		verified_email: '',
		session: null,
	}
}

export const useVerificationStore = defineStore('verification', () => {
	const modal_state = reactive(createVerificationModalState())
	const verification_state = reactive(createVerificationState())

	function patchModalState(payload: Partial<VerificationModalState>) {
		Object.assign(modal_state, payload)
	}

	function patchVerificationState(payload: Partial<VerificationState>) {
		Object.assign(verification_state, payload)
	}

	return {
		modal_state,
		verification_state,
		patchModalState,
		patchVerificationState,
	}
})