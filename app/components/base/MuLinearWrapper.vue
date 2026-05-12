<script setup lang="ts">
import { computed } from 'vue';

type FlexJustify =
	| 'flex-start'
	| 'flex-end'
	| 'center'
	| 'space-between'
	| 'space-around'
	| 'space-evenly';

type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
type FlexDirection = 'row' | 'column';

const props = withDefaults(
	defineProps<{
		direction?: FlexDirection;
		// eslint-disable-next-line vue/require-default-prop
		gap?: number | string;
		justify?: FlexJustify;
		align?: FlexAlign;
		overflowY?: string;
		overflowX?: string;
		width?: string;
		// eslint-disable-next-line vue/require-default-prop
		flexWrap?: string;
		// eslint-disable-next-line vue/require-default-prop
		padding?: number | string;
		// eslint-disable-next-line vue/require-default-prop
		paddingX?: number | string;
		// eslint-disable-next-line vue/require-default-prop
		paddingY?: number | string;
	}>(),
	{
		direction: 'row',
		justify: 'flex-start',
		align: 'stretch',
		overflowY: 'unset',
		overflowX: 'unset',
		width: 'auto',
	}
);

const format = (value?: number | string) => {
	if (value === undefined) return undefined;
	return typeof value === 'number' ? `${value}px` : value;
};

const custom_styles = computed(() => {
	const style: Record<string, string> = {
		display: 'flex',
		flexDirection: props.direction,
		justifyContent: props.justify,
		alignItems: props.align,
		overflowY: props.overflowY,
		overflowX: props.overflowX,
		width: props.width,
	};

	if (props.flexWrap) {
		style.flexWrap = props.flexWrap;
	}

	const gap = format(props.gap);
	if (gap) {
		style.gap = gap;
	}

	const padding = format(props.padding);
	if (padding) {
		style.padding = padding;
	}

	const padding_x = format(props.paddingX);
	if (padding_x) {
		style.paddingLeft = padding_x;
		style.paddingRight = padding_x;
	}

	const padding_y = format(props.paddingY);
	if (padding_y) {
		style.paddingTop = padding_y;
		style.paddingBottom = padding_y;
	}

	return style;
});
</script>

<template>
	<div class="mu-linear-wrapper" :style="custom_styles">
		<slot />
	</div>
</template>

<style scoped>
.mu-linear-wrapper {
	box-sizing: border-box;
}
</style>
