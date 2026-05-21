<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import { useProfilePersonalIndex } from '~/composables/account/profile/useProfilePersonalIndex';
import { useProfilePersonalIndexUI } from '~/composables/account/profile/useProfilePersonalIndexUI';

const AuthVerificationModal = defineAsyncComponent(
	() => import('~/components/auth/shared/AuthVerificationModal.vue')
);
const DeleteConfirmModal = defineAsyncComponent(
	() => import('~/components/ui/DeleteConfirmModal.vue')
);
const EmailChangeModal = defineAsyncComponent(
	() => import('~/components/features/account/profile/modals/EmailChangeModal.vue')
);

withDefaults(defineProps<{
	loading?: boolean;
}>(), {
	loading: false,
});

const {
	file_input,
	is_delete_photo_modal_open,

	pending_email,
	is_email_change_modal,
	email_change_error,

	is_otp_open,
	email_change_otp_code,
	email_change_otp_error,
	limit_reached_error,

	remaining,

	onFilePicked,
	closeDeletePhotoModal,
	deletePhoto,

	closeEmailChangeModal,
	confirmEmailChange,

	verifyOtp,
	resendOtp,
	closeOtpModal,
} = useProfilePersonalIndex()

const { translate } = useProfilePersonalIndexUI()
</script>

<template>
	<div class="account-profile-section" data-testid="account-profile-personal-section">
		<MuLinearWrapper v-if="loading" class="account-profile-section-copy" direction="column" :gap="4">
			<UiSkeleton width="120px" height="36px" border-radius="8px" />
			<UiSkeleton width="100%" height="20px" border-radius="8px" />
			<UiSkeleton width="78%" height="20px" border-radius="8px" />
		</MuLinearWrapper>
		<MuLinearWrapper v-else class="account-profile-section-copy" direction="column" :gap="4">
			<MuHeading class="account-profile-section-title">{{ translate('account.profile.personalDetails') }}</MuHeading>
			<MuText class="account-profile-section-description">
				{{ translate('account.profile.personalDetailsDesc') }}
			</MuText>
		</MuLinearWrapper>

		<FeaturesAccountProfileContentPersonalSkeleton v-if="loading" />

		<div v-else class="account-profile-section-main">
			<FeaturesAccountProfileContentPersonalPhoto />

			<FeaturesAccountProfileContentPersonalForm />
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
		:title="translate('account.profile.photoDeleteConfirm')"
		:description="translate('account.profile.photoDeleteDescription')"
		:cancel-label="translate('account.profile.cancel')"
		:confirm-label="translate('account.profile.delete')"
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
		:submit-label="translate('auth.verification.verify')"
		:busy-label="translate('auth.verification.verifying')"
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
				:alt="translate('account.profile.emailChangeVerification.iconAlt')"
				class="account-profile-email-change-verification-icon"
			>
		</template>
	</AuthVerificationModal>
</template>

<style scoped lang="scss">
.account-profile-section {
	.account-profile-file-input {
		display: none;
	}
}
</style>