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
    (e: 'update:orderNumber', value: string): void;
}>();
</script>

<template>
    <div class="auth-login-form" data-testid="auth-login-non-member-form">
        <div class="auth-login-inputs">
            <div class="auth-login-field">
                <div class="auth-login-label-row">
                    <label class="auth-login-label">{{ t('auth.login.email') }}</label>
                    <p v-if="emailError" class="auth-login-error">{{ emailError }}</p>
                </div>
                <UiInput
                    class="auth-login-input"
                    type="email"
                    size="lg"
                    :state="emailError ? 'error' : 'default'"
                    :placeholder="t('auth.login.enterEmail')"
                    :model-value="email"
                    data-testid="auth-login-non-member-email-input"
                    @update:model-value="emit('update:email', $event)"
                />
            </div>

            <div class="auth-login-field">
                <div class="auth-login-label-row">
                    <label class="auth-login-label">
                        {{ t('auth.login.orderNumber') }}
                    </label>
                    <p v-if="orderError" class="auth-login-error">{{ orderError }}</p>
                </div>
                <UiInput
                    class="auth-login-input"
                    type="text"
                    size="lg"
                    :state="orderError ? 'error' : 'default'"
                    :placeholder="t('auth.login.enterOrderNumber')"
                    :model-value="orderNumber"
                    data-testid="auth-login-non-member-order-number-input"
                    @update:model-value="emit('update:orderNumber', $event)"
                />
            </div>
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

            .auth-login-label-row {
                display: flex;
                align-items: baseline;
                justify-content: space-between;
                gap: 12px;

                .auth-login-label {
                    display: block;
                    margin: 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .auth-login-error {
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.2;
                    color: var(--error);
                }
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
