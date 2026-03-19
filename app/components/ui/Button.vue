<script setup lang="ts">
import { computed } from 'vue';
import UiIcon from '@/components/ui/Icon.vue';
import type { icons } from '~/data/ui/icons';
import type { ButtonVariant, ButtonSize, ButtonTone } from '~/data/ui/buttons';

type IconPosition = 'left' | 'right';
type IconName = keyof typeof icons;
type IconSizeValue = ButtonSize | number | `${number}`;
const buttonSizes = new Set<ButtonSize>(['sm', 'md', 'lg']);

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

const mergedStyle = computed<Record<string, string> | undefined>(() => {
	let numericSize: number | null = null;
	if (typeof props.size === 'number') {
		numericSize = props.size;
	} else if (typeof props.size === 'string' && !buttonSizes.has(props.size as ButtonSize)) {
		const parsed = Number(props.size);
		if (Number.isFinite(parsed)) numericSize = parsed;
	}

	const style = {
		...(props.style ?? {}),
		...(numericSize && !props.height ? { height: `${numericSize}px` } : {}),
		...(numericSize && props.iconOnly && !props.width ? { width: `${numericSize}px` } : {}),
		...(props.width ? { width: props.width } : {}),
		...(props.height ? { height: props.height } : {}),
	};

	return Object.keys(style).length ? style : undefined;
});

const normalizedIconSize = computed<ButtonSize | number>(() => {
	if (typeof props.iconSize === 'number') return props.iconSize;
	if (typeof props.iconSize === 'string') {
		if (buttonSizes.has(props.iconSize as ButtonSize)) {
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
		:style="mergedStyle"
		@click="emit('click', $event)"
	>
		<span v-if="selected && !loading" class="ui-button-indicator" />

		<span v-if="loading" class="ui-button-spinner" aria-hidden="true" />

		<UiIcon
			v-if="!loading && icon && iconPosition === 'left' && !iconOnly"
			:name="icon"
			:size="normalizedIconSize"
			decorative
			class="ui-button-icon"
		/>

		<UiIcon
			v-if="!loading && iconOnly && icon"
			:name="icon"
			:size="normalizedIconSize"
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
			:size="normalizedIconSize"
			decorative
			class="ui-button-icon"
		/>
	</button>
</template>

<style scoped lang="scss">
.ui-button-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>