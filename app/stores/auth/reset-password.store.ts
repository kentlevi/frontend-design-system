import { defineStore } from 'pinia';

interface ResetPasswordSession {
	email?: string;
	token?: string;
	expiry?: string;
}

export const useAuthResetPasswordStore = defineStore('auth_reset_password', () => {
	const is_modal_open = ref(false);
	const email = ref('');
	const token = ref('');
	const expiry = ref('');
	const password = ref('');
	const confirm_password = ref('');
	const password_visible = ref(false);
	const confirm_visible = ref(false);
	const is_loading = ref(false);
	const error_message = ref('');
	const is_success_toast_visible = ref(false);

	const has_reset_session = computed(
		() => email.value.trim() !== '' && token.value.trim() !== ''
	);

	function setModalOpen(value: boolean) {
		is_modal_open.value = value;
	}

	function setSession(value: ResetPasswordSession) {
		email.value = value.email || '';
		token.value = value.token || '';
		expiry.value = value.expiry || '';
	}

	function clearSession() {
		email.value = '';
		token.value = '';
		expiry.value = '';
	}

	function setPassword(value: string) {
		password.value = value;
	}

	function setConfirmPassword(value: string) {
		confirm_password.value = value;
	}

	function setPasswordVisible(value: boolean) {
		password_visible.value = value;
	}

	function setConfirmVisible(value: boolean) {
		confirm_visible.value = value;
	}

	function setLoading(value: boolean) {
		is_loading.value = value;
	}

	function setErrorMessage(value: string) {
		error_message.value = value;
	}

	function setSuccessToastVisible(value: boolean) {
		is_success_toast_visible.value = value;
	}

	function resetForm() {
		password.value = '';
		confirm_password.value = '';
		password_visible.value = false;
		confirm_visible.value = false;
		error_message.value = '';
	}

	function clearState() {
		is_modal_open.value = false;
		is_loading.value = false;
		is_success_toast_visible.value = false;
		clearSession();
		resetForm();
	}

	return {
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

		setModalOpen,
		setSession,
		clearSession,
		setPassword,
		setConfirmPassword,
		setPasswordVisible,
		setConfirmVisible,
		setLoading,
		setErrorMessage,
		setSuccessToastVisible,
		resetForm,
		clearState,
	};
});