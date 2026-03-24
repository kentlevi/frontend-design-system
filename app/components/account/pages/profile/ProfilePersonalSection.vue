<script setup lang="ts">
import AuthVerificationModal from '~/components/auth/shared/AuthVerificationModal.vue';
import ProfileEmailChangeModal from './ProfileEmailChangeModal.vue';
import DeleteConfirmModal from '~/components/ui/DeleteConfirmModal.vue';
import { useChangeEmailForm } from '~/composables/account/profile/useChangeEmailForm';
import { usePersonalForm } from '~/composables/account/profile/usePersonalForm';
import { useProfilePhoto } from '~/composables/account/profile/useProfilePhoto';
import { useProfilePhotoDisplay } from '~/utils/profile_photo/profile_photo';

const { t } = useI18n();
const profile_field_store = useProfileFieldsStore();
const { display_avatar, user_initial } = useProfilePhotoDisplay();

const {
	file_input,
	is_delete_photo_modal_open,
	error: photo_inline_error,

	openFilePicker,
	onFilePicked,
	openDeletePhotoModal,
	closeDeletePhotoModal,
	deletePhoto,
} = useProfilePhoto()

const {
	form_state: personal_form_state,
	has_changes,
	field_errors,
	is_updating: name_is_submitting,
	loadPersonalForm,
	submitPersonalForm
} = usePersonalForm();

const {
	email,

	pending_email,
	is_email_change_modal,
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

onMounted(() => {
	loadPersonalForm()
})
</script>

<template>
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
					<p v-if="photo_inline_error" class="account-profile-photo-error">{{ photo_inline_error }}</p>
				</div>
				<div class="account-profile-photo-row" data-testid="account-profile-photo-row">
					<div class="account-profile-avatar">
						<img
							v-if="display_avatar"
							:src="display_avatar"
							:alt="t('account.profile.profilePhoto')"
							class="account-profile-avatar-image"
						>
						<span v-else class="account-profile-avatar-text">{{ user_initial }}</span>
					</div>
					<div class="account-profile-photo-copy">
						<p class="account-profile-muted">{{ t('account.profile.photoHint1') }}</p>
						<p class="account-profile-muted">{{ t('account.profile.photoHint2') }}</p>
						<div class="account-profile-photo-actions">
							<input
								ref="file_input"
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
								{{ display_avatar ? t('account.profile.uploadNewPhoto') : t('account.profile.uploadPhoto') }}
							</UiButton>
							<UiButton
								v-if="display_avatar"
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
								v-model="personal_form_state.fields[field.field_key]"
								:state="field_errors[field.field_key] ? 'error' : 'default'"
								type="text"
								:aria-describedby="describedBy || undefined"
								:data-testid="`account-profile-${field.field_key}`"
							/>
						</template>
					</UiFormField>
				</div>

				<UiFormField
					class="account-profile-grid-full"
					:label="t('account.profile.emailAddress')"
					:required="true"
				>
					<template #default="{ inputId, describedBy }">
						<div class="account-profile-email-input-wrap">
							<UiInput
								:id="inputId"
								:model-value="email"
								type="email"
								:aria-describedby="describedBy || undefined"
								:disabled="true"
								input-class="account-profile-email-input-field--locked"
								data-testid="account-profile-email"
							/>
							<UiButton
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
						<p class="account-profile-email-helper-text">
							This account is linked to your <span class="account-profile-facebook-text">Facebook</span> login.
						</p>
						<p class="account-profile-email-helper-text">
							This account is linked to your <span class="account-profile-google-text">Google</span> login.
						</p>
					</template>
				</UiFormField>
			</div>

			<div class="account-profile-actions-right" data-testid="account-profile-save-wrap">
				<UiButton
					variant="filled"
					tone="neutral"
					size="md"
					:disabled="!has_changes || name_is_submitting"
					data-testid="account-profile-save-button"
					@click="submitPersonalForm"
				>
					{{ t('account.profile.saveChanges') }}
				</UiButton>
			</div>
		</div>
	</div>


	<!-- Modals -->
	<DeleteConfirmModal
		:model-value="is_delete_photo_modal_open"
		title="Are you sure you want to delete this photo?"
		description="This action cannot be undone. Please confirm to proceed."
		modal-class="account-profile-delete-photo-modal-shell"
		test-id="account-profile-delete-photo-modal"
		@cancel="closeDeletePhotoModal"
		@confirm="deletePhoto"
	/>

	<ProfileEmailChangeModal
		v-model="is_email_change_modal"
		:pending-email="pending_email"
		:email-change-error="email_change_error"
		:close-email-change-modal="closeEmailChangeModal"
		:confirm-email-change="confirmEmailChange"
		@update:pending-email="pending_email = $event"
		@input-change="email_change_error = ''"
	/>

	<AuthVerificationModal
		:model-value="is_otp_open"
		:code="email_change_otp_code"
		:error="email_change_otp_error"
		:resend-limit-reached="limit_reached_error"
		:resend-cooldown-remaining="remaining"
		submit-label="Verify"
		busy-label="Verifying..."
		align="center"
		:show-close-button="true"
		test-id-prefix="account-profile-email-change-verification"
		@update:model-value="is_otp_open = $event"
		@update:code="email_change_otp_code = $event"
		@verify="verifyOtp"
		@resend="resendOtp"
		@close="closeOtpModal"
	>
		<template #icon>
			<img
				src="/illustrations/icon-verification.svg"
				:alt="t('auth.verification.iconAlt')"
				class="account-profile-email-change-verification-icon"
			>
		</template>
	</AuthVerificationModal>

</template>

<style scoped lang="scss">
.account-profile-section {
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

	.account-profile-email-helper-text {
		margin: 0;
		color: var(--text-secondary);
	}

	.account-profile-facebook-text,
	.account-profile-google-text {
		color: var(--azure-base);
		font-weight: var(--font-weight-semibold);
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

	:deep(.ui-input[data-disabled="true"] .ui-input-field.account-profile-email-input-field--locked) {
		padding-right: 92px;
		color: var(--text-primary);
	}

	.account-profile-actions-right {
		display: flex;
		justify-content: flex-end;
	}
}
</style>