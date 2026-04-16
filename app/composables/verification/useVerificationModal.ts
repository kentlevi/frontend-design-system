import { useVerificationCodeInput } from '~/composables/auth/verification/useVerificationCodeInput'
import {
	getRemainingSecondsFromTimestamp,
	useVerificationCooldown,
} from '~/composables/auth/verification/useVerificationCooldown'
import { authVerificationConfig } from '~/data/auth/verification'
import { useVerificationStore } from '~/stores/verification.store'
import { useCheckoutVerification } from './useCheckoutVerification'

export function useVerificationModal() {
	const { t: translate } = useI18n()
	const verification_store = useVerificationStore()
	const { modal_state, verification_state } = storeToRefs(verification_store)
	const verification_cooldown = useVerificationCooldown()
	const test_id_prefix = 'verification-modal'

	const submit_label = computed(() => {
		if (modal_state.value.context === 'checkout_guest_contact') {
			return translate('auth.guestVerification.verify')
		}

		return translate('auth.verification.verify')
	})

	const busy_label = computed(() => translate('auth.verification.verifying'))
	const otp_length = computed(() => authVerificationConfig.otpLength)
	const modal_class = computed(() => {
		if (modal_state.value.context === 'checkout_guest_contact') {
			return 'checkout-guest-email-verification-dialog'
		}

		return 'verification-dialog'
	})
	const resend_cooldown_remaining = verification_cooldown.remaining
	const {
		codeInputs: code_inputs,
		inputRefs: input_refs,
		setCode,
		getCode,
		handleInput,
		handleKeyDown,
		handlePaste,
	} = useVerificationCodeInput(otp_length.value)
	const is_resend_pending = ref(false)

	async function submitVerification() {
		if (modal_state.value.context === 'checkout_guest_contact') {
			const { submitCheckoutGuestContactVerification } = useCheckoutVerification()
			return submitCheckoutGuestContactVerification()
		}

		return
	}

	async function resendVerification() {
		if (modal_state.value.context === 'checkout_guest_contact') {
			const { resendCheckoutGuestContactVerification } = useCheckoutVerification()
			return resendCheckoutGuestContactVerification()
		}

		return
	}

	function clearTransientState() {
		verification_store.patchVerificationState({
			code: '',
			error: '',
		})
	}

	function setModalOpen(value: boolean) {
		verification_store.patchModalState({
			is_open: value,
		})

		if (value) return

		clearTransientState()
	}

	function setVerificationCode(value: string) {
		verification_store.patchVerificationState({
			code: value,
			error: '',
		})
	}

	function emitCode() {
		setVerificationCode(getCode())
	}

	function onInput(index: number, event: Event) {
		handleInput(index, event)
		emitCode()
	}

	function onPaste(event: ClipboardEvent) {
		handlePaste(event)
		emitCode()
	}

	const can_resend = computed(
		() =>
			resend_cooldown_remaining.value <= 0 &&
			!is_resend_pending.value &&
			!verification_state.value.is_verifying
	)
	const modal_align = computed<'top' | 'center' | 'bottom'>(() => 'center')

	function onResendClick() {
		if (!can_resend.value) return
		is_resend_pending.value = true
		void resendVerification().finally(() => {
			is_resend_pending.value = false
		})
	}

	const formatted_error_parts = computed(() => {
		if (!verification_state.value.error) return []

		return verification_state.value.error
			.split(/(<b>.*?<\/b>)/g)
			.filter(Boolean)
			.map(part => {
				const match = part.match(/^<b>(.*?)<\/b>$/)
				return {
					text: match ? match[1] : part,
					is_bold: Boolean(match),
				}
			})
	})

	watch(
		() => verification_state.value.resend_cooldown_until,
		(value) => {
			verification_cooldown.start(getRemainingSecondsFromTimestamp(value))
		},
		{ immediate: true }
	)

	watch(
		() => verification_state.value.code,
		(value) => {
			setCode(value ?? '')
		},
		{ immediate: true }
	)

	watch(
		() => resend_cooldown_remaining.value,
		(remaining) => {
			if (remaining > 0) return
			verification_store.patchVerificationState({
				resend_limit_reached: '',
			})
		}
	)

	watch(
		() => modal_state.value.is_open,
		(is_open) => {
			is_resend_pending.value = false
			if (!is_open) return
			verification_store.patchVerificationState({
				error: '',
			})
		}
	)

	return {
		translate,
		is_modal_open: computed(() => modal_state.value.is_open),
		email: computed(() => verification_state.value.email),
		error: computed(() => verification_state.value.error),
		resend_limit_reached: computed(
			() => verification_state.value.resend_limit_reached
		),
		is_verifying: computed(() => verification_state.value.is_verifying),
		code_inputs,
		input_refs,
		can_resend,
		modal_align,
		test_id_prefix,
		modal_class,
		formatted_error_parts,
		resend_cooldown_remaining,
		setModalOpen,
		submitVerification,
		onInput,
		onPaste,
		onResendClick,
		handleKeyDown,
	}
}