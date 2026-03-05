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
		:busy-label="t('auth.guestVerification.verifying')"
		:otp-length="authVerificationConfig.otpLength"
		:resend-cooldown-remaining="resendCooldownRemaining || 0"
		test-id-prefix="auth-login-verification"
		@update:model-value="emit('update:modelValue', $event)"
		@update:code="emit('update:code', $event)"
		@verify="emit('verify')"
		@resend="emit('resend')"
	>
		<template #icon>
			<UiIcon name="strong-shield" :size="46" color="var(--brand-primary)" />
		</template>
	</AuthVerificationModal>
</template>
