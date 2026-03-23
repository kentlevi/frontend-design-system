<script setup lang="ts">
import { computed, watch } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { useAccountProfile } from '~/composables/account/useAccountProfile';
import { usePersonalForm } from '~/composables/account/profile/usePersonalForm';
import { usePreferenceForm } from '~/composables/account/profile/usePreferenceForm';
import { useChangeEmailForm } from '~/composables/account/profile/useChangeEmailForm';
import { usePasswordForm } from '~/composables/account/profile/usePasswordForm';
import { useForgotPasswordForm } from '~/composables/account/profile/useForgotPasswordForm';
import ProfilePersonalSection from './ProfilePersonalSection.vue';
import ProfilePasswordSection from './ProfilePasswordSection.vue';
import ProfileSettingsSection from './ProfileSettingsSection.vue';
import ProfileModals from './ProfileModals.vue';

const profile_field_store = useProfileFieldsStore();
const { t } = useI18n();
const {
	photoUrl,
	avatarDisplayUrl,
	photoError,
	fileInput,
	initials,
	openFilePicker,
	onFilePicked,
	removePhoto,
} = useAccountProfile();
const isDeletePhotoModalOpen = ref(false);
const photoInlineError = computed(() => {
	if (!photoError.value) return '';
	const normalized_message = photoError.value.toLowerCase();
	return /network|timeout|timed out|internet|connect/.test(normalized_message)
		? ''
		: photoError.value;
});

const {
	form_state: personal_form_state,
	has_changes,
	field_errors,
	is_updating: name_is_submitting,
	loadPersonalForm,
	submitPersonalForm
} = usePersonalForm();

const {
	form_state: preference_form_state,
	loadPreferences,
	updatePreferenceField
} = usePreferenceForm();

const {
	email,
	pending_email,
	is_email_change_modal,
	email_change_field_ref,
	email_change_error,
	is_otp_open,
	email_change_otp_code,
	email_change_otp_error,
	limit_reached_error,
	remaining,
	openEmailChangeModal,
	closeEmailChangeModal,
	confirmEmailChange,
	verifyOtp,
	resendOtp,
	closeOtpModal,
} = useChangeEmailForm();

const {
	current_password,
	new_password,
	new_password_confirmation,
	current_password_error,
	pair_password_error,
	is_change_password_enabled,
	current_password_visible,
	new_password_visible,
	new_password_confirmation_visible,
	clearNewPasswordPairErrors,
	onChangePassword,
} = usePasswordForm();

const {
	is_forgot_password_modal_open,
	forgot_password_request_send,
	sendForgotPasswordEmail,
	closeForgotPasswordModal
} = useForgotPasswordForm();

onMounted(() => {
	loadPreferences();
	loadPersonalForm();
});

const photoUploadToastVisible = ref(false);
const photoUploadToastMessage = ref('');
const isPasswordChangeSubmitting = ref(false);
let profile_toast_timer: ReturnType<typeof setTimeout> | null = null;
let photo_upload_toast_timer: ReturnType<typeof setTimeout> | null = null;

function clearProfileToastTimer() {
	if (!profile_toast_timer) return;
	clearTimeout(profile_toast_timer);
	profile_toast_timer = null;
}

function clearPhotoUploadToastTimer() {
	if (!photo_upload_toast_timer) return;
	clearTimeout(photo_upload_toast_timer);
	photo_upload_toast_timer = null;
}

function bindPhotoFileInput(element: Element | ComponentPublicInstance | null) {
	fileInput.value = element instanceof HTMLInputElement ? element : null;
}

function bindEmailChangeFieldRef(element: Element | ComponentPublicInstance | null) {
	email_change_field_ref.value = element instanceof HTMLElement ? element : null;
}

function updatePersonalField(fieldKey: string, value: string) {
	personal_form_state.fields[fieldKey] = value;
}

function updateCurrentPassword(value: string) {
	current_password.value = value;
}

function updateNewPassword(value: string) {
	new_password.value = value;
}

function updateNewPasswordConfirmation(value: string) {
	new_password_confirmation.value = value;
}

function clearCurrentPasswordError() {
	current_password_error.value = '';
}

function toggleCurrentPasswordVisible() {
	current_password_visible.value = !current_password_visible.value;
}

function toggleNewPasswordVisible() {
	new_password_visible.value = !new_password_visible.value;
}

function toggleNewPasswordConfirmationVisible() {
	new_password_confirmation_visible.value = !new_password_confirmation_visible.value;
}

function setIsEmailChangeModal(value: boolean) {
	is_email_change_modal.value = value;
}

function setPendingEmail(value: string) {
	pending_email.value = value;
}

function clearEmailChangeError() {
	email_change_error.value = '';
}

function setIsOtpOpen(value: boolean) {
	is_otp_open.value = value;
}

function setEmailChangeOtpCode(value: string) {
	email_change_otp_code.value = value;
}

function setIsDeletePhotoModalOpen(value: boolean) {
	isDeletePhotoModalOpen.value = value;
}

function setIsForgotPasswordModalOpen(value: boolean) {
	is_forgot_password_modal_open.value = value;
}

function openDeletePhotoModal() {
	isDeletePhotoModalOpen.value = true;
}

function closeDeletePhotoModal() {
	isDeletePhotoModalOpen.value = false;
}

function confirmDeletePhoto() {
	removePhoto();
	closeDeletePhotoModal();
}

function showPhotoUploadToast(message: string) {
	clearPhotoUploadToastTimer();
	const normalized_message = message.toLowerCase();
	if (/timeout|timed out/.test(normalized_message)) {
		photoUploadToastMessage.value = 'The upload timed out. Please try again later.';
	} else if (/network|internet|connect/.test(normalized_message)) {
		photoUploadToastMessage.value = 'Unable to upload due to a network issue. Please try again.';
	} else {
		photoUploadToastMessage.value = message;
	}
	photoUploadToastVisible.value = true;
	photo_upload_toast_timer = setTimeout(() => {
		photoUploadToastVisible.value = false;
		photo_upload_toast_timer = null;
	}, 3200);
}

watch(photoError, (message) => {
	if (!message) return;
	showPhotoUploadToast(message);
});

onBeforeUnmount(() => {
	clearProfileToastTimer();
	clearPhotoUploadToastTimer();
});
</script>

<template>
	<section class="account-page" data-testid="account-profile-page">
		<UiToast
			:visible="photoUploadToastVisible"
			tone="error"
			class="account-profile-photo-toast"
			data-testid="account-profile-photo-upload-error-toast"
			@close="photoUploadToastVisible = false"
		>
			<strong class="account-profile-photo-toast-title">Upload Failed</strong>
			<span> - {{ photoUploadToastMessage }}</span>
		</UiToast>

		<AccountShell active-tab="profile">
			<h1 class="account-profile-title" data-testid="account-profile-title">{{ t('account.profile.title') }}</h1>
			<div class="account-content account-profile" data-testid="account-profile-content">
				<ProfilePersonalSection
					:photo-inline-error="photoInlineError"
					:avatar-display-url="avatarDisplayUrl"
					:initials="initials"
					:photo-url="photoUrl"
					:profile-fields="profile_field_store.dynamic_profile_fields"
					:field-errors="field_errors"
					:personal-form-fields="personal_form_state.fields"
					:has-changes="has_changes"
					:name-is-submitting="name_is_submitting"
					:email="email"
					:update-personal-field="updatePersonalField"
					:bind-photo-file-input="bindPhotoFileInput"
					:open-file-picker="openFilePicker"
					:on-file-picked="onFilePicked"
					:open-delete-photo-modal="openDeletePhotoModal"
					:open-email-change-modal="openEmailChangeModal"
					:submit-personal-form="submitPersonalForm"
				/>

				<ProfilePasswordSection
					:current-password="current_password"
					:new-password="new_password"
					:new-password-confirmation="new_password_confirmation"
					:current-password-error="current_password_error"
					:pair-password-error="pair_password_error"
					:is-change-password-enabled="is_change_password_enabled"
					:current-password-visible="current_password_visible"
					:new-password-visible="new_password_visible"
					:new-password-confirmation-visible="new_password_confirmation_visible"
					:is-password-change-submitting="isPasswordChangeSubmitting"
					:update-current-password="updateCurrentPassword"
					:update-new-password="updateNewPassword"
					:update-new-password-confirmation="updateNewPasswordConfirmation"
					:clear-current-password-error="clearCurrentPasswordError"
					:toggle-current-password-visible="toggleCurrentPasswordVisible"
					:toggle-new-password-visible="toggleNewPasswordVisible"
					:toggle-new-password-confirmation-visible="toggleNewPasswordConfirmationVisible"
					:clear-new-password-pair-errors="clearNewPasswordPairErrors"
					:on-change-password="onChangePassword"
					:send-forgot-password-email="sendForgotPasswordEmail"
				/>

				<ProfileSettingsSection
					:preference-form-state="preference_form_state"
					:update-preference-field="updatePreferenceField"
				/>
			</div>
		</AccountShell>

		<ProfileModals
			:pending-email="pending_email"
			:is-email-change-modal="is_email_change_modal"
			:email-change-error="email_change_error"
			:is-otp-open="is_otp_open"
			:email-change-otp-code="email_change_otp_code"
			:email-change-otp-error="email_change_otp_error"
			:limit-reached-error="limit_reached_error"
			:remaining="remaining"
			:is-delete-photo-modal-open="isDeletePhotoModalOpen"
			:is-forgot-password-modal-open="is_forgot_password_modal_open"
			:forgot-password-request-send="forgot_password_request_send"
			:bind-email-change-field-ref="bindEmailChangeFieldRef"
			:set-is-email-change-modal="setIsEmailChangeModal"
			:set-pending-email="setPendingEmail"
			:clear-email-change-error="clearEmailChangeError"
			:set-is-otp-open="setIsOtpOpen"
			:set-email-change-otp-code="setEmailChangeOtpCode"
			:set-is-delete-photo-modal-open="setIsDeletePhotoModalOpen"
			:set-is-forgot-password-modal-open="setIsForgotPasswordModalOpen"
			:close-email-change-modal="closeEmailChangeModal"
			:confirm-email-change="confirmEmailChange"
			:verify-otp="verifyOtp"
			:resend-otp="resendOtp"
			:close-otp-modal="closeOtpModal"
			:close-delete-photo-modal="closeDeletePhotoModal"
			:confirm-delete-photo="confirmDeletePhoto"
			:close-forgot-password-modal="closeForgotPasswordModal"
		/>
	</section>
</template>

<style scoped lang="scss">
.account-page {
	background: var(--bg-page);
	min-height: calc(100vh - 176px);
	position: relative;

	.account-profile-title {
		font-size: var(--type-size-450);
		font-weight: var(--font-weight-bold);
		line-height: var(--type-line-450);
		color: var(--text-primary);
		padding: 40px 0 24px;
	}

	.account-content {
		min-height: 100%;
		display: flex;
		flex-direction: column;
		gap: 56px;
	}
}

:global(.ui-toast.account-profile-photo-toast) {
	background: #ff3131;
	color: var(--contrast-light);
	border: 2px solid var(--white-base);

	.ui-toast-text {
		display: inline-flex;
		align-items: center;
		gap: 0;
	}

	.ui-toast-close {
		color: inherit;
	}
}

:global(.account-profile-photo-toast-title) {
	font-weight: var(--font-weight-bold);
}
</style>