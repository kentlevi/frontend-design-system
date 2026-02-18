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
    <div class="auth-login-form">
        <div class="auth-login-inputs">
            <div class="auth-login-field">
                <div class="auth-login-label-row">
                    <label class="auth-login-label">{{ t('auth.login.email') }}</label>
                    <p v-if="emailError" class="auth-login-error">{{ emailError }}</p>
                </div>
                <input
                    type="email"
                    class="auth-login-input"
                    :class="{ 'has-error': Boolean(emailError) }"
                    :placeholder="t('auth.login.enterEmail')"
                    :value="email"
                    @input="
                        emit('update:email', ($event.target as HTMLInputElement).value)
                    "
                />
            </div>

            <div class="auth-login-field">
                <div class="auth-login-label-row">
                    <label class="auth-login-label">
                        {{ t('auth.login.orderNumber') }}
                    </label>
                    <p v-if="orderError" class="auth-login-error">{{ orderError }}</p>
                </div>
                <input
                    type="text"
                    class="auth-login-input"
                    :class="{ 'has-error': Boolean(orderError) }"
                    :placeholder="t('auth.login.enterOrderNumber')"
                    :value="orderNumber"
                    @input="
                        emit(
                            'update:orderNumber',
                            ($event.target as HTMLInputElement).value
                        )
                    "
                />
            </div>
        </div>
    </div>
</template>
