/* =========================================================
   BUTTON SIZES
   ---------------------------------------------------------
   Controls physical dimensions of the button component.
========================================================= */

export const buttonSizes = ['lg', 'md', 'sm'] as const;

/** Union type: "lg" | "md" | "sm" */
export type ButtonSize = (typeof buttonSizes)[number];

/* =========================================================
   BUTTON VARIANTS
   ---------------------------------------------------------
   Defines visual style of the button surface.
========================================================= */

export const buttonVariants = [
    'filled',
    'subtle',
    'outline',
    'tonal',
    'ghost',
] as const;

/** Union type of all variants */
export type ButtonVariant = (typeof buttonVariants)[number];

/* =========================================================
   BUTTON TONES
   ---------------------------------------------------------
   Semantic meaning of the action represented by the button.
========================================================= */

export const buttonTones = [
    {
        label: 'Primary',
        value: 'default',
        description:
            'Primary buttons use the brand’s main color to create strong visual recognition.',
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

/** Union type of tone values */
export type ButtonTone = (typeof buttonTones)[number]['value'];

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

export const buttonConfig = {
    sizes: buttonSizes,
    variants: buttonVariants,
    tones: buttonTones,
} as const;
