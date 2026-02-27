<script setup lang="ts">
import { authVerificationConfig } from '@/data/auth/verification';

const { t } = useI18n();

withDefaults(
    defineProps<{
        modelValue: boolean;
        email: string;
        code: string;
        error?: string;
        verifying?: boolean;
    }>(),
    {
        error: '',
        verifying: false,
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
        :verifying="verifying"
        :translation-base="authVerificationConfig.i18n.register"
        :submit-label="t('auth.verification.verifyEmailAddress')"
        :busy-label="t('auth.verification.verifying')"
        :otp-length="authVerificationConfig.otpLength"
        :show-close-button="true"
        align="center"
        modal-class="auth-register-verification-dialog"
        test-id-prefix="auth-register-verification"
        @update:model-value="emit('update:modelValue', $event)"
        @update:code="emit('update:code', $event)"
        @verify="emit('verify')"
        @resend="emit('resend')"
    >
        <template #icon>
            <img
                src="/illustrations/icon-verification.svg"
                :alt="t('auth.verification.iconAlt')"
                class="auth-register-verification-icon"
            >
        </template>
    </AuthVerificationModal>
</template>

<style scoped lang="scss">
.auth-register-verification-icon {
    width: 52px;
    height: 52px;
    object-fit: contain;
    display: block;
}

@media (max-width: 900px) {
    .auth-register-verification-icon {
        width: 46px;
        height: 46px;
    }
}
</style>
