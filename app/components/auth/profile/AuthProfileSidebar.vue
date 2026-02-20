<script setup lang="ts">
withDefaults(
    defineProps<{
        step: 1 | 2;
    }>(),
    {
        step: 1,
    }
);
</script>

<template>
    <aside class="auth-profile-sidebar" data-testid="auth-profile-sidebar">
        <UiLogo
            name="musticker"
            variant="full"
            color="colored"
            :size="54"
        />

        <div class="auth-profile-sidebar-head">
            {{ $t('auth.profile.sidebar.title') }}
        </div>

        <div class="auth-profile-steps" data-testid="auth-profile-steps">
            <div
                class="auth-profile-step"
                :class="{ 'is-active': step === 1 }"
                data-testid="auth-profile-step-1"
            >
                <span class="auth-profile-step-icon">
                    <UiIcon
                        :name="step === 1 ? 'strong-user-plus' : 'strong-check'"
                        :size="18"
                    />
                </span>
                <div>
                    <p class="auth-profile-step-title">
                        {{ $t('auth.profile.sidebar.profile.title') }}
                    </p>
                    <p class="auth-profile-step-text">
                        {{ $t('auth.profile.sidebar.profile.text') }}
                    </p>
                </div>
            </div>

            <div
                class="auth-profile-step"
                :class="{ 'is-active': step === 2 }"
                data-testid="auth-profile-step-2"
            >
                <span class="auth-profile-step-icon">
                    <UiIcon name="strong-cog" :size="18" />
                </span>
                <div>
                    <p class="auth-profile-step-title">
                        {{ $t('auth.profile.sidebar.settings.title') }}
                    </p>
                    <p class="auth-profile-step-text">
                        {{ $t('auth.profile.sidebar.settings.text') }}
                    </p>
                </div>
            </div>
        </div>

        <div class="auth-profile-progress" data-testid="auth-profile-progress">
            <span :class="{ 'is-on': step === 1 }" />
            <span :class="{ 'is-on': step === 2 }" />
        </div>
    </aside>
</template>

<style lang="scss">
.auth-profile-sidebar {
    background: var(--surface-subtle);
    border-radius: 16px;
    padding: 44px 50px;
    display: flex;
    flex-direction: column;
    gap: 42px;
    min-height: 850px;

    .auth-profile-sidebar-head {
        font-size: 32px;
        line-height: 1.15;
        font-weight: 700;
        color: var(--text-primary);
    }

    .auth-profile-steps {
        display: flex;
        flex-direction: column;
        gap: 30px;

        .auth-profile-step {
            display: grid;
            grid-template-columns: 42px 1fr;
            gap: 14px;
            opacity: 0.4;

            &.is-active {
                opacity: 1;
            }

            .auth-profile-step-icon {
                width: 36px;
                height: 36px;
                border: 1px solid var(--border-default);
                border-radius: 8px;
                display: grid;
                place-items: center;
                color: var(--text-primary);
                background: var(--contrast-light);
            }

            .auth-profile-step-title {
                margin: 0;
                font-size: 18px;
                line-height: 1.3;
                font-weight: 700;
                color: var(--text-primary);
            }

            .auth-profile-step-text {
                margin: 8px 0 0;
                color: var(--text-secondary);
                font-size: 14px;
                line-height: 1.5;
            }
        }
    }

    .auth-profile-progress {
        margin-top: auto;
        display: flex;
        justify-content: center;
        gap: 10px;

        span {
            width: 72px;
            height: 10px;
            border-radius: 999px;
            background: var(--border-default);

            &.is-on {
                background: var(--text-primary);
            }
        }
    }
}

@media (max-width: 1180px) {
    .auth-profile-sidebar {
        min-height: auto;
        padding: 28px 22px;
    }
}
</style>
