<script setup lang="ts">
import AuthProfileDetailsStep from '@/components/auth/profile/AuthProfileDetailsStep.vue';
import AuthProfileSettingsStep from '@/components/auth/profile/AuthProfileSettingsStep.vue';
import AuthProfileSidebar from '@/components/auth/profile/AuthProfileSidebar.vue';
import AuthVerificationModal from '@/components/auth/shared/AuthVerificationModal.vue';
import { useAuthProfilePage } from '~/composables/auth/profile/useAuthProfilePage';

definePageMeta({
	layout: 'home',
	layoutBackground: 'neutral',
	isSimpleHeader: true,
	footerVariant: 'compact',
});

const {
	submitEmailVerification,
	resendEmailVerification,
	step,
	is_email_verification_modal_open,
	verification_email,
	verification_code,
	verification_error,
	resend_limit_reached,
	is_verifying_email,
	verification_resend_cooldown_remaining,
	setEmailVerificationModalOpen,
	setVerificationCode,
	closeEmailVerificationModal,
} = useAuthProfilePage();
</script>

<template>
	<section class="auth-profile" data-testid="auth-profile-page">
		<div class="auth-profile-shell" data-testid="auth-profile-shell">
			<AuthProfileSidebar />

			<main class="auth-profile-main" data-testid="auth-profile-main">
				<AuthProfileDetailsStep v-if="step === 1" />
				<AuthProfileSettingsStep v-else />
			</main>
		</div>

		<AuthVerificationModal
			:model-value="is_email_verification_modal_open"
			:email="verification_email"
			:code="verification_code"
			:error="verification_error"
			:resend-limit-reached="resend_limit_reached"
			:verifying="is_verifying_email"
			submit-label="Verify"
			busy-label="Verifying..."
			align="center"
			width="504px"
			:show-close-button="true"
			test-id-prefix="auth-profile-email-verification"
			:resend-cooldown-remaining="verification_resend_cooldown_remaining"
			@update:model-value="setEmailVerificationModalOpen"
			@update:code="setVerificationCode"
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