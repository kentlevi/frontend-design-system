import { computed, ref } from 'vue';
import {
    semanticColors,
    paletteColors,
    paletteOrder,
    type SemanticColorGroup,
} from '@/data/ui/colors';
import { getHexFromToken } from '@/utils/color';
import { toGuideLabel } from '@/utils/text';

type ColorView = 'palette' | 'semantic';

export function useGuideColors() {
    const view = ref<ColorView>('semantic');
    const search = ref('');

    const matches = (token: string, group: string) => {
        const q = search.value.toLowerCase();

        return (
            token.toLowerCase().includes(q) ||
            group.toLowerCase().includes(q) ||
            getHexFromToken(token).includes(q)
        );
    };

    const semanticEntries = computed(() =>
        (
            Object.entries(semanticColors) as [
                SemanticColorGroup,
                readonly string[],
            ][]
        )
            .map(
                ([group, tokens]) =>
                    [group, tokens.filter((t) => matches(t, group))] as const
            )
            .filter(([, tokens]) => tokens.length)
    );

    const paletteEntries = computed(() =>
        paletteOrder
            .map(
                (group) =>
                    [
                        group,
                        paletteColors[group].filter((t) => matches(t, group)),
                    ] as const
            )
            .filter(([, tokens]) => tokens.length)
    );

    return {
        view,
        search,
        semanticEntries,
        paletteEntries,
        format: toGuideLabel,
    };
}
