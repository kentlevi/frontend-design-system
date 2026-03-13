<script setup lang="ts">
withDefaults(
	defineProps<{
		visible?: boolean;
	}>(),
	{
		visible: false,
	}
);

const emit = defineEmits<{
	(event: 'close'): void;
}>();
</script>

<template>
	<Transition name="home-guide-done-popover">
		<aside
			v-if="visible"
			class="home-guide-done-popover"
			role="dialog"
			aria-live="polite"
			data-testid="home-guide-done-popover"
		>
			<UiButton
				type="button"
				variant="ghost"
				tone="neutral"
				size="sm"
				class="home-guide-done-popover-close"
				:aria-label="$t('home.tour.close')"
				data-testid="home-guide-done-popover-close"
				@click="emit('close')"
			>
				<UiIcon name="strong-times" :size="20" />
			</UiButton>

			<h3 class="home-guide-done-popover-title">
				{{ $t('home.tour.step4.title') }}
			</h3>
			<p class="home-guide-done-popover-text">
				{{ $t('home.tour.step4.body') }}
			</p>

			<div class="home-guide-done-popover-actions">
				<UiButton
					variant="filled"
					tone="neutral"
					size="md"
					class="home-guide-done-popover-done"
					data-testid="home-guide-done-popover-done"
					@click="emit('close')"
				>
					{{ $t('home.tour.done') }}
				</UiButton>
			</div>
		</aside>
	</Transition>
</template>

<style scoped lang="scss">
.home-guide-done-popover {
    position: fixed;
    right: 40px;
    bottom: 36px;
    z-index: 120;
    width: min(370px, calc(100vw - 24px));
    background: var(--brand-primary);
    border: 1px solid color-mix(in srgb, var(--brand-primary) 70%, var(--text-primary));
    border-radius: 16px;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);
    padding: 24px 26px 20px;
}

    .home-guide-done-popover-close {
        position: absolute;
        top: 18px;
        right: 16px;
        min-height: auto;
        padding: 0;
        color: var(--text-primary);
        box-shadow: none;
    }

    .home-guide-done-popover-title {

        color: var(--text-primary);
        font-size: var(--type-size-200);
        line-height: var(--type-line-200);
        font-weight: var(--font-weight-bold);
    }

    .home-guide-done-popover-text {
        margin: 8px 0 0;
        color: var(--text-primary);
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
    }

    .home-guide-done-popover-actions {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;

        .home-guide-done-popover-done {
            min-width: 110px;
            border-radius: 16px;
            box-shadow: none;
        }
    }

.home-guide-done-popover-enter-active,
.home-guide-done-popover-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.home-guide-done-popover-enter-from,
.home-guide-done-popover-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

@media (max-width: 860px) {
    .home-guide-done-popover {
        right: 12px;
        left: 12px;
        bottom: 12px;
        width: auto;
        padding: 20px 18px 18px;
    }
}
</style>