<script setup lang="ts">
import AuthLoginForgotPasswordModal from '@/components/auth/login/AuthLoginForgotPasswordModal.vue';
import AuthLoginHeader from '@/components/auth/login/AuthLoginHeader.vue';
import AuthLoginMemberForm from '@/components/auth/login/AuthLoginMemberForm.vue';
import AuthLoginModeSwitch from '@/components/auth/login/AuthLoginModeSwitch.vue';
import AuthLoginNonMemberForm from '@/components/auth/login/AuthLoginNonMemberForm.vue';
import AuthLoginSocialButtons from '@/components/auth/login/AuthLoginSocialButtons.vue';
import AuthLoginVerificationModal from '@/components/auth/login/AuthLoginVerificationModal.vue';
import { useLoginPageForm } from '@/composables/auth/login/useLoginPageForm';

const props = withDefaults(defineProps<{
	skipMemberRedirect?: boolean;
	showCloseButton?: boolean;
	registerAsAction?: boolean;
	forgotPasswordAsAction?: boolean;
	hideNonMemberOrderNumber?: boolean;
}>(), {
	skipMemberRedirect: false,
	showCloseButton: false,
	registerAsAction: false,
	forgotPasswordAsAction: false,
	hideNonMemberOrderNumber: false,
});

const emit = defineEmits<{
	(e: 'member-login-success'): void;
	(e: 'close'): void;
	(e: 'open-register'): void;
	(e: 'open-forgot-password', email: string): void;
}>();

const { t } = useI18n();

const {
	memberType,
	keepSignedIn,
	showPassword,
	isNonMember,
	setMemberType,
	togglePassword,
	setKeepSignedIn,
	submitLabel,
	isVerificationModalOpen,
	isPageLoginBusy,
	guestVerificationEmail,
	guestVerificationOrderNumber,
	guestVerificationToken,
	guestVerificationCode,
	guestVerificationError,
	resendLimitReached,
	isGuestVerifying,
	guestResendCooldownRemaining,
	isForgotPasswordModalOpen,
	memberEmail,
	memberPassword,
	nonMemberEmail,
	nonMemberOrderNumber,
	memberEmailError,
	memberPasswordError,
	memberInvalidCredentials,
	nonMemberEmailError,
	nonMemberEmailHasError,
	nonMemberOrderError,
	onMemberEmailInput,
	onMemberPasswordInput,
	onNonMemberEmailInput,
	onNonMemberOrderInput,
	onSubmitClick,
	submitGuestVerification,
	resendGuestVerification,
	openForgotPasswordModal,
} = useLoginPageForm({
	skipMemberRedirect: props.skipMemberRedirect,
	allowNonMemberEmailOnly: props.hideNonMemberOrderNumber,
	onMemberLoginSuccess: () => emit('member-login-success'),
});

function handleForgotPasswordOpen() {
	if (props.forgotPasswordAsAction) {
		emit('open-forgot-password', memberEmail.value);
		return;
	}

	openForgotPasswordModal();
}
</script>

<template>
	<div class="auth-login-card-shell">
		<UiLoadingOverlay
			:visible="isPageLoginBusy"
			:label="isNonMember ? t('auth.login.checkOrder') : t('auth.login.signIn')"
			test-id="auth-login-check-order-loading-overlay"
			position="fixed"
		/>

		<div class="auth-login-card">
			<div v-if="props.showCloseButton" class="auth-login-card-close-wrap">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="sm"
					:no-hover="true"
					class="auth-login-card-close"
					aria-label="Close modal"
					@click="emit('close')"
				>
					<UiIcon
						name="regular-times"
						:size="24"
						color="#000000"
					/>
				</UiButton>
			</div>

			<div class="auth-login-intro">
				<AuthLoginHeader
					:register-as-action="props.registerAsAction"
					@open-register="emit('open-register')"
				/>

				<AuthLoginModeSwitch
					:member-type="memberType"
					@update:member-type="setMemberType"
				/>
			</div>

			<AuthLoginMemberForm
				v-if="!isNonMember"
				:show-password="showPassword"
				:keep-signed-in="keepSignedIn"
				:email="memberEmail"
				:password="memberPassword"
				:email-error="memberEmailError"
				:password-error="memberPasswordError"
				:password-invalid="memberInvalidCredentials"
				@toggle-password="togglePassword"
				@update:keep-signed-in="setKeepSignedIn"
				@update:email="onMemberEmailInput"
				@update:password="onMemberPasswordInput"
				@open-forgot-password="handleForgotPasswordOpen"
			/>

			<AuthLoginNonMemberForm
				v-else
				:email="nonMemberEmail"
				:order-number="nonMemberOrderNumber"
				:email-error="nonMemberEmailError"
				:email-has-error="nonMemberEmailHasError"
				:order-error="nonMemberOrderError"
				:hide-order-number="props.hideNonMemberOrderNumber"
				@update:email="onNonMemberEmailInput"
				@update:order-number="onNonMemberOrderInput"
			/>

			<UiButton
				variant="filled"
				tone="neutral"
				size="lg"
				class="auth-login-submit"
				:disabled="isPageLoginBusy"
				:data-testid="
					isNonMember
						? 'auth-login-submit-non-member-button'
						: 'auth-login-submit-member-button'
				"
				@click="onSubmitClick"
			>
				{{ submitLabel }}
			</UiButton>

			<AuthLoginSocialButtons v-if="!isNonMember" />
		</div>

		<AuthLoginForgotPasswordModal
			v-if="!props.forgotPasswordAsAction"
			v-model="isForgotPasswordModalOpen"
			:email="memberEmail"
			@return-to-login="isForgotPasswordModalOpen = false"
		/>
		<AuthLoginVerificationModal
			v-model="isVerificationModalOpen"
			:email="guestVerificationEmail"
			:order-number="guestVerificationOrderNumber"
			:token="guestVerificationToken"
			:code="guestVerificationCode"
			:error="guestVerificationError"
			:resend-limit-reached="resendLimitReached"
			:verifying="isGuestVerifying"
			:resend-cooldown-remaining="guestResendCooldownRemaining"
			@update:code="guestVerificationCode = $event"
			@verify="submitGuestVerification"
			@resend="resendGuestVerification"
		/>
	</div>
</template>

<style lang="scss">
.auth-login-card-shell {
	.auth-login-card {
		position: relative;
		background: var(--contrast-light);
		border: 1px solid var(--border-default);
		border-radius: 22px;
		box-shadow: 0 5px 14px rgba(0, 0, 0, 0.08);
		padding: 42px 54px 40px;
		width: 100%;
		max-width: 588px;
		display: flex;
		flex-direction: column;
		gap: 24px;

		.auth-login-card-close-wrap {
			position: absolute;
			top: 24px;
			right: 24px;
			z-index: 1;
		}

		.auth-login-card-close {
			width: 24px;
			height: 24px;
			padding: 0;
			min-height: auto;
			border-radius: 6px;
			box-shadow: none;
		}

		.auth-login-intro {
			display: flex;
			flex-direction: column;
			gap: 40px;
		}

		.auth-login-submit {
			width: 100%;
			border-radius: 16px;
			box-shadow: none;
			font-size: var(--type-size-200);
			line-height: var(--type-line-200);
		}
	}
}
</style>