import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useLoginForm } from '~/composables/auth/login/useLoginForm';
import { useRoute } from 'vue-router';
import {
	isValidAuthEmail,
	getAuthErrorMessage,
	getAuthResponseMessage,
	getAuthResponseMessageCode,
	cacheNonMemberVerificationData,
	getGuestVerificationCache,
	clearGuestVerificationCache
} from '~/helpers/auth/auth.helper';
import { useCountry } from '~/composables/app/country/useCountry';
import { useAuthUser } from '~/composables/auth/useAuthUser'
import {
	GUEST_LOGIN_TOAST_PENDING_KEY,
	HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
	LOGIN_SUCCESS_TOAST_TRIGGER_EVENT,
} from '~/data/home/onboarding';
import { resolvePostLoginRedirect } from '~/utils/auth/redirect';
import { authVerificationConfig } from '~/data/auth/verification';
import { useLoginUser } from '~/composables/auth/useLoginUser';
import type { NonMemberVerificationCache } from '~/types/auth/auth';

interface UseLoginPageFormOptions {
	skipMemberRedirect?: boolean;
	onMemberLoginSuccess?: () => void;
}

export function useLoginPageForm(options: UseLoginPageFormOptions = {}) {
	const route = useRoute();

	const { t } = useI18n();

	const { withCountry } = useCountry();

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
	const isCheckingGuestOrder = ref(false);
	const isSigningInMember = ref(false);
	const guestVerificationEmail = ref('');
	const guestVerificationOrderNumber = ref('');
	const guestVerificationToken = ref('');
	const guestVerificationCode = ref('');
	const guestVerificationError = ref('');
	const resendLimitReached = ref('');
	const isGuestVerifying = ref(false);
	const guestResendCooldownRemaining = ref(0);
	let guestResendCooldownTimer: ReturnType<typeof setInterval> | null = null;

	function clearGuestResendCooldownTimer() {
		if (!guestResendCooldownTimer) return;
		clearInterval(guestResendCooldownTimer);
		guestResendCooldownTimer = null;
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
	const isPageLoginBusy = computed(() =>
		isCheckingGuestOrder.value || isSigningInMember.value
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
		guestVerificationError.value = '';
		resendLimitReached.value = '';
	}

	function checkVerificationExpiry() {
		const cache = getGuestVerificationCache()

		if (cache && cache.expires_in) {
			const expiry_time = new Date(cache.expires_in).getTime()
			const now = Date.now()

			/* token still valid → reopen modal */
			if (now < expiry_time) {
				isVerificationModalOpen.value = true
				return false;
			}

			/* token expired → clear it */
			clearVerificationCache()
		}

		return true;
	}

	function clearVerificationCache() {
		const guestVerificationCache = useCookie('guest_verification_cache');
		guestVerificationCache.value = null;
	}

	function setResendCooldown(seconds = authVerificationConfig.resendCooldownSeconds) {
		const guest_verification_cache = useCookie<NonMemberVerificationCache | null>('guest_verification_cache')

		if (!guest_verification_cache.value) return

		const until = Date.now() + seconds * 1000

		guest_verification_cache.value = {
			...guest_verification_cache.value,
			resend_cooldown_until: until
		}

		startGuestResendCooldown(seconds)
	}

	function startGuestResendCooldown(seconds: number = authVerificationConfig.resendCooldownSeconds) {
		clearGuestResendCooldownTimer()

		guestResendCooldownRemaining.value = Math.max(0, Math.floor(seconds))

		if (guestResendCooldownRemaining.value <= 0) return

		guestResendCooldownTimer = setInterval(() => {
			if (guestResendCooldownRemaining.value <= 1) {
				clearGuestResendCooldownTimer()
				guestResendCooldownRemaining.value = 0
				return
			}

			guestResendCooldownRemaining.value -= 1
		}, 1000)
	}

	function setGuestLoginToastPending() {
		if (!import.meta.client) return;
		window.localStorage.setItem(GUEST_LOGIN_TOAST_PENDING_KEY, '1');
		window.localStorage.removeItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY);
	}

	async function fetchUserProfile() {
		const { fetchAndStoreUser } = useAuthUser()
		setGuestLoginToastPending()
		await fetchAndStoreUser()
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

	// Main handlers
	async function onSubmitClick() {
		clearErrors()
		if (isNonMember.value === false) {
			await memberLoginHandler();
		} else {
			await nonMemberLoginHandler();
		}
	}

	async function memberLoginHandler() {
		if (!validateMember()) return;

		const { handleMemberLogin } = useLoginUser();
		const response = await handleMemberLogin({
			email: memberEmail.value.trim(),
			password: memberPassword.value.trim(),
			remember_me: keepSignedIn.value
		});

		if (!response.success) {
			memberEmailError.value = t('auth.login.validation.credentialsMismatch');
			memberPasswordError.value = '';
			memberInvalidCredentials.value = true;
			return response;
		}

		memberInvalidCredentials.value = false;

		if (import.meta.client) {
			window.localStorage.setItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY, '1');
			window.localStorage.removeItem(GUEST_LOGIN_TOAST_PENDING_KEY);
			window.dispatchEvent(new CustomEvent(LOGIN_SUCCESS_TOAST_TRIGGER_EVENT));
		}

		options.onMemberLoginSuccess?.();

		if (options.skipMemberRedirect) return response;

		return await navigateTo(postLoginRedirect.value);
	}

	async function nonMemberLoginHandler() {
		if (!validateNonMember()) return;

		const expired = checkVerificationExpiry()
		if (!expired) return

		const email = nonMemberEmail.value.trim()
		const order_number = nonMemberOrderNumber.value.trim()

		try {
			isGuestVerifying.value = true;
			const { handleNonMemberVerification } = useLoginUser()
			const response = await handleNonMemberVerification({
				email,
				order_number: order_number
			})

			const message = getAuthResponseMessage(response)
			const message_code = getAuthResponseMessageCode(response)
			const GUEST_TEST_REDIRECT_URL = '/orders/12405070009';

			if (response.success && message_code === 'login_success') {
				await fetchUserProfile()
				return await navigateTo(GUEST_TEST_REDIRECT_URL);
			}

			if (!response.success) {
				nonMemberEmailError.value = '';
				nonMemberEmailHasError.value = true;
				nonMemberOrderError.value = t('auth.login.validation.orderNotFound');
				if (message_code === 'max_resend_reached') {
					resendLimitReached.value = message
				} else {
					guestVerificationError.value = message
				}

				return;
			}

			cacheNonMemberVerificationData(response, email, order_number)
			return isVerificationModalOpen.value = true;
		} catch (error) {
			guestVerificationError.value = handleApiError(error, t('auth.guestVerification.invalidCode'));
			console.error(error)
			return
		} finally {
			isGuestVerifying.value = false;
		}
	}

	async function resendGuestVerification() {
		if (guestResendCooldownRemaining.value > 0) return

		const cache = getGuestVerificationCache()
		if (!cache) return

		try {
			isGuestVerifying.value = true;
			const { handleNonMemberVerification } = useLoginUser()

			const response = await handleNonMemberVerification({
				email: cache.email,
				order_number: cache.order_number
			})

			if (!response.success) {
				const message = getAuthResponseMessage(response)
				const code = getAuthResponseMessageCode(response)

				if (code === 'max_resend_reached') {
					resendLimitReached.value = message
				} else {
					guestVerificationError.value = message
				}

				return
			}

			cacheNonMemberVerificationData(response, cache.email, cache.order_number)
			setResendCooldown()

		} catch (error) {
			console.error(error)
		} finally {
			isGuestVerifying.value = false;
		}
	}

	async function submitGuestVerification() {
		clearErrors()

		try {
			const cache = getGuestVerificationCache()

			if (!cache) {
				guestVerificationError.value = t('auth.guestVerification.sessionExpired')
				return
			}

			const { handleSubmitNonMemberLoginVerification } = useLoginUser();
			const response = await handleSubmitNonMemberLoginVerification({
				email: cache.email,
				order_number: cache.order_number,
				login_token: cache.token,
				otp: guestVerificationCode.value.trim()
			});

			if (!response.success) {
				guestVerificationError.value = response.message || t('auth.guestVerification.invalidCode');
				return;
			}

			fetchUserProfile()
			const GUEST_TEST_REDIRECT_URL = '/orders/12405070009';
			if (import.meta.client) {
				window.localStorage.setItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY, '1');
				window.localStorage.removeItem(GUEST_LOGIN_TOAST_PENDING_KEY);
				window.dispatchEvent(new CustomEvent(LOGIN_SUCCESS_TOAST_TRIGGER_EVENT));
			}

			clearGuestVerificationCache()
			return navigateTo(GUEST_TEST_REDIRECT_URL);;
		} catch (error) {
			console.error(error)
			return
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
		const cache = getGuestVerificationCache()

		if (!cache) return

		if (cache.resend_cooldown_until) {
			const remaining = Math.floor((cache.resend_cooldown_until - Date.now()) / 1000)

			if (remaining > 0) {
				startGuestResendCooldown(remaining)
			}
		}

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
		isCheckingGuestOrder,
		isSigningInMember,
		isPageLoginBusy,
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