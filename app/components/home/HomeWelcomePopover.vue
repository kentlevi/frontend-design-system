<script setup lang="ts">
import { useHomeWelcomePopover } from '~/composables/home/welcomePopover/useHomeWelcomePopover';

const props = withDefaults(
	defineProps<{
		visible?: boolean;
		rewardPoints?: number;
	}>(),
	{
		visible: false,
		rewardPoints: 500,
	}
);

const emit = defineEmits<{
	(event: 'close'): void;
	(event: 'start'): void;
}>();

const { greetingName } = useHomeWelcomePopover();
</script>

<template>
	<Transition name="home-welcome-popover">
		<aside
			v-if="visible"
			class="home-welcome-popover"
			role="dialog"
			aria-live="polite"
			data-testid="home-welcome-popover"
		>
			<UiButton
				type="button"
				variant="ghost"
				tone="neutral"
				size="sm"
				class="home-welcome-popover-close"
				aria-label="Close welcome popover"
				data-testid="home-welcome-popover-close"
				@click="emit('close')"
			>
				<UiIcon name="strong-times" :size="20" />
			</UiButton>

			<div class="home-welcome-popover-content">
				<h3 class="home-welcome-popover-title">
					{{ $t('home.welcome.title', { name: greetingName }) }}
				</h3>
				<p class="home-welcome-popover-text">
					<span>{{ $t('home.welcome.bodyPrefix') }}</span>
					<strong>{{ $t('home.welcome.bodyHighlight', { points: props.rewardPoints }) }}</strong>
					<span>{{ $t('home.welcome.bodySuffix') }}</span>
				</p>
			</div>

			<div class="home-welcome-popover-actions">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="sm"
					class="home-welcome-popover-skip"
					data-testid="home-welcome-popover-skip"
					@click="emit('close')"
				>
					{{ $t('home.welcome.skip') }}
				</UiButton>
				<UiButton
					variant="filled"
					tone="neutral"
					size="md"
					class="home-welcome-popover-start"
					data-testid="home-welcome-popover-start"
					@click="emit('start')"
				>
					<UiIcon name="regular-arrow-right" :size="18" />
					{{ $t('home.welcome.getStarted') }}
				</UiButton>
			</div>
		</aside>
	</Transition>
</template>

<style scoped lang="scss">
.home-welcome-popover {
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

	.home-welcome-popover-close {
		position: absolute;
		top: 18px;
		right: 16px;
		min-height: auto;
		padding: 0;
		color: var(--text-primary);
		box-shadow: none;
	}

	.home-welcome-popover-content {
		display: flex;
		flex-direction: column;
		gap: 8px;

		.home-welcome-popover-title {

			color: var(--text-primary);
			font-size: var(--type-size-200);
			line-height: var(--type-line-200);
			font-weight: var(--font-weight-bold);
		}

		.home-welcome-popover-text {

			color: var(--text-primary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
		}
	}

	.home-welcome-popover-actions {
		margin-top: 20px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 22px;

		.home-welcome-popover-skip {
			min-height: auto;
			padding: 0;
			color: var(--text-primary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			font-weight: var(--font-weight-bold);
			box-shadow: none;
		}

		.home-welcome-popover-start {
			min-width: 136px;
			border-radius: 16px;
			box-shadow: none;
		}
	}

.home-welcome-popover-enter-active,
.home-welcome-popover-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.home-welcome-popover-enter-from,
.home-welcome-popover-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

@media (max-width: 860px) {
    .home-welcome-popover {
        right: 12px;
        left: 12px;
        bottom: 12px;
        width: auto;
        padding: 20px 18px 18px;
    }

	.home-welcome-popover-content {
		.home-welcome-popover-title {
			font-size: var(--type-size-500);
			line-height: var(--type-line-500);
		}
	}
}
</style>