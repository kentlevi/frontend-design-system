<script setup lang="ts">
import { computed } from 'vue';

type TextVariant = 'p' | 'span';
type TextSize = 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall';
type TextWeight = 'thin' | 'extra-light' | 'light' | 'regular' | 'medium' | 'semi-bold' | 'bold';
type TextAlign = 'left' | 'right' | 'center' | 'inherit';

const props = withDefaults(
	defineProps<{
		variant?: TextVariant;
		size?: TextSize;
		weight?: TextWeight;
		color?: string;
		align?: TextAlign;
	}>(),
	{
		variant: 'p',
		size: 'medium',
		weight: 'regular',
		color: '',
		align: 'inherit',
	}
);

const size_class = computed(() => {
	switch (props.size) {
		case 'xlarge': return 'text-xlarge';
		case 'large': return 'text-large';
		case 'small': return 'text-small';
		case 'xsmall': return 'text-xsmall';
		case 'medium':
		default: return 'text-medium';
	}
});

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

const text_style = computed<Record<string, string> | undefined>(() => {
	const style = {
		...(resolved_color.value ? { color: resolved_color.value } : {}),
	};

	return Object.keys(style).length ? style : undefined;
});
</script>

<template>
	<component
		:is="props.variant"
		:class="['mu-text', size_class, weight_class, align_class]"
		:style="text_style"
	>
		<slot />
	</component>
</template>
