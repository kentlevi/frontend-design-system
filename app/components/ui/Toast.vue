<script setup lang="ts">
withDefaults(
    defineProps<{
        visible?: boolean;
        message?: string;
        tone?: 'success' | 'warning' | 'error' | 'info';
        dismissible?: boolean;
    }>(),
    {
        visible: false,
        message: '',
        tone: 'success',
        dismissible: true,
    }
);

const emit = defineEmits<{
    (event: 'close'): void;
}>();

const iconByTone = {
    success: 'strong-check-circle',
    warning: 'strong-exclamation-triangle',
    error: 'strong-triangle-exclamation',
    info: 'strong-info-circle',
} as const;
</script>

<template>
    <Transition name="ui-toast">
        <div
            v-if="visible"
            class="ui-toast"
            :data-tone="tone"
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
    bottom: 84px;
    transform: translateX(-50%);
    z-index: 60;
    min-width: 460px;
    max-width: calc(100vw - 24px);
    padding: 10px 14px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 10px 24px rgba(17, 24, 39, 0.16);

    &[data-tone='success'] {
        background: var(--brand-primary);
        color: var(--text-primary);
        border: 1px solid color-mix(in srgb, var(--brand-primary) 72%, #111827 28%);
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

    .ui-toast-text {
        flex: 1;
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
        min-width: 0;
        width: calc(100vw - 24px);
        bottom: 84px;
    }
}
</style>
