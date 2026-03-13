<script setup lang="ts">
import lottie from 'lottie-web';
import { computed, nextTick, useSlots } from 'vue';
import type { CSSProperties } from 'vue';

const BODY_LOCK_COUNT_KEY = 'uiLoadingOverlayLockCount';
const BODY_LOCK_OVERFLOW_KEY = 'uiLoadingOverlayPreviousOverflow';
const BODY_LOCK_COUNT_ATTR = 'data-ui-loading-overlay-lock-count';
const BODY_LOCK_OVERFLOW_ATTR = 'data-ui-loading-overlay-previous-overflow';

const props = withDefaults(defineProps<{
	visible: boolean;
	label?: string;
	description?: string;
	showCopy?: boolean;
	testId?: string;
	transitionName?: string;
	position?: 'fixed' | 'absolute';
	background?: string;
	zIndex?: number;
	loaderWidth?: string;
	loaderHeight?: string;
	animationPath?: string;
}>(), {
	label: '',
	description: '',
	showCopy: false,
	testId: '',
	transitionName: 'ui-loading-overlay-fade',
	position: 'fixed',
	background: 'rgba(255, 255, 255, 0.64)',
	zIndex: 320,
	loaderWidth: '104px',
	loaderHeight: '102px',
	animationPath: '/animations/musticker-loader.json',
});

const slots = useSlots();
const defaultLoaderRef = ref<HTMLElement | null>(null);
let loaderAnimation: ReturnType<typeof lottie.loadAnimation> | null = null;

const hasCustomLoader = computed(() => Boolean(slots.default));

const overlayStyle = computed<CSSProperties>(() => ({
	position: props.position,
	background: props.background,
	zIndex: props.zIndex,
}));

const loaderStyle = computed<CSSProperties>(() => ({
	width: props.loaderWidth,
	height: props.loaderHeight,
}));

function destroyLoaderAnimation() {
	if (!loaderAnimation) return;
	loaderAnimation.destroy();
	loaderAnimation = null;
}

function setBodyScrollLock(locked: boolean) {
	if (typeof document === 'undefined' || props.position !== 'fixed') return;

	const body = document.body;
	const current_lock_count = Number(body.dataset[BODY_LOCK_COUNT_KEY] || '0');

	if (locked) {
		if (current_lock_count === 0) {
			body.dataset[BODY_LOCK_OVERFLOW_KEY] = body.style.overflow || '';
			body.style.overflow = 'hidden';
		}

		body.dataset[BODY_LOCK_COUNT_KEY] = String(current_lock_count + 1);
		return;
	}

	if (current_lock_count <= 1) {
		body.style.overflow = body.dataset[BODY_LOCK_OVERFLOW_KEY] || '';
		body.removeAttribute(BODY_LOCK_COUNT_ATTR);
		body.removeAttribute(BODY_LOCK_OVERFLOW_ATTR);
		return;
	}

	body.dataset[BODY_LOCK_COUNT_KEY] = String(current_lock_count - 1);
}

function normalizeLoaderSvg() {
	const loaderElement = defaultLoaderRef.value;
	if (!loaderElement) return;
	const svgElement = loaderElement.querySelector('svg');
	if (!(svgElement instanceof SVGElement)) return;
	svgElement.style.width = '100%';
	svgElement.style.height = '100%';
	svgElement.style.display = 'block';
}

async function mountLoaderAnimation() {
	if (typeof window === 'undefined' || !defaultLoaderRef.value || hasCustomLoader.value) return;
	destroyLoaderAnimation();
	const response = await fetch(props.animationPath);
	if (!response.ok) return;
	const animationData = await response.json();
	loaderAnimation = lottie.loadAnimation({
		container: defaultLoaderRef.value,
		renderer: 'svg',
		loop: true,
		autoplay: true,
		animationData,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid meet',
		},
	});
	loaderAnimation.addEventListener('DOMLoaded', normalizeLoaderSvg);
}

watch(
	() => props.visible,
	async (visible, was_visible) => {
		if (visible && !was_visible) {
			setBodyScrollLock(true);
		}

		if (!visible && was_visible) {
			setBodyScrollLock(false);
			destroyLoaderAnimation();
			return;
		}

		if (!visible) {
			destroyLoaderAnimation();
			return;
		}

		await nextTick();
		await mountLoaderAnimation();
	},
	{ immediate: true }
);

onBeforeUnmount(() => {
	if (props.visible) {
		setBodyScrollLock(false);
	}
	destroyLoaderAnimation();
});
</script>

<template>
	<Teleport v-if="props.position === 'fixed'" to="body">
		<Transition :name="props.transitionName">
			<div
				v-if="props.visible"
				class="ui-loading-overlay"
				:data-testid="props.testId"
				:style="overlayStyle"
			>
				<div class="ui-loading-overlay-stack">
					<div
						class="ui-loading-overlay-loader"
						role="status"
						aria-live="polite"
						:aria-label="props.label"
						:style="loaderStyle"
					>
						<div class="ui-loading-overlay-content" aria-hidden="true">
							<slot v-if="hasCustomLoader" />
							<div v-else ref="defaultLoaderRef" class="ui-loading-overlay-lottie" />
						</div>
					</div>
					<div v-if="props.showCopy && (props.label || props.description)" class="ui-loading-overlay-copy">
						<p v-if="props.label" class="ui-loading-overlay-label">{{ props.label }}</p>
						<p v-if="props.description" class="ui-loading-overlay-description">{{ props.description }}</p>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>

	<Transition v-else :name="props.transitionName">
		<div
			v-if="props.visible"
			class="ui-loading-overlay"
			:data-testid="props.testId"
			:style="overlayStyle"
		>
			<div class="ui-loading-overlay-stack">
				<div
					class="ui-loading-overlay-loader"
					role="status"
					aria-live="polite"
					:aria-label="props.label"
					:style="loaderStyle"
				>
					<div class="ui-loading-overlay-content" aria-hidden="true">
						<slot v-if="hasCustomLoader" />
						<div v-else ref="defaultLoaderRef" class="ui-loading-overlay-lottie" />
					</div>
				</div>
				<div v-if="props.showCopy && (props.label || props.description)" class="ui-loading-overlay-copy">
					<p v-if="props.label" class="ui-loading-overlay-label">{{ props.label }}</p>
					<p v-if="props.description" class="ui-loading-overlay-description">{{ props.description }}</p>
				</div>
			</div>
		</div>
	</Transition>
</template>

<style scoped lang="scss">
.ui-loading-overlay {
	inset: 0;
	display: grid;
	place-items: center;

	.ui-loading-overlay-loader {
		display: grid;
		place-items: center;
	}

	.ui-loading-overlay-stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}

	.ui-loading-overlay-content {
		width: 100%;
		height: 100%;
	}

	.ui-loading-overlay-lottie {
		width: 100%;
		height: 100%;
	}

	.ui-loading-overlay-copy {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		text-align: center;
		width: min(360px, calc(100vw - 32px));
	}

	.ui-loading-overlay-label {

		color: var(--text-primary);
		font-size: var(--type-size-350);
		line-height: var(--type-line-350);
		font-weight: var(--font-weight-semibold);
	}

	.ui-loading-overlay-description {

		color: var(--text-primary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}
}

.ui-loading-overlay-fade-enter-active,
.ui-loading-overlay-fade-leave-active {
	transition: opacity 0.18s ease;
}

.ui-loading-overlay-fade-enter-from,
.ui-loading-overlay-fade-leave-to {
	opacity: 0;
}
</style>