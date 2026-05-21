// Responsive breakpoint tokens
//
// Mirrors `assets/scss/foundation/_breakpoints.scss`. Keep values in sync.
//
// Design tiers:
//   - Desktop (base, canvas 1920px)  -> no media query
//   - Tablet                         -> max-width 1024px
//   - Mobile                         -> max-width 600px

export const BREAKPOINTS = {
	tablet: 1024,
	mobile: 600,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;