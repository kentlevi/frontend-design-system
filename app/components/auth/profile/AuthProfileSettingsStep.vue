<script setup lang="ts">
type ProfileUnit = 'millimeter' | 'inch';

const props = withDefaults(
    defineProps<{
        promotions: boolean;
        reviews: boolean;
        confirmations: boolean;
        useShippingAsBilling: boolean;
        unit: ProfileUnit;
    }>(),
    {
        promotions: true,
        reviews: true,
        confirmations: true,
        useShippingAsBilling: true,
        unit: 'millimeter',
    }
);

const emit = defineEmits<{
    (event: 'update:promotions', value: boolean): void;
    (event: 'update:reviews', value: boolean): void;
    (event: 'update:confirmations', value: boolean): void;
    (event: 'update:useShippingAsBilling', value: boolean): void;
    (event: 'update:unit', value: ProfileUnit): void;
    (event: 'back'): void;
    (event: 'complete'): void;
}>();

function updateUnit(value: ProfileUnit) {
    emit('update:unit', value);
}
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
                            />
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
                            />
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
                            />
                            <span class="auth-profile-switch-track" />
                        </label>
                    </div>
                </div>

                <div
                    class="auth-profile-setting-row auth-profile-setting-row-unit"
                    data-testid="auth-profile-setting-unit"
                >
                    <div>
                        <p class="auth-profile-setting-title">
                            {{ $t('auth.profile.settings.unit') }}
                        </p>
                        <p class="auth-profile-setting-text">
                            {{ $t('auth.profile.settings.unitDesc') }}
                        </p>
                    </div>
                    <div class="auth-profile-segment">
                        <button
                            type="button"
                            class="auth-profile-segment-button"
                            :class="{ 'is-active': props.unit === 'millimeter' }"
                            data-testid="auth-profile-unit-millimeter-button"
                            @click="updateUnit('millimeter')"
                        >
                            millimeter
                        </button>
                        <button
                            type="button"
                            class="auth-profile-segment-button"
                            :class="{ 'is-active': props.unit === 'inch' }"
                            data-testid="auth-profile-unit-inch-button"
                            @click="updateUnit('inch')"
                        >
                            inch
                        </button>
                    </div>
                </div>

                <div class="auth-profile-setting-row" data-testid="auth-profile-setting-billing">
                    <div>
                        <p class="auth-profile-setting-title">
                            {{ $t('auth.profile.settings.billing') }}
                        </p>
                        <p class="auth-profile-setting-text">
                            {{ $t('auth.profile.settings.billingDesc') }}
                        </p>
                    </div>
                    <label class="auth-profile-switch">
                        <input
                            class="auth-profile-switch-input"
                            :checked="props.useShippingAsBilling"
                            type="checkbox"
                            data-testid="auth-profile-toggle-billing"
                            @change="emit('update:useShippingAsBilling', ($event.target as HTMLInputElement).checked)"
                        />
                        <span class="auth-profile-switch-track" />
                    </label>
                </div>
            </div>
        </div>

        <div class="auth-profile-actions auth-profile-actions-end" data-testid="auth-profile-settings-actions">
            <UiButton
                variant="outline"
                tone="neutral"
                size="lg"
                class="auth-profile-back-btn"
                data-testid="auth-profile-back-button"
                @click="emit('back')"
            >
                {{ $t('auth.profile.settings.back') }}
            </UiButton>
            <UiButton
                variant="filled"
                tone="neutral"
                size="lg"
                class="auth-profile-complete-btn"
                data-testid="auth-profile-complete-button"
                @click="emit('complete')"
            >
                <UiIcon name="strong-check" :size="24" />
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
                margin: 0;
                font-size: 24px;
                line-height: 36px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .auth-profile-head-subtitle {
                margin: 0;
                color: var(--text-secondary);
                font-size: 14px;
                line-height: 24px;
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
                    margin: 0;
                    font-size: 14px;
                    line-height: 24px;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .auth-profile-setting-text {
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 24px;
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

            .auth-profile-segment {
                display: inline-grid;
                grid-template-columns: 1fr 1fr;
                border: 1px solid var(--text-primary);
                border-radius: 16px;
                overflow: hidden;

                .auth-profile-segment-button {
                    min-width: 104px;
                    height: 40px;
                    border: 0;
                    background: var(--contrast-light);
                    color: var(--text-primary);
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 24px;
                    cursor: pointer;

                    &.is-active {
                        background: var(--text-primary);
                        color: var(--contrast-light);
                    }
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
        }

        .auth-profile-complete-btn {
            padding: 8px 32px;
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
                    font-size: 34px;
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
                font-size: 16px;
                line-height: 28px;
            }
        }
    }
}
</style>
