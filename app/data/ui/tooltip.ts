export const tooltipSides = ['right', 'left', 'top', 'bottom'] as const;
export const tooltipTones = ['default', 'danger'] as const;

export type TooltipSide = (typeof tooltipSides)[number];
export type TooltipTone = (typeof tooltipTones)[number];

export interface UiTooltipProps {
    open?: boolean;
    side?: TooltipSide;
    mobileSide?: TooltipSide | null;
    tone?: TooltipTone;
    offset?: number | string;
    slideDistance?: number | string;
    role?: string;
    contentTestid?: string;
}

export const uiTooltipDefaults: Required<
    Pick<UiTooltipProps, 'open' | 'side' | 'mobileSide' | 'tone' | 'offset' | 'slideDistance' | 'role' | 'contentTestid'>
> = {
    open: false,
    side: 'right',
    mobileSide: null,
    tone: 'default',
    offset: 10,
    slideDistance: 24,
    role: 'status',
    contentTestid: '',
};
