<script setup lang="ts">
import AuthLoginForgotPasswordModal from '@/components/auth/login/AuthLoginForgotPasswordModal.vue'
import AuthLoginHeader from '@/components/auth/login/AuthLoginHeader.vue'
import AuthLoginMemberForm from '@/components/auth/login/AuthLoginMemberForm.vue'
import AuthLoginModeSwitch from '@/components/auth/login/AuthLoginModeSwitch.vue'
import AuthLoginNonMemberForm from '@/components/auth/login/AuthLoginNonMemberForm.vue'
import AuthLoginSocialButtons from '@/components/auth/login/AuthLoginSocialButtons.vue'
import AuthLoginVerificationModal from '@/components/auth/login/AuthLoginVerificationModal.vue'
import { useAuthLoginCard } from '@/composables/auth/login/useAuthLoginCard'

const { t: translate } = useI18n();

withDefaults(defineProps<{
	googleLabelKey?: string;
}>(), {
	googleLabelKey: 'auth.login.signInGoogle',
});

const {
	member_type,
	is_non_member,
	show_close_button,
	register_as_action,
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
	setMemberType,
	submitLogin,
	submitGuestVerification,
	resendGuestVerification,
	setForgotPasswordModalOpen,
	handleVerificationModalChange,
	setGuestVerificationCode,
	handleClose,
	openRegister,
} = useAuthLoginCard()
</script>

<template>
	<div class="auth-login-card-shell">
		<div class="auth-login-card">
			<div v-if="show_close_button" class="auth-login-card-close-wrap">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="sm"
					:no-hover="true"
					class="auth-login-card-close"
					:aria-label="translate('auth.login.closeModal')"
					@click="handleClose"
				>
					<UiIcon name="regular-times" :size="24" color="#000000" />
				</UiButton>
			</div>

			<div class="auth-login-intro">
				<AuthLoginHeader
					:register-as-action="register_as_action"
					@open-register="openRegister"
				/>

				<AuthLoginModeSwitch
					:member-type="member_type"
					@update:member-type="setMemberType"
				/>
			</div>

			<AuthLoginMemberForm v-if="!is_non_member" />

			<AuthLoginNonMemberForm v-else />

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
				@click="submitLogin"
			>
				{{ submit_label }}
			</UiButton>

			<AuthLoginSocialButtons
				v-if="!is_non_member"
				:google-label-key="googleLabelKey"
			/>
		</div>

		<AuthLoginForgotPasswordModal
			v-if="!register_as_action"
			:model-value="is_forgot_password_modal_open"
			:email="member_email"
			@update:model-value="setForgotPasswordModalOpen"
			@return-to-login="setForgotPasswordModalOpen(false)"
		/>
		<AuthLoginVerificationModal
			:model-value="is_verification_modal_open"
			:email="guest_verification_email"
			:order-number="guest_verification_order_number"
			:token="guest_verification_token"
			:code="guest_verification_code"
			:error="guest_verification_error"
			:resend-limit-reached="resend_limit_reached"
			:verifying="is_guest_verifying"
			:resend-cooldown-remaining="guest_resend_cooldown_remaining"
			@update:model-value="handleVerificationModalChange"
			@update:code="setGuestVerificationCode"
			@verify="submitGuestVerification"
			@resend="resendGuestVerification"
		/>
	</div>
</template>

<style lang="scss">
.auth-login-card-shell {
	.auth-login-card {
		.auth-login-intro {
			display: flex;
			flex-direction: column;
			gap: 40px;
		}
	}
}
</style>