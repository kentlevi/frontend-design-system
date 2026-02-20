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
        promotions: false,
        reviews: false,
        confirmations: false,
        useShippingAsBilling: false,
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
        <header class="auth-profile-head" data-testid="auth-profile-settings-header">
            <h1 data-testid="auth-profile-settings-title">{{ $t('auth.profile.settings.title') }}</h1>
            <p data-testid="auth-profile-settings-subtitle">{{ $t('auth.profile.settings.subtitle') }}</p>
        </header>

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
                        :checked="props.promotions"
                        type="checkbox"
                        data-testid="auth-profile-toggle-promotions"
                        @change="emit('update:promotions', ($event.target as HTMLInputElement).checked)"
                    />
                    <span />
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
                        :checked="props.reviews"
                        type="checkbox"
                        data-testid="auth-profile-toggle-reviews"
                        @change="emit('update:reviews', ($event.target as HTMLInputElement).checked)"
                    />
                    <span />
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
                        :checked="props.confirmations"
                        type="checkbox"
                        data-testid="auth-profile-toggle-confirmations"
                        @change="emit('update:confirmations', ($event.target as HTMLInputElement).checked)"
                    />
                    <span />
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
                    :class="{ 'is-active': props.unit === 'millimeter' }"
                    data-testid="auth-profile-unit-millimeter-button"
                    @click="updateUnit('millimeter')"
                >
                    millimeter
                </button>
                <button
                    type="button"
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
                    :checked="props.useShippingAsBilling"
                    type="checkbox"
                    data-testid="auth-profile-toggle-billing"
                    @change="emit('update:useShippingAsBilling', ($event.target as HTMLInputElement).checked)"
                />
                <span />
            </label>
        </div>

        <div class="auth-profile-actions auth-profile-actions-end" data-testid="auth-profile-settings-actions">
            <UiButton
                variant="outline"
                tone="neutral"
                size="lg"
                data-testid="auth-profile-back-button"
                @click="emit('back')"
            >
                {{ $t('auth.profile.settings.back') }}
            </UiButton>
            <UiButton
                variant="filled"
                tone="neutral"
                size="lg"
                data-testid="auth-profile-complete-button"
                @click="emit('complete')"
            >
                <UiIcon name="strong-check" :size="16" />
                {{ $t('auth.profile.settings.complete') }}
            </UiButton>
        </div>
    </div>
</template>

<style lang="scss">
.auth-profile-settings-step {
    .auth-profile-head {
        h1 {
            margin: 0;
            font-size: 52px;
            line-height: 1.08;
            color: var(--text-primary);
        }

        p {
            margin: 10px 0 0;
            color: var(--text-secondary);
            font-size: 14px;
        }
    }

    .auth-profile-setting-list {
        margin-top: 42px;
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
            font-size: 16px;
            font-weight: 700;
            color: var(--text-primary);
        }

        .auth-profile-setting-text {
            margin: 4px 0 0;
            font-size: 14px;
            color: var(--text-secondary);
        }
    }

    .auth-profile-switch {
        position: relative;
        width: 42px;
        height: 24px;
        display: inline-flex;
        flex-shrink: 0;

        input {
            position: absolute;
            opacity: 0;
            pointer-events: none;
        }

        span {
            width: 100%;
            height: 100%;
            border-radius: 999px;
            background: var(--text-primary);
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

        input:checked + span::after {
            transform: translateX(18px);
        }
    }

    .auth-profile-setting-row-unit {
        margin-top: 42px;
    }

    .auth-profile-segment {
        display: inline-grid;
        grid-template-columns: 1fr 1fr;
        border: 1px solid var(--text-primary);
        border-radius: 16px;
        overflow: hidden;

        button {
            min-width: 128px;
            height: 48px;
            border: 0;
            background: var(--contrast-light);
            color: var(--text-primary);
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;

            &.is-active {
                background: var(--text-primary);
                color: var(--contrast-light);
            }
        }
    }

    .auth-profile-actions {
        margin-top: 56px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 14px;

        .ui-button {
            min-width: 210px;
            border-radius: 16px;
            box-shadow: none;
            font-size: 18px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
    }

    .auth-profile-actions-end {
        justify-content: space-between;
    }
}

@media (max-width: 860px) {
    .auth-profile-settings-step {
        .auth-profile-head {
            h1 {
                font-size: 34px;
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
                font-size: 18px;
            }
        }
    }
}
</style>
