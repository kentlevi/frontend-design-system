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
	member_type,
	keep_signed_in,
	show_password,
	is_non_member,
	setMemberType,
	togglePassword,
	setKeepSignedIn,
	submit_label,
	is_verification_modal_open,
	is_page_login_busy,
	guest_verification_email,
	guest_verification_order_number,
	guest_verification_token,
	guest_verification_code,
	guest_verification_error,
	resend_limit_reached,
	is_guest_verifying,
	guest_resend_cooldown_remaining,
	is_forgot_password_modal_open,
	member_email,
	member_password,
	non_member_email,
	non_member_order_number,
	member_email_error,
	member_password_error,
	member_invalid_credentials,
	non_member_email_error,
	non_member_email_has_error,
	non_member_order_error,
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
		emit('open-forgot-password', member_email.value);
		return;
	}

	openForgotPasswordModal();
}
</script>

<template>
	<div class="auth-login-card-shell">
		<UiLoadingOverlay
			:visible="is_page_login_busy"
			:label="is_non_member ? t('auth.login.checkOrder') : t('auth.login.signIn')"
			test-id="auth-login-check-order-loading-overlay"
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
					:member-type="member_type"
					@update:member-type="setMemberType"
				/>
			</div>

			<AuthLoginMemberForm
				v-if="!is_non_member"
				:show-password="show_password"
				:keep-signed-in="keep_signed_in"
				:email="member_email"
				:password="member_password"
				:email-error="member_email_error"
				:password-error="member_password_error"
				:password-invalid="member_invalid_credentials"
				@toggle-password="togglePassword"
				@update:keep-signed-in="setKeepSignedIn"
				@update:email="onMemberEmailInput"
				@update:password="onMemberPasswordInput"
				@open-forgot-password="handleForgotPasswordOpen"
			/>

			<AuthLoginNonMemberForm
				v-else
				:email="non_member_email"
				:order-number="non_member_order_number"
				:email-error="non_member_email_error"
				:email-has-error="non_member_email_has_error"
				:order-error="non_member_order_error"
				:hide-order-number="props.hideNonMemberOrderNumber"
				@update:email="onNonMemberEmailInput"
				@update:order-number="onNonMemberOrderInput"
			/>

			<UiButton
				variant="filled"
				tone="neutral"
				size="lg"
				class="auth-login-submit"
				:disabled="is_page_login_busy"
				:data-testid="
					is_non_member
						? 'auth-login-submit-non-member-button'
						: 'auth-login-submit-member-button'
				"
				@click="onSubmitClick"
			>
				{{ submit_label }}
			</UiButton>

			<AuthLoginSocialButtons v-if="!is_non_member" />
		</div>

		<AuthLoginForgotPasswordModal
			v-if="!props.forgotPasswordAsAction"
			v-model="is_forgot_password_modal_open"
			:email="member_email"
			@return-to-login="is_forgot_password_modal_open = false"
		/>
		<AuthLoginVerificationModal
			v-model="is_verification_modal_open"
			:email="guest_verification_email"
			:order-number="guest_verification_order_number"
			:token="guest_verification_token"
			:code="guest_verification_code"
			:error="guest_verification_error"
			:resend-limit-reached="resend_limit_reached"
			:verifying="is_guest_verifying"
			:resend-cooldown-remaining="guest_resend_cooldown_remaining"
			@update:code="guest_verification_code = $event"
			@verify="submitGuestVerification"
			@resend="resendGuestVerification"
		/>
	</div>
</template>

<style lang="scss">
.auth-login-card-shell {
	width: 100%;
	max-width: 588px;
	.auth-login-card {
		position: relative;
		background: var(--contrast-light);
		border: 1px solid var(--border-default);
		border-radius: 22px;
		box-shadow: 0 5px 14px rgba(0, 0, 0, 0.08);
		padding: 40px;
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