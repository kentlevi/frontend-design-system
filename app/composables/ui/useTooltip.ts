import { computed, toValue  } from 'vue';

import type { UiTooltipProps } from '~/data/ui/tooltip';
import type { MaybeRefOrGetter } from 'vue';

type TooltipStyleProps = {
    offset: MaybeRefOrGetter<UiTooltipProps['offset']>;
    slideDistance: MaybeRefOrGetter<UiTooltipProps['slideDistance']>;
};

function normalizeCssUnit(value: number | string | undefined, fallback: number): string {
    const resolved = value ?? fallback;
    return typeof resolved === 'number' ? `${resolved}px` : resolved;
}

export function useTooltip(styleProps: TooltipStyleProps) {
    const cssVars = computed<Record<string, string>>(() => ({
        '--ui-tooltip-offset': normalizeCssUnit(toValue(styleProps.offset), 10),
        '--ui-tooltip-slide-distance': normalizeCssUnit(toValue(styleProps.slideDistance), 24),
    }));

    return {
        cssVars,
    };
}
