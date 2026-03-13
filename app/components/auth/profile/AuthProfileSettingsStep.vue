<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		promotions?: boolean;
		reviews?: boolean;
		confirmations?: boolean;
	}>(),
	{
		promotions: true,
		reviews: true,
		confirmations: true,
	}
);

const emit = defineEmits<{
	(event: 'update:promotions', value: boolean): void;
	(event: 'update:reviews', value: boolean): void;
	(event: 'update:confirmations', value: boolean): void;
	(event: 'back'): void;
	(event: 'complete'): void;
}>();
</script>

<template>
	<div class="auth-profile-settings-step" data-testid="auth-profile-settings-step">
		<div class="auth-profile-settings-main" data-testid="auth-profile-settings-main">
			<header class="auth-profile-head" data-testid="auth-profile-settings-header">
				<h1 class="auth-profile-head-title" data-testid="auth-profile-settings-title">
					{{ $t('auth.profile.settings.title') }}
				</h1>
				<p class="auth-profile-head-subtitle" data-testid="auth-profile-settings-subtitle">
					{{ $t('auth.profile.settings.subtitle') }}
				</p>
			</header>

			<div class="auth-profile-settings-content" data-testid="auth-profile-settings-content">
				<div class="auth-profile-setting-list" data-testid="auth-profile-settings-list">
					<div class="auth-profile-setting-row" data-testid="auth-profile-setting-promotions">
						<div>
							<p class="auth-profile-setting-title">
								{{ $t('auth.profile.settings.promotions') }}
							</p>
							<p class="auth-profile-setting-text">
								{{ $t('auth.profile.settings.promotionsDesc') }}
							</p>
						</div>
						<label class="auth-profile-switch">
							<input
								class="auth-profile-switch-input"
								:checked="props.promotions"
								type="checkbox"
								data-testid="auth-profile-toggle-promotions"
								@change="emit('update:promotions', ($event.target as HTMLInputElement).checked)"
							>
							<span class="auth-profile-switch-track" />
						</label>
					</div>

					<div class="auth-profile-setting-row" data-testid="auth-profile-setting-reviews">
						<div>
							<p class="auth-profile-setting-title">
								{{ $t('auth.profile.settings.reviews') }}
							</p>
							<p class="auth-profile-setting-text">
								{{ $t('auth.profile.settings.reviewsDesc') }}
							</p>
						</div>
						<label class="auth-profile-switch">
							<input
								class="auth-profile-switch-input"
								:checked="props.reviews"
								type="checkbox"
								data-testid="auth-profile-toggle-reviews"
								@change="emit('update:reviews', ($event.target as HTMLInputElement).checked)"
							>
							<span class="auth-profile-switch-track" />
						</label>
					</div>

					<div class="auth-profile-setting-row" data-testid="auth-profile-setting-confirmations">
						<div>
							<p class="auth-profile-setting-title">
								{{ $t('auth.profile.settings.confirmations') }}
							</p>
							<p class="auth-profile-setting-text">
								{{ $t('auth.profile.settings.confirmationsDesc') }}
							</p>
						</div>
						<label class="auth-profile-switch">
							<input
								class="auth-profile-switch-input"
								:checked="props.confirmations"
								type="checkbox"
								data-testid="auth-profile-toggle-confirmations"
								@change="emit('update:confirmations', ($event.target as HTMLInputElement).checked)"
							>
							<span class="auth-profile-switch-track" />
						</label>
					</div>
				</div>

			</div>
		</div>

		<div class="auth-profile-actions auth-profile-actions-end" data-testid="auth-profile-settings-actions">
			<UiButton
				variant="outline"
				tone="neutral"
				size="md"
				class="auth-profile-back-btn"
				data-testid="auth-profile-back-button"
				@click="emit('back')"
			>
				{{ $t('auth.profile.settings.back') }}
			</UiButton>
			<UiButton
				variant="filled"
				tone="neutral"
				size="md"
				class="auth-profile-complete-btn"
				data-testid="auth-profile-complete-button"
				@click="emit('complete')"
			>
				<UiIcon name="regular-clipboard-check" :size="24" />
				{{ $t('auth.profile.settings.complete') }}
			</UiButton>
		</div>
	</div>
</template>

<style lang="scss">
.auth-profile-settings-step {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    max-height: 773px;

    .auth-profile-settings-main {
        display: flex;
        flex-direction: column;
        gap: 40px;

        .auth-profile-head {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .auth-profile-head-title {

                font-size: var(--type-size-400);
                line-height: var(--type-line-400);
                font-weight: var(--font-weight-semibold);
                color: var(--text-primary);
            }

            .auth-profile-head-subtitle {

                color: var(--text-secondary);
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
            }
        }

        .auth-profile-settings-content {
            display: flex;
            flex-direction: column;
            gap: 56px;

            .auth-profile-setting-list {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .auth-profile-setting-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;

                .auth-profile-setting-title {

                    font-size: var(--type-size-100);
                    line-height: var(--type-line-100);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                }

                .auth-profile-setting-text {
                    font-size: var(--type-size-100);
                    font-weight: var(--font-weight-regular);
                    line-height: var(--type-line-100);
                    color: var(--text-secondary);
                }
            }

            .auth-profile-switch {
                position: relative;
                width: 42px;
                height: 24px;
                display: inline-flex;
                flex-shrink: 0;
                cursor: pointer;

                .auth-profile-switch-input {
                    position: absolute;
                    opacity: 0;
                    pointer-events: none;
                }

            .auth-profile-switch-track {
                width: 100%;
                height: 100%;
                border-radius: 999px;
                background: var(--gray-30);
                position: relative;

                &::after {
                    content: '';
                    width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: var(--contrast-light);
                        position: absolute;
                        top: 4px;
                        left: 4px;
                        transition: transform 0.2s ease;
                    }
            }

            .auth-profile-switch-input:checked + .auth-profile-switch-track {
                background: var(--text-primary);
            }

            .auth-profile-switch-input:checked + .auth-profile-switch-track::after {
                transform: translateX(18px);
            }
            }

        }
    }

    .auth-profile-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 14px;


        .auth-profile-back-btn {
            padding: 8px 24px;
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
        }

        .auth-profile-complete-btn {
            padding: 8px 32px;
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
        }
    }

    .auth-profile-actions-end {
        justify-content: space-between;
    }
}

@media (max-width: 860px) {
    .auth-profile-settings-step {
        min-height: auto;

        .auth-profile-settings-main {
            .auth-profile-head {
                .auth-profile-head-title {
                    font-size: var(--type-size-550);
                    line-height: var(--type-line-550);
                }
            }
        }

        .auth-profile-actions,
        .auth-profile-actions-end {
            margin-top: 34px;
            flex-direction: column;
            align-items: stretch;
        }

        .auth-profile-actions {
            .ui-button {
                width: 100%;
                min-width: 0;
                font-size: var(--type-size-200);
                line-height: var(--type-line-200);
            }
        }
    }
}
</style>