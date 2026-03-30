<script setup lang="ts">
import type { PropType } from 'vue';
import { toRef } from 'vue';
import { useTooltip } from '~/composables/ui/useTooltip';
import type { UiTooltipProps, tooltip_sides, tooltip_tones } from '~/data/ui/tooltip';
import { ui_tooltip_defaults } from '~/data/ui/tooltip';

const props = defineProps({
	open: {
		type: Boolean,
		default: ui_tooltip_defaults.open,
	},
	side: {
		type: String as PropType<(typeof tooltip_sides)[number]>,
		default: ui_tooltip_defaults.side,
	},
	mobileSide: {
		type: String as PropType<(typeof tooltip_sides)[number] | null>,
		default: ui_tooltip_defaults.mobileSide,
	},
	tone: {
		type: String as PropType<(typeof tooltip_tones)[number]>,
		default: ui_tooltip_defaults.tone,
	},
	offset: {
		type: [Number, String] as PropType<UiTooltipProps['offset']>,
		default: ui_tooltip_defaults.offset,
	},
	slideDistance: {
		type: [Number, String] as PropType<UiTooltipProps['slideDistance']>,
		default: ui_tooltip_defaults.slideDistance,
	},
	role: {
		type: String,
		default: ui_tooltip_defaults.role,
	},
	contentTestid: {
		type: String,
		default: ui_tooltip_defaults.contentTestid,
	},
	contentClass: {
		type: String,
		default: '',
	},
});

const { css_vars } = useTooltip({
	offset: toRef(props, 'offset'),
	slideDistance: toRef(props, 'slideDistance'),
});
</script>

<template>
	<div
		class="ui-tooltip"
		:data-side="props.side"
		:data-mobile-side="props.mobileSide || null"
		:data-tone="props.tone"
		:style="css_vars"
	>
		<slot name="trigger" />

		<Transition name="ui-tooltip-slide">
			<div
				v-if="props.open"
				:class="['ui-tooltip-content', props.contentClass]"
				:role="props.role"
				:data-testid="props.contentTestid || null"
			>
				<slot />
			</div>
		</Transition>
	</div>
</template>