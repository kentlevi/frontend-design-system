import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useVerificationCodeInput } from '~/composables/auth/verification/useVerificationCodeInput'
import {
	getAuthErrorMessage,
	getAuthResponseCode,
	getAuthResponseMessage,
} from '~/helpers/auth/auth.helper'
import {
	getCooldownSecondsFromResponse,
	getRemainingSecondsFromTimestamp,
	useVerificationCooldown,
} from '~/composables/auth/verification/useVerificationCooldown'
import { authVerificationConfig } from '~/data/auth/verification'
import {
	requestNonMemberLoginVerification,
	submitNonMemberLoginVerification,
} from '~/services/auth/auth.service'
import { useVerificationStore } from '~/stores/verification.store'

function resolveCooldownUntil(response: unknown): number | null {
	const cooldown_seconds = getCooldownSecondsFromResponse(response)
	return cooldown_seconds > 0
		? Date.now() + cooldown_seconds * 1000
		: null
}

function getFirstVerificationDataError(
	payload: Record<string, unknown> | null | undefined
): string {
	const prioritized_keys = ['otp', 'code', 'verification_code', 'email']

	for (const key of prioritized_keys) {
		const field_errors = payload?.[key]

		if (Array.isArray(field_errors) && field_errors.length > 0) {
			const message = String(field_errors[0] ?? '').trim()
			if (message) return message
		}
	}

	if (!payload || typeof payload !== 'object') return ''

	for (const value of Object.values(payload)) {
		if (typeof value === 'string' && value.trim()) {
			return value.trim()
		}

		if (Array.isArray(value) && value.length > 0) {
			const message = String(value[0] ?? '').trim()
			if (message) return message
		}
	}

	return ''
}

function normalizeVerificationErrorMessage(
	message: string,
	translate: ReturnType<typeof useI18n>['t']
): string {
	if (!message) return ''
	if (/expired/i.test(message)) {
		return translate('auth.verification.expiredCode')
	}
	if (/incorrect|invalid/i.test(message)) {
		return translate('auth.verification.invalidCode')
	}
	return message
}

export function useVerificationModal() {
	const { t: translate } = useI18n()
	const verification_store = useVerificationStore()
	const { modal_state, verification_state } = storeToRefs(verification_store)
	const verification_cooldown = useVerificationCooldown()
	const translation_key = 'auth.verification'
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
	const computed_submit_label = computed(() =>
		verification_state.value.is_verifying
			? busy_label.value || translate(`${translation_key}.verifying`)
			: submit_label.value || translate(`${translation_key}.verify`)
	)
	const is_resend_pending = ref(false)

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

	async function submitCheckoutGuestContactVerification() {
		const email_value = verification_state.value.email.trim()
		const otp_value = verification_state.value.code.trim()
		const session_token =
			(verification_state.value.session?.token || '').trim()

		if (!otp_value) {
			verification_store.patchVerificationState({
				error: translate('auth.guestVerification.codeRequired'),
			})
			return
		}

		if (!email_value || !session_token) {
			verification_store.patchVerificationState({
				error: translate('auth.guestVerification.requestFailed'),
			})
			return
		}

		try {
			verification_store.patchVerificationState({
				is_verifying: true,
				error: '',
			})

			const response = await submitNonMemberLoginVerification(
				{
					email: email_value || null,
					order_number: null,
					login_token: session_token || null,
					otp: otp_value,
				},
				{
					is_checkout: true,
				}
			)

			if (!response.success) {
				const first_data_error = getFirstVerificationDataError(
					response.data as Record<string, unknown> | null | undefined
				)
				verification_store.patchVerificationState({
					error:
						normalizeVerificationErrorMessage(
							first_data_error,
							translate
						) ||
						normalizeVerificationErrorMessage(
							getAuthResponseMessage(response),
							translate
						) ||
						translate('auth.guestVerification.invalidCode'),
				})
				return response
			}

			verification_store.patchVerificationState({
				code: '',
				error: '',
				resend_limit_reached: '',
				resend_cooldown_until: null,
				verified_email: email_value,
				session: null,
			})
			verification_store.patchModalState({
				is_open: false,
			})
			return response
		} catch (error) {
			verification_store.patchVerificationState({
				error:
					getAuthErrorMessage(error) ||
					translate('auth.guestVerification.invalidCode'),
			})
			console.error(error)
			return
		} finally {
			verification_store.patchVerificationState({
				is_verifying: false,
			})
		}
	}

	async function resendCheckoutGuestContactVerification() {
		if (resend_cooldown_remaining.value > 0) return

		const email_value =
			(verification_state.value.session?.email ||
				verification_state.value.email).trim()

		if (!email_value) {
			verification_store.patchVerificationState({
				error: translate('auth.guestVerification.requestFailed'),
			})
			return
		}

		try {
			verification_store.patchVerificationState({
				error: '',
				resend_limit_reached: '',
			})

			const response = await requestNonMemberLoginVerification(
				{
					email: email_value,
					order_number: '',
					is_resend: true,
				},
				{
					is_checkout: true,
				}
			)

			if (!response.success) {
				const response_message =
					getAuthResponseMessage(response) ||
					translate('auth.guestVerification.requestFailed')
				const response_code = getAuthResponseCode(response)

				if (response_code === 'max_resend_reached') {
					verification_store.patchVerificationState({
						resend_limit_reached: response_message,
						error: '',
						resend_cooldown_until: resolveCooldownUntil(response),
					})
				} else {
					verification_store.patchVerificationState({
						error: response_message,
					})
				}

				return response
			}

			const resolved_token =
				typeof response.data?.token === 'string'
					? response.data.token.trim()
					: ''

			if (!resolved_token) {
				verification_store.patchVerificationState({
					error: translate('auth.verification.invalidCode'),
				})
				return response
			}

			verification_store.patchVerificationState({
				email: email_value,
				code: '',
				error: '',
				resend_limit_reached: '',
				resend_cooldown_until: resolveCooldownUntil(response),
				session: {
					email: email_value,
					token: resolved_token,
					expires_in: response.data?.expires_in || null,
				},
			})
			return response
		} catch (error) {
			verification_store.patchVerificationState({
				error:
					getAuthErrorMessage(error) ||
					translate('auth.guestVerification.requestFailed'),
			})
			console.error(error)
			return
		}
	}

	async function submitVerification() {
		if (modal_state.value.context === 'checkout_guest_contact') {
			return submitCheckoutGuestContactVerification()
		}

		return
	}

	async function resendVerification() {
		if (modal_state.value.context === 'checkout_guest_contact') {
			return resendCheckoutGuestContactVerification()
		}

		return
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
		computed_submit_label,
		code_inputs,
		input_refs,
		translation_key,
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