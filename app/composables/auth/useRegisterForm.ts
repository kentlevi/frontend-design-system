import { nextTick, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
	getAuthErrorMessage,
	getAuthResponseCode,
	getAuthResponseMessage,
	isValidAuthEmail,
} from '~/composables/auth/auth.helpers';
import { useUserStore } from '~/stores/user';
import { useCountry } from '~/composables/app/useCountry';
import type { UserIdentity, UserProfile } from '~/stores/user';
import {
	getProfileFieldValue,
	normalizeAccountName,
} from '~/utils/account/accountProfile';
import { HOME_WELCOME_POPOVER_PENDING_KEY } from '~/data/home/onboarding';
import { authVerificationConfig } from '~/data/auth/verification';

export function useRegisterForm() {
	const router = useRouter();
	const userStore = useUserStore();
	const isVerificationModalOpen = ref(false);
	const api = useApi();
	const { t } = useI18n();
	const { withCountry, apiCountry } = useCountry();

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
	const verificationExpiry = useCookie('verificaiton_expiry', {
		maxAge: 60 * 10,
		sameSite: 'lax',
		path: '/'
	});
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

	function extractCooldownSeconds(message: string) {
		const match = message.match(/please wait\s+(\d+)\s*seconds?/i);
		if (!match) return 0;
		const seconds = Number(match[1] || 0);
		return Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
	}

	function updateRegisterCooldownErrorMessage() {
		if (registerRequestCooldownRemaining.value <= 0) return;
		emailError.value = t('auth.verification.resendCooldown', {
			seconds: registerRequestCooldownRemaining.value,
		});
	}

	function startRegisterRequestCooldown(seconds: number) {
		clearRegisterRequestCooldownTimer();
		registerRequestCooldownRemaining.value = Math.max(0, Math.floor(seconds));
		if (registerRequestCooldownRemaining.value <= 0) return;
		updateRegisterCooldownErrorMessage();

		registerRequestCooldownTimer = setInterval(() => {
			if (registerRequestCooldownRemaining.value <= 1) {
				clearRegisterRequestCooldownTimer();
				registerRequestCooldownRemaining.value = 0;
				if (/before requesting a new code/i.test(emailError.value)) {
					emailError.value = '';
				}
				return;
			}

			registerRequestCooldownRemaining.value -= 1;
			updateRegisterCooldownErrorMessage();
		}, 1000);
	}

	function applyRegisterCooldownFromMessage(message: string) {
		const seconds = extractCooldownSeconds(message);
		if (seconds <= 0) return false;
		startRegisterRequestCooldown(seconds);
		return true;
	}

	function startResendCooldown(seconds = authVerificationConfig.resendCooldownSeconds) {
		clearResendCooldownTimer();
		resendCooldownRemaining.value = Math.max(0, Math.floor(seconds));
		if (resendCooldownRemaining.value <= 0) return;

		resendCooldownTimer = setInterval(() => {
			if (resendCooldownRemaining.value <= 1) {
				clearResendCooldownTimer();
				resendCooldownRemaining.value = 0;
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

	interface RegisterVerificationResponse {
		success: boolean | string | number;
		message: string;
		data:
		| {
			email: string;
			token: string;
			expires_in: string;
		}
		| Record<string, string[]>;
		meta: Record<string, unknown>;
		error: Record<string, unknown>;
	}

	interface RegisterResponse {
		success: boolean;
		message: string;
		data: Record<string, unknown>;
		meta: Record<string, unknown>;
		error: Record<string, unknown>;
	}

	function getFirstError(
		payload: RegisterVerificationResponse['data'] | undefined,
		key: string
	) {
		if (!payload || Array.isArray(payload) || typeof payload !== 'object') return '';
		const value = (payload as Record<string, unknown>)[key];
		if (!Array.isArray(value) || !value.length) return '';
		return String(value[0] ?? '').trim();
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

	async function submitRegister() {
		if (isSubmitting.value) return;
		clearErrors();

		if (!firstName.value.trim()) {
			firstNameError.value = t('auth.register.validation.fieldBlank');
		}

		if (!email.value.trim()) {
			emailError.value = t('auth.register.validation.fieldBlank');
		} else if (!isValidAuthEmail(email.value.trim())) {
			emailError.value = t('auth.register.validation.emailInvalid');
		}

		if (!password.value.trim()) {
			passwordError.value = t('auth.register.validation.fieldBlank');
		} else if (!isValidRegisterPassword(password.value.trim())) {
			passwordError.value = t('auth.register.validation.passwordRequirement');
		}

		if (!agreeTerms.value) {
			termsError.value = t('auth.register.validation.mustAgree');
		}

		if (
			firstNameError.value ||
			emailError.value ||
			passwordError.value ||
			termsError.value
		) {
			return;
		}

		// When reading/checking
		if (verificationExpiry.value && typeof verificationExpiry.value === 'object') {
			const data = verificationExpiry.value as { email: string; expires_at: string };
			const now = Date.now();
			const expiryTime = new Date(data.expires_at).getTime();

			// Only open modal if email matches and not expired
			if (data.email === email.value.trim() && now < expiryTime) {
				isVerificationModalOpen.value = true;
				return;
			}
		}

		isSubmitting.value = true;

		try {
			const response = await api<RegisterVerificationResponse>(`/${apiCountry.value}/auth/register/verification`, {
				method: 'POST',
				body: {
					given_name: firstName.value.trim(),
					family_name: lastName.value.trim(),
					email: email.value.trim(),
					password: password.value.trim(),
					terms_of_service: agreeTerms.value,
					newsletter: optInPromos.value
				}
			})

			const isSuccess = response?.success === true || response?.success === 'true' || response?.success === 1;
			if (!isSuccess) {
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
					if (applyRegisterCooldownFromMessage(response.message || '')) {
						return response;
					}
					emailError.value = resolveRegisterErrorMessage(
						response.message,
						'Registration failed.'
					);
				}
				return response
			}

			const verificationData = response.data as { email?: string; token?: string; otp_required?: boolean } | undefined;
			const resolvedEmail =
				typeof verificationData?.email === 'string' && verificationData.email.trim()
					? verificationData.email.trim()
					: email.value.trim();
			const resolvedToken =
				typeof verificationData?.token === 'string' ? verificationData.token.trim() : '';
			verificationOtpRequired.value = verificationData?.otp_required !== false;
			verificationExpiry.value = {
				email: Array.isArray(response.data.email) ? response.data.email[0] : response.data.email,
				expires_at: Array.isArray(response.data.expires_in) ? response.data.expires_in[0] : response.data.expires_in
			};

			if (!resolvedToken) {
				emailError.value = resolveRegisterErrorMessage(
					response.message,
					'Registration failed.'
				);
				return response;
			}

			verificationEmail.value = resolvedEmail;
			verificationToken.value = resolvedToken;
			verificationCode.value = '';
			verificationError.value = '';
			if (!verificationOtpRequired.value) {
				await submitVerification(true);
				return response;
			}
			// Re-open explicitly in case state was previously left open/closed by a stale render cycle.
			isVerificationModalOpen.value = false;
			await nextTick();
			isVerificationModalOpen.value = true;
			return response
		} catch (error: unknown) {
			const errorPayload = error as { data?: RegisterVerificationResponse; message?: string };
			const payload = errorPayload?.data;
			const validation = payload?.data;
			firstNameError.value =
				getFirstError(validation, 'given_name') ||
				getFirstError(validation, 'first_name');
			emailError.value = normalizeEmailErrorMessage(
				getFirstError(validation, 'email')
			);
			passwordError.value = normalizePasswordErrorMessage(
				getFirstError(validation, 'password')
			);
			termsError.value =
				getFirstError(validation, 'terms_of_service') ||
				getFirstError(validation, 'terms');

			if (!firstNameError.value && !emailError.value && !passwordError.value && !termsError.value) {
				const cooldownMessage = (payload?.message || errorPayload?.message || '').trim();
				if (applyRegisterCooldownFromMessage(cooldownMessage)) {
					return;
				}
				emailError.value = resolveRegisterErrorMessage(
					payload?.message,
					errorPayload?.message || 'Registration failed.'
				);
			}
		} finally {
			isSubmitting.value = false;
		}
	}

	async function submitVerification(forceBypass = false) {
		const requiresOtp = verificationOtpRequired.value && !forceBypass;
		if (requiresOtp && !verificationCode.value.trim()) {
			verificationError.value = t('auth.verification.codeRequired');
			return;
		}

		isVerifying.value = true;
		verificationError.value = '';

		try {
			const response = await api<RegisterResponse>(`/${apiCountry.value}/auth/register`, {
				method: 'POST',
				body: {
					email: verificationEmail.value,
					registration_token: verificationToken.value,
					otp: requiresOtp ? verificationCode.value.trim() : undefined,
				}
			});

			if (response.success === false) {
				verificationError.value =
					normalizeVerificationErrorMessage(getAuthResponseMessage(response))
					|| t('auth.verification.invalidCode');
				return response;
			}

			try {
				type MeResponse = {
					success: boolean;
					data: {
						user?: UserIdentity;
						profile?: UserProfile | null;
					}
				};

				const meResponse = await api<MeResponse>(`/${apiCountry.value}/user/me`, {
					method: 'GET',
				});

				if (meResponse?.success && meResponse.data?.user) {
					userStore.setUser({
						...meResponse.data.user,
						profile: meResponse.data.profile ?? null
					});

					const guestLoginMode = useCookie<string | number | null>('guest_login_mode', {
						maxAge: 60 * 60 * 24 * 90,
						sameSite: 'lax',
						path: '/',
					});
					guestLoginMode.value = 0;

					const mockUser = useCookie<{
						firstName: string;
						lastName: string;
						email: string;
					} | null>('mock_user', {
						sameSite: 'lax',
						path: '/',
					});

					const fields = meResponse.data.profile?.user_field_values ?? [];
					const normalizedName = normalizeAccountName(
						getProfileFieldValue(fields, 'first_name') || firstName.value.trim() || 'User',
						getProfileFieldValue(fields, 'last_name') || lastName.value.trim()
					);

					mockUser.value = {
						firstName: normalizedName.firstName,
						lastName: normalizedName.lastName,
						email: meResponse.data.user.email || email.value.trim(),
					};
				}
			} catch (error) {
				console.warn('Failed to fetch user data after registration.', error);
			}
			if (import.meta.client) {
				window.localStorage.setItem(HOME_WELCOME_POPOVER_PENDING_KEY, '1');
			}

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
			const response = await api<RegisterVerificationResponse>(`/${apiCountry.value}/auth/register/verification`, {
				method: 'POST',
				body: {
					given_name: firstName.value.trim(),
					family_name: lastName.value.trim(),
					email: verificationEmail.value.trim() || email.value.trim(),
					password: password.value.trim(),
					terms_of_service: agreeTerms.value,
					newsletter: optInPromos.value
				}
			});

			const isSuccess = response?.success === true || response?.success === 'true' || response?.success === 1;
			if (!isSuccess) {
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
			startResendCooldown();
			if (!verificationOtpRequired.value) {
				await submitVerification(true);
			}
		} catch (error: unknown) {
			verificationError.value = getAuthErrorMessage(error) || t('auth.verification.invalidCode');
		}
	}

	watch(isVerificationModalOpen, (open) => {
		if (open) return;

		// Keep resend cooldown running even if the modal is closed/re-opened.
		resendLimitReached.value = '';
	});

	onBeforeUnmount(() => {
		clearResendCooldownTimer();
		clearRegisterRequestCooldownTimer();
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