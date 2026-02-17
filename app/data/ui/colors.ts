/* =========================================================
   SEMANTIC COLOR TOKENS
   Must match semantic.scss + semantic-vars.scss exactly
========================================================= */

export const semanticColors = {
    /* BACKGROUND */
    background: ['bg-page', 'bg-surface', 'bg-muted', 'bg-inverse'],

    /* TEXT */
    text: ['text-primary', 'text-secondary', 'text-muted', 'text-inverse'],

    /* BORDER */
    border: ['border-default', 'border-strong', 'border-inverse'],

    /* BRAND */
    brand: [
        'brand-primary',
        'brand-primary-hover',
        'brand-primary-active',
        'brand-secondary',
        'brand-accent',
    ],

    /* STATE (UI READY ONLY) */
    state: [
        'success',
        'success-bg',
        'warning',
        'warning-bg',
        'error',
        'error-bg',
    ],

    /* INTERACTIVE */
    interactive: ['link-color', 'link-hover', 'focus-ring'],

    /* SURFACE (MEANING LEVEL) */
    surface: [
        'surface-default',
        'surface-subtle',
        'surface-raised',
        'surface-inverse',
    ],

    /* CONTRAST */
    contrast: ['contrast-light', 'contrast-dark'],

    /* DISABLED */
    disabled: ['text-disabled', 'bg-disabled', 'border-disabled'],

    /* OVERLAY */
    overlay: ['overlay-backdrop', 'overlay-soft'],
} as const;

/* =========================================================
   TYPES — AUTOCOMPLETE + SAFETY
========================================================= */

export type SemanticColorGroup = keyof typeof semanticColors;

export type SemanticColorToken =
    (typeof semanticColors)[SemanticColorGroup][number];

/* =========================================================
   PALETTE COLOR TOKENS (RAW SCALE COLORS)
========================================================= */

export const paletteColors = {
    brandBase: ['gold-base', 'abyss-base'],

    commonBase: ['white-base', 'black-base', 'gray-base'],

    informativeBase: ['success-base', 'warning-base', 'error-base'],

    otherBase: [
        'ultramarine-base',
        'lynch-base',
        'azure-base',
        'aloha-base',
        'blood-base',
        'amber-base',
    ],

    primitives: ['white', 'black-pure', 'transparent'],

    gold: [
        'gold-10',
        'gold-20',
        'gold-30',
        'gold-40',
        'gold-50',
        'gold-60',
        'gold-70',
        'gold-80',
        'gold-90',
        'gold-100',
    ],

    abyss: [
        'abyss-10',
        'abyss-20',
        'abyss-30',
        'abyss-40',
        'abyss-50',
        'abyss-60',
        'abyss-70',
        'abyss-80',
        'abyss-90',
        'abyss-100',
    ],

    gray: [
        'gray-10',
        'gray-20',
        'gray-30',
        'gray-40',
        'gray-50',
        'gray-60',
        'gray-70',
        'gray-80',
        'gray-90',
        'gray-100',
    ],

    success: [
        'success-10',
        'success-20',
        'success-30',
        'success-40',
        'success-50',
        'success-60',
        'success-70',
        'success-80',
        'success-90',
        'success-100',
    ],

    warning: [
        'warning-10',
        'warning-20',
        'warning-30',
        'warning-40',
        'warning-50',
        'warning-60',
        'warning-70',
        'warning-80',
        'warning-90',
        'warning-100',
    ],

    error: [
        'error-10',
        'error-20',
        'error-30',
        'error-40',
        'error-50',
        'error-60',
        'error-70',
        'error-80',
        'error-90',
        'error-100',
    ],

    ultramarine: [
        'ultramarine-10',
        'ultramarine-20',
        'ultramarine-30',
        'ultramarine-40',
        'ultramarine-50',
        'ultramarine-60',
        'ultramarine-70',
        'ultramarine-80',
        'ultramarine-90',
        'ultramarine-100',
    ],

    lynch: [
        'lynch-10',
        'lynch-20',
        'lynch-30',
        'lynch-40',
        'lynch-50',
        'lynch-60',
        'lynch-70',
        'lynch-80',
        'lynch-90',
        'lynch-100',
    ],

    azure: [
        'azure-10',
        'azure-20',
        'azure-30',
        'azure-40',
        'azure-50',
        'azure-60',
        'azure-70',
        'azure-80',
        'azure-90',
        'azure-100',
    ],

    aloha: [
        'aloha-10',
        'aloha-20',
        'aloha-30',
        'aloha-40',
        'aloha-50',
        'aloha-60',
        'aloha-70',
        'aloha-80',
        'aloha-90',
        'aloha-100',
    ],

    blood: [
        'blood-10',
        'blood-20',
        'blood-30',
        'blood-40',
        'blood-50',
        'blood-60',
        'blood-70',
        'blood-80',
        'blood-90',
        'blood-100',
    ],

    amber: [
        'amber-10',
        'amber-20',
        'amber-30',
        'amber-40',
        'amber-50',
        'amber-60',
        'amber-70',
        'amber-80',
        'amber-90',
        'amber-100',
    ],
} as const;

export const paletteOrder = [
    'brandBase',
    'commonBase',
    'informativeBase',
    'otherBase',
    'primitives',
    'gold',
    'ultramarine',
    'azure',
    'aloha',
    'lynch',
    'gray',
    'success',
    'warning',
    'error',
    'blood',
    'amber',
    'abyss',
] as const;

/* =========================================================
   PALETTE TYPES
========================================================= */

export type PaletteColorGroup = keyof typeof paletteColors;

export type PaletteColorToken =
    (typeof paletteColors)[PaletteColorGroup][number];
