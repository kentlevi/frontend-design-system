<script setup lang="ts">
withDefaults(
	defineProps<{
		step?: 1 | 2;
	}>(),
	{
		step: 1,
	}
);
</script>

<template>
	<aside class="auth-profile-sidebar" data-testid="auth-profile-sidebar">
		<div class="auth-profile-sidebar-main">
			<UiLogo class="auth-profile-sidebar-logo" name="musticker" variant="full" color="colored" :size="58" />

			<div class="auth-profile-sidebar-content">
				<div class="auth-profile-sidebar-head">
					{{ $t('auth.profile.sidebar.title') }}
				</div>

				<div class="auth-profile-steps" data-testid="auth-profile-steps">
					<div
						class="auth-profile-step"
						:class="{ 'is-active': step === 1, 'is-complete': step === 2 }"
						data-testid="auth-profile-step-1"
					>
						<span class="auth-profile-step-icon">
							<UiIcon :name="step === 2 ? 'regular-check' : 'regular-user-plus'" :size="24" />
						</span>
						<div class="auth-profile-step-body">
							<p class="auth-profile-step-title">
								{{ $t('auth.profile.sidebar.profile.title') }}
							</p>
							<p class="auth-profile-step-text">
								{{ $t('auth.profile.sidebar.profile.text') }}
							</p>
						</div>
					</div>

					<div
						class="auth-profile-step" :class="{ 'is-active': step === 2 }"
						data-testid="auth-profile-step-2">
						<span class="auth-profile-step-icon">
							<UiIcon name="regular-cogs" :size="24" />
						</span>
						<div class="auth-profile-step-body">
							<p class="auth-profile-step-title">
								{{ $t('auth.profile.sidebar.settings.title') }}
							</p>
							<p class="auth-profile-step-text">
								{{ $t('auth.profile.sidebar.settings.text') }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="auth-profile-progress" data-testid="auth-profile-progress">
			<span class="auth-profile-progress-item" :class="{ 'is-on': step === 1 }" />
			<span class="auth-profile-progress-item" :class="{ 'is-on': step === 2 }" />
		</div>
	</aside>
</template>

<style lang="scss">
.auth-profile-sidebar {
    background: var(--gray-10);
    border-radius: 16px;
    padding: 44px 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 850px;
    max-width: 384px;

    .auth-profile-sidebar-main {
        display: flex;
        flex-direction: column;
        gap: 80px;

        .ui-logo.auth-profile-sidebar-logo {
            align-self: flex-start;
        }

        .auth-profile-sidebar-content {
            display: flex;
            flex-direction: column;
            gap: 32px;

            .auth-profile-sidebar-head {
                font-size: var(--type-size-200);
                font-weight: var(--font-weight-bold);
                line-height: var(--type-line-200);
                color: var(--text-primary);
            }

            .auth-profile-steps {
                display: flex;
                flex-direction: column;
                gap: 40px;

                .auth-profile-step {
                    display: grid;
                    grid-template-columns: 40px 1fr;
                    gap: 24px;

                    &.is-complete {
                        .auth-profile-step-icon {
                            border-color: var(--success);
                            background: var(--success-bg);
                            color: var(--success);
                        }

                        .auth-profile-step-title {
                            color: var(--text-muted);
                        }

                        .auth-profile-step-text {
                            color: var(--text-muted);
                        }
                    }

                    &.is-active {
                        .auth-profile-step-icon {
                            border-color: var(--border-default);
                            background: var(--contrast-light);
                            color: var(--text-primary);
                        }

                        .auth-profile-step-title {
                            color: var(--text-primary);
                        }

                        .auth-profile-step-text {
                            color: var(--text-secondary);
                        }
                    }

                    .auth-profile-step-icon {
                        width: 40px;
                        height: 40px;
                        border: 1px solid var(--border-default);
                        border-radius: 10px;
                        display: grid;
                        place-items: center;
                        color: var(--text-muted);
                        background: var(--contrast-light);
                        transition: border-color 0.2s ease, background-color 0.2s ease,
                            color 0.2s ease;
                    }

                    .auth-profile-step-title {

                        font-size: var(--type-size-200);
                        font-weight: var(--font-weight-bold);
                        line-height: var(--type-line-200);
                        color: var(--text-muted);
                    }

                    .auth-profile-step-text {
                        color: var(--text-muted);
                        font-size: var(--type-size-100);
                        line-height: var(--type-line-100);
                    }

                    .auth-profile-step-body {
                        display: flex;
                        flex-direction: column;
                    }
                }
            }
        }
    }

    .auth-profile-progress {
        display: flex;
        justify-content: center;
        gap: 10px;

        .auth-profile-progress-item {
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
        max-width: none;
        padding: 28px 22px;
    }
}
</style>