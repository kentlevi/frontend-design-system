import { defineStore } from 'pinia'
import type { VerificationModalState, VerificationState } from '~/types/verification/verification-state'

export const createVerificationModalState = (): VerificationModalState => {
	return {
		context: 'idle',
		is_open: false,
	}
}

export const createVerificationState = (): VerificationState => {
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