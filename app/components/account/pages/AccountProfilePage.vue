<script setup lang="ts">
import { useAccountProfile } from '~/composables/account/useAccountProfile';
import { useCountry } from '~/composables/app/country/useCountry';
import { usePersonalForm } from '~/composables/account/profile/usePersonalForm';
import { usePreferenceForm } from '~/composables/account/profile/usePreferenceForm';
import AuthVerificationModal from '~/components/auth/shared/AuthVerificationModal.vue';
import { computed, nextTick } from 'vue';

const profile_field_store = useProfileFieldsStore();
const { t } = useI18n();
const { withCountry } = useCountry();
const {
	email,
	currentPassword,
	newPassword,
	confirmPassword,
	photoUrl,
	avatarDisplayUrl,
	photoError,
	fileInput,
	initials,
	openFilePicker,
	onFilePicked,
	removePhoto,
	signOut,
} = useAccountProfile();
const isDeletePhotoModalOpen = ref(false);
const isEmailChangeModalOpen = ref(false);
const emailChangeFieldRef = ref<HTMLElement | null>(null);
const pendingEmail = ref('');
const emailChangeOverlayMode = ref<'idle' | 'requesting' | 'verifying'>('idle');
const isEmailChangeOtpOpen = ref(false);
const emailChangeOtpCode = ref('');
const emailChangeOtpError = ref('');
const emailChangeTargetEmail = ref('');
const currentPasswordVisible = ref(false);
const newPasswordVisible = ref(false);
const confirmPasswordVisible = ref(false);
const emailChangeOverlayLabel = computed(() => (
	emailChangeOverlayMode.value === 'requesting'
		? 'Verifying Your Information...'
		: ''
));
const emailChangeOverlayDescription = computed(() => (
	emailChangeOverlayMode.value === 'requesting'
		? "Just a moment! We're making sure everything looks perfect."
		: ''
));
const isChangePasswordEnabled = computed(() => (
	Boolean(currentPassword.value.trim())
	&& Boolean(newPassword.value.trim())
	&& Boolean(confirmPassword.value.trim())
));

const {
	form_state: personal_form_state,
	has_changes,
	has_required_fields,
	is_submitting,
	api_response,
	loadPersonalForm,
	submitPersonalForm
} = usePersonalForm();

const {
	form_state: preference_form_state,
	loadPreferences,
	updatePreferenceField
} = usePreferenceForm();

onMounted(() => {
	loadPreferences()
	loadPersonalForm()
})

const profileToastVisible = ref(false);
const passwordChangeToastVisible = ref(false);
const isPasswordChangeSubmitting = ref(false);
let profile_toast_timer: ReturnType<typeof setTimeout> | null = null;
let password_change_toast_timer: ReturnType<typeof setTimeout> | null = null;
const emailLocked = computed(() => {
	return Boolean(email.value.trim());
});

function clearProfileToastTimer() {
	if (!profile_toast_timer) return;
	clearTimeout(profile_toast_timer);
	profile_toast_timer = null;
}

function clearPasswordChangeToastTimer() {
	if (!password_change_toast_timer) return;
	clearTimeout(password_change_toast_timer);
	password_change_toast_timer = null;
}

function showProfileSavedToast() {
	clearProfileToastTimer();
	profileToastVisible.value = true;
	profile_toast_timer = setTimeout(() => {
		profileToastVisible.value = false;
		profile_toast_timer = null;
	}, 2400);
}

function showPasswordChangedToast() {
	clearPasswordChangeToastTimer();
	passwordChangeToastVisible.value = true;
	password_change_toast_timer = setTimeout(() => {
		passwordChangeToastVisible.value = false;
		password_change_toast_timer = null;
	}, 2400);
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

function openEmailChangeModal() {
	pendingEmail.value = '';
	isEmailChangeModalOpen.value = true;
	void nextTick(() => {
		emailChangeFieldRef.value?.querySelector('input')?.focus();
	});
}

function closeEmailChangeModal() {
	isEmailChangeModalOpen.value = false;
	pendingEmail.value = '';
}

async function confirmEmailChange() {
	const next_email = pendingEmail.value.trim();
	if (!next_email) return;
	emailChangeTargetEmail.value = next_email;
	closeEmailChangeModal();
	emailChangeOverlayMode.value = 'requesting';
	await new Promise((resolve) => setTimeout(resolve, 1200));
	emailChangeOverlayMode.value = 'idle';
	isEmailChangeOtpOpen.value = true;
}

function closeEmailChangeOtpModal() {
	isEmailChangeOtpOpen.value = false;
	emailChangeOtpCode.value = '';
	emailChangeOtpError.value = '';
}

async function verifyEmailChangeOtp() {
	if (emailChangeOtpCode.value.trim().length < 4) {
		emailChangeOtpError.value = 'Please enter the verification code sent to your email.';
		return;
	}

	emailChangeOtpError.value = '';
	isEmailChangeOtpOpen.value = false;
	emailChangeOverlayMode.value = 'verifying';
	await new Promise((resolve) => setTimeout(resolve, 900));
	emailChangeOverlayMode.value = 'idle';
	email.value = emailChangeTargetEmail.value;
	closeEmailChangeOtpModal();
}

function resendEmailChangeOtp() {
	emailChangeOtpCode.value = '';
	emailChangeOtpError.value = '';
}

async function onSaveProfile() {
	await submitPersonalForm();

	if (!api_response?.value?.success) return;

	showProfileSavedToast();
}

async function onChangePassword() {
	isPasswordChangeSubmitting.value = true;
	await new Promise((resolve) => setTimeout(resolve, 900));
	isPasswordChangeSubmitting.value = false;
	showPasswordChangedToast();
	currentPassword.value = '';
	newPassword.value = '';
	confirmPassword.value = '';
	currentPasswordVisible.value = false;
	newPasswordVisible.value = false;
	confirmPasswordVisible.value = false;
}

onBeforeUnmount(() => {
	clearProfileToastTimer();
	clearPasswordChangeToastTimer();
});
</script>

<template>
	<section class="account-page" data-testid="account-profile-page">
		<UiLoadingOverlay
			:visible="is_submitting"
			:label="t('account.profile.saveChanges')"
			test-id="account-profile-saving-overlay"
			position="fixed"
		/>
		<UiLoadingOverlay
			:visible="emailChangeOverlayMode !== 'idle'"
			:label="emailChangeOverlayLabel"
			:description="emailChangeOverlayDescription"
			:show-copy="emailChangeOverlayMode === 'requesting'"
			test-id="account-profile-email-change-page-overlay"
			position="fixed"
		/>
		<UiLoadingOverlay
			:visible="isPasswordChangeSubmitting"
			:label="t('account.profile.changePassword')"
			test-id="account-profile-password-change-overlay"
			position="fixed"
		/>
		<UiToast
			:visible="profileToastVisible"
			:message=api_response?.message
			tone="primary"
			variant="outlined"
			data-testid="account-profile-save-toast"
			@close="profileToastVisible = false"
		/>
		<UiToast
			:visible="passwordChangeToastVisible"
			message="Your password has been successfully changed!"
			tone="primary"
			variant="outlined"
			data-testid="account-profile-password-change-toast"
			@close="passwordChangeToastVisible = false"
		/>
		<AccountShell active-tab="profile">
			<div class="account-content account-profile" data-testid="account-profile-content">
				<h1 class="account-profile-title" data-testid="account-profile-title">{{ t('account.profile.title') }}</h1>

				<div class="account-profile-section" data-testid="account-profile-personal-section">
					<div class="account-profile-section-copy">
						<h2 class="account-profile-section-title">{{ t('account.profile.personalDetails') }}</h2>
						<p class="account-profile-section-description">
							{{ t('account.profile.personalDetailsDesc') }}
						</p>
					</div>
					<div class="account-profile-section-main">
						<div class="account-profile-label">{{ t('account.profile.profilePhoto') }}</div>
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
								<p v-if="photoError" class="account-profile-photo-error">{{ photoError }}</p>
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

						<div class="account-profile-grid" data-testid="account-profile-form">

							<!-- START OF DYNAMIC PROFILE FIELDS -->
							<div v-for="field in profile_field_store.dynamic_profile_fields" :key="field.id">
								<UiFormField
									:label="field.is_required
										? t(`account.profile.${field.field_key}`)
										: `${t(`account.profile.${field.field_key}`)} (${t('account.profile.optional')})`"
									:required="field.is_required"
								>
									<template #default="{ inputId, describedBy }">
										<UiInput
											:id="inputId"
											v-model=" personal_form_state.fields[field.field_key]"
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
											:disabled="emailLocked"
											:input-class="emailLocked ? 'account-profile-email-input-field--locked' : ''"
											data-testid="account-profile-email"
										/>
										<UiButton
											v-if="emailLocked"
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
							<UiButton variant="filled" tone="neutral" size="md" :disabled="!has_changes || !has_required_fields || is_submitting" data-testid="account-profile-save-button" @click="onSaveProfile">
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
						<UiFormField :label="t('account.profile.currentPassword')" :required="true">
							<template #default="{ inputId, describedBy }">
								<UiInput
									:id="inputId"
									v-model="currentPassword"
									:type="currentPasswordVisible ? 'text' : 'password'"
									:aria-describedby="describedBy || undefined"
									:placeholder="t('account.profile.currentPasswordPlaceholder')"
									data-testid="account-profile-current-password"
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
											:icon="currentPasswordVisible ? 'regular-eye' : 'regular-eye-slash'"
											:icon-size="24"
											@click="currentPasswordVisible = !currentPasswordVisible"
										/>
									</template>
								</UiInput>
							</template>
						</UiFormField>
						<p class="account-profile-muted">{{ t('account.profile.passwordHint') }}</p>
						<UiFormField :label="t('account.profile.newPassword')" :required="true">
							<template #default="{ inputId, describedBy }">
								<UiInput
									:id="inputId"
									v-model="newPassword"
									:type="newPasswordVisible ? 'text' : 'password'"
									:aria-describedby="describedBy || undefined"
									:placeholder="t('account.profile.newPasswordPlaceholder')"
									data-testid="account-profile-new-password"
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
											:icon="newPasswordVisible ? 'regular-eye' : 'regular-eye-slash'"
											:icon-size="24"
											@click="newPasswordVisible = !newPasswordVisible"
										/>
									</template>
								</UiInput>
							</template>
						</UiFormField>
						<UiFormField :label="t('account.profile.confirmNewPassword')" :required="true">
							<template #default="{ inputId, describedBy }">
								<UiInput
									:id="inputId"
									v-model="confirmPassword"
									:type="confirmPasswordVisible ? 'text' : 'password'"
									:aria-describedby="describedBy || undefined"
									:placeholder="t('account.profile.confirmNewPasswordPlaceholder')"
									data-testid="account-profile-confirm-password"
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
											:icon="confirmPasswordVisible ? 'regular-eye' : 'regular-eye-slash'"
											:icon-size="24"
											@click="confirmPasswordVisible = !confirmPasswordVisible"
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
								:disabled="!isChangePasswordEnabled || isPasswordChangeSubmitting"
								data-testid="account-profile-change-password-button"
								@click="onChangePassword"
							>
								{{ t('account.profile.changePassword') }}
							</UiButton>
							<NuxtLink :to="withCountry('/auth/login')" class="account-profile-forgot-password-link" data-testid="account-profile-forgot-password">
								{{ t('account.profile.forgotPassword') }}
							</NuxtLink>
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
						<div class="account-profile-actions-right" data-testid="account-profile-signout-wrap">
							<UiButton variant="outline" tone="neutral" size="md" data-testid="account-profile-signout-button" @click="signOut">
								{{ t('account.profile.signOut') }}
							</UiButton>
						</div>
					</div>
				</div>
			</div>
		</AccountShell>
		<UiModal
			:model-value="isEmailChangeModalOpen"
			align="center"
			width="520px"
			padding="0"
			gap="0"
			modal-class="account-profile-email-change-modal-shell"
			@update:model-value="isEmailChangeModalOpen = $event"
		>
			<section class="account-profile-email-change-modal" data-testid="account-profile-email-change-modal">
				<button
					type="button"
					class="account-profile-email-change-modal-close"
					size="24"
					aria-label="Close email change modal"
					data-testid="account-profile-email-change-modal-close"
					@click="closeEmailChangeModal"
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
						:required="true"
					>
						<template #default="{ inputId, describedBy }">
							<div ref="emailChangeFieldRef" class="account-profile-email-change-input-wrap">
								<UiInput
									:id="inputId"
									v-model="pendingEmail"
									type="email"
									:aria-describedby="describedBy || undefined"
									placeholder="Please enter your new email address."
									input-class="account-profile-email-change-input"
									data-testid="account-profile-email-change-input"
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
			:model-value="isEmailChangeOtpOpen"
			:email="emailChangeTargetEmail"
			:code="emailChangeOtpCode"
			:error="emailChangeOtpError"
			submit-label="Verify"
			busy-label="Verifying..."
			width="504px"
			align="center"
			:show-close-button="true"
			test-id-prefix="account-profile-email-change-verification"
			@update:model-value="isEmailChangeOtpOpen = $event"
			@update:code="emailChangeOtpCode = $event"
			@verify="verifyEmailChangeOtp"
			@resend="resendEmailChangeOtp"
		>
			<template #icon>
				<img
					src="/illustrations/icon-verification.svg"
					:alt="t('auth.verification.iconAlt')"
					class="account-profile-email-change-verification-icon"
				>
			</template>
		</AuthVerificationModal>
		<UiModal
			:model-value="isDeletePhotoModalOpen"
			align="center"
			width="520px"
			padding="0"
			gap="0"
			modal-class="account-profile-delete-photo-modal-shell"
			@update:model-value="isDeletePhotoModalOpen = $event"
		>
			<section class="account-profile-delete-photo-modal" data-testid="account-profile-delete-photo-modal">
				<div class="account-profile-delete-photo-modal-copy">
					<div class="account-profile-delete-photo-modal-icon-wrap">
						<img
							src="/icons/custom/account/delete-photo-trash.svg"
							alt=""
							class="account-profile-delete-photo-modal-icon"
						>
					</div>
					<div class="account-profile-delete-photo-modal-text-wrap">
						<h3 class="account-profile-delete-photo-modal-title">
							Are you sure you want to delete this photo?
						</h3>
						<p class="account-profile-delete-photo-modal-text">
							This action cannot be undone. Please confirm to proceed.
						</p>
					</div>
				</div>

				<footer class="account-profile-delete-photo-modal-actions">
					<UiButton
						type="button"
						variant="ghost"
						tone="neutral"
						size="sm"
						:no-hover="true"
						class="account-profile-delete-photo-modal-cancel"
						data-testid="account-profile-delete-photo-modal-cancel"
						@click="closeDeletePhotoModal"
					>
						Cancel
					</UiButton>
					<UiButton
						type="button"
						variant="filled"
						tone="danger"
						size="md"
						class="account-profile-delete-photo-modal-delete"
						data-testid="account-profile-delete-photo-modal-confirm"
						@click="confirmDeletePhoto"
					>
						Delete
					</UiButton>
				</footer>
			</section>
		</UiModal>
	</section>
</template>

<style scoped lang="scss">
.account-page {
    background: var(--bg-page);
    min-height: calc(100vh - 176px);
    position: relative;

    .account-content {
        padding-top: 18px;
        min-height: 100%;

        .account-profile-title {
            margin: 0 0 26px;
            font-size: var(--type-size-500);
            font-weight: var(--font-weight-bold);
            line-height: var(--type-line-500);

            color: var(--text-primary);
        }

        .account-profile-section {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 126px;
            padding: 26px 0;

            .account-profile-section-copy,
            .account-profile-section-main {
                display: flex;
                flex-direction: column;
            }

            .account-profile-section-title {
                margin: 0 0 0px;
                font-size: var(--type-size-300);
                font-weight: var(--font-weight-semibold);
                line-height: var(--type-line-300);


            }

            .account-profile-section-description {
                margin: 0;
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

            .account-profile-photo-row {
                display: grid;
                grid-template-columns: 98px 1fr;
                gap: 18px;
                align-items: center;
                margin-bottom: 16px;

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
                margin: 0;
            }

            .account-profile-photo-error {
                color: var(--error);
                font-size: var(--type-size-100);
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
                font-weight: var(--font-weight-bold);
                --btn-border: transparent;
            }

            :deep(.account-profile-email-input-field--locked) {
                padding-right: 92px;
            }

            .account-profile-stack {
                display: flex;
                flex-direction: column;
                gap: 10px;

                .account-profile-inline-actions {
                    display: flex;
                    gap: 16px;
                    align-items: center;
                    justify-content: flex-end;
                    margin-top: 6px;

                    .account-profile-forgot-password-link {
                        color: var(--text-primary);
                        font-size: var(--type-size-100);
                        line-height: var(--type-line-100);
                        text-decoration: underline;
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
                margin-top: 12px;
                display: flex;
                justify-content: flex-end;
            }
        }
    }


}

    .account-profile-delete-photo-modal {
        background: var(--contrast-light);
	border-radius: 16px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	width: 100%;

	.account-profile-delete-photo-modal-copy {
		width: 100%;
		box-sizing: border-box;
		padding: 24px;
		display: grid;
		grid-template-columns: 52px minmax(0, 1fr);
		align-items: center;
		column-gap: 24px;
	}

	.account-profile-delete-photo-modal-icon-wrap {
		width: 52px;
		height: 52px;
		flex-shrink: 0;
		display: grid;
		place-items: center;
	}

	.account-profile-delete-photo-modal-icon {
		display: block;
		width: 48px;
		height: 48px;
	}

	.account-profile-delete-photo-modal-text-wrap {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.account-profile-delete-photo-modal-title {
		margin: 0;
		font-size: var(--type-size-300);
		line-height: var(--type-line-300);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
	}

	.account-profile-delete-photo-modal-text {
		margin: 0;
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}

	.account-profile-delete-photo-modal-actions {
		width: 100%;
		box-sizing: border-box;
		border-top: 1px solid var(--border-default);
		padding: 16px 24px;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 18px;
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
				margin: 0;
				color: var(--text-primary);
				font-size: var(--type-size-400);
				line-height: var(--type-line-400);
				font-weight: var(--font-weight-bold);
			}

			.account-profile-email-change-modal-text {
				margin: 0;
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

:global(.account-profile-delete-photo-modal-shell) {
    border-radius: 16px;
    overflow: hidden;
    max-width: 520px;
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
</style>