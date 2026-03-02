<script setup lang="ts">
import type { SupportedCountry } from '~/constants/countries';
import type { FlagCode } from '~/data/ui/flags';

const props = defineProps<{
    open: boolean;
    localeValue: string;
    localeOptions: Array<{ code: SupportedCountry; flagCode: FlagCode; label: string }>;
}>();

const emit = defineEmits<{
    close: [];
    select: [code: SupportedCountry];
}>();

const { t } = useI18n();
</script>

<template>
    <Transition name="locale-modal">
        <div
            v-if="props.open"
            class="home-locale-overlay"
            data-testid="app-header-locale-overlay"
            @click.self="emit('close')"
        >
            <div
                class="home-locale-modal"
                role="dialog"
                aria-modal="true"
                :aria-label="t('layout.header.locale.title')"
                data-testid="app-header-locale-dialog"
            >
                <UiButton
                    variant="ghost"
                    tone="default"
                    size="sm"
                    :icon-only="true"
                    icon="regular-times"
                    icon-size="md"
                    class="home-locale-close"
                    :aria-label="t('layout.header.locale.close')"
                    data-testid="app-header-locale-close-button"
                    @click="emit('close')"
                />

                <h3 class="home-locale-title" data-testid="app-header-locale-title">
                    {{ t('layout.header.locale.title') }}
                </h3>

                <div class="home-locale-list" data-testid="app-header-locale-list">
                    <button
                        v-for="option in props.localeOptions"
                        :key="option.code"
                        type="button"
                        class="home-locale-item"
                        :class="{ 'is-active': props.localeValue === option.code }"
                        :data-testid="`app-header-locale-option-${option.code}-button`"
                        @click="emit('select', option.code)"
                    >
                        <UiFlag :code="option.flagCode" :size="20" />
                        <span class="home-locale-item-label">{{ option.label }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
.home-locale-overlay {
    position: fixed;
    inset: 0;
    background: var(--overlay-soft);
    display: grid;
    place-items: start center;
    padding-top: 88px;
    z-index: 120;

    .home-locale-modal {
        width: min(520px, calc(100vw - 24px));
        background: var(--contrast-light);
        border-radius: 10px;
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
        padding: 22px;
        position: relative;

        .home-locale-close {
            --btn-bg: var(--text-primary);
            --btn-soft: transparent;
            --btn-border: transparent;

            position: absolute;
            top: 14px;
            right: 14px;
            width: 24px;
            height: 24px;
            border: 0;
            background: transparent;
            display: grid;
            place-items: center;
            cursor: pointer;
            box-shadow: none;
        }

        .home-locale-title {
            margin: 0 0 14px;
            font-size: 38px;
            line-height: 1.3;
            color: var(--text-primary);
        }

        .home-locale-list {
            border: 1px solid var(--border-default);
            border-radius: 8px;
            overflow: hidden;

            .home-locale-item {
                width: 100%;
                height: 44px;
                border: 0;
                border-top: 1px solid var(--border-default);
                background: var(--contrast-light);
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 0 12px;
                text-align: left;
                cursor: pointer;
                color: var(--text-primary);
                font-size: 14px;

                &:first-child {
                    border-top: 0;
                }

                &.is-active {
                    background: var(--azure-10);
                }
            }
        }
    }
}

.locale-modal-enter-active,
.locale-modal-leave-active {
    transition: opacity 0.2s ease;
}

.locale-modal-enter-from,
.locale-modal-leave-to {
    opacity: 0;
}
</style>
