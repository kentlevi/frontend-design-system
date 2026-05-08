<script setup lang="ts">
import { computed } from 'vue';
import type { LogoName } from '~/data/ui/logos';

type Variant = 'full' | 'mark';
type Color = 'colored' | 'white';
type Size = 'sm' | 'md' | 'lg' | number;
type Loading = 'eager' | 'lazy';

const props = withDefaults(
	defineProps<{
		name: LogoName;
		variant?: Variant;
		color?: Color;
		size?: Size;
		width?: number;
		loading?: Loading;
		fetchpriority?: 'high' | 'low' | 'auto';
	}>(),
	{
		variant: 'full',
		color: 'colored',
		size: 'lg',
		width: undefined,
		loading: 'lazy',
		fetchpriority: 'auto',
	}
);

const size_map = {
	sm: 24,
	md: 32,
	lg: 48,
} as const;

const logo_height = computed(() => {
	if (typeof props.size === 'number') return props.size;
	return size_map[props.size];
});

const logo_width = computed<number | undefined>(() => props.width);

const src = computed(
	() => `/logos/${props.variant}/${props.color}/${props.name}.svg`
);
</script>

<template>
	<img
		:src="src"
		:style="{
			height: `${logo_height}px`,
			width: logo_width ? `${logo_width}px` : 'auto',
		}"
		:width="logo_width"
		:height="logo_height"
		:alt="`${props.name} logo`"
		class="ui-logo"
		:loading="loading"
		:fetchpriority="fetchpriority"
		decoding="async"
	>
</template>