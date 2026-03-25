import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useLoginForm } from '~/composables/auth/login/useLoginForm';
import { useRoute } from 'vue-router';
import {
	isValidAuthEmail,
	getAuthErrorMessage,
	getAuthResponseMessage,
	getAuthResponseMessageCode,
	getAuthResponseCode,
} from '~/helpers/auth/auth.helper';
import { useCountry } from '~/composables/app/country/useCountry';
import { useAuthUser } from '~/composables/auth/useAuthUser';
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

type NonMemberVerificationSession = {
	email?: string | null;
	order_number?: string | null;
	token?: string | null;
	expires_in?: string | number | Date | null;
};

export function useLoginPageForm(options: UseLoginPageFormOptions = {}) {
	const route = useRoute();
	const { t } = useI18n();
	const { withCountry } = useCountry();

	const {
		member_type,
		keep_signed_in,
		show_password,
		is_non_member,
		setMemberType,
		togglePassword,
		setKeepSignedIn,
	} = useLoginForm();

	const is_verification_modal_open = ref(false);
	const is_forgot_password_modal_open = ref(false);
	const is_checking_guest_order = ref(false);
	const is_signing_in_member = ref(false);
	const guest_verification_email = ref('');
	const guest_verification_order_number = ref('');
	const guest_verification_token = ref('');
	const guest_verification_code = ref('');
	const guest_verification_error = ref('');
	const resend_limit_reached = ref('');
	const is_guest_verifying = ref(false);
	const guest_resend_cooldown = useVerificationCooldown();
	const guest_resend_cooldown_remaining = guest_resend_cooldown.remaining;
	const guest_verification_session = ref<NonMemberVerificationSession | null>(null);

	const member_email = ref('');
	const member_password = ref('');
	const non_member_email = ref('');
	const non_member_order_number = ref('');

	const member_email_error = ref('');
	const member_password_error = ref('');
	const member_invalid_credentials = ref(false);
	const non_member_email_error = ref('');
	const non_member_email_has_error = ref(false);
	const non_member_order_error = ref('');

	const submit_label = computed(() => {
		const is_login_page = route.path === withCountry('/auth/login');

		if (is_non_member.value) {
			return is_login_page
				? t('auth.login.checkOrder')
				: t('auth.login.signIn');
		}

		return t('auth.login.signIn');
	});

	const is_page_login_busy = computed(() =>
		is_checking_guest_order.value || is_signing_in_member.value
	);

	const post_login_redirect = computed(() =>
		resolvePostLoginRedirect(getRedirectCandidate(), withCountry)
	);

	function getRedirectCandidate() {
		const query_redirect = Array.isArray(route.query.redirect)
			? route.query.redirect[0]
			: route.query.redirect;
		if (query_redirect) return query_redirect;
		if (!import.meta.client) return null;
		return window.history.state?.back ?? null;
	}

	function clearGuestResendCooldownTimer() {
		guest_resend_cooldown.clear();
	}

	function clearErrors() {
		member_email_error.value = '';
		member_password_error.value = '';
		member_invalid_credentials.value = false;
		non_member_email_error.value = '';
		non_member_email_has_error.value = false;
		non_member_order_error.value = '';
		guest_verification_error.value = '';
		resend_limit_reached.value = '';
	}

	function isVerificationSessionExpired(session: NonMemberVerificationSession | null): boolean {
		if (!session) return true;
		return isTimestampExpired(session.expires_in);
	}

	function applyGuestResendCooldownFromResponse(response: unknown) {
		guest_resend_cooldown.applyFromResponse(response);
	}

	function setGuestLoginToastPending() {
		if (!import.meta.client) return;
		window.localStorage.setItem(GUEST_LOGIN_TOAST_PENDING_KEY, '1');
		window.localStorage.removeItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY);
	}

	async function fetchUserProfile() {
		const { fetchAndStoreUser } = useAuthUser();
		setGuestLoginToastPending();
		await fetchAndStoreUser();
	}

	function handleApiError(error: unknown, fallbackMessage: string) {
		return getAuthErrorMessage(error) || fallbackMessage;
	}

	function validateMember() {
		clearErrors();

		if (!member_email.value.trim()) {
			member_email_error.value = t('auth.login.validation.fieldBlank');
		} else if (!isValidAuthEmail(member_email.value.trim())) {
			member_email_error.value = t('auth.login.validation.emailInvalid');
		}

		if (!member_password.value.trim()) {
			member_password_error.value = t('auth.login.validation.fieldBlank');
		}

		return !member_email_error.value && !member_password_error.value;
	}

	function validateNonMember() {
		non_member_email_error.value = '';
		non_member_email_has_error.value = false;
		non_member_order_error.value = '';

		if (!non_member_email.value.trim()) {
			non_member_email_error.value = t('auth.login.validation.fieldBlank');
			non_member_email_has_error.value = true;
		} else if (!isValidAuthEmail(non_member_email.value.trim())) {
			non_member_email_error.value = t('auth.login.validation.emailInvalid');
			non_member_email_has_error.value = true;
		}

		if (!options.allowNonMemberEmailOnly && !non_member_order_number.value.trim()) {
			non_member_order_error.value = t('auth.login.validation.fieldBlank');
		}

		return !non_member_email_error.value && !non_member_order_error.value;
	}

	function onMemberEmailInput(value: string) {
		member_email.value = value;
		member_email_error.value = '';
		member_invalid_credentials.value = false;
	}

	function onMemberPasswordInput(value: string) {
		member_password.value = value;
		member_password_error.value = '';
		member_email_error.value = '';
		member_invalid_credentials.value = false;
	}

	function onNonMemberEmailInput(value: string) {
		non_member_email.value = value;
		non_member_email_error.value = '';
		non_member_email_has_error.value = false;
	}

	function onNonMemberOrderInput(value: string) {
		non_member_order_number.value = value;
		non_member_order_error.value = '';
	}

	async function onSubmitClick() {
		clearErrors();
		if (!is_non_member.value) {
			await memberLoginHandler();
			return;
		}

		await nonMemberLoginHandler();
	}

	async function memberLoginHandler() {
		if (!validateMember()) return;

		try {
			is_signing_in_member.value = true;
			const { handleMemberLogin } = useLoginUser();
			const response = await handleMemberLogin({
				email: member_email.value.trim(),
				password: member_password.value.trim(),
				remember_me: keep_signed_in.value,
			});

			if (!response.success) {
				member_email_error.value = t('auth.login.validation.credentialsMismatch');
				member_password_error.value = '';
				member_invalid_credentials.value = true;
				return response;
			}

			member_invalid_credentials.value = false;

			if (import.meta.client) {
				window.localStorage.setItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY, '1');
				window.localStorage.removeItem(GUEST_LOGIN_TOAST_PENDING_KEY);
				window.dispatchEvent(new CustomEvent(LOGIN_SUCCESS_TOAST_TRIGGER_EVENT));
			}

			options.onMemberLoginSuccess?.();

			if (options.skipMemberRedirect) return response;

			return await navigateTo(post_login_redirect.value);
		} finally {
			is_signing_in_member.value = false;
		}
	}

	async function nonMemberLoginHandler() {
		if (!validateNonMember()) return;

		const email_value = non_member_email.value.trim();
		const order_number = non_member_order_number.value.trim();
		const session_email = (guest_verification_session.value?.email || '').trim().toLowerCase();
		const session_order_number = (guest_verification_session.value?.order_number || '').trim();
		const session_token = (guest_verification_session.value?.token || '').trim();
		const can_skip_verification_request =
			guest_resend_cooldown_remaining.value > 0
			&& !isVerificationSessionExpired(guest_verification_session.value)
			&& session_email === email_value.toLowerCase()
			&& session_order_number === order_number
			&& session_token !== '';

		if (can_skip_verification_request) {
			guest_verification_email.value = email_value;
			guest_verification_order_number.value = order_number;
			guest_verification_token.value = session_token;
			is_verification_modal_open.value = true;
			return;
		}

		try {
			is_checking_guest_order.value = true;
			is_guest_verifying.value = true;
			const { handleNonMemberVerification } = useLoginUser();
			const response = await handleNonMemberVerification({
				email: email_value,
				order_number,
				is_resend: false,
			});

			const response_message = getAuthResponseMessage(response);
			const message_code = getAuthResponseMessageCode(response);

			if (!response.success) {
				const response_code = getAuthResponseCode(response);
				if (response_code === 'max_resend_reached') {
					resend_limit_reached.value = response_message || t('auth.verification.invalidCode');
					non_member_email_error.value = '';
					non_member_order_error.value = '';
					is_verification_modal_open.value = true;
					return response;
				}
			}

			if (response.success && message_code === 'login_success') {
				await fetchUserProfile();
				return await navigateTo(post_login_redirect.value);
			}

			if (!response.success) {
				non_member_email_error.value = '';
				non_member_email_has_error.value = true;
				non_member_order_error.value = t('auth.login.validation.orderNotFound');
				if (message_code === 'max_resend_reached') {
					resend_limit_reached.value = response_message;
				} else {
					guest_verification_error.value = response_message;
				}
				return;
			}

			guest_verification_email.value = email_value;
			guest_verification_order_number.value = order_number;
			guest_verification_token.value = (response.data?.token || '').trim();
			guest_verification_session.value = {
				email: email_value,
				order_number,
				token: response.data?.token || null,
				expires_in: response.data?.expires_in || null,
			};
			applyGuestResendCooldownFromResponse(response);
			is_verification_modal_open.value = true;
		} catch (error) {
			guest_verification_error.value = handleApiError(error, t('auth.guestVerification.invalidCode'));
			console.error(error);
		} finally {
			is_checking_guest_order.value = false;
			is_guest_verifying.value = false;
		}
	}

	async function resendGuestVerification() {
		if (guest_resend_cooldown_remaining.value > 0) return;

		const session_email = (guest_verification_session.value?.email || '').trim();
		const session_order_number = (guest_verification_session.value?.order_number || '').trim();
		if (!session_email || !session_order_number) {
			guest_verification_error.value = t('auth.guestVerification.sessionExpired');
			return;
		}

		try {
			is_guest_verifying.value = true;
			const { handleNonMemberVerification } = useLoginUser();
			const response = await handleNonMemberVerification({
				email: session_email,
				order_number: session_order_number,
				is_resend: true,
			});

			if (!response.success) {
				const response_message = getAuthResponseMessage(response);
				const message_code = getAuthResponseMessageCode(response);

				if (message_code === 'max_resend_reached') {
					resend_limit_reached.value = response_message;
				} else {
					guest_verification_error.value = response_message;
				}

				return;
			}

			guest_verification_email.value = session_email;
			guest_verification_order_number.value = session_order_number;
			guest_verification_token.value = (response.data?.token || '').trim();
			guest_verification_session.value = {
				email: session_email,
				order_number: session_order_number,
				token: response.data?.token || null,
				expires_in: response.data?.expires_in || null,
			};
			applyGuestResendCooldownFromResponse(response);
		} catch (error) {
			console.error(error);
		} finally {
			is_guest_verifying.value = false;
		}
	}

	async function submitGuestVerification() {
		guest_verification_error.value = '';

		try {
			is_guest_verifying.value = true;
			const { handleSubmitNonMemberLoginVerification } = useLoginUser();
			const response = await handleSubmitNonMemberLoginVerification({
				email: guest_verification_email.value.trim() || null,
				order_number: guest_verification_order_number.value.trim() || null,
				login_token: guest_verification_token.value.trim() || null,
				otp: guest_verification_code.value.trim(),
			});

			if (!response.success) {
				guest_verification_error.value = response.message || t('auth.guestVerification.invalidCode');
				return;
			}

			await fetchUserProfile();
			guest_verification_session.value = null;
			guest_verification_token.value = '';
			return navigateTo(post_login_redirect.value);
		} catch (error) {
			console.error(error);
			return;
		} finally {
			is_guest_verifying.value = false;
		}
	}

	function openForgotPasswordModal() {
		is_forgot_password_modal_open.value = true;
	}

	watch(member_type, clearErrors);

	watch(is_verification_modal_open, (is_open) => {
		if (is_open) return;
		guest_verification_code.value = '';
		guest_verification_error.value = '';
		resend_limit_reached.value = '';
		is_guest_verifying.value = false;
	});

	onMounted(() => {
		const modal_query = Array.isArray(route.query.modal)
			? route.query.modal[0]
			: route.query.modal;
		const should_open_forgot_password =
			modal_query === 'forgot-password' || modal_query === 'reset-password';

		if (!should_open_forgot_password) return;

		const email_query = Array.isArray(route.query.email)
			? route.query.email[0]
			: route.query.email;

		if (typeof email_query === 'string' && email_query.trim().length > 0) {
			member_email.value = email_query;
		}

		is_forgot_password_modal_open.value = true;
	});

	onBeforeUnmount(() => {
		clearGuestResendCooldownTimer();
	});

	return {
		member_type,
		keep_signed_in,
		show_password,
		is_non_member,
		setMemberType,
		togglePassword,
		setKeepSignedIn,
		submit_label,
		is_verification_modal_open,
		is_forgot_password_modal_open,
		is_checking_guest_order,
		is_signing_in_member,
		is_page_login_busy,
		member_email,
		member_password,
		guest_verification_email,
		guest_verification_order_number,
		guest_verification_token,
		guest_verification_code,
		guest_verification_error,
		resend_limit_reached,
		is_guest_verifying,
		guest_resend_cooldown_remaining,
		non_member_email,
		non_member_order_number,
		member_email_error,
		member_password_error,
		member_invalid_credentials,
		non_member_email_error,
		non_member_email_has_error,
		non_member_order_error,
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