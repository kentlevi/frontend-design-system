<script setup lang="ts">
const { t } = useI18n();

defineProps<{
    showPassword: boolean;
    keepSignedIn: boolean;
    email: string;
    password: string;
    emailError?: string;
    passwordError?: string;
}>();

const emit = defineEmits<{
    (e: 'togglePassword'): void;
    (e: 'update:keepSignedIn', value: boolean): void;
    (e: 'update:email', value: string): void;
    (e: 'update:password', value: string): void;
    (e: 'openForgotPassword'): void;
}>();
</script>

<template>
    <div class="auth-login-form" data-testid="auth-login-member-form">
        <div class="auth-login-inputs">
            <UiFormField
                class="auth-login-field"
                :label="t('auth.login.email')"
                :error="emailError"
                :required="true"
            >
                <template #default="{ inputId, describedBy }">
                    <UiInput
                        :id="inputId"
                        class="auth-login-input"
                        size="md"
                        :state="emailError ? 'error' : 'default'"
                        :aria-invalid="emailError ? 'true' : 'false'"
                        :aria-describedby="describedBy || undefined"
                        :placeholder="t('auth.login.enterEmail')"
                        :model-value="email"
                        data-testid="auth-login-member-email-input"
                        @update:model-value="emit('update:email', $event)"
                    />
                </template>
            </UiFormField>

            <UiFormField
                class="auth-login-field"
                :label="t('auth.login.password')"
                :error="passwordError"
                :required="true"
            >
                <template #default="{ inputId, describedBy }">
                    <div class="auth-login-password-wrap">
                        <UiInput
                            :id="inputId"
                            class="auth-login-input"
                            size="md"
                            :state="passwordError ? 'error' : 'default'"
                            :aria-invalid="passwordError ? 'true' : 'false'"
                            :aria-describedby="describedBy || undefined"
                            :placeholder="t('auth.login.enterPassword')"
                            :type="showPassword ? 'text' : 'password'"
                            :model-value="password"
                            data-testid="auth-login-member-password-input"
                            @update:model-value="emit('update:password', $event)"
                        >
                            <template #icon-right>
                                <button
                                    type="button"
                                    class="auth-login-password-toggle"
                                    :aria-label="t('auth.login.togglePassword')"
                                    data-testid="auth-login-member-password-toggle-button"
                                    @click="emit('togglePassword')"
                                >
                                    <UiIcon
                                        :name="showPassword ? 'regular-eye' : 'regular-eye-slash'"
                                        :size="24"
                                        color="var(--gray-90)"
                                    />
                                </button>
                            </template>
                        </UiInput>
                    </div>
                </template>
            </UiFormField>
        </div>

        <div class="auth-login-inline">
            <UiCheckbox
                class="auth-login-checkbox-control"
                :model-value="keepSignedIn"
                data-testid="auth-login-member-keep-signed-in"
                @update:model-value="emit('update:keepSignedIn', $event)"
            >
                <span class="auth-login-checkbox-text">{{ t('auth.login.keepSignedIn') }}</span>
            </UiCheckbox>

            <UiButton
                variant="ghost"
                tone="neutral"
                size="sm"
                class="auth-login-link-button"
                data-testid="auth-login-member-forgot-password-button"
                @click="emit('openForgotPassword')"
            >
                {{ t('auth.login.forgotPassword') }}
            </UiButton>
        </div>
    </div>
</template>

<style lang="scss">
.auth-login-form {
    display: flex;
    flex-direction: column;
    gap: 8px;

        .auth-login-inputs {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .auth-login-field {
                display: flex;
                flex-direction: column;
                gap: 8px;

                :deep(.ui-form-field-label) {
                    display: block;
                    margin: 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                :deep(.ui-form-field-error) {
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.2;
                    color: var(--error);
                }

            .auth-login-input {
                width: 100%;
            }

            .auth-login-password-wrap {
                position: relative;

                .auth-login-password-toggle {
                    border: 0;
                    background: transparent;
                    display: grid;
                    place-items: center;
                }
            }
        }
    }

    .auth-login-inline {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;

        .auth-login-checkbox-control {
            color: var(--text-secondary);
        }

        .auth-login-checkbox-text {
            line-height: 1.2;
        }

        .auth-login-link-button {
            --btn-soft: transparent;
            --btn-border: transparent;
            --btn-bg: var(--text-primary);

            color: var(--text-primary);
            font-weight: 600;
            background: transparent;
            border-color: transparent;
            border-radius: 0;
            padding: 0;
            min-height: auto;
            height: auto;
            box-shadow: none;

            &:hover,
            &:active {
                background: transparent;
                filter: none;
            }

            :deep(.ui-button-label) {
                padding: 0;
            }
        }
    }

    @media (max-width: 1100px) {
        .auth-login-inputs {
            .auth-login-field {
                .auth-login-label-row {
                    .auth-login-error {
                        font-size: 13px;
                    }
                }
            }
        }
    }
}
</style>
