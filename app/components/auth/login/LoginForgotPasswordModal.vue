<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        email?: string;
    }>(),
    {
        email: '',
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const { t } = useI18n();

const resetEmail = ref('');
const error = ref('');
const sent = ref(false);

watch(
    () => props.modelValue,
    (open) => {
        if (!open) return;
        resetEmail.value = props.email ?? '';
        error.value = '';
        sent.value = false;
    },
    { immediate: true }
);

const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function closeModal() {
    emit('update:modelValue', false);
}

function submitReset() {
    const value = resetEmail.value.trim();
    error.value = '';

    if (!value) {
        error.value = t('auth.login.validation.fieldBlank');
        return;
    }

    if (!isValidEmail(value)) {
        error.value = t('auth.login.validation.emailInvalid');
        return;
    }

    sent.value = true;
}
</script>

<template>
    <UiModal
        :model-value="modelValue"
        width="504px"
        padding="40px"
        gap="24px"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <template #header>
            <div class="auth-forgot-header">
                <UiLogo
                    name="musticker"
                    variant="mark"
                    color="colored"
                    :size="40"
                    class="auth-forgot-logo"
                />
                <h3 class="auth-forgot-title">Forgot your password?</h3>
            </div>
        </template>

        <div class="auth-forgot-body">
            <p class="auth-forgot-description">
                Enter your user account's verified email address and we will
                send you a password reset link.
            </p>

            <label class="auth-forgot-label">{{ t('auth.login.email') }}</label>
            <input
                v-model="resetEmail"
                type="email"
                class="auth-forgot-input"
                :class="{ 'has-error': Boolean(error) }"
                :placeholder="t('auth.login.enterEmail')"
            />
            <p v-if="error" class="auth-forgot-error">{{ error }}</p>
            <p v-if="sent" class="auth-forgot-success">
                Password reset email sent. Please check your inbox.
            </p>

            <div class="auth-forgot-actions">
                <UiButton
                    variant="filled"
                    tone="neutral"
                    size="lg"
                    class="auth-forgot-submit"
                    @click="submitReset"
                >
                    Send Password Reset Email
                </UiButton>

                <button
                    type="button"
                    class="auth-forgot-return"
                    @click="closeModal"
                >
                    Return to Login
                </button>
            </div>
        </div>
    </UiModal>
</template>

<style scoped lang="scss">
.auth-forgot-header {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.auth-forgot-title {
    margin: 0;
    font-size: 32px;
    line-height: 48px;
    letter-spacing: -0.02em;
    color: var(--text-primary);
}

.auth-forgot-logo {
    width: 40px;
    height: 40px;
}

.auth-forgot-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.auth-forgot-description {
    margin: 0;
    font-size: 14px;
    line-height: 24px;
    color: var(--text-secondary);
}

.auth-forgot-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.auth-forgot-input {
    width: 100%;
    height: 48px;
    border: 1px solid var(--border-default);
    border-radius: 10px;
    background: var(--contrast-light);
    color: var(--text-primary);
    padding: 0 14px;
    font-size: 14px;
    outline: none;

    &:focus {
        border-color: var(--brand-primary);
        box-shadow: 0 0 0 2px
            color-mix(in srgb, var(--brand-primary) 20%, transparent);
    }

    &.has-error {
        border-color: var(--error);
    }
}

.auth-forgot-error {
    margin: 0;
    font-size: 13px;
    color: var(--error);
}

.auth-forgot-success {
    margin: 0;
    font-size: 13px;
    color: var(--success);
}

.auth-forgot-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.auth-forgot-submit {
    width: 100%;
    border-radius: 16px;
    box-shadow: none;
    font-size: 16px;
    line-height: 28px;
}

.auth-forgot-return {
    border: 0;
    background: transparent;
    width: fit-content;
    align-self: center;
    color: var(--text-secondary);
    font-size: 14px;
    text-decoration: none;
    cursor: pointer;

    &:hover {
        color: var(--text-primary);
    }
}

@media (max-width: 768px) {
    .auth-forgot-title {
        font-size: 32px;
        line-height: 48px;
    }
}
</style>
