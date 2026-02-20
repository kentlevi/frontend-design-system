<script setup lang="ts">
const { t } = useI18n();

const props = withDefaults(
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
}>();

function onCodeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/\D/g, '').slice(0, 6);
    emit('update:code', cleaned);
}
</script>

<template>
    <UiModal
        :model-value="modelValue"
        width="560px"
        data-testid="auth-register-verification-modal"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <template #header>
            <span class="auth-register-verification-hidden-title">
                {{ t('auth.login.verification.title') }}
            </span>
        </template>

        <div class="auth-register-verification-modal">
            <h3 class="auth-register-verification-title">
                {{ t('auth.login.verification.title') }}
            </h3>

            <p class="auth-register-verification-copy">
                {{ t('auth.login.verification.messagePrefix') }}
                <strong class="auth-register-verification-email">{{ props.email }}</strong>
                {{ t('auth.login.verification.messageSuffix') }}
            </p>

            <label
                class="auth-register-verification-label"
                for="auth-register-verification-input"
            >
                {{ t('auth.login.verification.enterCode') }}
            </label>
            <input
                id="auth-register-verification-input"
                class="auth-register-verification-input"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                :value="props.code"
                data-testid="auth-register-verification-code-input"
                @input="onCodeInput"
            />

            <p v-if="props.error" class="auth-register-verification-error">
                {{ props.error }}
            </p>

            <UiButton
                variant="filled"
                tone="neutral"
                size="lg"
                class="auth-register-verification-submit"
                :disabled="props.verifying || props.code.length === 0"
                :loading="props.verifying"
                data-testid="auth-register-verification-submit-button"
                @click="emit('verify')"
            >
                {{ t('auth.login.verification.verify') }}
            </UiButton>
        </div>
    </UiModal>
</template>

<style scoped lang="scss">
.auth-register-verification-hidden-title {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    clip-path: inset(50%);
}

.auth-register-verification-modal {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 4px 0 8px;

    .auth-register-verification-title {
        margin: 0;
        color: var(--text-primary);
        font-size: 28px;
        line-height: 1.2;
    }

    .auth-register-verification-copy {
        margin: 0;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 1.6;

        .auth-register-verification-email {
            color: var(--text-primary);
        }
    }

    .auth-register-verification-label {
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 600;
    }

    .auth-register-verification-input {
        height: 48px;
        border: 1px solid var(--border-default);
        border-radius: 10px;
        padding: 0 14px;
        color: var(--text-primary);
        font-size: 16px;
    }

    .auth-register-verification-error {
        margin: 0;
        color: var(--error);
        font-size: 13px;
        line-height: 1.2;
    }

    .auth-register-verification-submit {
        width: 100%;
        border-radius: 14px;
        box-shadow: none;
    }
}
</style>
