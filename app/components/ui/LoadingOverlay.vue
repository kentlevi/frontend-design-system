<script setup lang="ts">
import { computed } from 'vue';
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
}>(), {
	testId: '',
	transitionName: 'ui-loading-overlay-fade',
	position: 'fixed',
	background: 'rgba(255, 255, 255, 0.64)',
	zIndex: 320,
	loaderWidth: '104px',
	loaderHeight: '102px',
});

const overlayStyle = computed<CSSProperties>(() => ({
	position: props.position,
	background: props.background,
	zIndex: props.zIndex,
}));

const loaderStyle = computed<CSSProperties>(() => ({
	width: props.loaderWidth,
	height: props.loaderHeight,
}));
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
					<slot />
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

		:deep(svg) {
			width: 100%;
			height: 100%;
			display: block;
		}
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