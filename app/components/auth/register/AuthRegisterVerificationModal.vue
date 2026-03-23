<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AuthVerificationModal from '@/components/auth/shared/AuthVerificationModal.vue';
import { authVerificationConfig } from '@/data/auth/verification';

const { t } = useI18n();

withDefaults(
	defineProps<{
		modelValue: boolean;
		email: string;
		code: string;
		error?: string;
		resendLimitReached?: string;
		verifying?: boolean;
		resendCooldownRemaining?: number;
	}>(),
	{
		error: '',
		resendLimitReached: '',
		verifying: false,
		resendCooldownRemaining: 0,
	}
);

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'update:code', value: string): void;
	(e: 'verify'): void;
	(e: 'resend'): void;
}>();
</script>

<template>
	<AuthVerificationModal
		:model-value="modelValue"
		:email="email"
		:code="code"
		:error="error"
		:resend-limit-reached="resendLimitReached"
		:verifying="verifying"
		:translation-base="authVerificationConfig.i18n.register"
		:submit-label="t('auth.verification.verifyEmailAddress')"
		:busy-label="t('auth.verification.verifying')"
		:otp-length="authVerificationConfig.otpLength"
		:resend-cooldown-remaining="resendCooldownRemaining"
		:show-close-button="true"
		align="center"
		modal-class="auth-register-verification-dialog"
		test-id-prefix="auth-register-verification"
		@update:model-value="emit('update:modelValue', $event)"
		@update:code="emit('update:code', $event)"
		@verify="emit('verify')"
		@resend="emit('resend')"
	/>
</template>

<style scoped lang="scss">
</style>