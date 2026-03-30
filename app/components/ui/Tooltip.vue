<script setup lang="ts">
import type { PropType } from 'vue';
import { nextTick, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue';
import { useTooltip } from '~/composables/ui/useTooltip';
import type { UiTooltipProps, tooltip_alignments, tooltip_sides, tooltip_tones } from '~/data/ui/tooltip';
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
	align: {
		type: String as PropType<(typeof tooltip_alignments)[number]>,
		default: ui_tooltip_defaults.align,
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

const content_ref = ref<HTMLElement | null>(null);
const viewport_shift_style = ref<Record<string, string>>({
	'--ui-tooltip-viewport-shift-x': '0px',
	'--ui-tooltip-viewport-shift-y': '0px',
});

function resetViewportShift() {
	viewport_shift_style.value = {
		'--ui-tooltip-viewport-shift-x': '0px',
		'--ui-tooltip-viewport-shift-y': '0px',
	};
}

function updateViewportShift() {
	if (!props.open || !content_ref.value || typeof window === 'undefined') return;

	const rect = content_ref.value.getBoundingClientRect();
	const viewport_padding = 16;
	let shift_x = 0;
	let shift_y = 0;

	if (rect.right > window.innerWidth - viewport_padding) {
		shift_x -= rect.right - (window.innerWidth - viewport_padding);
	}

	if (rect.left < viewport_padding) {
		shift_x += viewport_padding - rect.left;
	}

	if (rect.bottom > window.innerHeight - viewport_padding) {
		shift_y -= rect.bottom - (window.innerHeight - viewport_padding);
	}

	if (rect.top < viewport_padding) {
		shift_y += viewport_padding - rect.top;
	}

	viewport_shift_style.value = {
		'--ui-tooltip-viewport-shift-x': `${Math.round(shift_x)}px`,
		'--ui-tooltip-viewport-shift-y': `${Math.round(shift_y)}px`,
	};
}

async function syncTooltipViewportShift() {
	if (!props.open) {
		resetViewportShift();
		return;
	}

	await nextTick();
	updateViewportShift();
}

onMounted(() => {
	window.addEventListener('resize', updateViewportShift);
	window.addEventListener('scroll', updateViewportShift, true);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', updateViewportShift);
	window.removeEventListener('scroll', updateViewportShift, true);
});

watch(() => props.open, () => {
	syncTooltipViewportShift();
});
</script>

<template>
	<div
		class="ui-tooltip"
		:data-side="props.side"
		:data-align="props.align"
		:data-mobile-side="props.mobileSide || null"
		:data-tone="props.tone"
		:style="css_vars"
	>
		<slot name="trigger" />

		<Transition name="ui-tooltip-slide">
			<div
				v-if="props.open"
				ref="content_ref"
				:class="['ui-tooltip-content', props.contentClass]"
				:style="viewport_shift_style"
				:role="props.role"
				:data-testid="props.contentTestid || null"
			>
				<slot />
			</div>
		</Transition>
	</div>
</template>
