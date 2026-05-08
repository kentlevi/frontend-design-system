/* =========================================================
   BUTTON SIZES
   ---------------------------------------------------------
   Controls physical dimensions of the button component.
========================================================= */

export const button_sizes = ['lg', 'md', 'sm'] as const;
export const buttonSizes = button_sizes;

/** Union type: "lg" | "md" | "sm" */
export type ButtonSize = (typeof button_sizes)[number];

/* =========================================================
   BUTTON VARIANTS
   ---------------------------------------------------------
   Defines visual style of the button surface.
========================================================= */

export const button_variants = [
	'filled',
	'subtle',
	'outline',
	'tonal',
	'ghost',
] as const;
export const buttonVariants = button_variants;

/** Union type of all variants */
export type ButtonVariant = (typeof button_variants)[number];

/* =========================================================
   BUTTON TONES
   ---------------------------------------------------------
   Semantic meaning of the action represented by the button.
========================================================= */

export const button_tones = [
	{
		label: 'Primary',
		value: 'default',
		description:
            'Primary buttons use the brandâ€™s main color to create strong visual recognition.',
	},
	{
		label: 'Accent',
		value: 'accent',
		description:
            'Accent buttons provide secondary emphasis using accent brand colors.',
	},
	{
		label: 'Neutral',
		value: 'neutral',
		description:
            'Neutral buttons are grayscale and suitable for low-emphasis actions.',
	},
	{
		label: 'Success',
		value: 'success',
		description:
            'Success buttons communicate confirmation or positive completion.',
	},
	{
		label: 'Danger',
		value: 'danger',
		description:
            'Danger buttons indicate destructive or irreversible actions.',
	},
] as const;
export const buttonTones = button_tones;

/** Union type of tone values */
export type ButtonTone = (typeof button_tones)[number]['value'];

/* =========================================================
   BUTTON OPTIONS TYPE
   ---------------------------------------------------------
   Shared prop shape for docs, builders, and components.
========================================================= */

export interface ButtonOptions {
	size?: ButtonSize;
	variant?: ButtonVariant;
	tone?: ButtonTone;
	iconLeft?: string;
	iconRight?: string;
	iconOnly?: boolean;
}

/* =========================================================
   OPTIONAL: CENTRALIZED CONFIG OBJECT
   ---------------------------------------------------------
   Useful for importing a single object across the system.
========================================================= */

export const button_config = {
	sizes: button_sizes,
	variants: button_variants,
	tones: button_tones,
} as const;