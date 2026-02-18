<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
    <div class="auth-login-header">
        <h1 class="auth-login-title">{{ t('auth.login.title') }}</h1>
        <p class="auth-login-subtitle">
            {{ t('auth.login.subtitle') }}
            <NuxtLink :to="localePath('/auth/register')">
                {{ t('auth.login.createAccount') }}
            </NuxtLink>
        </p>
    </div>
</template>