<script setup lang="ts">
import { computed } from 'vue';

interface Props {
	href?: string;
	disabled?: boolean;
	color?: string;
}

const props = withDefaults(defineProps<Props>(), {
	href: 'javascript:;',
	disabled: false,
	color: '',
});

const link_style = computed(() => {
	return props.color ? { color: `var(--${props.color})` } : undefined;
});
</script>

<template>
	<a
		:class="['mu-link', { 'is-disabled': disabled }]"
		:href="href"
		:style="link_style"
		:aria-disabled="disabled || undefined"
	>
		<slot />
	</a>
</template>

<style scoped lang="scss">
.mu-link {
	display: inline-block;
	color: var(--text-primary);
	font: inherit;
	font-weight: var(--font-weight-bold);
	text-decoration: underline;
	cursor: pointer;
	transition: color 120ms ease;

	&:hover {
		color: var(--brand-primary-hover);
	}

	&.is-disabled {
		opacity: 0.5;
		pointer-events: none;
		cursor: not-allowed;
	}
}
</style>