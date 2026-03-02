<script setup lang="ts">
withDefaults(
    defineProps<{
        visible?: boolean;
        message?: string;
        tone?: 'primary' | 'success' | 'warning' | 'error' | 'info';
        dismissible?: boolean;
        variant?: 'default' | 'outlined';
    }>(),
    {
        visible: false,
        message: '',
        tone: 'primary',
        dismissible: true,
        variant: 'default',
    }
);

const emit = defineEmits<{
    (event: 'close'): void;
}>();

const iconByTone = {
    primary: 'strong-check-circle',
    success: 'strong-check-circle',
    warning: 'strong-exclamation-triangle',
    error: 'strong-exclamation-circle',
    info: 'strong-info-circle',
} as const;
</script>

<template>
    <Transition name="ui-toast">
        <div
            v-if="visible"
            class="ui-toast"
            :data-tone="tone"
            :data-variant="variant"
            role="status"
            aria-live="polite"
            data-testid="ui-toast"
        >
            <UiIcon :name="iconByTone[tone]" :size="18" />
            <span class="ui-toast-text">
                <slot>{{ message }}</slot>
            </span>
            <button
                v-if="dismissible"
                type="button"
                class="ui-toast-close"
                aria-label="Close"
                data-testid="ui-toast-close-button"
                @click="emit('close')"
            >
                <UiIcon name="strong-times" :size="14" />
            </button>
        </div>
    </Transition>
</template>

<style lang="scss">
.ui-toast {
    position: fixed;
    left: 50%;
    bottom: 32px;
    transform: translateX(-50%);
    z-index: 60;
    width: fit-content;
    max-width: calc(100vw - 24px);
    padding: 10px 14px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 10px 24px rgba(17, 24, 39, 0.16);

    &[data-tone='primary'] {
        background: var(--brand-primary);
        color: var(--text-primary);
        border: 1px solid color-mix(in srgb, var(--brand-primary) 72%, #111827 28%);
    }

    &[data-tone='success'] {
        background: var(--success-bg);
        color: var(--success-90);
        border: 1px solid color-mix(in srgb, var(--success) 40%, var(--success-bg));
    }

    &[data-tone='warning'] {
        background: #ffedd5;
        color: #7c2d12;
        border: 1px solid #fdba74;
    }

    &[data-tone='error'] {
        background: #fee2e2;
        color: #991b1b;
        border: 1px solid #fca5a5;
    }

    &[data-tone='info'] {
        background: #dbeafe;
        color: #1e3a8a;
        border: 1px solid #93c5fd;
    }

    &[data-variant='outlined'] {
        border: 2px solid var(--white-base);
    }

    .ui-toast-text {
        flex: 0 1 auto;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.3;
    }

    .ui-toast-close {
        border: 0;
        background: transparent;
        color: inherit;
        display: grid;
        place-items: center;
        cursor: pointer;
    }
}

.ui-toast-enter-active,
.ui-toast-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.ui-toast-enter-from,
.ui-toast-leave-to {
    opacity: 0;
    transform: translate(-50%, 8px);
}

@media (max-width: 860px) {
    .ui-toast {
        width: calc(100vw - 24px);
        bottom: 32px;
    }
}
</style>
