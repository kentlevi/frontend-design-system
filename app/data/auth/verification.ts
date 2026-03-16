export const authVerificationConfig = {
	otpLength: 4,
	resendCooldownSeconds: 60,
	maxAttempts: 5,
	i18n: {
		register: 'auth.verification',
		guest: 'auth.guestVerification',
	},
} as const;

export type AuthVerificationI18nBase =
	(typeof authVerificationConfig.i18n)[keyof typeof authVerificationConfig.i18n];