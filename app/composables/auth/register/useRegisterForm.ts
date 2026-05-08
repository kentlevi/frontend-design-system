import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
	getAuthErrorMessage,
	getAuthResponseCode,
	getAuthResponseMessage,
	isValidAuthEmail,
} from '~/helpers/auth/auth.helper';
import { useCountry } from '~/composables/app/country/useCountry';
import { HOME_WELCOME_POPOVER_PENDING_KEY } from '~/data/home/onboarding';
import {
	getRemainingSecondsFromTimestamp,
	isTimestampExpired,
	useVerificationCooldown,
} from '~/composables/auth/verification/useVerificationCooldown';
import { useRegisterUser } from '../useRegisterUser';
import { normalizeAppPath } from '~/utils/auth/redirect';
import { fetchAndStoreUser } from '~/services/auth/auth.service';

type ValidationPayload = Record<string, unknown> | null | undefined;

type VerificationExpiryCookie = {
	email?: string;
	token?: string;
	expires_at?: string | number | Date;
	resend_cooldown_until?: number;
	register_cooldown_until?: number;
	form_signature?: string;
};

export function useRegisterForm() {
	const router = useRouter();
	const route = useRoute();
	const is_verification_modal_open = ref(false);
	const { t } = useI18n();
	const { withCountry } = useCountry();

	const first_name = ref('');
	const last_name = ref('');
	const email = ref('');
	const password = ref('');
	const show_password = ref(false);
	const agree_terms = ref(false);
	const opt_in_promos = ref(false);

	const first_name_error = ref('');
	const email_error = ref('');
	const password_error = ref('');
	const terms_error = ref('');
	const is_submitting = ref(false);

	const verification_email = ref('');
	const verification_token = ref('');
	const verification_code = ref('');
	const verification_error = ref('');
	const resend_limit_reached = ref('');
	const verification_otp_required = ref(true);
	const is_verifying = ref(false);
	const resend_cooldown = useVerificationCooldown();
	const register_request_cooldown = useVerificationCooldown();
	const resend_cooldown_remaining = resend_cooldown.remaining;
	const register_request_cooldown_remaining = register_request_cooldown.remaining;

	const verification_expiry = ref<VerificationExpiryCookie | null>(null);

	function clearResendCooldownTimer() {
		resend_cooldown.clear();
	}

	function clearRegisterRequestCooldownTimer() {
		register_request_cooldown.clear();
	}

	function getResendCooldownSecondsFromCache(cache: VerificationExpiryCookie | null): number {
		if (!cache) return 0;
		return getRemainingSecondsFromTimestamp(cache.resend_cooldown_until);
	}

	function getRegisterCooldownSecondsFromCache(cache: VerificationExpiryCookie | null): number {
		if (!cache) return 0;
		return getRemainingSecondsFromTimestamp(cache.register_cooldown_until);
	}

	function clearResendCooldownCache() {
		if (!verification_expiry.value) return;
		const { resend_cooldown_until: _resend_cooldown_until, ...rest } = verification_expiry.value;
		verification_expiry.value = Object.keys(rest).length > 0 ? rest : null;
	}

	function clearRegisterCooldownCache() {
		if (!verification_expiry.value) return;
		const { register_cooldown_until: _register_cooldown_until, ...rest } = verification_expiry.value;
		verification_expiry.value = Object.keys(rest).length > 0 ? rest : null;
	}

	function setResendCooldownCache(seconds: number) {
		const now = Date.now();
		const until = now + Math.max(0, Math.floor(seconds)) * 1000;
		verification_expiry.value = {
			...(verification_expiry.value || {}),
			resend_cooldown_until: until,
		};
	}

	function setRegisterCooldownCache(seconds: number) {
		const now = Date.now();
		const until = now + Math.max(0, Math.floor(seconds)) * 1000;
		verification_expiry.value = {
			...(verification_expiry.value || {}),
			register_cooldown_until: until,
		};
	}

	function startRegisterRequestCooldown(
		seconds: number,
		options: { persist?: boolean } = {}
	) {
		const normalized_seconds = Math.max(0, Math.floor(seconds));
		register_request_cooldown.start(normalized_seconds);

		const should_persist = options.persist !== false;
		if (normalized_seconds <= 0) {
			clearRegisterCooldownCache();
			return;
		}

		if (should_persist) {
			setRegisterCooldownCache(normalized_seconds);
		}
	}

	function applyRegisterCooldownFromResponse(response: unknown) {
		const seconds = register_request_cooldown.applyFromResponse(response);
		if (seconds <= 0) {
			clearRegisterRequestCooldownTimer();
			clearRegisterCooldownCache();
			return false;
		}

		setRegisterCooldownCache(seconds);
		return true;
	}

	function applyResendCooldownFromResponse(response: unknown) {
		const seconds = resend_cooldown.applyFromResponse(response);
		if (seconds <= 0) {
			clearResendCooldownTimer();
			clearResendCooldownCache();
			return;
		}

		setResendCooldownCache(seconds);
	}

	function startResendCooldown(
		seconds: number,
		options: { persist?: boolean } = {}
	) {
		const normalized_seconds = Math.max(0, Math.floor(seconds));
		resend_cooldown.start(normalized_seconds);

		const should_persist = options.persist !== false;
		if (normalized_seconds <= 0) {
			clearResendCooldownCache();
			return;
		}

		if (should_persist) {
			setResendCooldownCache(normalized_seconds);
		}
	}

	function isValidRegisterPassword(value: string): boolean {
		if (value.length < 6) return false;

		// Reject ONLY lowercase-only passwords
		if (/^[a-z]+$/.test(value)) return false;

		return true;
	}

	function clearErrors() {
		first_name_error.value = '';
		email_error.value = '';
		password_error.value = '';
		terms_error.value = '';
	}

	watch(first_name, (value) => {
		if (value.trim()) {
			first_name_error.value = '';
		}
	});

	watch(email, (value) => {
		const trimmed_value = value.trim();
		if (!trimmed_value) return;
		if (isValidAuthEmail(trimmed_value) && register_request_cooldown_remaining.value <= 0) {
			email_error.value = '';
		}

		const verificationEmailNormalized = verification_email.value.trim().toLowerCase();
		if (
			verificationEmailNormalized
			&& verificationEmailNormalized !== trimmed_value.toLowerCase()
		) {
			resend_limit_reached.value = '';
		}
	});

	watch(resend_cooldown_remaining, (value) => {
		if (value <= 0) {
			clearResendCooldownCache();
			resend_limit_reached.value = '';
		}
	});

	watch(register_request_cooldown_remaining, (value) => {
		if (value <= 0) {
			clearRegisterCooldownCache();
		}
	});

	watch(password, (value) => {
		if (value.trim()) {
			password_error.value = '';
		}
	});

	watch(agree_terms, (value) => {
		if (value) {
			terms_error.value = '';
		}
	});

	function getFirstError(payload: ValidationPayload, key: string): string {
		const field_errors = payload?.[key];

		if (!Array.isArray(field_errors) || field_errors.length === 0) {
			return '';
		}

		return String(field_errors[0]).trim();
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
		const prioritized_keys = ['otp', 'code', 'verification_code', 'registration_token', 'email'];

		for (const key of prioritized_keys) {
			const message = getFirstError(payload, key);
			if (message) return message;
		}

		if (!payload || typeof payload !== 'object') return '';

		for (const value of Object.values(payload)) {
			if (typeof value === 'string' && value.trim()) {
				return value.trim();
			}
			if (Array.isArray(value) && value.length > 0) {
				const first_value = String(value[0] ?? '').trim();
				if (first_value) return first_value;
			}
		}

		return '';
	}

	function validateInputs() {
		if (!first_name.value.trim()) {
			first_name_error.value = t('auth.register.validation.fieldBlank');
			return false;
		}

		if (!email.value.trim()) {
			email_error.value = t('auth.register.validation.fieldBlank');
			return false;
		} else if (!isValidAuthEmail(email.value.trim())) {
			email_error.value = t('auth.register.validation.emailInvalid');
			return false;
		}

		if (!password.value.trim()) {
			password_error.value = t('auth.register.validation.fieldBlank');
			return false;
		} else if (!isValidRegisterPassword(password.value.trim())) {
			password_error.value = t('auth.register.validation.passwordRequirement');
			return false;
		}

		if (!agree_terms.value) {
			terms_error.value = t('auth.register.validation.mustAgree');
			return false;
		}

		return true;
	}

	async function submitRegister() {
		if (is_submitting.value) return;
		clearErrors();

		const is_valid = validateInputs();
		if (!is_valid) return;

		const current_form_signature = buildRegisterPayloadSignature();
		const can_skip_send_request = register_request_cooldown_remaining.value > 0
			&& !isVerificationCacheExpired(verification_expiry.value);

		if (can_skip_send_request) {
			const normalized_email = email.value.trim().toLowerCase();
			const cached_email =
				typeof verification_expiry.value?.email === 'string'
					? verification_expiry.value.email.trim()
					: '';
			const cached_token =
				typeof verification_expiry.value?.token === 'string'
					? verification_expiry.value.token.trim()
					: '';
			const cached_form_signature =
				typeof verification_expiry.value?.form_signature === 'string'
					? verification_expiry.value.form_signature
					: '';

			if (cached_email.toLowerCase() === normalized_email) {
				verification_email.value = cached_email;
			}

			if (
				cached_token
				&& cached_email.toLowerCase() === normalized_email
				&& cached_form_signature === current_form_signature
			) {
				verification_token.value = cached_token;
				verification_code.value = '';
				verification_error.value = '';
				is_verification_modal_open.value = true;
				return;
			}
		}

		is_submitting.value = true;

		try {
			const response = await sendVerificationCode(false);

			if (!response.success) {
				const code = getAuthResponseCode(response);
				const message = getAuthResponseMessage(response);
				if (code === 'max_resend_reached') {
					resend_limit_reached.value = message || t('auth.verification.invalidCode');
					applyResendCooldownFromResponse(response);
					verification_error.value = '';
					is_verification_modal_open.value = true
					return response;
				}
			}

			if (!response.success) {
				first_name_error.value =
					getFirstError(response.data, 'given_name')
					|| getFirstError(response.data, 'first_name');

				email_error.value = normalizeEmailErrorMessage(
					getFirstError(response.data, 'email')
				);

				password_error.value = normalizePasswordErrorMessage(
					getFirstError(response.data, 'password')
				);

				terms_error.value =
					getFirstError(response.data, 'terms_of_service')
					|| getFirstError(response.data, 'terms');

				if (
					!first_name_error.value
					&& !email_error.value
					&& !password_error.value
					&& !terms_error.value
				) {
					if (applyRegisterCooldownFromResponse(response)) {
						return response;
					}

					if (response.message) {
						email_error.value = response.message;
					}
				}

				return response;
			}

			const resolved_email =
				typeof response.data?.email === 'string' && response.data?.email.trim()
					? response.data?.email.trim()
					: email.value.trim();
			const resolved_token =
				typeof response.data?.token === 'string' ? response.data?.token.trim() : '';

			verification_expiry.value = {
				email: resolved_email,
				token: resolved_token,
				expires_at: response.data?.expires_in,
				form_signature: current_form_signature,
			};
			resend_limit_reached.value = '';
			clearResendCooldownTimer();
			clearResendCooldownCache();
			applyRegisterCooldownFromResponse(response);
			applyResendCooldownFromResponse(response);

			verification_email.value = resolved_email;
			verification_token.value = resolved_token;
			verification_code.value = '';
			verification_error.value = '';

			clearErrors();
			is_verification_modal_open.value = false;
			await nextTick();
			is_verification_modal_open.value = true;
			return response;
		} catch (error: unknown) {
			console.error(error);
		} finally {
			is_submitting.value = false;
		}
	}

	async function submitVerification() {
		is_verifying.value = true;
		verification_error.value = '';

		try {
			if(!verification_code.value){
				return verification_error.value = t('auth.guestVerification.codeRequired')
			}

			const { submitRegisterVerificationHandler } = useRegisterUser();
			const response = await submitRegisterVerificationHandler({
				email: verification_email.value.trim() || null,
				registration_token: verification_token.value.trim() || null,
				otp: verification_code.value.trim(),
			});

			if (!response.success) {
				const first_data_error = getFirstVerificationDataError(response.data);
				verification_error.value =
					normalizeVerificationErrorMessage(first_data_error)
					|| normalizeVerificationErrorMessage(getAuthResponseMessage(response))
					|| t('auth.verification.invalidCode');
				return response;
			}

			await fetchAndStoreUser();

			if (import.meta.client) {
				window.localStorage.setItem(HOME_WELCOME_POPOVER_PENDING_KEY, '1');
			}

			verification_expiry.value = null;
			clearResendCooldownTimer();
			clearResendCooldownCache();
			is_verification_modal_open.value = false;

			const is_register_page =
				normalizeAppPath(route.path) === normalizeAppPath(withCountry('/auth/register'));
			if (is_register_page) {
				await router.push(withCountry('/auth/profile'));
			}

			return response;
		} catch (error: unknown) {
			verification_error.value =
				normalizeVerificationErrorMessage(getAuthErrorMessage(error))
				|| t('auth.verification.invalidCode');
		} finally {
			is_verifying.value = false;
		}
	}

	async function resendVerification() {
		if (resend_cooldown_remaining.value > 0) return;
		verification_error.value = '';
		resend_limit_reached.value = '';

		try {
			const response = await sendVerificationCode(true);

			if (!response.success) {
				const message_code = getAuthResponseCode(response);
				const response_message = getAuthResponseMessage(response);
				if (message_code === 'max_resend_reached') {
					resend_limit_reached.value = response_message || t('auth.verification.invalidCode');
					applyResendCooldownFromResponse(response);
					verification_error.value = '';
					return;
				}
				verification_error.value = response_message || t('auth.verification.invalidCode');
				return;
			}

			resend_limit_reached.value = '';
			const verification_data = response.data as { email?: string; token?: string; otp_required?: boolean } | undefined;
			const resolved_token =
				typeof verification_data?.token === 'string' ? verification_data.token.trim() : '';
			const resolved_email =
				typeof verification_data?.email === 'string' && verification_data.email.trim()
					? verification_data.email.trim()
					: verification_email.value.trim() || email.value.trim();
			verification_otp_required.value = verification_data?.otp_required !== false;

			if (!resolved_token) {
				verification_error.value = getAuthResponseMessage(response) || t('auth.verification.invalidCode');
				return;
			}

			verification_email.value = resolved_email;
			verification_token.value = resolved_token;
			verification_code.value = '';
			verification_error.value = '';
			verification_expiry.value = {
				...(verification_expiry.value || {}),
				email: resolved_email,
				token: resolved_token,
				form_signature: buildRegisterPayloadSignature(),
			};
			applyRegisterCooldownFromResponse(response);
			applyResendCooldownFromResponse(response);
		} catch (error: unknown) {
			verification_error.value = getAuthErrorMessage(error) || t('auth.verification.invalidCode');
		}
	}

	async function sendVerificationCode(resend: boolean) {
		const { sendRegisterVerificationHandler } = useRegisterUser()
		const response = await sendRegisterVerificationHandler({
			...getCurrentRegisterPayload(),
			is_resend: resend
		})

		return response
	}

	function getCurrentRegisterPayload() {
		return {
			given_name: first_name.value.trim(),
			family_name: last_name.value.trim(),
			email: email.value.trim(),
			password: password.value.trim(),
			terms_of_service: agree_terms.value,
			newsletter: opt_in_promos.value,
		};
	}

	function buildRegisterPayloadSignature(): string {
		const payload = getCurrentRegisterPayload();
		return JSON.stringify(payload);
	}

	function isVerificationCacheExpired(
		cache: VerificationExpiryCookie | null
	): boolean {
		if (!cache) return true;
		return isTimestampExpired(cache.expires_at);
	}

	function clearExpiredVerificationCache(): void {
		if (isVerificationCacheExpired(verification_expiry.value)) {
			verification_expiry.value = null;
			resend_limit_reached.value = '';
		}
	}

	function restoreResendCooldownFromCache() {
		const cached_email =
			typeof verification_expiry.value?.email === 'string'
				? verification_expiry.value.email.trim()
				: '';
		const cached_token =
			typeof verification_expiry.value?.token === 'string'
				? verification_expiry.value.token.trim()
				: '';
		if (cached_email) {
			verification_email.value = cached_email;
		}
		if (cached_token) {
			verification_token.value = cached_token;
		}

		const remaining = getResendCooldownSecondsFromCache(verification_expiry.value);
		if (remaining <= 0) {
			clearResendCooldownCache();
			return;
		}
		startResendCooldown(remaining, { persist: false });
	}

	function restoreRegisterCooldownFromCache() {
		const remaining = getRegisterCooldownSecondsFromCache(verification_expiry.value);
		if (remaining <= 0) {
			clearRegisterCooldownCache();
			return;
		}
		startRegisterRequestCooldown(remaining, { persist: false });
	}

	clearExpiredVerificationCache();
	restoreResendCooldownFromCache();
	restoreRegisterCooldownFromCache();

	watch(is_verification_modal_open, (open) => {
		if (open) return;

		// Keep resend cooldown running even if the modal is closed/re-opened.
		verification_error.value = '';
	});

	onBeforeUnmount(() => {
		clearResendCooldownTimer();
		clearRegisterRequestCooldownTimer();
		clearExpiredVerificationCache();
	});

	return {
		first_name,
		last_name,
		email,
		password,
		show_password,
		agree_terms,
		opt_in_promos,
		first_name_error,
		email_error,
		password_error,
		terms_error,
		is_submitting,
		is_verification_modal_open,
		verification_email,
		verification_token,
		verification_code,
		verification_error,
		resend_limit_reached,
		is_verifying,
		resend_cooldown_remaining,
		verification_otp_required,
		submitRegister,
		submitVerification,
		resendVerification,
	};
}