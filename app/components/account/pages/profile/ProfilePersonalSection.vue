<script setup lang="ts">
import AuthVerificationModal from '~/components/auth/shared/AuthVerificationModal.vue';
import ProfileEmailChangeModal from './ProfileEmailChangeModal.vue';
import DeleteConfirmModal from '~/components/ui/DeleteConfirmModal.vue';
import { useChangeEmailForm } from '~/composables/account/profile/useChangeEmailForm';
import { useProfilePhoto } from '~/composables/account/profile/useProfilePhoto';
import PersonalDetails from '~/components/profile/PersonalDetails.vue';

const { t } = useI18n();

const {
	is_delete_photo_modal_open,

	closeDeletePhotoModal,
	deletePhoto,
} = useProfilePhoto()

const {
	pending_email,
	is_email_change_modal,
	email_change_error,

	is_otp_open,
	email_change_otp_code,
	email_change_otp_error,
	limit_reached_error,

	remaining,

	closeEmailChangeModal,
	confirmEmailChange,

	verifyOtp,
	resendOtp,
	closeOtpModal,
} = useChangeEmailForm()
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
			<PersonalDetails />
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
		:email="pending_email"
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