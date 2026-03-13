<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'filled' | 'tonal' | 'outline' | 'subtle' | 'ghost';
type Tone = 'default' | 'success' | 'danger' | 'warning';
type Size = 'sm' | 'md';

const props = withDefaults(
	defineProps<{
		variant?: Variant;
		tone?: Tone;
		size?: Size;
		badgeClass?: string;
		bgColor?: string;
		textColor?: string;
		borderColor?: string;
	}>(),
	{
		variant: 'tonal',
		tone: 'default',
		size: 'md',
		badgeClass: '',
		bgColor: '',
		textColor: '',
		borderColor: '',
	}
);

const badgeStyle = computed<Record<string, string> | undefined>(() => {
	const style = {
		...(props.bgColor ? { background: props.bgColor } : {}),
		...(props.textColor ? { color: props.textColor } : {}),
		...(props.borderColor ? { borderColor: props.borderColor } : {}),
	};

	return Object.keys(style).length ? style : undefined;
});
</script>

<template>
	<span
		:class="['ui-badge', badgeClass]"
		:data-variant="variant"
		:data-tone="tone"
		:data-size="size"
		:style="badgeStyle"
	>
		<slot />
	</span>
</template>