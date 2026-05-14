<script setup lang="ts">
import { computed, onMounted, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { HOME_GUIDE_TOUR_TOTAL_STEPS } from '~/data/home/onboarding';
import { useFileBaseUrl } from '~/composables/core/fileBaseUrl/useFileBaseUrl';
import {
	HOME_GUIDE_TOUR_HEADER_IMAGE_BY_STEP,
	resolveHomeGuideTourPanelStyle,
} from '~/helpers/home/homeGuideTour.helper';
import type { GuideTargetRect } from '~/types/home/guideTour';

const component_props = withDefaults(
	defineProps<{
		visible?: boolean;
		step?: number;
		targetRect?: GuideTargetRect | null;
	}>(),
	{
		visible: false,
		step: 1,
		targetRect: null,
	}
);
const { visible, step, targetRect: target_rect } = toRefs(component_props);

const emit = defineEmits<{
	(event: 'close'): void;
	(event: 'next'): void;
}>();

const { t: translate } = useI18n();
const { resolveFileUrl } = useFileBaseUrl();

const safe_step = computed(() =>
	Math.min(Math.max(step.value, 1), HOME_GUIDE_TOUR_TOTAL_STEPS)
);
const panel_class = computed(() => `home-guide-tour-panel--step-${safe_step.value}`);
const title = computed(() => translate(`home.tour.step${safe_step.value}.title`));
const body = computed(() => translate(`home.tour.step${safe_step.value}.body`));
const cta_label = computed(() => translate('home.tour.next'));
const has_header_image = computed(() => Boolean(HOME_GUIDE_TOUR_HEADER_IMAGE_BY_STEP[safe_step.value]));
const header_image_path = computed(() => HOME_GUIDE_TOUR_HEADER_IMAGE_BY_STEP[safe_step.value] || '');
const step_image_urls = computed(() => (
	Object.values(HOME_GUIDE_TOUR_HEADER_IMAGE_BY_STEP).map((path) => resolveFileUrl(path))
));
const header_image_style = computed(() =>
	has_header_image.value
		? { backgroundImage: `url(${resolveFileUrl(header_image_path.value)})` }
		: {}
);

const panel_inline_style = computed(() => {
	return resolveHomeGuideTourPanelStyle(
		safe_step.value,
		target_rect.value,
		typeof window === 'undefined' ? undefined : window.innerWidth
	);
});

onMounted(() => {
	if (!import.meta.client) return;
	for (const url of step_image_urls.value) {
		const img = new Image();
		img.src = url;
	}
});
</script>

<template>
	<Transition name="home-guide-tour-fade">
		<div
			v-if="visible"
			class="home-guide-tour"
			role="dialog"
			aria-live="polite"
			data-testid="home-guide-tour"
		>
			<div class="home-guide-tour-overlay" />

			<aside
				class="home-guide-tour-panel"
				:class="panel_class"
				:style="panel_inline_style"
				data-testid="home-guide-tour-panel"
			>
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="sm"
					class="home-guide-tour-close"
					:aria-label="translate('home.tour.close')"
					data-testid="home-guide-tour-close"
					@click="emit('close')"
				>
					<UiIcon name="strong-times" :size="18" />
				</UiButton>

				<div
					v-if="has_header_image"
					class="home-guide-tour-header"
					:style="header_image_style"
				/>

				<div class="home-guide-tour-body">
					<div class="home-guide-tour-copy">
						<h3 class="home-guide-tour-title">
							{{ title }}
						</h3>
						<p class="home-guide-tour-text">
							{{ body }}
						</p>
					</div>

					<div class="home-guide-tour-actions">
						<p class="home-guide-tour-step">
							{{ translate('home.tour.stepLabel', { current: safe_step, total: HOME_GUIDE_TOUR_TOTAL_STEPS }) }}
						</p>

						<UiButton
							variant="filled"
							tone="neutral"
							size="md"
							class="home-guide-tour-next"
							data-testid="home-guide-tour-next"
							@click="emit('next')"
						>
							{{ cta_label }}
						</UiButton>
					</div>
				</div>
			</aside>
		</div>
	</Transition>
</template>

<style scoped lang="scss">
.home-guide-tour {
    position: fixed;
    inset: 0;
    z-index: 140;
}

.home-guide-tour-overlay {
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, var(--contrast-light) 48%, transparent);
}

.home-guide-tour-panel {
    position: fixed;
    z-index: 143;
    width: min(416px, calc(100vw - 24px));
    border-radius: 24px;
    overflow: hidden;
    background: var(--contrast-light);
    border: 2px solid var(--contrast-light);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
}

.home-guide-tour-panel--step-1,
.home-guide-tour-panel--step-3 {
    top: 112px;
    right: 28px;
}

.home-guide-tour-panel--step-2 {
    top: 112px;
    left: 50%;
    transform: translateX(-50%);
}

	.home-guide-tour-close {
		position: absolute;
		top: 20px;
		right: 20px;
		min-height: auto;
		padding: 0;
		color: var(--text-primary);
		box-shadow: none;
		z-index: 2;
	}

	.home-guide-tour-header {
		min-height: 200px;
		background-color: var(--contrast-light);
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}

	.home-guide-tour-body {
		padding: 32px;
		background: var(--brand-primary);
		display: flex;
		flex-direction: column;
		gap: 32px;

		.home-guide-tour-copy {
			display: flex;
			flex-direction: column;
			gap: 14px;

			.home-guide-tour-title {

				font-size: var(--type-size-200);
				line-height: var(--type-line-200);
				font-weight: var(--font-weight-bold);
				color: var(--text-primary);
				max-width: 100%;
			}

			.home-guide-tour-text {

				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				color: var(--text-primary);
			}
		}

		.home-guide-tour-actions {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;

			.home-guide-tour-step {

				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				font-weight: var(--font-weight-bold);
				color: var(--text-primary);
			}

			.home-guide-tour-next {
				padding: 8px 24px;
				border-radius: 18px;
				box-shadow: none;
			}
		}
	}

.home-guide-tour-fade-enter-active,
.home-guide-tour-fade-leave-active {
    transition: opacity 0.18s ease;
}

.home-guide-tour-fade-enter-from,
.home-guide-tour-fade-leave-to {
    opacity: 0;
}

@media (max-width: 1024px) {
    .home-guide-tour-panel--step-1,
    .home-guide-tour-panel--step-2,
    .home-guide-tour-panel--step-3 {
        top: auto;
        left: 12px;
        right: 12px;
        bottom: 12px;
        transform: none;
        width: auto;
    }

	.home-guide-tour-header {
		min-height: 140px;
	}

	.home-guide-tour-body {
		padding: 24px 18px 18px;

		.home-guide-tour-copy {
			.home-guide-tour-title {
				font-size: var(--type-size-500);
				line-height: var(--type-line-500);
			}
		}
	}
}
</style>