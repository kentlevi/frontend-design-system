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

type ResponsiveOverride = {
	direction?: FlexDirection;
	gap?: number | string;
	justify?: FlexJustify;
	align?: FlexAlign;
	flexWrap?: string;
	padding?: number | string;
	paddingX?: number | string;
	paddingY?: number | string;
};

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
		// eslint-disable-next-line vue/require-default-prop
		tablet?: ResponsiveOverride;
		// eslint-disable-next-line vue/require-default-prop
		mobile?: ResponsiveOverride;
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

function emit_tier(
	tier: 'base' | 'tablet' | 'mobile',
	override: ResponsiveOverride,
	style: Record<string, string>
) {
	if (override.direction) style[`--mu-direction-${tier}`] = override.direction;
	if (override.justify) style[`--mu-justify-${tier}`] = override.justify;
	if (override.align) style[`--mu-align-${tier}`] = override.align;
	if (override.flexWrap) style[`--mu-flex-wrap-${tier}`] = override.flexWrap;

	const gap = format(override.gap);
	if (gap) style[`--mu-gap-${tier}`] = gap;

	const padding = format(override.padding);
	if (padding) style[`--mu-padding-${tier}`] = padding;

	const padding_x = format(override.paddingX);
	if (padding_x) style[`--mu-padding-x-${tier}`] = padding_x;

	const padding_y = format(override.paddingY);
	if (padding_y) style[`--mu-padding-y-${tier}`] = padding_y;
}

const custom_styles = computed(() => {
	const style: Record<string, string> = {};

	// Non-responsive: only emit inline when non-default (defaults live in scoped CSS).
	if (props.overflowY !== 'unset') style.overflowY = props.overflowY;
	if (props.overflowX !== 'unset') style.overflowX = props.overflowX;
	if (props.width !== 'auto') style.width = props.width;

	// Base tier: only emit CSS vars for explicit (non-default) values; defaults handled by fallback in scoped CSS.
	emit_tier('base', {
		direction: props.direction !== 'row' ? props.direction : undefined,
		gap: props.gap,
		justify: props.justify !== 'flex-start' ? props.justify : undefined,
		align: props.align !== 'stretch' ? props.align : undefined,
		flexWrap: props.flexWrap,
		padding: props.padding,
		paddingX: props.paddingX,
		paddingY: props.paddingY,
	}, style);

	if (props.tablet) emit_tier('tablet', props.tablet, style);
	if (props.mobile) emit_tier('mobile', props.mobile, style);

	return style;
});
</script>

<template>
	<div class="mu-linear-wrapper" :style="custom_styles">
		<slot />
	</div>
</template>

<style scoped lang="scss">
@use '../../assets/scss/foundation/breakpoints' as bp;

.mu-linear-wrapper {
	box-sizing: border-box;
	display: flex;
	width: auto;
	overflow-x: unset;
	overflow-y: unset;

	// Reset responsive CSS vars so a nested MuLinearWrapper does not inherit its parent's values.
	--mu-direction-base: initial;
	--mu-justify-base: initial;
	--mu-align-base: initial;
	--mu-flex-wrap-base: initial;
	--mu-gap-base: initial;
	--mu-padding-base: initial;
	--mu-padding-x-base: initial;
	--mu-padding-y-base: initial;
	--mu-direction-tablet: initial;
	--mu-justify-tablet: initial;
	--mu-align-tablet: initial;
	--mu-flex-wrap-tablet: initial;
	--mu-gap-tablet: initial;
	--mu-padding-tablet: initial;
	--mu-padding-x-tablet: initial;
	--mu-padding-y-tablet: initial;
	--mu-direction-mobile: initial;
	--mu-justify-mobile: initial;
	--mu-align-mobile: initial;
	--mu-flex-wrap-mobile: initial;
	--mu-gap-mobile: initial;
	--mu-padding-mobile: initial;
	--mu-padding-x-mobile: initial;
	--mu-padding-y-mobile: initial;

	flex-direction: var(--mu-direction-base, row);
	justify-content: var(--mu-justify-base, flex-start);
	align-items: var(--mu-align-base, stretch);
	flex-wrap: var(--mu-flex-wrap-base, nowrap);
	gap: var(--mu-gap-base, 0);

	padding-top: var(--mu-padding-y-base, var(--mu-padding-base, 0));
	padding-right: var(--mu-padding-x-base, var(--mu-padding-base, 0));
	padding-bottom: var(--mu-padding-y-base, var(--mu-padding-base, 0));
	padding-left: var(--mu-padding-x-base, var(--mu-padding-base, 0));
}

@include bp.tablet {
	.mu-linear-wrapper {
		flex-direction: var(--mu-direction-tablet, var(--mu-direction-base, row));
		justify-content: var(--mu-justify-tablet, var(--mu-justify-base, flex-start));
		align-items: var(--mu-align-tablet, var(--mu-align-base, stretch));
		flex-wrap: var(--mu-flex-wrap-tablet, var(--mu-flex-wrap-base, nowrap));
		gap: var(--mu-gap-tablet, var(--mu-gap-base, 0));

		padding-top: var(--mu-padding-y-tablet, var(--mu-padding-tablet, var(--mu-padding-y-base, var(--mu-padding-base, 0))));
		padding-right: var(--mu-padding-x-tablet, var(--mu-padding-tablet, var(--mu-padding-x-base, var(--mu-padding-base, 0))));
		padding-bottom: var(--mu-padding-y-tablet, var(--mu-padding-tablet, var(--mu-padding-y-base, var(--mu-padding-base, 0))));
		padding-left: var(--mu-padding-x-tablet, var(--mu-padding-tablet, var(--mu-padding-x-base, var(--mu-padding-base, 0))));
	}
}

@include bp.mobile {
	.mu-linear-wrapper {
		flex-direction: var(--mu-direction-mobile, var(--mu-direction-tablet, var(--mu-direction-base, row)));
		justify-content: var(--mu-justify-mobile, var(--mu-justify-tablet, var(--mu-justify-base, flex-start)));
		align-items: var(--mu-align-mobile, var(--mu-align-tablet, var(--mu-align-base, stretch)));
		flex-wrap: var(--mu-flex-wrap-mobile, var(--mu-flex-wrap-tablet, var(--mu-flex-wrap-base, nowrap)));
		gap: var(--mu-gap-mobile, var(--mu-gap-tablet, var(--mu-gap-base, 0)));

		padding-top: var(--mu-padding-y-mobile, var(--mu-padding-mobile, var(--mu-padding-y-tablet, var(--mu-padding-tablet, var(--mu-padding-y-base, var(--mu-padding-base, 0))))));
		padding-right: var(--mu-padding-x-mobile, var(--mu-padding-mobile, var(--mu-padding-x-tablet, var(--mu-padding-tablet, var(--mu-padding-x-base, var(--mu-padding-base, 0))))));
		padding-bottom: var(--mu-padding-y-mobile, var(--mu-padding-mobile, var(--mu-padding-y-tablet, var(--mu-padding-tablet, var(--mu-padding-y-base, var(--mu-padding-base, 0))))));
		padding-left: var(--mu-padding-x-mobile, var(--mu-padding-mobile, var(--mu-padding-x-tablet, var(--mu-padding-tablet, var(--mu-padding-x-base, var(--mu-padding-base, 0))))));
	}
}
</style>