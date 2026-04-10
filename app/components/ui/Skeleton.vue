<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
	width?: string | number;
	height?: string | number;
	borderRadius?: string | number;
	circle?: boolean;
}>(), {
	width: '100%',
	height: '20px',
	borderRadius: '8px',
	circle: false,
});

const style = computed(() => {
	const w = typeof props.width === 'number' ? `${props.width}px` : props.width;
	const h = typeof props.height === 'number' ? `${props.height}px` : props.height;
	const r = props.circle ? '50%' : (typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius);

	return {
		width: w,
		height: h,
		borderRadius: r,
	};
});
</script>

<template>
	<div class="ui-skeleton" :style="style" aria-hidden="true" />
</template>

<style scoped lang="scss">
.ui-skeleton {
	background: linear-gradient(
		90deg,
		var(--gray-20) 25%,
		var(--gray-30) 37%,
		var(--gray-20) 63%
	);
	background-size: 400% 100%;
	animation: ui-skeleton-shimmer 1.4s ease-in-out infinite;
}

@keyframes ui-skeleton-shimmer {
	0% {
		background-position: 100% 0;
	}
	100% {
		background-position: 0 0;
	}
}
</style>