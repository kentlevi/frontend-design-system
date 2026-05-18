<script setup lang="ts">
import { computed } from 'vue';
import MuText from '~/components/base/MuText.vue';

type ThumbnailShape = 'circle' | 'square';
type ThumbnailFit = 'contain' | 'cover';

const props = withDefaults(
	defineProps<{
		src?: string | null;
		alt?: string;
		name?: string | null;
		size?: number | string;
		shape?: ThumbnailShape;
		fit?: ThumbnailFit;
	}>(),
	{
		src: '',
		alt: '',
		name: '',
		size: 32,
		shape: 'circle',
		fit: 'contain',
	}
);

const resolved_size = computed(() => {
	if (typeof props.size === 'number') return `${props.size}px`;
	return String(props.size);
});

const frame_style = computed(() => ({
	width: resolved_size.value,
	height: resolved_size.value,
}));

const has_image = computed(() => Boolean(props.src && String(props.src).trim()));

const initials = computed(() => {
	const raw = (props.name ?? '').trim();
	if (!raw) return '';

	const parts = raw.split(/\s+/).filter(Boolean);
	if (parts.length === 1) {
		return (parts[0]?.charAt(0) ?? '').toUpperCase();
	}

	const first = parts[0]?.charAt(0) ?? '';
	const last = parts[parts.length - 1]?.charAt(0) ?? '';
	return `${first}${last}`.toUpperCase();
});

const has_initials = computed(() => !has_image.value && initials.value.length > 0);

const resolved_alt = computed(() => props.alt || props.name || '');

const initials_size = computed(() => {
	const numeric = typeof props.size === 'number'
		? props.size
		: Number.parseFloat(String(props.size));

	if (!Number.isFinite(numeric)) return 'xsmall' as const;
	if (numeric >= 96) return 'xlarge' as const;
	if (numeric >= 72) return 'large' as const;
	if (numeric >= 56) return 'medium' as const;
	if (numeric >= 40) return 'small' as const;
	return 'xsmall' as const;
});
</script>

<template>
	<figure
		:class="['mu-thumbnail', `mu-thumbnail--${ shape }`]"
		:data-fit="fit"
		:style="frame_style"
		:aria-label="!has_image && resolved_alt ? resolved_alt : undefined"
	>
		<img
			v-if="has_image"
			class="mu-thumbnail__img"
			:src="props.src ?? ''"
			:alt="resolved_alt"
		/>
		<MuText
			v-else-if="has_initials"
			class="mu-thumbnail__text"
			:size="initials_size"
			weight="bold"
			aria-hidden="true"
		>
			{{ initials }}
		</MuText>
	</figure>
</template>

<style scoped lang="scss">
.mu-thumbnail {
	flex: 0 0 auto;
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	margin: 0;
	overflow: hidden;
	background-color: transparent;
	line-height: 0;

	&--circle {
		border-radius: 50%;
	}

	&--square {
		border-radius: 0;
	}

	&__img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	&[data-fit='cover'] &__img {
		object-fit: cover;
	}

	&__text {
		line-height: 1;
		user-select: none;
	}
}
</style>
