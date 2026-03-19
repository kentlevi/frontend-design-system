import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useLoginForm } from '~/composables/auth/login/useLoginForm';
import { useRoute } from 'vue-router';
import {
	isValidAuthEmail,
	getAuthErrorMessage,
	getAuthResponseMessage,
	getAuthResponseMessageCode,
} from '~/helpers/auth/auth.helper';
import { useCountry } from '~/composables/app/country/useCountry';
import { useAuthUser } from '~/composables/auth/useAuthUser'
import {
	GUEST_LOGIN_TOAST_PENDING_KEY,
	HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY,
	LOGIN_SUCCESS_TOAST_TRIGGER_EVENT,
} from '~/data/home/onboarding';
import { resolvePostLoginRedirect } from '~/utils/auth/redirect';
import { useLoginUser } from '~/composables/auth/useLoginUser';
import { isTimestampExpired, useVerificationCooldown } from '~/composables/auth/verification/useVerificationCooldown';

interface UseLoginPageFormOptions {
	skipMemberRedirect?: boolean;
	allowNonMemberEmailOnly?: boolean;
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
	const guestResendCooldown = useVerificationCooldown();
	const guestResendCooldownRemaining = guestResendCooldown.remaining;
	type NonMemberVerificationSession = {
		email?: string | null;
		order_number?: string | null;
		token?: string | null;
		expires_in?: string | number | Date | null;
	};
	const guestVerificationSession = ref<NonMemberVerificationSession | null>(null);

	function clearGuestResendCooldownTimer() {
		guestResendCooldown.clear();
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

	function isVerificationSessionExpired(session: NonMemberVerificationSession | null): boolean {
		if (!session) return true;
		return isTimestampExpired(session.expires_in);
	}

	function applyGuestResendCooldownFromResponse(response: unknown) {
		guestResendCooldown.applyFromResponse(response);
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

		if (!options.allowNonMemberEmailOnly && !nonMemberOrderNumber.value.trim()) {
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

		const email = nonMemberEmail.value.trim();
		const order_number = nonMemberOrderNumber.value.trim();
		const session_email = (guestVerificationSession.value?.email || '').trim().toLowerCase();
		const session_order_number = (guestVerificationSession.value?.order_number || '').trim();
		const session_token = (guestVerificationSession.value?.token || '').trim();
		const can_skip_verification_request =
			guestResendCooldownRemaining.value > 0
			&& !isVerificationSessionExpired(guestVerificationSession.value)
			&& session_email === email.toLowerCase()
			&& session_order_number === order_number
			&& session_token !== '';

		if (can_skip_verification_request) {
			guestVerificationEmail.value = email;
			guestVerificationOrderNumber.value = order_number;
			guestVerificationToken.value = session_token;
			isVerificationModalOpen.value = true;
			return;
		}

		try {
			isGuestVerifying.value = true;
			const { handleNonMemberVerification } = useLoginUser();
			const response = await handleNonMemberVerification({
				email,
				order_number,
				is_resend: false,
			});

			const message = getAuthResponseMessage(response);
			const message_code = getAuthResponseMessageCode(response);
			const GUEST_TEST_REDIRECT_URL = '/orders/12405070009';

			if (response.success && message_code === 'login_success') {
				await fetchUserProfile();
				return await navigateTo(GUEST_TEST_REDIRECT_URL);
			}

			if (!response.success) {
				nonMemberEmailError.value = '';
				nonMemberEmailHasError.value = true;
				nonMemberOrderError.value = t('auth.login.validation.orderNotFound');
				if (message_code === 'max_resend_reached') {
					resendLimitReached.value = message;
				} else {
					guestVerificationError.value = message;
				}

				return;
			}

			guestVerificationEmail.value = email;
			guestVerificationOrderNumber.value = order_number;
			guestVerificationToken.value = (response.data?.token || '').trim();
			guestVerificationSession.value = {
				email,
				order_number,
				token: response.data?.token || null,
				expires_in: response.data?.expires_in || null,
			};
			applyGuestResendCooldownFromResponse(response);
			isVerificationModalOpen.value = true;
			return;
		} catch (error) {
			guestVerificationError.value = handleApiError(error, t('auth.guestVerification.invalidCode'));
			console.error(error);
			return;
		} finally {
			isGuestVerifying.value = false;
		}
	}
	async function resendGuestVerification() {
		if (guestResendCooldownRemaining.value > 0) return;

		const session_email = (guestVerificationSession.value?.email || '').trim();
		const session_order_number = (guestVerificationSession.value?.order_number || '').trim();
		if (!session_email || !session_order_number) {
			guestVerificationError.value = t('auth.guestVerification.sessionExpired');
			return;
		}

		try {
			isGuestVerifying.value = true;
			const { handleNonMemberVerification } = useLoginUser();

			const response = await handleNonMemberVerification({
				email: session_email,
				order_number: session_order_number,
				is_resend: true,
			});

			if (!response.success) {
				const message = getAuthResponseMessage(response);
				const code = getAuthResponseMessageCode(response);

				if (code === 'max_resend_reached') {
					resendLimitReached.value = message;
				} else {
					guestVerificationError.value = message;
				}

				return;
			}

			guestVerificationEmail.value = session_email;
			guestVerificationOrderNumber.value = session_order_number;
			guestVerificationToken.value = (response.data?.token || '').trim();
			guestVerificationSession.value = {
				email: session_email,
				order_number: session_order_number,
				token: response.data?.token || null,
				expires_in: response.data?.expires_in || null,
			};
			applyGuestResendCooldownFromResponse(response);

		} catch (error) {
			console.error(error);
		} finally {
			isGuestVerifying.value = false;
		}
	}
	async function submitGuestVerification() {
		clearErrors();

		try {
			const { handleSubmitNonMemberLoginVerification } = useLoginUser();
			const response = await handleSubmitNonMemberLoginVerification({
				email: guestVerificationEmail.value.trim() || null,
				order_number: guestVerificationOrderNumber.value.trim() || null,
				login_token: guestVerificationToken.value.trim() || null,
				otp: guestVerificationCode.value.trim()
			});

			if (!response.success) {
				guestVerificationError.value = response.message || t('auth.guestVerification.invalidCode');
				return;
			}

			fetchUserProfile();
			const GUEST_TEST_REDIRECT_URL = '/orders/12405070009';

			guestVerificationSession.value = null;
			guestVerificationToken.value = '';
			return navigateTo(GUEST_TEST_REDIRECT_URL);
		} catch (error) {
			console.error(error);
			return;
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