<script setup lang="ts">
import { computed } from 'vue';
import { iconSpriteVersion, icons } from '~/data/ui/icons';

type Size = 'sm' | 'md' | 'lg' | number | string;

const props = defineProps<{
	name: keyof typeof icons;
	size?: Size;
	title?: string;
	color?: string;
}>();

const size_map = { sm: 16, md: 20, lg: 24 } as const;

const icon_size = computed<string>(() => {
	if (!props.size) return `${size_map.lg}px`;

	if (typeof props.size === 'string' && props.size in size_map) {
		return `${size_map[props.size as keyof typeof size_map]}px`;
	}

	if (typeof props.size === 'number') {
		return `${props.size}px`;
	}

	return props.size;
});

const icon_meta = computed(() => icons[props.name] ?? null);

const sprite_href = computed<string | undefined>(() =>
	icon_meta.value ? `/icons/sprite.svg?v=${iconSpriteVersion}#${icon_meta.value.id}` : undefined
);
</script>

<template>
	<svg
		v-if="icon_meta"
		class="ui-icon"
		:style="{
			width: icon_size,
			height: icon_size,
			color: color ?? 'currentColor',
		}"
		:viewBox="icon_meta.viewBox"
		:role="title ? 'img' : undefined"
		:aria-hidden="title ? undefined : true"
	>
		<title v-if="title">{{ title }}</title>
		<use :href="sprite_href" />
	</svg>

	<span
		v-else
		class="ui-icon ui-icon--missing"
		:style="{ width: icon_size, height: icon_size }"
		aria-hidden="true"
	/>
</template>