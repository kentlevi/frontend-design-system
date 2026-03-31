<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		name: string;
		variant?: 'colored' | 'white' | 'black';
		size?: 'sm' | 'md' | 'lg' | number;
		href?: string;
	}>(),
	{
		variant: 'colored',
		size: 'md',
		href: '',
	}
);

const sizes = {
	sm: 24,
	md: 32,
	lg: 48,
};

const resolved_size = computed(() => {
	if (typeof props.size === 'number') return props.size;
	return sizes[props.size];
});

const src = computed(() => `/social/${props.variant}/${props.name}.svg`);
</script>

<template>
	<component
		:is="href ? 'a' : 'span'"
		:href="href"
		target="_blank"
		rel="noopener noreferrer"
		class="ui-social-icon"
		:data-size="size"
	>
		<img
			:src="src"
			:width="resolved_size"
			:height="resolved_size"
			:alt="`${name} icon`"
			loading="lazy"
			decoding="async" class="c-om-po-ne-nt-s-u-i-s-oc-ia-li-co-n-img" >
	</component>
</template>