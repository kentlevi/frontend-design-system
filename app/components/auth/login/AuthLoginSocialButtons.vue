<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
    <div class="auth-login-social-stack" data-testid="auth-login-social-stack">
        <div class="auth-login-divider">
            <span class="auth-login-social-label">{{ t('auth.login.socialLabel') }}</span>
        </div>

        <div class="auth-login-social-buttons">
            <UiButton
                variant="outline"
                tone="neutral"
                size="lg"
                class="auth-login-social"
                data-testid="auth-login-social-facebook"
            >
                <span class="auth-login-social-content">
                    <UiSocialIcon name="facebook" :size="24" variant="colored" />
                    <span class="auth-login-social-text">{{ t('auth.login.signInFacebook') }}</span>
                </span>
            </UiButton>

            <UiButton
                variant="outline"
                tone="neutral"
                size="lg"
                class="auth-login-social"
                data-testid="auth-login-social-google"
            >
                <span class="auth-login-social-content">
                    <UiSocialIcon name="google" :size="24" variant="colored" />
                    <span class="auth-login-social-text">{{ t('auth.login.signInGoogle') }}</span>
                </span>
            </UiButton>
        </div>
    </div>
</template>

<style lang="scss">
.auth-login-social-stack {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .auth-login-divider {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--text-muted);
        font-size: 13px;

        .auth-login-social-label {
            padding: 0 40px;
        }

        &::before,
        &::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--border-default);
        }
    }

    .auth-login-social-buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .auth-login-social {
            width: 100%;
            border-radius: 16px;
            color: var(--text-primary);
            font-size: 14px;
            font-weight: 600;
            line-height: 1;
            box-shadow: none;
            display: flex;
            align-items: center;
            justify-content: center;

            :deep(.ui-button-label) {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
            }

            .auth-login-social-content {
                display: flex;
                height: 100%;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .auth-login-social-text {
                display: inline-flex;
                align-items: center;
                line-height: 1;
            }
        }
    }
}
</style>
