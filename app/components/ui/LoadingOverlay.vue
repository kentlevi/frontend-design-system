<script setup lang="ts">
import lottie from 'lottie-web';
import { computed, nextTick, useSlots } from 'vue';
import type { CSSProperties } from 'vue';

const props = withDefaults(defineProps<{
	visible: boolean;
	label: string;
	testId?: string;
	transitionName?: string;
	position?: 'fixed' | 'absolute';
	background?: string;
	zIndex?: number;
	loaderWidth?: string;
	loaderHeight?: string;
	animationPath?: string;
}>(), {
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

watch(() => props.visible, async (visible) => {
	if (!visible) {
		destroyLoaderAnimation();
		return;
	}
	await nextTick();
	await mountLoaderAnimation();
});

onBeforeUnmount(() => {
	destroyLoaderAnimation();
});
</script>

<template>
	<Transition :name="props.transitionName">
		<div
			v-if="props.visible"
			class="ui-loading-overlay"
			:data-testid="props.testId"
			:style="overlayStyle"
		>
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

	.ui-loading-overlay-content {
		width: 100%;
		height: 100%;
	}

	.ui-loading-overlay-lottie {
		width: 100%;
		height: 100%;
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