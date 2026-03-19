<script setup lang="ts">
import { useAccountProfile } from '~/composables/account/useAccountProfile';
import { usePersonalForm } from '~/composables/account/profile/usePersonalForm';
import { usePreferenceForm } from '~/composables/account/profile/usePreferenceForm';
import AuthVerificationModal from '~/components/auth/shared/AuthVerificationModal.vue';
import { computed, watch } from 'vue';
import { useChangeEmailForm } from '~/composables/account/profile/useChangeEmailForm';
import { usePasswordForm } from '~/composables/account/profile/usePasswordForm';
import DeleteConfirmModal from '~/components/ui/DeleteConfirmModal.vue';
import { useForgotPasswordForm } from '~/composables/account/profile/useForgotPasswordForm';

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
} = useChangeEmailForm()

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
} = usePasswordForm()

const {
	is_forgot_password_modal_open,
	forgot_password_request_send,

	sendForgotPasswordEmail,
	closeForgotPasswordModal
} = useForgotPasswordForm()

onMounted(() => {
	loadPreferences()
	loadPersonalForm()
})

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
				<div class="account-profile-section" data-testid="account-profile-personal-section">
					<div class="account-profile-section-copy">
						<h2 class="account-profile-section-title">{{ t('account.profile.personalDetails') }}</h2>
						<p class="account-profile-section-description">
							{{ t('account.profile.personalDetailsDesc') }}
						</p>
					</div>
					<div class="account-profile-section-main">
						<div class="account-profile-photo-group">
							<div class="account-profile-photo-head">
								<div class="account-profile-label">{{ t('account.profile.profilePhoto') }}</div>
								<p v-if="photoInlineError" class="account-profile-photo-error">{{ photoInlineError }}</p>
							</div>
							<div class="account-profile-photo-row" data-testid="account-profile-photo-row">
								<div class="account-profile-avatar">
									<img
										v-if="avatarDisplayUrl"
										:src="avatarDisplayUrl"
										:alt="t('account.profile.profilePhoto')"
										class="account-profile-avatar-image"
									>
									<span v-else class="account-profile-avatar-text">{{ initials }}</span>
								</div>
								<div class="account-profile-photo-copy">
									<p class="account-profile-muted">{{ t('account.profile.photoHint1') }}</p>
									<p class="account-profile-muted">{{ t('account.profile.photoHint2') }}</p>
									<div class="account-profile-photo-actions">
										<input
											ref="fileInput"
											type="file"
											class="account-profile-file-input"
											accept=".jpg,.jpeg,.png"
											data-testid="account-profile-photo-input"
											@change="onFilePicked"
										>
										<UiButton
											variant="outline"
											tone="neutral"
											size="md"
											class="account-profile-outline-button"
											data-testid="account-profile-photo-upload-button"
											@click="openFilePicker"
										>
											{{ t('account.profile.uploadNewPhoto') }}
										</UiButton>
										<UiButton
											v-if="photoUrl"
											variant="ghost"
											tone="danger"
											size="md"
											class="account-profile-delete-button"
											data-testid="account-profile-photo-delete-button"
											@click="openDeletePhotoModal"
										>
											{{ t('account.profile.delete') }}
										</UiButton>
									</div>
								</div>
							</div>
						</div>

						<div class="account-profile-grid" data-testid="account-profile-form">

							<!-- START OF DYNAMIC PROFILE FIELDS -->
							<div v-for="field in profile_field_store.dynamic_profile_fields" :key="field.id">
								<UiFormField
									:error="field_errors[field.field_key]"
									:label="field.is_required
										? t(`account.profile.${field.field_key}`)
										: `${t(`account.profile.${field.field_key}`)} (${t('account.profile.optional')})`"
									:required="field.is_required"
								>
									<template v-if="field.field_key === 'last_name' || field.field_key === 'family_name'" #label>
										<span class="ui-form-field-label-text">
											{{ t(`account.profile.${field.field_key}`) }}
										</span>
										<span class="account-profile-optional">
											({{ t('account.profile.optional') }})
										</span>
									</template>
									<template #default="{ inputId, describedBy }">
										<UiInput
											:id="inputId"
											v-model=" personal_form_state.fields[field.field_key]"
											:state="field_errors[field.field_key] ? 'error' : 'default'"
											type="text"
											:aria-describedby="describedBy || undefined"
											:data-testid="`account-profile-${field.field_key}`"
										/>
									</template>
								</UiFormField>
							</div>
							<!-- END OF DYNAMIC PROFILE FIELDS -->

							<UiFormField
								class="account-profile-grid-full"
								:label="t('account.profile.emailAddress')"
								:required="true"
							>
								<template #default="{ inputId, describedBy }">
									<div class="account-profile-email-input-wrap">
										<UiInput
											:id="inputId"
											v-model="email"
											type="email"
											:aria-describedby="describedBy || undefined"
											:disabled="true"
											:input-class="true ? 'account-profile-email-input-field--locked' : ''"
											data-testid="account-profile-email"
										/>
										<UiButton
											v-if="true"
											type="button"
											variant="ghost"
											tone="neutral"
											size="sm"
											:no-hover="true"
											class="account-profile-email-change-button"
											data-testid="account-profile-email-change-button"
											@click="openEmailChangeModal"
										>
											Change
										</UiButton>
									</div>
								</template>
							</UiFormField>
						</div>
						<div class="account-profile-actions-right" data-testid="account-profile-save-wrap">
							<UiButton variant="filled" tone="neutral" size="md" :disabled="!has_changes || name_is_submitting" data-testid="account-profile-save-button" @click="submitPersonalForm">
								{{ t('account.profile.saveChanges') }}
							</UiButton>
						</div>
					</div>
				</div>

				<div class="account-profile-section" data-testid="account-profile-password-section">
					<div class="account-profile-section-copy">
						<h2 class="account-profile-section-title">{{ t('account.profile.password') }}</h2>
						<p class="account-profile-section-description">{{ t('account.profile.passwordDesc') }}</p>
					</div>
					<div class="account-profile-stack" data-testid="account-profile-password-form">
						<UiFormField :label="t('account.profile.currentPassword')" :error="current_password_error" :required="true">
							<template #default="{ inputId, describedBy }">
								<UiInput
									:id="inputId"
									v-model="current_password"
									:type="current_password_visible ? 'text' : 'password'"
									:aria-describedby="describedBy || undefined"
									:state="current_password_error ? 'error' : 'default'"
									:placeholder="t('account.profile.currentPasswordPlaceholder')"
									data-testid="account-profile-current-password"
									@update:model-value="current_password_error = ''"
								>
									<template #icon-right>
										<UiButton
											variant="ghost"
											tone="neutral"
											size="24"
											:no-hover="true"
											class="account-profile-password-toggle"
											:aria-label="t('auth.reset.togglePassword')"
											:sr-label="t('auth.reset.togglePassword')"
											icon-only
											:icon="current_password_visible ? 'regular-eye' : 'regular-eye-slash'"
											:icon-size="24"
											@click="current_password_visible = !current_password_visible"
										/>
									</template>
								</UiInput>
							</template>
						</UiFormField>
						<UiFormField :label="t('account.profile.newPassword')" :error="pair_password_error" :required="true">
							<template #default="{ inputId, describedBy }">
								<UiInput
									:id="inputId"
									v-model="new_password"
									:type="new_password_visible ? 'text' : 'password'"
									:aria-describedby="describedBy || undefined"
									:state="pair_password_error ? 'error' : 'default'"
									:placeholder="t('account.profile.newPasswordPlaceholder')"
									data-testid="account-profile-new-password"
									@update:model-value="clearNewPasswordPairErrors()"
								>
									<template #icon-right>
										<UiButton
											variant="ghost"
											tone="neutral"
											size="24"
											:no-hover="true"
											class="account-profile-password-toggle"
											:aria-label="t('auth.reset.togglePassword')"
											:sr-label="t('auth.reset.togglePassword')"
											icon-only
											:icon="new_password_visible ? 'regular-eye' : 'regular-eye-slash'"
											:icon-size="24"
											@click="new_password_visible = !new_password_visible"
										/>
									</template>
								</UiInput>
							</template>
						</UiFormField>
						<p class="account-profile-muted">{{ t('account.profile.passwordHint') }}</p>
						<UiFormField :label="t('account.profile.confirmNewPassword')" :required="true">
							<template #default="{ inputId, describedBy }">
								<UiInput
									:id="inputId"
									v-model="new_password_confirmation"
									:type="new_password_confirmation_visible ? 'text' : 'password'"
									:aria-describedby="describedBy || undefined"
									:state="pair_password_error ? 'error' : 'default'"
									:placeholder="t('account.profile.confirmNewPasswordPlaceholder')"
									data-testid="account-profile-confirm-password"
									@update:model-value="clearNewPasswordPairErrors()"
								>
									<template #icon-right>
										<UiButton
											variant="ghost"
											tone="neutral"
											size="24"
											:no-hover="true"
											class="account-profile-password-toggle"
											:aria-label="t('auth.reset.toggleConfirmPassword')"
											:sr-label="t('auth.reset.toggleConfirmPassword')"
											icon-only
											:icon="new_password_confirmation_visible ? 'regular-eye' : 'regular-eye-slash'"
											:icon-size="24"
											@click="new_password_confirmation_visible = !new_password_confirmation_visible"
										/>
									</template>
								</UiInput>
							</template>
						</UiFormField>
						<div class="account-profile-inline-actions" data-testid="account-profile-password-actions">
							<UiButton
								variant="filled"
								tone="neutral"
								size="md"
								:disabled="!is_change_password_enabled || isPasswordChangeSubmitting"
								data-testid="account-profile-change-password-button"
								@click="onChangePassword"
							>
								{{ t('account.profile.changePassword') }}
							</UiButton>
							<UiButton
								variant="ghost"
								tone="neutral"
								size="sm"
								:no-hover="true"
								class="account-profile-forgot-password-link"
								label-class="account-profile-forgot-password-link-label"
								data-testid="account-profile-forgot-password"
								@click="sendForgotPasswordEmail"
							>
								{{ t('account.profile.forgotPassword') }}
							</UiButton>
						</div>
					</div>
				</div>

				<div class="account-profile-section" data-testid="account-profile-settings-section">
					<div class="account-profile-section-copy">
						<h2 class="account-profile-section-title">{{ t('account.profile.settings') }}</h2>
						<p class="account-profile-section-description">{{ t('account.profile.settingsDesc') }}</p>
					</div>
					<div class="account-profile-settings" data-testid="account-profile-settings">
						<div class="account-profile-setting-row" data-testid="account-profile-setting-promotions">
							<div class="account-profile-setting-copy">
								<h3 class="account-profile-setting-title">{{ t('account.profile.promotions') }}</h3>
								<p class="account-profile-muted">{{ t('account.profile.promotionsDesc') }}</p>
							</div>
							<label class="account-profile-switch">
								<input
									v-model="preference_form_state.offers_emails"
									type="checkbox"
									class="account-profile-switch-input"
									data-testid="account-profile-toggle-promotions"
									@change="updatePreferenceField('offers_emails', preference_form_state.offers_emails)"
								>
								<span class="account-profile-switch-track" />
							</label>
						</div>
						<div class="account-profile-setting-row" data-testid="account-profile-setting-reviews">
							<div class="account-profile-setting-copy">
								<h3 class="account-profile-setting-title">{{ t('account.profile.reviews') }}</h3>
								<p class="account-profile-muted">{{ t('account.profile.reviewsDesc') }}</p>
							</div>
							<label class="account-profile-switch">
								<input
									v-model="preference_form_state.reviews_emails"
									type="checkbox"
									class="account-profile-switch-input"
									data-testid="account-profile-toggle-reviews"
									@change="updatePreferenceField('reviews_emails', preference_form_state.reviews_emails)"
								>
								<span class="account-profile-switch-track" />
							</label>
						</div>
						<div class="account-profile-setting-row" data-testid="account-profile-setting-confirmations">
							<div class="account-profile-setting-copy">
								<h3 class="account-profile-setting-title">{{ t('account.profile.confirmations') }}</h3>
								<p class="account-profile-muted">{{ t('account.profile.confirmationsDesc') }}</p>
							</div>
							<label class="account-profile-switch">
								<input
									v-model="preference_form_state.confirmations_emails"
									type="checkbox"
									class="account-profile-switch-input"
									data-testid="account-profile-toggle-confirmations"
									@change="updatePreferenceField('confirmations_emails', preference_form_state.confirmations_emails)"
								>
								<span class="account-profile-switch-track" />
							</label>
						</div>
						<div class="account-profile-setting-row" data-testid="account-profile-setting-unit">
							<div class="account-profile-setting-copy">
								<h3 class="account-profile-setting-title">{{ t('account.profile.unit') }}</h3>
								<p class="account-profile-muted">{{ t('account.profile.unitDesc') }}</p>
							</div>
							<div class="account-profile-unit-segment">
								<UiButton
									variant="ghost"
									tone="neutral"
									size="md"
									class="account-profile-unit-button"
									:class="{ active: preference_form_state.unit_of_measurement === 'mm' }"
									data-testid="account-profile-unit-millimeter-button"
									@click="updatePreferenceField('unit_of_measurement', 'mm')"
								>
									{{ t('account.profile.millimeter') }}
								</UiButton>
								<UiButton
									variant="ghost"
									tone="neutral"
									size="md"
									class="account-profile-unit-button"
									:class="{ active: preference_form_state.unit_of_measurement === 'in' }"
									data-testid="account-profile-unit-inch-button"
									@click="updatePreferenceField('unit_of_measurement', 'in')"
								>
									{{ t('account.profile.inch') }}
								</UiButton>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AccountShell>
		<UiModal
			:model-value="is_email_change_modal"
			align="center"
			width="520px"
			padding="0"
			gap="0"
			modal-class="account-profile-email-change-modal-shell"
			@update:model-value="is_email_change_modal = $event"
		>
			<section class="account-profile-email-change-modal" data-testid="account-profile-email-change-modal">
				<button
					type="button"
					class="account-profile-email-change-modal-close"
					size="24"
					aria-label="Close email change modal"
					data-testid="account-profile-email-change-modal-close"
					@click="() => closeEmailChangeModal()"
				>
					<UiIcon name="regular-times" :size="24" />
				</button>

				<div class="account-profile-email-change-modal-copy">
					<div class="account-profile-email-change-modal-icon-wrap">
						<img
							src="/icons/custom/account/email-change.svg"
							alt=""
							class="account-profile-email-change-modal-icon"
						>
					</div>
					<div class="account-profile-email-change-modal-text-wrap">
						<h3 class="account-profile-email-change-modal-title">Email Change</h3>
						<p class="account-profile-email-change-modal-text">
							Enter your new email address and click the <strong class="change-strong">"Confirm"</strong> button to proceed.
						</p>
					</div>
				</div>

				<div class="account-profile-email-change-modal-body">
					<UiFormField
						class="account-profile-email-change-field"
						head-class="account-profile-email-change-field-head"
						label-text-class="account-profile-email-change-field-label-text"
						:label="t('account.profile.emailAddress')"
						:error="email_change_error"
						:required="true"
					>
						<template #default="{ inputId, describedBy }">
							<div ref="email_change_field_ref" class="account-profile-email-change-input-wrap">
								<UiInput
									:id="inputId"
									v-model="pending_email"
									type="email"
									:aria-describedby="describedBy || undefined"
									:state="email_change_error ? 'error' : 'default'"
									placeholder="Please enter your new email address."
									input-class="account-profile-email-change-input"
									data-testid="account-profile-email-change-input"
									@update:model-value="email_change_error = ''"
								/>
							</div>
						</template>
					</UiFormField>
				</div>

				<div class="account-profile-email-change-modal-actions">
					<UiButton
						type="button"
						variant="filled"
						tone="neutral"
						size="md"
						class="account-profile-email-change-modal-confirm"
						data-testid="account-profile-email-change-modal-confirm"
						@click="confirmEmailChange"
					>
						Confirm
					</UiButton>
				</div>
			</section>
		</UiModal>
		<AuthVerificationModal
			:model-value="is_otp_open"
			:code="email_change_otp_code"
			:error="email_change_otp_error"
			:resend-limit-reached="limit_reached_error"
			:resend-cooldown-remaining="remaining"
			submit-label="Verify"
			busy-label="Verifying..."
			width="504px"
			align="center"
			:show-close-button="true"
			test-id-prefix="account-profile-email-change-verification"
			@update:model-value="is_otp_open = $event"
			@update:code="email_change_otp_code = $event"
			@verify="verifyOtp"
			@resend="resendOtp"
			@close="() => closeOtpModal()"
		>
			<template #icon>
				<img
					src="/illustrations/icon-verification.svg"
					:alt="t('auth.verification.iconAlt')"
					class="account-profile-email-change-verification-icon"
				>
			</template>
		</AuthVerificationModal>
		<DeleteConfirmModal
			v-model="isDeletePhotoModalOpen"
			title="Are you sure you want to delete this photo?"
			description="This action cannot be undone. Please confirm to proceed."
			modal-class="account-profile-delete-photo-modal-shell"
			test-id="account-profile-delete-photo-modal"
			@cancel="closeDeletePhotoModal"
			@confirm="confirmDeletePhoto"
		/>
		<UiModal
			:model-value="is_forgot_password_modal_open"
			align="center"
			width="504px"
			padding="40px"
			gap="8px"
			modal-class="account-profile-forgot-password-modal-shell"
			@update:model-value="$event ? (is_forgot_password_modal_open = true) : closeForgotPasswordModal()"
		>
			<section class="account-profile-forgot-password-modal" data-testid="account-profile-forgot-password-modal">
				<button
					type="button"
					class="account-profile-forgot-password-modal-close"
					:aria-label="t('account.profile.forgotPasswordModalClose')"
					data-testid="account-profile-forgot-password-modal-close"
					@click="closeForgotPasswordModal"
				>
					<UiIcon name="regular-times" :size="24" />
				</button>

				<div class="account-profile-forgot-password-modal-header">
					<UiLogo
						name="musticker"
						variant="mark"
						color="colored"
						:size="40"
						class="account-profile-forgot-password-modal-logo"
					/>
					<h3 class="account-profile-forgot-password-modal-title">
						{{ forgot_password_request_send ? t('account.profile.forgotPasswordCheckEmailTitle') : t('account.profile.forgotPasswordRequestFailedTitle') }}
					</h3>
				</div>

				<p class="account-profile-forgot-password-modal-description">
					{{ forgot_password_request_send ? t('account.profile.forgotPasswordCheckEmailDescription') : t('account.profile.forgotPasswordRequestFailed') }}
				</p>

				<div class="account-profile-forgot-password-modal-actions">
					<UiButton
						variant="filled"
						tone="neutral"
						size="lg"
						class="account-profile-forgot-password-modal-confirm"
						data-testid="account-profile-forgot-password-modal-confirm"
						@click="closeForgotPasswordModal"
					>
						{{ t('account.profile.forgotPasswordReturnToDashboard') }}
					</UiButton>
				</div>
			</section>
		</UiModal>
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

        .account-profile-section {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 126px;

            .account-profile-section-copy,
            .account-profile-section-main {
                display: flex;
                flex-direction: column;
				gap: 16px;
            }

            .account-profile-section-title {
                margin: 0 0 0px;
                font-size: var(--type-size-300);
                font-weight: var(--font-weight-semibold);
                line-height: var(--type-line-300);


            }

            .account-profile-section-description {

                color: var(--text-secondary);
                font-size: var(--type-size-100);
                font-weight: var(--font-weight-regular);
                line-height: var(--type-line-100);

            }

            .account-profile-label {
                display: block;
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                font-weight: var(--font-weight-semibold);
                margin-bottom: 10px;
            }

            .account-profile-photo-head {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 6px;

                .account-profile-label {
                    margin-bottom: 0;
                }

                .account-profile-photo-error {

                    text-align: left;
                    max-width: 100%;
                }
            }

            .account-profile-photo-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .account-profile-photo-row {
                display: grid;
                grid-template-columns: 98px 1fr;
                gap: 18px;
                align-items: center;

                .account-profile-avatar {
                    width: 98px;
                    height: 98px;
                    border-radius: 50%;
                    background: var(--gray-40);
                    color: var(--black-base);
                    display: grid;
                    place-items: center;
                    overflow: hidden;
                    font-size: var(--type-size-550);
                    line-height: var(--type-line-550);
                    font-weight: var(--font-weight-bold);

                    .account-profile-avatar-image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }

            .account-profile-photo-copy {
                display: flex;
                flex-direction: column;
            }

            .account-profile-muted {
                color: var(--text-secondary);
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);

            }

            .account-profile-photo-error {
                color: var(--error);
                font-size: var(--type-size-100);
                font-weight: var(--font-weight-semibold);
                line-height: var(--type-line-100);
                margin: 8px 0 0;
            }

            .account-profile-file-input {
                display: none;
            }

            .account-profile-photo-actions {
                margin-top: 10px;
                display: flex;
                gap: 14px;
                align-items: center;

                .account-profile-outline-button {
                    min-height: 38px;
                }

                .account-profile-delete-button {
                    color: var(--error);
                }
            }

            .account-profile-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;

                .account-profile-grid-full {
                    grid-column: 1 / -1;
                }

                .account-profile-optional {
                    color: var(--text-muted);
                    font-weight: var(--font-weight-regular);
                }
            }

            .account-profile-email-input-wrap {
                position: relative;
            }

            .account-profile-email-change-button {
                position: absolute;
                top: 50%;
                right: 12px;
                transform: translateY(-50%);
                z-index: 1;
                min-height: 32px;
                padding: 0 8px;
                color: var(--text-primary);
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                font-weight: var(--font-weight-semibold);
                --btn-border: transparent;
            }

            :deep(.account-profile-email-input-field--locked) {
                padding-right: 92px;
            }

            .account-profile-stack {
                display: flex;
                flex-direction: column;
                gap: 16px;

                .account-profile-inline-actions {
                    display: flex;
                    gap: 16px;
                    align-items: center;
                    justify-content: flex-end;

                    .account-profile-forgot-password-link {
                        min-height: auto;
                        padding: 0;
                        color: var(--text-primary);
                        font-size: var(--type-size-100);
                        line-height: var(--type-line-100);
                        text-decoration: underline;

                        :deep(.account-profile-forgot-password-link-label) {
                            color: inherit;
                            font-size: var(--type-size-100);
                            line-height: var(--type-line-100);
                            text-decoration: underline;
                        }
                    }
                }
            }

            .account-profile-settings {
                display: flex;
                flex-direction: column;
                gap: 12px;

                .account-profile-setting-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 16px;
                    align-items: center;

                    .account-profile-setting-copy {
                        display: flex;
                        flex-direction: column;
                    }

                    .account-profile-setting-title {
                        margin: 0 0 4px;
                        font-size: var(--type-size-200);
                        line-height: var(--type-line-200);
                    }

                    .account-profile-switch {
                        position: relative;
                        width: 42px;
                        height: 24px;
                        display: inline-flex;
                        flex-shrink: 0;
                        cursor: pointer;

                        .account-profile-switch-input {
                            position: absolute;
                            opacity: 0;
                            pointer-events: none;
                        }

                        .account-profile-switch-track {
                            width: 100%;
                            height: 100%;
                            border-radius: 999px;
                            background: var(--gray-30);
                            position: relative;

                            &::after {
                                content: '';
                                width: 16px;
                                height: 16px;
                                border-radius: 50%;
                                background: var(--contrast-light);
                                position: absolute;
                                left: 4px;
                                top: 4px;
                                transition: transform 0.2s ease;
                            }
                        }

                        .account-profile-switch-input:checked + .account-profile-switch-track {
                            background: var(--text-primary);
                        }

                        .account-profile-switch-input:checked + .account-profile-switch-track::after {
                            transform: translateX(18px);
                        }
                    }

                    .account-profile-unit-segment {
                        display: inline-grid;
                        grid-template-columns: 1fr 1fr;
                        border: 1px solid var(--text-primary);
                        border-radius: 14px;
                        overflow: hidden;

                        .account-profile-unit-button {
                            min-width: 112px;
                            height: 40px;
                            font-size: var(--type-size-100);
                            line-height: var(--type-line-100);
                            font-weight: var(--font-weight-bold);
							border-radius: 0;

                            &.active {
                                background: var(--text-primary);
                                color: var(--contrast-light);
                            }
                        }
                    }
                }
            }

            .account-profile-actions-right {
                display: flex;
                justify-content: flex-end;
            }
        }
    }


}

.account-profile-forgot-password-modal {
    position: relative;
    margin: calc(var(--ui-modal-padding, 40px) * -1);
    padding: var(--ui-modal-padding, 40px);
    background: var(--contrast-light);
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .account-profile-forgot-password-modal-close {
        position: absolute;
        top: 24px;
        right: 24px;
        display: grid;
        place-items: center;
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--text-primary);
        cursor: pointer;
        z-index: 1;
    }

    .account-profile-forgot-password-modal-header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;
    }

    .account-profile-forgot-password-modal-title {
        font-size: var(--type-size-500);
        line-height: var(--type-line-500);
        color: var(--text-primary);
    }

    .account-profile-forgot-password-modal-description {
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        color: var(--text-secondary);
    }

    .account-profile-forgot-password-modal-actions {
        display: flex;
    }

    .account-profile-forgot-password-modal-confirm {
        width: 100%;
    }
}

.account-profile-email-change-modal {
	position: relative;
	--account-profile-email-change-modal-padding: 40px;
	background: var(--contrast-light);
	border-radius: 16px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	gap: 32px;
	width: 100%;
	padding: 40px;

	.account-profile-email-change-modal-close {
		position: absolute;
		top: 24px;
		right: 24px;
		display: grid;
		place-items: center;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--text-primary);
		cursor: pointer;
	}
	.account-profile-email-change-modal-copy {
		display: grid;
		grid-template-columns: 48px minmax(0, 1fr);
		align-items: start;
		column-gap: 16px;
		.account-profile-email-change-modal-icon-wrap {
			display: grid;
			place-items: center;
			width: 48px;
			height: 48px;
			.account-profile-email-change-modal-icon {
				display: block;
				width: 48px;
				height: 48px;
			}
		}

		.account-profile-email-change-modal-text-wrap {
			display: flex;
			flex-direction: column;
			gap: 8px;
			.account-profile-email-change-modal-title {

				color: var(--text-primary);
				font-size: var(--type-size-400);
				line-height: var(--type-line-400);
				font-weight: var(--font-weight-bold);
			}

			.account-profile-email-change-modal-text {

				color: var(--text-secondary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				.change-strong {
					color: var(--text-primary);
					font-weight: var(--font-weight-bold);
				}
			}
		}
	}

        .account-profile-email-change-modal-confirm {
            width: 100%;
            min-height: 46px;
            border-radius: 18px;
		font-size: var(--type-size-200);
		line-height: var(--type-line-200);
        }
    }

    .account-profile-email-change-verification-icon {
        width: 52px;
        height: 52px;
        object-fit: contain;
        display: block;
    }

    @media (max-width: 980px) {
        .account-content {
            .account-profile-section {
                grid-template-columns: 1fr;
                gap: 16px;
            }
        }

        .account-profile-email-change-verification-icon {
            width: 46px;
            height: 46px;
        }
    }

.account-profile-forgot-password-modal {
    position: relative;
    margin: calc(var(--ui-modal-padding, 40px) * -1);
    padding: var(--ui-modal-padding, 40px);
    background: var(--contrast-light);
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .account-profile-forgot-password-modal-close {
        position: absolute;
        top: 24px;
        right: 24px;
        display: grid;
        place-items: center;
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--text-primary);
        cursor: pointer;
        z-index: 1;
    }

    .account-profile-forgot-password-modal-header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;
    }

    .account-profile-forgot-password-modal-title {
        font-size: var(--type-size-500);
        line-height: var(--type-line-500);
        color: var(--text-primary);
    }

    .account-profile-forgot-password-modal-description {
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        color: var(--text-secondary);
    }

    .account-profile-forgot-password-modal-actions {
        display: flex;
    }

    .account-profile-forgot-password-modal-confirm {
        width: 100%;
    }
}

:global(.account-profile-email-change-modal-shell) {
    border-radius: 16px;
    overflow: hidden;
    max-width: 520px;
}

:global(.account-profile-email-change-field-label-text) {
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
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