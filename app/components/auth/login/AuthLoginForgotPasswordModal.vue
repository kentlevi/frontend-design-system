<script setup lang="ts">
import { computed, ref, watch } from 'vue';

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
const api = useApi();
const route = useRoute();
const country = computed(() =>
    String(route.params.country || 'en').toLowerCase()
);
const apiCountry = computed(() =>
    country.value === 'en' ? 'ph' : country.value
);

const resetEmail = ref('');
const error = ref('');
const sent = ref(false);
const loading = ref(false);

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

async function submitReset() {
    const value = resetEmail.value.trim();
    error.value = '';
    sent.value = false;

    if (!value) {
        error.value = t('auth.login.validation.fieldBlank');
        return;
    }

    if (!isValidEmail(value)) {
        error.value = t('auth.login.validation.emailInvalid');
        return;
    }

    loading.value = true;

    try {
        const response = await api<{ success: boolean; message: string }>(
            `/${apiCountry.value}/auth/password/reset-link`,
            {
                method: 'POST',
                body: {
                    email: value,
                },
            }
        );

        if (!response?.success) {
            error.value = response?.message || t('auth.login.forgot.requestFailed');
            return;
        }

        sent.value = true;
    } catch (err: any) {
        error.value =
            err?.data?.message || err?.message || t('auth.login.forgot.requestFailed');
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <UiModal
        :model-value="modelValue"
        align="center"
        width="504px"
        padding="40px"
        gap="24px"
        data-testid="auth-login-forgot-password-modal"
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
                <h3 class="auth-forgot-title">
                    {{ sent ? t('auth.login.forgot.checkEmailTitle') : t('auth.login.forgot.title') }}
                </h3>
            </div>
        </template>

        <div class="auth-forgot-body">
            <template v-if="!sent">
                <p class="auth-forgot-description">
                    {{ t('auth.login.forgot.description') }}
                </p>

                <UiFormField
                    class="auth-forgot-field"
                    :label="t('auth.login.email')"
                    :error="error"
                    :required="true"
                >
                    <template #default="{ inputId, describedBy }">
                        <UiInput
                            :id="inputId"
                            class="auth-forgot-input"
                            type="email"
                            size="md"
                            :model-value="resetEmail"
                            :state="error ? 'error' : 'default'"
                            :aria-invalid="error ? 'true' : 'false'"
                            :aria-describedby="describedBy || undefined"
                            :placeholder="t('auth.login.enterEmail')"
                            data-testid="auth-login-forgot-password-email-input"
                            @update:model-value="resetEmail = $event"
                        />
                    </template>
                </UiFormField>

                <div class="auth-forgot-actions">
                    <UiButton
                        variant="filled"
                        tone="neutral"
                        size="lg"
                        class="auth-forgot-submit"
                        data-testid="auth-login-forgot-password-submit-button"
                        :disabled="loading"
                        @click="submitReset"
                    >
                        {{ loading ? t('auth.login.forgot.sending') : t('auth.login.forgot.sendResetEmail') }}
                    </UiButton>

                    <UiButton
                        variant="ghost"
                        tone="neutral"
                        size="sm"
                        class="auth-forgot-return"
                        data-testid="auth-login-forgot-password-return-button"
                        @click="closeModal"
                    >
                        {{ t('auth.login.forgot.returnToLogin') }}
                    </UiButton>
                </div>
            </template>

            <template v-else>
                <p class="auth-forgot-description">
                    {{ t('auth.login.forgot.checkEmailDescription') }}
                </p>

                <div class="auth-forgot-actions auth-forgot-actions-success">
                    <UiButton
                        variant="filled"
                        tone="neutral"
                        size="md"
                        class="auth-forgot-submit"
                        data-testid="auth-login-forgot-password-return-button"
                        @click="closeModal"
                    >
                        {{ t('auth.login.forgot.returnToLogin') }}
                    </UiButton>
                </div>
            </template>
        </div>
    </UiModal>
</template>

<style scoped lang="scss">
.auth-forgot-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;

    .auth-forgot-logo {
        flex: 0 0 auto;
    }

    .auth-forgot-title {
        margin: 0;
        font-size: 32px;
        line-height: 48px;
        letter-spacing: -0.02em;
        color: var(--text-primary);
    }
}

.auth-forgot-body {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .auth-forgot-description {
        margin: 0;
        font-size: 14px;
        line-height: 24px;
        color: var(--text-secondary);
    }

    .auth-forgot-field {
        :deep(.ui-form-field-label) {
            font-size: 14px;
            font-weight: 600;
            line-height: 24px;
            color: var(--text-primary);
        }

        :deep(.ui-form-field-error) {
            margin: 0;
            font-size: 14px;
            line-height: 24px;
            font-weight: 600;
            color: var(--error);
        }
    }

    .auth-forgot-input {
        width: 100%;
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

        .auth-forgot-submit {
            width: 100%;
            border-radius: 16px;
            box-shadow: none;
            font-size: 16px;
            line-height: 28px;
        }

        .auth-forgot-return {
            --btn-soft: transparent;
            --btn-border: transparent;
            --btn-bg: var(--text-secondary);

            width: fit-content;
            align-self: center;
            color: var(--text-secondary);
            font-size: 14px;
            background: transparent;
            border-color: transparent;
            border-radius: 0;
            padding: 0;
            min-height: auto;
            height: auto;
            box-shadow: none;

            &:hover {
                background: transparent;
                filter: none;
                color: var(--text-primary);
            }

            :deep(.ui-button-label) {
                padding: 0;
            }
        }
    }

    .auth-forgot-actions-success {
        margin-top: 8px;
    }
}

@media (max-width: 768px) {
    .auth-forgot-header {
        .auth-forgot-title {
            font-size: 32px;
            line-height: 48px;
        }
    }
}
</style>


