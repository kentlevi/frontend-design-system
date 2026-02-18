<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
    <div class="auth-login-social-stack">
        <div class="auth-login-divider">
            <span>{{ t('auth.login.socialLabel') }}</span>
        </div>

        <div class="auth-login-social-buttons">
            <button type="button" class="auth-login-social">
                <UiSocialIcon name="facebook" :size="24" variant="colored" />
                <span>{{ t('auth.login.signInFacebook') }}</span>
            </button>

            <button type="button" class="auth-login-social">
                <UiSocialIcon name="google" :size="24" variant="colored" />
                <span>{{ t('auth.login.signInGoogle') }}</span>
            </button>
        </div>
    </div>
</template>
