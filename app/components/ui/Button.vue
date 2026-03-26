<script setup lang="ts">
import { computed } from 'vue';
import UiIcon from '@/components/ui/Icon.vue';
import type { icons } from '~/data/ui/icons';
import type { ButtonVariant, ButtonSize, ButtonTone } from '~/data/ui/buttons';

type IconPosition = 'left' | 'right';
type IconName = keyof typeof icons;
type IconSizeValue = ButtonSize | number | `${number}`;
const button_sizes = new Set<ButtonSize>(['sm', 'md', 'lg']);

const props = withDefaults(
	defineProps<{
		variant?: ButtonVariant;
		size?: ButtonSize | number | `${number}`;
		tone?: ButtonTone;

		icon?: IconName | null;
		iconPosition?: IconPosition;
		iconSize?: IconSizeValue;
		iconOnly?: boolean;
		srLabel?: string;

		selected?: boolean;
		disabled?: boolean;
		loading?: boolean;
		noHover?: boolean;

		width?: string;
		height?: string;
		style?: Record<string, string>;
		labelClass?: string;
	}>(),
	{
		variant: 'filled',
		size: 'md',
		tone: 'default',

		icon: null,
		iconPosition: 'left',
		iconSize: 'sm',
		iconOnly: false,
		srLabel: '',

		selected: false,
		disabled: false,
		loading: false,
		noHover: false,
		width: '',
		height: '',
		style: () => ({}),
		labelClass: '',
	}
);

const emit = defineEmits<{
	click: [event: MouseEvent];
}>();

const merged_style = computed<Record<string, string> | undefined>(() => {
	let numeric_size: number | null = null;
	if (typeof props.size === 'number') {
		numeric_size = props.size;
	} else if (typeof props.size === 'string' && !button_sizes.has(props.size as ButtonSize)) {
		const parsed = Number(props.size);
		if (Number.isFinite(parsed)) numeric_size = parsed;
	}

	const style = {
		...(props.style ?? {}),
		...(numeric_size && !props.height ? { height: `${numeric_size}px` } : {}),
		...(numeric_size && props.iconOnly && !props.width ? { width: `${numeric_size}px` } : {}),
		...(props.width ? { width: props.width } : {}),
		...(props.height ? { height: props.height } : {}),
	};

	return Object.keys(style).length ? style : undefined;
});

const normalized_icon_size = computed<ButtonSize | number>(() => {
	if (typeof props.iconSize === 'number') return props.iconSize;
	if (typeof props.iconSize === 'string') {
		if (button_sizes.has(props.iconSize as ButtonSize)) {
			return props.iconSize as ButtonSize;
		}
		const parsed = Number(props.iconSize);
		if (Number.isFinite(parsed)) return parsed;
	}
	return 'sm';
});
</script>

<template>
	<button
		class="ui-button"
		type="button"
		:data-variant="variant"
		:data-size="size"
		:data-tone="tone ?? 'primary'"
		:data-selected="selected ? 'true' : 'false'"
		:data-icon-only="iconOnly ? 'true' : 'false'"
		:data-no-hover="noHover ? 'true' : 'false'"
		:disabled="disabled || loading"
		:aria-busy="loading || undefined"
		:style="merged_style"
		@click="emit('click', $event)"
	>
		<span v-if="selected && !loading" class="ui-button-indicator" />

		<span v-if="loading" class="ui-button-spinner" aria-hidden="true" />

		<UiIcon
			v-if="!loading && icon && iconPosition === 'left' && !iconOnly"
			:name="icon"
			:size="normalized_icon_size"
			decorative
			class="ui-button-icon"
		/>

		<UiIcon
			v-if="!loading && iconOnly && icon"
			:name="icon"
			:size="normalized_icon_size"
			decorative
			class="ui-button-icon"
		/>

		<span v-if="iconOnly && srLabel" class="ui-button-sr-only">
			{{ srLabel }}
		</span>

		<span
			v-if="!iconOnly && !loading && $slots.default"
			:class="['ui-button-label', props.labelClass]"
		>
			<slot />
		</span>

		<UiIcon
			v-if="!loading && icon && iconPosition === 'right' && !iconOnly"
			:name="icon"
			:size="normalized_icon_size"
			decorative
			class="ui-button-icon"
		/>
	</button>
</template>