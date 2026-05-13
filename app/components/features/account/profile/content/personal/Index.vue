<script setup lang="ts">
import AuthVerificationModal from '~/components/auth/shared/AuthVerificationModal.vue';
import DeleteConfirmModal from '~/components/ui/DeleteConfirmModal.vue';
import EmailChangeModal from '~/components/features/account/profile/modals/EmailChangeModal.vue';
import { useChangeEmailForm } from '~/composables/account/profile/useChangeEmailForm';
import { useProfilePhoto } from '~/composables/account/profile/useProfilePhoto';
import { useProfilePhotoDisplay } from '~/utils/profile_photo/profile_photo';
import { useSocialAccount } from '~/composables/account/profile/useSocialAccount';
import { useProfilePersonal } from '~/composables/account/profile/useProfilePersonal';

withDefaults(defineProps<{
	loading?: boolean;
}>(), {
	loading: false,
});

const { t } = useI18n();
const { display_avatar, user_initial } = useProfilePhotoDisplay();

const { social } = useSocialAccount()

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
	form_state,
	field_errors,
	dynamic_profile_fields,
	has_changes,

	submitPersonalForm,

	is_updating,
} = useProfilePersonal()

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
</script>

<template>
	<div class="account-profile-section" data-testid="account-profile-personal-section">
		<div v-if="loading" class="account-profile-section-copy">
			<UiSkeleton width="120px" height="36px" border-radius="8px" />
			<UiSkeleton width="100%" height="20px" border-radius="8px" />
			<UiSkeleton width="78%" height="20px" border-radius="8px" />
		</div>
		<div v-else class="account-profile-section-copy">
			<h2 class="account-profile-section-title">{{ t('account.profile.personalDetails') }}</h2>
			<p class="account-profile-section-description">
				{{ t('account.profile.personalDetailsDesc') }}
			</p>
		</div>

		<FeaturesAccountProfileContentPersonalSkeleton v-if="loading" />

		<div v-else class="account-profile-section-main">
			<FeaturesAccountProfileContentPersonalPhoto
				:display-avatar="display_avatar"
				:user-initial="user_initial"
				:photo-inline-error="photo_inline_error"
				@upload-click="openFilePicker"
				@delete-click="openDeletePhotoModal"
			/>

			<FeaturesAccountProfileContentPersonalForm
				:dynamic-profile-fields="dynamic_profile_fields"
				:form-state="form_state"
				:field-errors="field_errors"
				:email="email"
				:social="social"
				:has-changes="has_changes"
				:is-updating="is_updating"
				@submit="submitPersonalForm"
				@change-email-click="openEmailChangeModal"
			/>
		</div>

		<input
			ref="file_input"
			type="file"
			class="account-profile-file-input"
			accept=".jpg,.jpeg,.png"
			data-testid="account-profile-photo-input"
			@change="onFilePicked"
		>
	</div>

	<DeleteConfirmModal
		:model-value="is_delete_photo_modal_open"
		:title="t('account.profile.photoDeleteConfirm')"
		:description="t('account.profile.photoDeleteDescription')"
		:cancel-label="t('account.profile.cancel')"
		:confirm-label="t('account.profile.delete')"
		modal-class="account-profile-delete-photo-modal-shell"
		test-id="account-profile-delete-photo-modal"
		@cancel="closeDeletePhotoModal"
		@confirm="deletePhoto"
	/>

	<EmailChangeModal
		v-model="is_email_change_modal"
		:pending-email="pending_email"
		:email-change-error="email_change_error"
		:close-email-change-modal="closeEmailChangeModal"
		:confirm-email-change="confirmEmailChange"
		@update:pending-email="pending_email = $event"
		@input-change="email_change_error = ''"
	/>

	<AuthVerificationModal
		:email="pending_email"
		:show-email-in-message="false"
		:model-value="is_otp_open"
		:code="email_change_otp_code"
		:error="email_change_otp_error"
		:resend-limit-reached="limit_reached_error"
		:resend-cooldown-remaining="remaining"
		translation-base="account.profile.emailChangeVerification"
		:submit-label="t('auth.verification.verify')"
		:busy-label="t('auth.verification.verifying')"
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
				:alt="t('account.profile.emailChangeVerification.iconAlt')"
				class="account-profile-email-change-verification-icon"
			>
		</template>
	</AuthVerificationModal>
</template>

<style scoped lang="scss">
.account-profile-section-copy {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.account-profile-section {
	.account-profile-file-input {
		display: none;
	}
}
</style>
