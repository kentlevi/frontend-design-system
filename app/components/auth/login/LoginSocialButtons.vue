<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
    <div class="auth-login-divider">
        <span>{{ t('auth.login.socialLabel') }}</span>
    </div>

    <button type="button" class="auth-login-social">
        <UiSocialIcon name="facebook" :size="18" variant="colored" />
        <span>{{ t('auth.login.signInFacebook') }}</span>
    </button>

    <button type="button" class="auth-login-social">
        <UiSocialIcon name="google" :size="18" variant="colored" />
        <span>{{ t('auth.login.signInGoogle') }}</span>
    </button>
</template>
