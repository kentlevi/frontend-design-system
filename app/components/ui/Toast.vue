<script setup lang="ts">
defineOptions({
	inheritAttrs: false,
});

withDefaults(
	defineProps<{
		visible?: boolean;
		message?: string | null;
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

const attrs = useAttrs();

const iconByTone = {
	primary: 'strong-check-circle',
	success: 'strong-check-circle',
	warning: 'strong-exclamation-triangle',
	error: 'strong-exclamation-circle',
	info: 'strong-info-circle',
} as const;
</script>

<template>
	<Teleport to="body">
		<Transition name="ui-toast">
			<div
				v-if="visible"
				class="ui-toast"
				v-bind="attrs"
				:data-tone="tone"
				:data-variant="variant"
				role="status"
				aria-live="polite"
				data-testid="ui-toast"
			>
				<div class="ui-toast-main">
					<UiIcon :name="iconByTone[tone]" :size="24" />
					<span class="ui-toast-text">
						<slot>{{ message }}</slot>
					</span>
				</div>
				<UiButton
					v-if="dismissible"
					type="button"
					variant="ghost"
					tone="neutral"
					size="24"
					:no-hover="true"
					class="ui-toast-close"
					aria-label="Close"
					data-testid="ui-toast-close-button"
					@click="emit('close')"
				>
					<UiIcon name="regular-times" :size="24" />
				</UiButton>
			</div>
		</Transition>
	</Teleport>
</template>

<style lang="scss">
.ui-toast {
    position: fixed;
    left: 50%;
    bottom: 32px;
    transform: translateX(-50%);
    z-index: 1100;
    width: fit-content;
    max-width: calc(100vw - 24px);
    padding: 10px 14px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 24px;
    box-shadow: var(--shadow-md);

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

    .ui-toast-main {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
    }

    .ui-toast-text {
        flex: 0 1 auto;
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        font-weight: var(--font-weight-semibold);
    }

    .ui-toast-close {
        color: inherit;
        display: grid;
        place-items: center;
        min-height: auto;
        padding: 0;
        box-shadow: none;
    }
}

.ui-toast-enter-active {
    transition: opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1), transform 0.42s cubic-bezier(0.16, 1, 0.3, 1);
}

.ui-toast-leave-active {
    transition: opacity 0.24s cubic-bezier(0.22, 1, 0.36, 1), transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.ui-toast-enter-from,
.ui-toast-leave-to {
    opacity: 0;
    transform: translate(-50%, 18px) scale(0.96);
}

@media (max-width: 860px) {
    .ui-toast {
        width: calc(100vw - 24px);
        bottom: 32px;
    }
}
</style>