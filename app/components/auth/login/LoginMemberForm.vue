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
        @input="emit('update:email', ($event.target as HTMLInputElement).value)"
    />

    <div class="auth-login-label-row">
        <label class="auth-login-label">
            {{ t('auth.login.password') }}
        </label>
    </div>
    <div class="auth-login-password-wrap">
        <input
            :type="showPassword ? 'text' : 'password'"
            class="auth-login-input"
            :class="{ 'has-error': Boolean(passwordError) }"
            :placeholder="t('auth.login.enterPassword')"
            :value="password"
            @input="
                emit(
                    'update:password',
                    ($event.target as HTMLInputElement).value
                )
            "
        />
        <button
            type="button"
            class="auth-login-password-toggle"
            :aria-label="t('auth.login.togglePassword')"
            @click="emit('togglePassword')"
        >
            <UiIcon
                :name="showPassword ? 'regular-eye' : 'regular-eye-slash'"
                :size="18"
                color="#6f7480"
            />
        </button>
    </div>

    <div class="auth-login-inline">
        <label class="auth-login-checkbox">
            <input
                :checked="keepSignedIn"
                type="checkbox"
                @change="
                    emit(
                        'update:keepSignedIn',
                        ($event.target as HTMLInputElement).checked
                    )
                "
            />
            <span>{{ t('auth.login.keepSignedIn') }}</span>
        </label>

        <button
            type="button"
            class="auth-login-link-button"
            @click="emit('openForgotPassword')"
        >
            {{ t('auth.login.forgotPassword') }}
        </button>
    </div>
</template>
