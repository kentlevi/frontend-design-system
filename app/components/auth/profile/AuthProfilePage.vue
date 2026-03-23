<script setup lang="ts">
import AuthProfileDetailsStep from '@/components/auth/profile/AuthProfileDetailsStep.vue';
import AuthProfileSettingsStep from '@/components/auth/profile/AuthProfileSettingsStep.vue';
import AuthProfileSidebar from '@/components/auth/profile/AuthProfileSidebar.vue';
import AuthProfileWelcomeToast from '@/components/auth/profile/AuthProfileWelcomeToast.vue';
import AuthVerificationModal from '@/components/auth/shared/AuthVerificationModal.vue';
import { useAuthProfileSetup } from '@/composables/auth/profile/useAuthProfileSetup';

const {
	step,
	showWelcomeToast,
	firstName,
	lastName,
	email,
	emailError,
	emailDisabled,
	emailRequired,
	photoUrl,
	photoError,
	promotions,
	reviews,
	confirmations,
	initials,
	canContinueProfileDetails,
	canSkipProfileDetails,
	isEmailVerificationModalOpen,
	verificationEmail,
	verificationCode,
	verificationError,
	resendLimitReached,
	isVerifyingEmail,
	verificationResendCooldownRemaining,
	dismissToast,
	onPhotoFilePicked,
	removePhoto,
	goNext,
	goBack,
	closeEmailVerificationModal,
	submitEmailVerification,
	resendEmailVerification,
	completeSetup,
} = useAuthProfileSetup();
</script>

<template>
	<section class="auth-profile" data-testid="auth-profile-page">
		<div class="auth-profile-shell" data-testid="auth-profile-shell">
			<AuthProfileSidebar :step="step" />

			<main class="auth-profile-main" data-testid="auth-profile-main">
				<AuthProfileDetailsStep
					v-if="step === 1"
					:first-name="firstName"
					:last-name="lastName"
					:email="email"
					:email-error="emailError"
					:email-disabled="emailDisabled"
					:email-required="emailRequired"
					:initials="initials"
					:photo-url="photoUrl"
					:photo-error="photoError"
					:can-continue="canContinueProfileDetails"
					:can-skip="canSkipProfileDetails"
					@update:first-name="firstName = $event"
					@update:last-name="lastName = $event"
					@update:email="email = $event"
					@photo-file-picked="onPhotoFilePicked"
					@photo-remove="removePhoto"
					@next="goNext"
				/>

				<AuthProfileSettingsStep
					v-else
					:promotions="promotions"
					:reviews="reviews"
					:confirmations="confirmations"
					@update:promotions="promotions = $event"
					@update:reviews="reviews = $event"
					@update:confirmations="confirmations = $event"
					@back="goBack"
					@complete="completeSetup"
				/>
			</main>
		</div>

		<AuthProfileWelcomeToast :visible="showWelcomeToast" @close="dismissToast" />
		<AuthVerificationModal
			:model-value="isEmailVerificationModalOpen"
			:email="verificationEmail"
			:code="verificationCode"
			:error="verificationError"
			:resend-limit-reached="resendLimitReached"
			:verifying="isVerifyingEmail"
			submit-label="Verify"
			busy-label="Verifying..."
			align="center"
			width="504px"
			:show-close-button="true"
			test-id-prefix="auth-profile-email-verification"
			:resend-cooldown-remaining="verificationResendCooldownRemaining"
			@update:model-value="isEmailVerificationModalOpen = $event"
			@update:code="verificationCode = $event"
			@verify="submitEmailVerification"
			@resend="resendEmailVerification"
			@close="closeEmailVerificationModal"
		/>
	</section>
</template>

<style lang="scss">
.auth-profile {
    background: var(--bg-page);
    position: relative;
    padding-top: 40px;
    padding-bottom: 60px;

    .auth-profile-shell {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        gap: 36px;

        .auth-profile-main {
            width: 100%;
            max-width: 690px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }
    }
}

@media (max-width: 1180px) {
    .auth-profile {
        .auth-profile-shell {
            flex-direction: column;
            gap: 30px;

            .auth-profile-main {
                max-width: none;
            }
        }
    }
}

@media (max-width: 860px) {
    .auth-profile {
        padding: 24px 14px 40px;
    }
}
</style>
