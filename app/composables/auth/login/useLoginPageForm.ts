import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useLoginForm } from '~/composables/auth/login/useLoginForm';
import { useRoute } from 'vue-router';
import {
	isValidAuthEmail,
	getAuthErrorMessage,
	getAuthResponseMessage,
	getAuthResponseCode
} from '~/helpers/auth/auth.helper';

import {
	getProfileFieldValue,
	normalizeAccountName,
} from '~/utils/account/accountProfile';
import { useCountry } from '~/composables/app/country/useCountry';
import type { UserIdentity, UserProfile } from '~/stores/user';
import {
	GUEST_LOGIN_TOAST_PENDING_KEY,
	HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
} from '~/data/home/onboarding';
import { resolvePostLoginRedirect } from '~/utils/auth/redirect';
import { authVerificationConfig } from '~/data/auth/verification';

// Constants
const TOKEN_DURATION_SHORT = 60 * 60 * 24 * 3; // 3 days
const TOKEN_DURATION_LONG = 60 * 60 * 24 * 90; // 90 days
const CACHE_DURATION = 60 * 60 * 24 * 30; // 30 days
const DEFAULT_EXPIRES_IN = 300; // 5 minutes
const GUEST_TEST_REDIRECT_URL = 'http://localhost:4000/us/orders/12405070009';

export function useLoginPageForm() {
	const api = useApi();
	const { t } = useI18n();

	const route = useRoute();
	const { withCountry, apiCountry } = useCountry();

	const {
		memberType,
		keepSignedIn,
		showPassword,
		isNonMember,
		setMemberType,
		togglePassword,
		setKeepSignedIn,
	} = useLoginForm();

	// Reactive state
	const isVerificationModalOpen = ref(false);
	const isForgotPasswordModalOpen = ref(false);
	const guestVerificationEmail = ref('');
	const guestVerificationOrderNumber = ref('');
	const guestVerificationToken = ref('');
	const guestVerificationCode = ref('');
	const guestVerificationError = ref('');
	const resendLimitReached = ref('');
	const guestVerificationOtpRequired = ref(true);
	const isGuestVerifying = ref(false);
	const guestResendCooldownRemaining = ref(0);
	const guestVerificationTokenExpiresAt = ref(0);
	let guestResendCooldownTimer: ReturnType<typeof setInterval> | null = null;

	function clearGuestResendCooldownTimer() {
		if (!guestResendCooldownTimer) return;
		clearInterval(guestResendCooldownTimer);
		guestResendCooldownTimer = null;
	}

	function startGuestResendCooldown(seconds = authVerificationConfig.resendCooldownSeconds) {
		clearGuestResendCooldownTimer();
		guestResendCooldownRemaining.value = Math.max(0, Math.floor(seconds));
		if (guestResendCooldownRemaining.value <= 0) return;

		guestResendCooldownTimer = setInterval(() => {
			if (guestResendCooldownRemaining.value <= 1) {
				clearGuestResendCooldownTimer();
				guestResendCooldownRemaining.value = 0;
				return;
			}
			guestResendCooldownRemaining.value -= 1;
		}, 1000);
	}

	function coercePositiveInt(value: unknown) {
		if (typeof value === 'number') {
			if (!Number.isFinite(value) || value <= 0) return null;
			return Math.floor(value);
		}
		if (typeof value === 'string') {
			const parsed = Number(value);
			if (!Number.isFinite(parsed) || parsed <= 0) return null;
			return Math.floor(parsed);
		}
		return null;
	}

	const memberEmail = ref('');
	const memberPassword = ref('');
	const nonMemberEmail = ref('');
	const nonMemberOrderNumber = ref('');

	const memberEmailError = ref('');
	const memberPasswordError = ref('');
	const memberInvalidCredentials = ref(false);
	const nonMemberEmailError = ref('');
	const nonMemberEmailHasError = ref(false);
	const nonMemberOrderError = ref('');

	// Computed
	const submitLabel = computed(() =>
		isNonMember.value ? t('auth.login.checkOrder') : t('auth.login.signIn')
	);

	const postLoginRedirect = computed(() =>
		resolvePostLoginRedirect(getRedirectCandidate(), withCountry)
	);

	// Helper functions
	function getRedirectCandidate() {
		const queryRedirect = Array.isArray(route.query.redirect)
			? route.query.redirect[0]
			: route.query.redirect;
		if (queryRedirect) return queryRedirect;
		if (!import.meta.client) return null;
		return window.history.state?.back ?? null;
	}

	function clearErrors() {
		memberEmailError.value = '';
		memberPasswordError.value = '';
		memberInvalidCredentials.value = false;
		nonMemberEmailError.value = '';
		nonMemberEmailHasError.value = false;
		nonMemberOrderError.value = '';
		resendLimitReached.value = '';
	}

	function setLoginModeCookie(isGuest: boolean, keepSigned = false) {
		const tokenDuration = keepSigned ? TOKEN_DURATION_LONG : TOKEN_DURATION_SHORT;

		const guestLoginModeCookie = useCookie<string | number | null>('guest_login_mode', {
			maxAge: tokenDuration,
			sameSite: 'lax',
			path: '/',
		});

		guestLoginModeCookie.value = isGuest ? 1 : 0;
	}

	async function initializeUserFromResponse(response: LoginResponse | GuestOtpVerifyResponse, isGuest = false) {
		const userStore = useUserStore();
		const user = response.data?.user;

		if (!user) {
			console.warn('No user returned from login API');
			return;
		}

		userStore.setUser(user);

		const mockUserCookie = useCookie<{
			firstName: string;
			lastName: string;
			email: string;
		} | null>('mock_user', {
			sameSite: 'lax',
			path: '/',
		});

		if (isGuest) {
			const email = user.email;
			const emailLocalPart = email && typeof email === 'string' && email.includes('@')
				? email.split('@')[0]!.trim()
				: '';
			const userName = emailLocalPart || 'Guest';

			mockUserCookie.value = {
				firstName: userName,
				lastName: '',
				email: user.email,
			};
		} else {
			const fields = user.profile?.user_field_values ?? [];
			const firstName = getProfileFieldValue(fields, 'first_name');
			const lastName = getProfileFieldValue(fields, 'last_name');
			const existing = mockUserCookie.value;
			const emailValue = user.email || memberEmail.value.trim();
			const normalizedName = normalizeAccountName(
				firstName || existing?.firstName || '',
				lastName || existing?.lastName || ''
			);

			mockUserCookie.value = {
				firstName: normalizedName.firstName,
				lastName: normalizedName.lastName,
				email: emailValue,
			};
		}
	}

	function clearVerificationCache() {
		const guestVerificationCache = useCookie('guest_verification_cache');
		guestVerificationCache.value = null;
	}

	function setGuestLoginToastPending() {
		if (!import.meta.client) return;
		window.localStorage.setItem(GUEST_LOGIN_TOAST_PENDING_KEY, '1');
		window.localStorage.removeItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY);
	}

	async function fetchUserProfile() {
		try {
			const response = await api<MeResponse>(`/${apiCountry.value}/user/me`, {
				method: 'GET',
			});

			const { user, profile } = response.data;
			if (user) {
				const userStore = useUserStore();
				userStore.setUser({ ...user, profile: profile as unknown as UserProfile | null });

				const mockUserCookie = useCookie<{
					firstName: string;
					lastName: string;
					email: string;
				} | null>('mock_user', {
					sameSite: 'lax',
					path: '/',
				});

				const email = user.email;
				const emailLocalPart = email && typeof email === 'string' && email.includes('@')
					? email.split('@')[0]!.trim()
					: '';
				const userName = emailLocalPart || 'Guest';

				mockUserCookie.value = {
					firstName: userName,
					lastName: '',
					email: user.email,
				};
			}
		} catch {
			// Handle error if needed, but keep UX non-blocking
		}
	}

	function handleApiError(error: unknown, fallbackMessage: string) {
		return getAuthErrorMessage(error) || fallbackMessage;
	}

	// Watchers
	watch(memberType, clearErrors);

	// Validation functions
	function validateMember() {
		clearErrors();

		if (!memberEmail.value.trim()) {
			memberEmailError.value = t('auth.login.validation.fieldBlank');
		} else if (!isValidAuthEmail(memberEmail.value.trim())) {
			memberEmailError.value = t('auth.login.validation.emailInvalid');
		}

		if (!memberPassword.value.trim()) {
			memberPasswordError.value = t('auth.login.validation.fieldBlank');
		}

		return !memberEmailError.value && !memberPasswordError.value;
	}

	function validateNonMember() {
		nonMemberEmailError.value = '';
		nonMemberEmailHasError.value = false;
		nonMemberOrderError.value = '';

		if (!nonMemberEmail.value.trim()) {
			nonMemberEmailError.value = t('auth.login.validation.fieldBlank');
			nonMemberEmailHasError.value = true;
		} else if (!isValidAuthEmail(nonMemberEmail.value.trim())) {
			nonMemberEmailError.value = t('auth.login.validation.emailInvalid');
			nonMemberEmailHasError.value = true;
		}

		if (!nonMemberOrderNumber.value.trim()) {
			nonMemberOrderError.value = t('auth.login.validation.fieldBlank');
		}

		return !nonMemberEmailError.value && !nonMemberOrderError.value;
	}

	// Input handlers
	function onMemberEmailInput(value: string) {
		memberEmail.value = value;
		memberEmailError.value = '';
		memberInvalidCredentials.value = false;
	}

	function onMemberPasswordInput(value: string) {
		memberPassword.value = value;
		memberPasswordError.value = '';
		memberEmailError.value = '';
		memberInvalidCredentials.value = false;
	}

	function onNonMemberEmailInput(value: string) {
		nonMemberEmail.value = value;
		nonMemberEmailError.value = '';
		nonMemberEmailHasError.value = false;
	}

	function onNonMemberOrderInput(value: string) {
		nonMemberOrderNumber.value = value;
		nonMemberOrderError.value = '';
	}

	// Interfaces
	interface LoginResponse {
		success: boolean;
		message: string;
		data: {
			user?: UserIdentity & { profile: UserProfile | null };
		};
	}

	interface GuestOtpRequestResponse {
		success: boolean;
		message: string;
		data?: {
			token?: string;
			expires_in?: number;
			otp_required?: boolean;
			user?: UserIdentity & { profile: UserProfile | null };
		};
	}

	interface GuestOtpVerifyResponse {
		success: boolean;
		message: string;
		data?: {
			user?: UserIdentity & { profile: UserProfile | null };
			order_lookup_token?: string;
			order_number?: string;
		};
	}

	interface MeResponse {
		success: boolean;
		message: string;
		data: {
			user?: {
				id: number;
				code: string;
				email: string;
			};
			profile?: Record<string, unknown>;
		};
		meta: Record<string, unknown>;
		error: unknown;
	}

	interface GuestVerificationCache {
		email: string;
		order_number: string;
		token?: string;
		expires_in?: number;
		otp_required?: boolean;
		cached_at: number;
	}

	// Main handlers
	async function onSubmitClick() {
		if (isNonMember.value === false) {
			const response = await memberLoginHandler();
			if (response?.success === true) {
				if (import.meta.client) {
					window.localStorage.setItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY, '1');
				}
				await navigateTo(postLoginRedirect.value);
			}
		} else {
			await nonMemberLoginHandler();
		}
	}

	async function memberLoginHandler() {
		if (!validateMember()) return;

		try {
			const response = await api<LoginResponse>(`/${apiCountry.value}/auth/login`, {
				method: 'POST',
				body: {
					email: memberEmail.value.trim(),
					password: memberPassword.value.trim(),
					remember_me: keepSignedIn.value,
				},
			});

			if (!response.success) {
				memberEmailError.value = t('auth.login.validation.credentialsMismatch');
				memberPasswordError.value = '';
				memberInvalidCredentials.value = true;
				return response;
			}

			memberInvalidCredentials.value = false;
			setLoginModeCookie(false, keepSignedIn.value);
			await initializeUserFromResponse(response, false);

			return response;
		} catch (error: unknown) {
			memberEmailError.value = t('auth.login.validation.credentialsMismatch');
			memberPasswordError.value = '';
			memberInvalidCredentials.value = true;
			console.error(error);
		}
	}

	async function nonMemberLoginHandler() {
		if (!validateNonMember()) return;

		const email = nonMemberEmail.value.trim();
		const orderNumber = nonMemberOrderNumber.value.trim();

		guestVerificationError.value = '';
		resendLimitReached.value = '';

		const guestVerificationCache = useCookie<GuestVerificationCache | null>('guest_verification_cache', {
			maxAge: CACHE_DURATION,
			sameSite: 'lax',
			path: '/',
		});

		let response: GuestOtpRequestResponse | null = null;
		let shouldUseCache = false;

		// Check if we have a valid cached response
		if (guestVerificationCache.value) {
			const cache = guestVerificationCache.value;
			const credentialsMatch = cache.email === email && cache.order_number === orderNumber;

			if (credentialsMatch) {
				const now = Date.now();
				const cachedAt = typeof cache.cached_at === 'number' ? cache.cached_at : Number(cache.cached_at);
				const expiresIn = coercePositiveInt(cache.expires_in);
				const cacheAge = Number.isFinite(cachedAt) ? (now - cachedAt) / 1000 : Number.POSITIVE_INFINITY;
				const isExpired = !expiresIn || cacheAge >= expiresIn;

				if (!isExpired) {
					shouldUseCache = true;
					guestVerificationTokenExpiresAt.value = cachedAt + expiresIn * 1000;
					response = {
						success: true,
						message: 'Using cached verification',
						data: {
							token: cache.token,
							expires_in: cache.expires_in,
							otp_required: cache.otp_required,
						},
					};
				}
				if (isExpired) {
					clearVerificationCache();
				}
			} else {
				clearVerificationCache();
			}
		}

		// Call API only if we don't have a valid cache
		if (!shouldUseCache) {
			try {
				response = await api<GuestOtpRequestResponse>(
					`/${apiCountry.value}/auth/login/guest/verification`,
					{
						method: 'POST',
						body: { email, order_number: orderNumber },
					}
				);

				const isSuccess = response?.success === true;
				if (!isSuccess) {
					const message = getAuthResponseMessage(response);
					const code = getAuthResponseCode(response);
					resendLimitReached.value = code === 'max_resend_reached' ? message : '';
					nonMemberEmailError.value = '';
					nonMemberEmailHasError.value = true;
					nonMemberOrderError.value = t('auth.login.validation.orderNotFound');
					guestVerificationError.value = message;
					return;
				}

				// Cache the response
				const expiresIn =
					coercePositiveInt(response.data?.expires_in) ?? DEFAULT_EXPIRES_IN;
				guestVerificationTokenExpiresAt.value = Date.now() + expiresIn * 1000;
				guestVerificationCache.value = {
					email,
					order_number: orderNumber,
					token: response.data?.token,
					expires_in: expiresIn,
					otp_required: response.data?.otp_required,
					cached_at: Date.now(),
				};
			} catch {
				nonMemberEmailError.value = '';
				nonMemberEmailHasError.value = true;
				nonMemberOrderError.value = t('auth.login.validation.orderNotFound');
				guestVerificationError.value = '';
				return;
			}
		}

		if (response?.data?.user) {
			setLoginModeCookie(true);
			await initializeUserFromResponse({ success: true, message: response.message, data: { user: response.data.user } }, true);
			clearVerificationCache();
			resendLimitReached.value = '';
			await fetchUserProfile();
			setGuestLoginToastPending();
			await navigateTo(GUEST_TEST_REDIRECT_URL, { external: true });
			return response;
		}

		guestVerificationEmail.value = email;
		guestVerificationOrderNumber.value = orderNumber;
		guestVerificationToken.value = response?.data?.token || '';
		guestVerificationOtpRequired.value = response?.data?.otp_required !== false;
		guestVerificationCode.value = '';
		guestVerificationTokenExpiresAt.value =
			Date.now() + (coercePositiveInt(response?.data?.expires_in) ?? DEFAULT_EXPIRES_IN) * 1000;

		if (!guestVerificationOtpRequired.value) {
			await submitGuestVerification(true);
			return;
		}

		isVerificationModalOpen.value = true;
	}

	async function submitGuestVerification(forceBypass = false) {
		const requiresOtp = guestVerificationOtpRequired.value && !forceBypass;
		if (requiresOtp && !guestVerificationCode.value.trim()) {
			guestVerificationError.value = t('auth.guestVerification.codeRequired');
			return;
		}

		if (
			guestVerificationOtpRequired.value &&
			(!guestVerificationToken.value ||
				(guestVerificationTokenExpiresAt.value > 0 && Date.now() >= guestVerificationTokenExpiresAt.value))
		) {
			// Token/code window expired; request a new token/code via the verification endpoint.
			guestVerificationCode.value = '';
			await resendGuestVerification();
			return;
		}

		isGuestVerifying.value = true;
		guestVerificationError.value = '';

		try {
			const response = await api<GuestOtpVerifyResponse>(
				`/${apiCountry.value}/auth/login/guest`,
				{
					method: 'POST',
					body: {
						email: guestVerificationEmail.value,
						order_number: guestVerificationOrderNumber.value,
						login_token: guestVerificationToken.value || undefined,
						otp: requiresOtp ? guestVerificationCode.value.trim() : undefined,
					},
				}
			);

			if (!response.success) {
				guestVerificationError.value = response.message || t('auth.guestVerification.invalidCode');
				return;
			}

			if (response.data?.user) {
				setLoginModeCookie(true);
				await initializeUserFromResponse(response, true);
			}

			const resolvedOrderNumber = response.data?.order_number || guestVerificationOrderNumber.value;

			clearVerificationCache();
			isVerificationModalOpen.value = false;
			resendLimitReached.value = '';

			if (resolvedOrderNumber) {
				guestVerificationOrderNumber.value = resolvedOrderNumber;
			}

			setGuestLoginToastPending();
			await navigateTo(GUEST_TEST_REDIRECT_URL, { external: true });
		} catch (error: unknown) {
			guestVerificationError.value = handleApiError(error, t('auth.guestVerification.invalidCode'));
		} finally {
			isGuestVerifying.value = false;
		}
	}

	async function resendGuestVerification() {
		if (guestResendCooldownRemaining.value > 0) return;
		if (!guestVerificationEmail.value || !guestVerificationOrderNumber.value) return;

		try {
			const response = await api<GuestOtpRequestResponse>(
				`/${apiCountry.value}/auth/login/guest/verification`,
				{
					method: 'POST',
					body: {
						email: guestVerificationEmail.value,
						order_number: guestVerificationOrderNumber.value,
					},
				}
			);

			const message = getAuthResponseMessage(response);
			const isSuccess = response?.success === true;
			if (!isSuccess) {
				const code = getAuthResponseCode(response);
				resendLimitReached.value = code === 'max_resend_reached' ? message : '';
				guestVerificationError.value = resendLimitReached.value
					? ''
					: message || guestVerificationError.value;
				return response;
			}

			resendLimitReached.value = '';

			if (response.data?.user) {
				setLoginModeCookie(true);
				await initializeUserFromResponse({ success: true, message: response.message, data: { user: response.data.user } }, true);
				clearVerificationCache();
				await fetchUserProfile();
				setGuestLoginToastPending();
				await navigateTo(GUEST_TEST_REDIRECT_URL, { external: true });
				return response;
			}

			const expiresIn =
				coercePositiveInt(response.data?.expires_in) ?? DEFAULT_EXPIRES_IN;
			guestVerificationToken.value = response.data?.token || '';
			guestVerificationOtpRequired.value = response.data?.otp_required !== false;
			guestVerificationTokenExpiresAt.value = Date.now() + expiresIn * 1000;

			const guestVerificationCache = useCookie<GuestVerificationCache | null>('guest_verification_cache', {
				maxAge: CACHE_DURATION,
				sameSite: 'lax',
				path: '/',
			});
			guestVerificationCache.value = {
				email: guestVerificationEmail.value,
				order_number: guestVerificationOrderNumber.value,
				token: response.data?.token,
				expires_in: expiresIn,
				otp_required: response.data?.otp_required,
				cached_at: Date.now(),
			};

			startGuestResendCooldown();
			if (!guestVerificationOtpRequired.value) {
				await submitGuestVerification(true);
			}

			return response;
		} catch {
			// Keep UX non-blocking for resend tap failures.
		}
	}

	// Modal and utility functions
	watch(isVerificationModalOpen, (open) => {
		if (open) return;
		guestVerificationCode.value = '';
		guestVerificationError.value = '';
		resendLimitReached.value = '';
		isGuestVerifying.value = false;
	});

	function openForgotPasswordModal() {
		isForgotPasswordModalOpen.value = true;
	}

	onMounted(() => {
		const modalQuery = Array.isArray(route.query.modal)
			? route.query.modal[0]
			: route.query.modal;
		const shouldOpenForgotPassword =
			modalQuery === 'forgot-password' || modalQuery === 'reset-password';

		if (!shouldOpenForgotPassword) return;

		const emailQuery = Array.isArray(route.query.email)
			? route.query.email[0]
			: route.query.email;

		if (typeof emailQuery === 'string' && emailQuery.trim().length > 0) {
			memberEmail.value = emailQuery;
		}

		isForgotPasswordModalOpen.value = true;
	});

	onBeforeUnmount(() => {
		clearGuestResendCooldownTimer();
	});

	return {
		memberType,
		keepSignedIn,
		showPassword,
		isNonMember,
		setMemberType,
		togglePassword,
		setKeepSignedIn,
		submitLabel,
		isVerificationModalOpen,
		isForgotPasswordModalOpen,
		memberEmail,
		memberPassword,
		guestVerificationEmail,
		guestVerificationOrderNumber,
		guestVerificationToken,
		guestVerificationCode,
		guestVerificationError,
		resendLimitReached,
		isGuestVerifying,
		guestResendCooldownRemaining,
		nonMemberEmail,
		nonMemberOrderNumber,
		memberEmailError,
		memberPasswordError,
		memberInvalidCredentials,
		nonMemberEmailError,
		nonMemberEmailHasError,
		nonMemberOrderError,
		onMemberEmailInput,
		onMemberPasswordInput,
		onNonMemberEmailInput,
		onNonMemberOrderInput,
		submitGuestVerification,
		resendGuestVerification,
		onSubmitClick,
		openForgotPasswordModal,
	};
}