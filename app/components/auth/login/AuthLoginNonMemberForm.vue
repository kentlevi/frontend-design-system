<script setup lang="ts">
const { t } = useI18n();

defineProps<{
    email: string;
    orderNumber: string;
    emailError?: string;
    orderError?: string;
}>();

const emit = defineEmits<{
    (e: 'update:email', value: string): void;
    (e: 'update:order-number', value: string): void;
}>();
</script>

<template>
    <div class="auth-login-form" data-testid="auth-login-non-member-form">
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
                        type="email"
                        size="md"
                        :state="emailError ? 'error' : 'default'"
                        :aria-invalid="emailError ? 'true' : 'false'"
                        :aria-describedby="describedBy || undefined"
                        :placeholder="t('auth.login.enterEmail')"
                        :model-value="email"
                        data-testid="auth-login-non-member-email-input"
                        @update:model-value="emit('update:email', $event)"
                    />
                </template>
            </UiFormField>

            <UiFormField
                class="auth-login-field"
                :label="t('auth.login.orderNumber')"
                :error="orderError"
                :required="true"
            >
                <template #default="{ inputId, describedBy }">
                    <UiInput
                        :id="inputId"
                        class="auth-login-input"
                        type="text"
                        size="md"
                        :state="orderError ? 'error' : 'default'"
                        :aria-invalid="orderError ? 'true' : 'false'"
                        :aria-describedby="describedBy || undefined"
                        :placeholder="t('auth.login.enterOrderNumber')"
                        :model-value="orderNumber"
                        data-testid="auth-login-non-member-order-number-input"
                        @update:model-value="emit('update:order-number', $event)"
                    />
                </template>
            </UiFormField>
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
