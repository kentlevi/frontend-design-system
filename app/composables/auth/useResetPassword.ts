import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import type { LocationQueryValue } from 'vue-router';
import { useCountry } from '~/composables/app/country/useCountry';
import { usePasswordReset } from '~/composables/auth/usePasswordReset';
import { useAuthResetPasswordStore } from '~/stores/auth/reset-password.store';

function getQueryValue(
	value: LocationQueryValue | LocationQueryValue[] | undefined
) {
	return Array.isArray(value) ? value[0] || '' : value || '';
}

function buildOtpExpiredRoute(
	withCountry: (path: string) => string,
	email: string
) {
	return withCountry(`/auth/otp-expired?email=${encodeURIComponent(email)}`);
}

export const useResetPassword = () => {
	const route = useRoute();
	const router = useRouter();
	const { withCountry } = useCountry();
	const { t: translate } = useI18n();
	const reset_password_store = useAuthResetPasswordStore();
	const {
		is_modal_open,
		email,
		token,
		expiry,
		password,
		confirm_password,
		password_visible,
		confirm_visible,
		is_loading,
		error_message,
		is_success_toast_visible,
		has_reset_session,
	} = storeToRefs(reset_password_store);

	function setPasswordValue(value: string) {
		reset_password_store.setPassword(value);
		reset_password_store.setErrorMessage('');
	}

	function setConfirmPasswordValue(value: string) {
		reset_password_store.setConfirmPassword(value);
		reset_password_store.setErrorMessage('');
	}

	function togglePasswordVisible() {
		reset_password_store.setPasswordVisible(!password_visible.value);
	}

	function toggleConfirmVisible() {
		reset_password_store.setConfirmVisible(!confirm_visible.value);
	}

	function clearForm() {
		reset_password_store.resetForm();
		reset_password_store.setLoading(false);
	}

	function closeResetPasswordModal() {
		reset_password_store.setModalOpen(false);
		clearForm();
		reset_password_store.clearSession();
	}

	function handleModalValueChange(value: boolean) {
		if (value) {
			reset_password_store.setModalOpen(true);
			return;
		}

		closeResetPasswordModal();
	}

	function dismissResetSuccessToast() {
		reset_password_store.setSuccessToastVisible(false);
	}

	function isStrongPassword(value: string): boolean {
		if (value.length < 6) return false;
		if (/^[a-z]+$/.test(value)) return false;
		return true;
	}

	function isResetLinkExpired(reset_expiry: string): boolean {
		if (!reset_expiry.trim()) return false;

		const parsed_expiry = Number.parseInt(reset_expiry, 10);
		if (Number.isNaN(parsed_expiry)) return false;

		return Math.floor(Date.now() / 1000) > parsed_expiry;
	}

	async function initializeResetPasswordFromRoute() {
		const modal_query = getQueryValue(route.query.modal);

		if (modal_query !== 'reset-password') {
			return false;
		}

		const route_email = getQueryValue(route.query.email);
		const route_token = getQueryValue(route.query.token);
		const route_expiry = getQueryValue(route.query.expiry);

		reset_password_store.setSession({
			email: route_email,
			token: route_token,
			expiry: route_expiry,
		});
		clearForm();
		reset_password_store.setSuccessToastVisible(false);

		if (!has_reset_session.value) {
			return false;
		}

		if (isResetLinkExpired(route_expiry)) {
			await navigateTo(buildOtpExpiredRoute(withCountry, route_email));
			return false;
		}

		const { validateTokenHandler } = usePasswordReset();
		const response = await validateTokenHandler({
			email: route_email,
			token: route_token,
		});

		if (!response.success) {
			await navigateTo(buildOtpExpiredRoute(withCountry, route_email));
			return false;
		}

		reset_password_store.setModalOpen(true);
		return true;
	}

	async function submitChangePassword() {
		reset_password_store.setErrorMessage('');

		const reset_email = email.value.trim();
		const reset_token = token.value.trim();
		const new_password = password.value.trim();
		const confirm_new_password = confirm_password.value.trim();

		const validated = validatePassword(reset_email, reset_token, new_password, confirm_new_password)
		if (!validated) return;

		reset_password_store.setLoading(true);

		try {
			const { submitResetPasswordHandler } = usePasswordReset();
			const response = await submitResetPasswordHandler({
				email: reset_email,
				token: reset_token,
				password: new_password,
				password_confirmation: confirm_new_password,
			});

			if (!response.success) {
				reset_password_store.setErrorMessage(
					response.message || translate('auth.reset.errors.unable')
				);
				return;
			}

			reset_password_store.setSuccessToastVisible(true);
			closeResetPasswordModal();
			await router.push(withCountry('/'));
		} catch (err: unknown) {
			const error_payload = err as {
				data?: { message?: string };
				message?: string;
			};
			reset_password_store.setErrorMessage(
				error_payload?.data?.message ||
                error_payload?.message ||
                translate('auth.reset.errors.unable')
			);
		} finally {
			reset_password_store.setLoading(false);
		}
	}

	function validatePassword(reset_email: string, reset_token: string, new_password: string, confirm_new_password: string) {
		if (!reset_email || !reset_token) {
			reset_password_store.setErrorMessage(
				translate('auth.reset.errors.missingLink')
			);
			return false;
		}

		if (!new_password || !confirm_new_password) {
			reset_password_store.setErrorMessage(
				translate('auth.reset.errors.fillBoth')
			);
			return false;
		}

		if (!isStrongPassword(new_password)) {
			reset_password_store.setErrorMessage(
				translate('auth.reset.errors.passwordRequirements')
			);
			return false;
		}

		if (new_password !== confirm_new_password) {
			reset_password_store.setErrorMessage(
				translate('auth.reset.errors.mismatch')
			);
			return false;
		}

		return true;
	}

	return {
		translate,
		is_reset_password_modal_open: is_modal_open,
		reset_email: email,
		reset_token: token,
		reset_expiry: expiry,
		password_value: password,
		confirm_password,
		password_visible,
		confirm_visible,
		is_loading,
		error_message,
		is_reset_success_toast_visible: is_success_toast_visible,
		setPasswordValue,
		setConfirmPasswordValue,
		togglePasswordVisible,
		toggleConfirmVisible,
		handleModalValueChange,
		closeResetPasswordModal,
		initializeResetPasswordFromRoute,
		submitChangePassword,
		dismissResetSuccessToast,
	};
};