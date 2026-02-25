<script setup lang="ts">
import type { PropType } from 'vue';
import { toRef } from 'vue';
import { useTooltip } from '~/composables/ui/useTooltip';
import type { UiTooltipProps } from '~/data/ui/tooltip';
import { tooltipSides, tooltipTones, uiTooltipDefaults } from '~/data/ui/tooltip';

const props = defineProps({
    open: {
        type: Boolean,
        default: uiTooltipDefaults.open,
    },
    side: {
        type: String as PropType<(typeof tooltipSides)[number]>,
        default: uiTooltipDefaults.side,
    },
    mobileSide: {
        type: String as PropType<(typeof tooltipSides)[number] | null>,
        default: uiTooltipDefaults.mobileSide,
    },
    tone: {
        type: String as PropType<(typeof tooltipTones)[number]>,
        default: uiTooltipDefaults.tone,
    },
    offset: {
        type: [Number, String] as PropType<UiTooltipProps['offset']>,
        default: uiTooltipDefaults.offset,
    },
    slideDistance: {
        type: [Number, String] as PropType<UiTooltipProps['slideDistance']>,
        default: uiTooltipDefaults.slideDistance,
    },
    role: {
        type: String,
        default: uiTooltipDefaults.role,
    },
    contentTestid: {
        type: String,
        default: uiTooltipDefaults.contentTestid,
    },
});

const { cssVars } = useTooltip({
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
        :style="cssVars"
    >
        <slot name="trigger" />

        <Transition name="ui-tooltip-slide">
            <div
                v-if="props.open"
                class="ui-tooltip-content"
                :role="props.role"
                :data-testid="props.contentTestid || null"
            >
                <slot />
            </div>
        </Transition>
    </div>
</template>
