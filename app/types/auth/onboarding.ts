export type ProfileStep = 1 | 2;

export type ProfileUnit = 'millimeter' | 'inch';

export type EmailVerificationSession = {
	email?: string;
	expires_at?: string | number | Date;
	resend_cooldown_until?: number;
	request_cooldown_until?: number;
};

export type OnboardingDraft = {
	fields?: Record<string, string>;
	email?: string;
};
