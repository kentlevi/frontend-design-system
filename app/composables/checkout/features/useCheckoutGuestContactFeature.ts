import { storeToRefs } from 'pinia'
import { onBeforeUnmount, ref } from 'vue'
import {
	getAuthResponseCode,
	getAuthErrorMessage,
	getAuthResponseMessage,
	isValidAuthEmail,
} from '~/helpers/auth/auth.helper'
import {
	getCooldownSecondsFromResponse,
	isTimestampExpired,
} from '~/composables/auth/verification/useVerificationCooldown'
import { useCheckoutExperienceFeatureContext } from '~/composables/checkout/checkoutExperienceFeatureContext'
import { useDismissibleTooltip } from '~/composables/checkout/features/useDismissibleTooltip'
import { requestNonMemberLoginVerification } from '~/services/auth/auth.service'
import { useLoadingOverlayStore } from '~/stores/loading_overlay'
import { useVerificationStore } from '~/stores/verification.store'
import { useToastStore } from '~/stores/toast'

function resolveCooldownUntil(response: unknown): number | null {
	const cooldown_seconds = getCooldownSecondsFromResponse(response)
	return cooldown_seconds > 0
		? Date.now() + cooldown_seconds * 1000
		: null
}

export function useCheckoutGuestContactFeature() {
	const { t: translate } = useI18n()
	const {
		is_member,
		email,
		email_tooltip_open,
		toggleEmailTooltip,
		openLoginModal,
	} = useCheckoutExperienceFeatureContext()
	const loading_overlay_store = useLoadingOverlayStore()
	const toast_store = useToastStore()
	const verification_store = useVerificationStore()
	const { verification_state } = storeToRefs(verification_store)
	const email_tooltip_ref = ref<HTMLElement | null>(null)
	const CHECKOUT_GUEST_VERIFICATION_LOADING_KEY =
		'checkout_guest_contact_verification'

	useDismissibleTooltip(email_tooltip_ref, email_tooltip_open)

	function openVerificationModal() {
		verification_store.patchModalState({
			context: 'checkout_guest_contact',
			is_open: true,
		})
	}

	function resetVerificationState() {
		verification_store.patchModalState(createVerificationModalState())
		verification_store.patchVerificationState(createVerificationState())
	}

	function setGuestEmail(value: string) {
		email.value = value

		if (is_member.value) return

		const normalized_value = value.trim().toLowerCase()
		const verified_email =
			verification_state.value.verified_email.trim().toLowerCase()
		const session_email =
			(verification_state.value.session?.email || '').trim().toLowerCase()

		if (verified_email && verified_email !== normalized_value) {
			verification_store.patchVerificationState({
				verified_email: '',
			})
		}

		if (session_email && session_email !== normalized_value) {
			verification_store.patchModalState({
				is_open: false,
			})
			verification_store.patchVerificationState({
				code: '',
				error: '',
				resend_limit_reached: '',
				resend_cooldown_until: null,
				session: null,
			})
		}
	}

	async function handleGuestEmailBlur() {
		if (is_member.value) return

		const email_value = email.value.trim()
		if (!email_value || !isValidAuthEmail(email_value)) return

		const normalized_email = email_value.toLowerCase()
		const verified_email =
			verification_state.value.verified_email.trim().toLowerCase()

		if (verified_email === normalized_email) return

		const session_email =
			(verification_state.value.session?.email || '').trim().toLowerCase()
		const session_token =
			(verification_state.value.session?.token || '').trim()
		const can_reuse_session =
			session_email === normalized_email &&
			session_token !== '' &&
			!isTimestampExpired(verification_state.value.session?.expires_in)

		if (can_reuse_session) {
			verification_store.patchVerificationState({
				email: email_value,
				code: '',
				error: '',
				resend_limit_reached: '',
			})
			openVerificationModal()
			return
		}

		try {
			verification_store.patchVerificationState({
				email: email_value,
				code: '',
				error: '',
				resend_limit_reached: '',
				is_verifying: true,
			})
			loading_overlay_store.startLoading(
				CHECKOUT_GUEST_VERIFICATION_LOADING_KEY,
				{
					label: translate('auth.verification.verifying'),
					testId: 'checkout-guest-contact-verification-loading-overlay',
					position: 'fixed',
				}
			)

			const response = await requestNonMemberLoginVerification(
				{
					email: email_value,
					order_number: '',
					is_resend: false,
				},
				{
					is_checkout: true,
				}
			)

			if (!response.success) {
				const response_code = getAuthResponseCode(response)
				const response_message =
					getAuthResponseMessage(response) ||
					translate('auth.guestVerification.requestFailed')

				if (response_code === 'max_resend_reached') {
					verification_store.patchVerificationState({
						email: email_value,
						code: '',
						error: '',
						resend_limit_reached: response_message,
						resend_cooldown_until: resolveCooldownUntil(response),
						session: null,
					})
					openVerificationModal()
					return response
				}

				toast_store.showToastWithTimer({
					message: response_message,
					tone: 'error',
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
					token: response.data?.token || null,
					expires_in: response.data?.expires_in || null,
				},
			})
			openVerificationModal()
			return response
		} catch (error) {
			toast_store.showToastWithTimer({
				message:
					getAuthErrorMessage(error) ||
					translate('auth.guestVerification.requestFailed'),
				tone: 'error',
			})
			console.error(error)
			return
		} finally {
			loading_overlay_store.stopLoading(
				CHECKOUT_GUEST_VERIFICATION_LOADING_KEY
			)
			verification_store.patchVerificationState({
				is_verifying: false,
			})
		}
	}

	onBeforeUnmount(() => {
		loading_overlay_store.stopLoading(
			CHECKOUT_GUEST_VERIFICATION_LOADING_KEY
		)
		resetVerificationState()
	})

	return {
		translate,
		is_member,
		email,
		email_tooltip_open,
		email_tooltip_ref,
		toggleEmailTooltip,
		openLoginModal,
		setGuestEmail,
		handleGuestEmailBlur,
	}
}