// ~/composables/guide/useColorSuggestions.ts
import { semanticColors, paletteColors } from '~/data/ui/colors';

/* Convert token → CSS variable */
export function tokenToCssVar(token: string) {
    return `var(--${token})`;
}

/* Provide grouped + flat suggestions */
export function useColorSuggestions() {
    const semantic = Object.values(semanticColors).flat();
    const palette = Object.values(paletteColors).flat();

    return {
        semantic,
        palette,
        all: [...semantic, ...palette],
    };
}
