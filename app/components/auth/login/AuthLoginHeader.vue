<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
    <div class="auth-login-header" data-testid="auth-login-header">
        <h1 class="auth-login-title">{{ t('auth.login.title') }}</h1>
        <p class="auth-login-subtitle">
            {{ t('auth.login.subtitle') }}
            <NuxtLink
                :to="localePath('/auth/register')"
                class="auth-login-create-account-link"
                data-testid="auth-login-create-account-link"
            >
                {{ t('auth.login.createAccount') }}
            </NuxtLink>
        </p>
    </div>
</template>

<style lang="scss">
.auth-login-header {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .auth-login-title {
        margin: 0;
        text-align: center;
        color: var(--text-primary);
        font-size: 28px;
        line-height: 40px;
    }

    .auth-login-subtitle {
        margin: 0;
        text-align: center;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 24px;

        .auth-login-create-account-link {
            color: var(--text-primary);
            font-weight: 700;
            text-decoration: underline;
        }
    }
}
</style>
