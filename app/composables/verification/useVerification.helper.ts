import {
	getCooldownSecondsFromResponse,
} from '~/composables/auth/verification/useVerificationCooldown'

export const useVerificationHelper = () => {
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

	return {
		resolveCooldownUntil,
		getFirstVerificationDataError,
		normalizeVerificationErrorMessage
	}
}