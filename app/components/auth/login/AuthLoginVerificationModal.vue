<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AuthVerificationModal from '@/components/auth/shared/AuthVerificationModal.vue';
import { authVerificationConfig } from '@/data/auth/verification';

const { t } = useI18n();

defineProps<{
	modelValue: boolean;
	email: string;
	orderNumber: string;
	token: string;
	code: string;
	error?: string;
	verifying?: boolean;
	resendCooldownRemaining?: number;
}>();

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
		:order-number="orderNumber"
		:code="code"
		:error="error"
		:verifying="verifying"
		:translation-base="authVerificationConfig.i18n.guest"
		:submit-label="t('auth.guestVerification.verify')"
		:busy-label="t('auth.verification.verifying')"
		:otp-length="authVerificationConfig.otpLength"
		:resend-cooldown-remaining="resendCooldownRemaining || 0"
		:show-close-button="true"
		align="center"
		modal-class="auth-login-verification-dialog"
		test-id-prefix="auth-login-verification"
		@update:model-value="emit('update:modelValue', $event)"
		@update:code="emit('update:code', $event)"
		@verify="emit('verify')"
		@resend="emit('resend')"
	>
		<template #icon>
			<img
				src="/illustrations/icon-verification.svg"
				:alt="t('auth.verification.iconAlt')"
				class="auth-login-verification-icon"
			>
		</template>
	</AuthVerificationModal>
</template>

<style scoped lang="scss">
.auth-login-verification-icon {
    width: 52px;
    height: 52px;
    object-fit: contain;
    display: block;
}

@media (max-width: 900px) {
    .auth-login-verification-icon {
        width: 46px;
        height: 46px;
    }
}
</style>
