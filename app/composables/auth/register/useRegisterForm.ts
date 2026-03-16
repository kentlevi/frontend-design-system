import { nextTick, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
	getAuthErrorMessage,
	getAuthResponseCode,
	getAuthResponseMessage,
	isValidAuthEmail,
} from '~/helpers/auth/auth.helper';
import { useCountry } from '~/composables/app/country/useCountry';
import { HOME_WELCOME_POPOVER_PENDING_KEY } from '~/data/home/onboarding';
import { authVerificationConfig } from '~/data/auth/verification';
import { useAuthUser } from '../useAuthUser';
import { useRegisterUser } from '../useRegisterUser';

export function useRegisterForm() {
	const router = useRouter();
	const isVerificationModalOpen = ref(false);
	const { t } = useI18n();
	const { withCountry } = useCountry();

	const firstName = ref('');
	const lastName = ref('');
	const email = ref('');
	const password = ref('');
	const showPassword = ref(false);
	const agreeTerms = ref(false);
	const optInPromos = ref(false);

	const firstNameError = ref('');
	const emailError = ref('');
	const passwordError = ref('');
	const termsError = ref('');
	const isSubmitting = ref(false);

	const verificationEmail = ref('');
	const verificationToken = ref('');
	const verificationCode = ref('');
	const verificationError = ref('');
	const resendLimitReached = ref('');
	const verificationOtpRequired = ref(true);
	const isVerifying = ref(false);
	const resendCooldownRemaining = ref(0);

	type VerificationExpiryCookie = {
		email?: string;
		token?: string;
		expires_at?: string | number | Date;
		resend_cooldown_until?: number;
		register_cooldown_until?: number;
	};

	const verificationExpiry = ref<VerificationExpiryCookie | null>(null);
	let resendCooldownTimer: ReturnType<typeof setInterval> | null = null;
	const registerRequestCooldownRemaining = ref(0);
	let registerRequestCooldownTimer: ReturnType<typeof setInterval> | null = null;

	function clearResendCooldownTimer() {
		if (!resendCooldownTimer) return;
		clearInterval(resendCooldownTimer);
		resendCooldownTimer = null;
	}

	function clearRegisterRequestCooldownTimer() {
		if (!registerRequestCooldownTimer) return;
		clearInterval(registerRequestCooldownTimer);
		registerRequestCooldownTimer = null;
	}

	function toEpochMilliseconds(value: unknown): number {
		if (typeof value === 'number' && Number.isFinite(value)) {
			return value > 1e12 ? value : value * 1000;
		}
		if (typeof value === 'string') {
			const parsedNumber = Number(value);
			if (Number.isFinite(parsedNumber)) {
				return parsedNumber > 1e12 ? parsedNumber : parsedNumber * 1000;
			}
			const parsedDate = Date.parse(value);
			return Number.isFinite(parsedDate) ? parsedDate : Number.NaN;
		}
		if (value instanceof Date) {
			return value.getTime();
		}
		return Number.NaN;
	}

	function getResendCooldownSecondsFromCache(cache: VerificationExpiryCookie | null): number {
		if (!cache) return 0;
		const cooldownUntil = toEpochMilliseconds(cache.resend_cooldown_until);
		if (!Number.isFinite(cooldownUntil)) return 0;
		const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
		return Math.max(0, remaining);
	}

	function getRegisterCooldownSecondsFromCache(cache: VerificationExpiryCookie | null): number {
		if (!cache) return 0;
		const cooldownUntil = toEpochMilliseconds(cache.register_cooldown_until);
		if (!Number.isFinite(cooldownUntil)) return 0;
		const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
		return Math.max(0, remaining);
	}

	function clearResendCooldownCache() {
		if (!verificationExpiry.value) return;
		const { resend_cooldown_until: _resendCooldownUntil, ...rest } = verificationExpiry.value;
		verificationExpiry.value = Object.keys(rest).length > 0 ? rest : null;
	}

	function clearRegisterCooldownCache() {
		if (!verificationExpiry.value) return;
		const { register_cooldown_until: _registerCooldownUntil, ...rest } = verificationExpiry.value;
		verificationExpiry.value = Object.keys(rest).length > 0 ? rest : null;
	}

	function setResendCooldownCache(seconds: number) {
		const now = Date.now();
		const until = now + Math.max(0, Math.floor(seconds)) * 1000;
		verificationExpiry.value = {
			...(verificationExpiry.value || {}),
			resend_cooldown_until: until,
		};
	}

	function setRegisterCooldownCache(seconds: number) {
		const now = Date.now();
		const until = now + Math.max(0, Math.floor(seconds)) * 1000;
		verificationExpiry.value = {
			...(verificationExpiry.value || {}),
			register_cooldown_until: until,
		};
	}

	function startRegisterRequestCooldown(
		seconds: number,
		options: { persist?: boolean } = {}
	) {
		clearRegisterRequestCooldownTimer();
		const shouldPersist = options.persist !== false;
		registerRequestCooldownRemaining.value = Math.max(0, Math.floor(seconds));
		if (registerRequestCooldownRemaining.value <= 0) {
			clearRegisterCooldownCache();
			return;
		}
		if (shouldPersist) {
			setRegisterCooldownCache(registerRequestCooldownRemaining.value);
		}

		registerRequestCooldownTimer = setInterval(() => {
			if (registerRequestCooldownRemaining.value <= 1) {
				clearRegisterRequestCooldownTimer();
				registerRequestCooldownRemaining.value = 0;
				clearRegisterCooldownCache();
				return;
			}

			registerRequestCooldownRemaining.value -= 1;
		}, 1000);
	}

	function applyRegisterCooldownFromResponse(response: unknown) {
		const payload = response as { data?: { cooldown_remaining?: unknown } } | null;
		const seconds = Number(payload?.data?.cooldown_remaining ?? 0);
		if (!Number.isFinite(seconds)) return false;
		if (seconds <= 0) return false;
		startRegisterRequestCooldown(seconds);
		return true;
	}

	function startResendCooldown(
		seconds: number = authVerificationConfig.resendCooldownSeconds,
		options: { persist?: boolean } = {}
	) {
		clearResendCooldownTimer();
		const shouldPersist = options.persist !== false;
		resendCooldownRemaining.value = Math.max(0, Math.floor(seconds));
		if (shouldPersist && resendCooldownRemaining.value > 0) {
			setResendCooldownCache(resendCooldownRemaining.value);
		}
		if (resendCooldownRemaining.value <= 0) return;

		resendCooldownTimer = setInterval(() => {
			if (resendCooldownRemaining.value <= 1) {
				clearResendCooldownTimer();
				resendCooldownRemaining.value = 0;
				clearResendCooldownCache();
				return;
			}
			resendCooldownRemaining.value -= 1;
		}, 1000);
	}

	function isValidRegisterPassword(value: string) {
		if (value.length < 6) return false;
		return /[A-Z]|\d|[^A-Za-z0-9]/.test(value);
	}

	function clearErrors() {
		firstNameError.value = '';
		emailError.value = '';
		passwordError.value = '';
		termsError.value = '';
	}

	watch(firstName, (value) => {
		if (value.trim()) {
			firstNameError.value = '';
		}
	});

	watch(email, (value) => {
		const trimmed = value.trim();
		if (!trimmed) return;
		if (isValidAuthEmail(trimmed)) {
			if (registerRequestCooldownRemaining.value <= 0) {
				emailError.value = '';
			}
		}
	});

	watch(password, (value) => {
		if (value.trim()) {
			passwordError.value = '';
		}
	});

	watch(agreeTerms, (value) => {
		if (value) {
			termsError.value = '';
		}
	});

	type ValidationPayload = Record<string, string[] | undefined> | null | undefined | any;

	function getFirstError(payload: ValidationPayload, key: string): string {
		const field_errors = payload?.[key];

		if (!Array.isArray(field_errors) || field_errors.length === 0) {
			return '';
		}

		return String(field_errors[0]).trim();
	}

	function resolveRegisterErrorMessage(payloadMessage?: string, fallbackMessage?: string) {
		const technicalMessagePattern = /(failed to fetch|\[post\]|network|fetch failed|load failed)/i;
		const message = (payloadMessage || fallbackMessage || '').trim();
		if (/request up to 5 codes per hour/i.test(message)) {
			return '';
		}
		if (!message || technicalMessagePattern.test(message)) {
			return t('auth.register.validation.requestFailed');
		}
		return message;
	}

	function normalizeEmailErrorMessage(message: string) {
		if (!message) return message;
		if (/already been taken/i.test(message)) {
			return t('auth.register.validation.emailTaken');
		}
		return message;
	}

	function normalizePasswordErrorMessage(message: string) {
		if (!message) return message;
		if (/at least|uppercase|numbers?|symbols?|mixed case|letters?|format|invalid/i.test(message)) {
			return t('auth.register.validation.passwordRequirement');
		}
		return message;
	}

	function normalizeVerificationErrorMessage(message: string) {
		if (!message) return '';
		if (/expired/i.test(message)) {
			return t('auth.verification.expiredCode');
		}
		if (/incorrect|invalid/i.test(message)) {
			return t('auth.verification.invalidCode');
		}
		return message;
	}

	function getFirstVerificationDataError(payload: ValidationPayload): string {
		const prioritizedKeys = ['otp', 'code', 'verification_code', 'registration_token', 'email'];

		for (const key of prioritizedKeys) {
			const message = getFirstError(payload, key);
			if (message) return message;
		}

		if (!payload || typeof payload !== 'object') return '';

		for (const value of Object.values(payload as Record<string, unknown>)) {
			if (typeof value === 'string' && value.trim()) {
				return value.trim();
			}
			if (Array.isArray(value) && value.length > 0) {
				const first = String(value[0] ?? '').trim();
				if (first) return first;
			}
		}

		return '';
	}

	function validateInputs() {
		if (!firstName.value.trim()) {
			firstNameError.value = t('auth.register.validation.fieldBlank');
			return false
		}

		if (!email.value.trim()) {
			emailError.value = t('auth.register.validation.fieldBlank');
			return
		} else if (!isValidAuthEmail(email.value.trim())) {
			emailError.value = t('auth.register.validation.emailInvalid');
			return false
		}

		if (!password.value.trim()) {
			passwordError.value = t('auth.register.validation.fieldBlank');
			return false
		} else if (!isValidRegisterPassword(password.value.trim())) {
			passwordError.value = t('auth.register.validation.passwordRequirement');
			return false
		}

		if (!agreeTerms.value) {
			termsError.value = t('auth.register.validation.mustAgree');
			return false
		}

		return true
	}

	async function submitRegister() {
		if (isSubmitting.value) return;
		clearErrors();

		const valid = validateInputs()
		if (!valid) return

		const canSkipSendRequest = registerRequestCooldownRemaining.value > 0
			&& !isVerificationCacheExpired(verificationExpiry.value);

		if (canSkipSendRequest) {
			const normalizedEmail = email.value.trim().toLowerCase();
			const cachedEmail =
				typeof verificationExpiry.value?.email === 'string'
					? verificationExpiry.value.email.trim()
					: '';
			const cachedToken =
				typeof verificationExpiry.value?.token === 'string'
					? verificationExpiry.value.token.trim()
					: '';

			if (cachedEmail.toLowerCase() === normalizedEmail) {
				verificationEmail.value = cachedEmail;
			}

			if (cachedToken && cachedEmail.toLowerCase() === normalizedEmail) {
				verificationToken.value = cachedToken;
				verificationCode.value = '';
				verificationError.value = '';
				isVerificationModalOpen.value = true;
				return;
			}
		}

		isSubmitting.value = true;

		try {
			const response = await sendVerificationCode()

			if (!response.success) {
				const code = getAuthResponseCode(response);
				const message = getAuthResponseMessage(response);
				if (code === 'max_resend_reached') {
					resendLimitReached.value = message || t('auth.verification.invalidCode');
					verificationError.value = '';
					isVerificationModalOpen.value = true
					return response;
				}
			}

			if (!response.success) {
				firstNameError.value =
					getFirstError(response.data, 'given_name') ||
					getFirstError(response.data, 'first_name');

				emailError.value = normalizeEmailErrorMessage(
					getFirstError(response.data, 'email')
				);

				passwordError.value = normalizePasswordErrorMessage(
					getFirstError(response.data, 'password')
				);

				termsError.value =
					getFirstError(response.data, 'terms_of_service') ||
					getFirstError(response.data, 'terms');

				if (
					!firstNameError.value &&
					!emailError.value &&
					!passwordError.value &&
					!termsError.value
				) {
					if (applyRegisterCooldownFromResponse(response)) {
						return response;
					}

					if (response.message) {
						emailError.value = response.message;
					}
				}

				return response;
			}

			const resolvedEmail =
				typeof response.data?.email === 'string' && response.data?.email.trim()
					? response.data?.email.trim()
					: email.value.trim();
			const resolvedToken =
				typeof response.data?.token === 'string' ? response.data?.token.trim() : '';

			verificationExpiry.value = {
				email: resolvedEmail,
				token: resolvedToken,
				expires_at: response.data?.expires_in
			};
			clearResendCooldownTimer();
			resendCooldownRemaining.value = 0;
			clearResendCooldownCache();
			applyRegisterCooldownFromResponse(response);

			verificationEmail.value = resolvedEmail;
			verificationToken.value = resolvedToken;
			verificationCode.value = '';
			verificationError.value = '';

			clearErrors()
			// Re-open explicitly in case state was previously left open/closed by a stale render cycle.
			isVerificationModalOpen.value = false;
			await nextTick();
			isVerificationModalOpen.value = true;
			return response
		} catch (error: unknown) {
			console.error(error)
		} finally {
			isSubmitting.value = false;
		}
	}

	async function submitVerification() {
		console.log('called')
		isVerifying.value = true;
		verificationError.value = '';

		try {
			const { submitRegisterVerificationHandler } = useRegisterUser()
			const response = await submitRegisterVerificationHandler({
				email: verificationEmail.value.trim() || null,
				registration_token: verificationToken.value.trim() || null,
				otp: verificationCode.value.trim(),
			})

			if (!response.success) {
				const firstDataError = getFirstVerificationDataError(response.data);
				verificationError.value =
					normalizeVerificationErrorMessage(firstDataError)
					|| normalizeVerificationErrorMessage(getAuthResponseMessage(response))
					|| t('auth.verification.invalidCode');
				return response;
			}

			const { fetchAndStoreUser } = useAuthUser()
			await fetchAndStoreUser()

			if (import.meta.client) {
				window.localStorage.setItem(HOME_WELCOME_POPOVER_PENDING_KEY, '1');
			}

			verificationExpiry.value = null;
			clearResendCooldownTimer();
			resendCooldownRemaining.value = 0;
			isVerificationModalOpen.value = false;
			await router.push(withCountry('/auth/profile'));
			return response;
		} catch (error: unknown) {
			verificationError.value =
				normalizeVerificationErrorMessage(getAuthErrorMessage(error))
				|| t('auth.verification.invalidCode');
		} finally {
			isVerifying.value = false;
		}
	}

	async function resendVerification() {
		if (resendCooldownRemaining.value > 0) return;
		verificationError.value = '';
		resendLimitReached.value = '';

		try {
			const response = await sendVerificationCode()

			if (!response.success) {
				const code = getAuthResponseCode(response);
				const message = getAuthResponseMessage(response);
				if (code === 'max_resend_reached') {
					resendLimitReached.value = message || t('auth.verification.invalidCode');
					verificationError.value = '';
					return;
				}
				verificationError.value = message || t('auth.verification.invalidCode');
				return;
			}

			resendLimitReached.value = '';
			const verificationData = response.data as { email?: string; token?: string; otp_required?: boolean } | undefined;
			const resolvedToken =
				typeof verificationData?.token === 'string' ? verificationData.token.trim() : '';
			const resolvedEmail =
				typeof verificationData?.email === 'string' && verificationData.email.trim()
					? verificationData.email.trim()
					: verificationEmail.value.trim() || email.value.trim();
			verificationOtpRequired.value = verificationData?.otp_required !== false;

			if (!resolvedToken) {
				verificationError.value = getAuthResponseMessage(response) || t('auth.verification.invalidCode');
				return;
			}

			verificationEmail.value = resolvedEmail;
			verificationToken.value = resolvedToken;
			verificationCode.value = '';
			verificationError.value = '';
			verificationExpiry.value = {
				...(verificationExpiry.value || {}),
				email: resolvedEmail,
				token: resolvedToken,
			};
			startResendCooldown();
		} catch (error: unknown) {
			verificationError.value = getAuthErrorMessage(error) || t('auth.verification.invalidCode');
		}
	}

	async function sendVerificationCode() {
		const { sendRegisterVerificationHandler } = useRegisterUser()
		const response = await sendRegisterVerificationHandler({
			given_name: firstName.value.trim(),
			family_name: lastName.value.trim(),
			email: email.value.trim(),
			password: password.value.trim(),
			terms_of_service: agreeTerms.value,
			newsletter: optInPromos.value
		})

		return response
	}

	function isVerificationCacheExpired(
		cache: VerificationExpiryCookie | null
	): boolean {
		if (!cache) return true;
		const expiry_time = toEpochMilliseconds(cache.expires_at);

		if (!Number.isFinite(expiry_time)) {
			return true;
		}

		return Date.now() >= expiry_time;
	}

	function clearExpiredVerificationCache(): void {
		if (isVerificationCacheExpired(verificationExpiry.value)) {
			verificationExpiry.value = null;
		}
	}

	function restoreResendCooldownFromCache() {
		const cachedEmail =
			typeof verificationExpiry.value?.email === 'string'
				? verificationExpiry.value.email.trim()
				: '';
		const cachedToken =
			typeof verificationExpiry.value?.token === 'string'
				? verificationExpiry.value.token.trim()
				: '';
		if (cachedEmail) {
			verificationEmail.value = cachedEmail;
		}
		if (cachedToken) {
			verificationToken.value = cachedToken;
		}

		const remaining = getResendCooldownSecondsFromCache(verificationExpiry.value);
		if (remaining <= 0) {
			clearResendCooldownCache();
			return;
		}
		startResendCooldown(remaining, { persist: false });
	}

	function restoreRegisterCooldownFromCache() {
		const remaining = getRegisterCooldownSecondsFromCache(verificationExpiry.value);
		if (remaining <= 0) {
			clearRegisterCooldownCache();
			return;
		}
		startRegisterRequestCooldown(remaining, { persist: false });
	}

	clearExpiredVerificationCache();
	restoreResendCooldownFromCache();
	restoreRegisterCooldownFromCache();

	watch(isVerificationModalOpen, (open) => {
		if (open) return;

		// Keep resend cooldown running even if the modal is closed/re-opened.
		resendLimitReached.value = '';
	});

	onBeforeUnmount(() => {
		clearResendCooldownTimer();
		clearRegisterRequestCooldownTimer();
		clearExpiredVerificationCache();
	});

	return {
		firstName,
		lastName,
		email,
		password,
		showPassword,
		agreeTerms,
		optInPromos,
		firstNameError,
		emailError,
		passwordError,
		termsError,
		isSubmitting,
		isVerificationModalOpen,
		verificationEmail,
		verificationToken,
		verificationCode,
		verificationError,
		resendLimitReached,
		isVerifying,
		resendCooldownRemaining,
		submitRegister,
		submitVerification,
		resendVerification,
	};
}
