export const tooltip_sides = ['right', 'left', 'top', 'bottom'] as const;
export const tooltip_tones = ['default', 'danger'] as const;

export type TooltipSide = (typeof tooltip_sides)[number];
export type TooltipTone = (typeof tooltip_tones)[number];

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

export const ui_tooltip_defaults: Required<
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