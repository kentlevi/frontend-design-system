<script setup lang="ts">
import { computed } from 'vue';

type HeadingVariant = '1' | '2' | '3' | '4' | '5' | '6';
type HeadingWeight = 'thin' | 'extra-light' | 'light' | 'regular' | 'medium' | 'semi-bold' | 'bold';
type HeadingAlign = 'left' | 'right' | 'center' | 'inherit';

const props = withDefaults(
	defineProps<{
		variant?: HeadingVariant;
		weight?: HeadingWeight;
		color?: string;
		align?: HeadingAlign;
	}>(),
	{
		variant: '2',
		weight: 'regular',
		color: '',
		align: 'inherit',
	}
);

const tag = computed(() => `h${props.variant}`);

const weight_class = computed(() => {
	switch (props.weight) {
		case 'thin': return 'font-thin';
		case 'extra-light': return 'font-extra-light';
		case 'light': return 'font-light';
		case 'medium': return 'font-medium';
		case 'semi-bold': return 'font-semi-bold';
		case 'bold': return 'font-bold';
		case 'regular':
		default: return 'font-regular';
	}
});

const align_class = computed(() => {
	switch (props.align) {
		case 'left': return 'text-left';
		case 'right': return 'text-right';
		case 'center': return 'text-center';
		default: return '';
	}
});

const resolved_color = computed(() => {
	const value = props.color.trim();
	if (!value) return undefined;

	if (
		value.startsWith('var(')
		|| value.startsWith('#')
		|| value.startsWith('rgb(')
		|| value.startsWith('rgba(')
		|| value.startsWith('hsl(')
		|| value.startsWith('hsla(')
	) {
		return value;
	}

	if (value.startsWith('--')) {
		return `var(${value})`;
	}

	return `var(--${value})`;
});

const heading_style = computed<Record<string, string> | undefined>(() => {
	const style = {
		...(resolved_color.value ? { color: resolved_color.value } : {}),
	};

	return Object.keys(style).length ? style : undefined;
});
</script>

<template>
	<component :is="tag" :class="['ui-heading', weight_class, align_class]" :style="heading_style">
		<slot />
	</component>
</template>