import { computed, ref } from 'vue';
import { useColorPicker } from '~/composables/guide/useColorPicker';
import { useIconGroups } from '~/composables/guide/useIconGroups';
import { useIconSize } from '~/composables/guide/useIconSize';

export function useGuideIcons() {
    const { grouped } = useIconGroups();
    const {
        selectedColor,
        selectedToken,
        hexInput,
        tokenHexQuery,
        dataColorQuery,
        hoverToken,
        hoverHex,
        isLight,
        allSemanticTokens,
        allPaletteTokens,
        tokenHexSuggestions,
        dataColorSuggestions,
        selectToken,
        onHexInput,
        onTokenHexQueryInput,
        onDataColorQueryInput,
        onSwatchHover,
        clearHover,
    } = useColorPicker();

    const {
        sizeTokens,
        selectedSize,
        customSize,
        selectSize,
        onCustomSize,
        isSelected,
    } = useIconSize();

    const copyMode = ref<'code' | 'name'>('code');
    const searchQuery = ref('');

    const getCopyProps = (name: (typeof grouped.value)[string][number]) => ({
        name,
        color: selectedColor.value,
        size: selectedSize.value,
    });

    const filtered_grouped = computed(() => {
        if (!searchQuery.value.trim()) return grouped.value;

        const q = searchQuery.value.toLowerCase();
        const result: Record<string, Array<(typeof grouped.value)[string][number]>> = {};

        for (const style in grouped.value) {
            const filtered = (grouped.value[style] ?? []).filter((name) =>
                name.toLowerCase().includes(q)
            );
            if (filtered.length) result[style] = filtered;
        }

        return result;
    });

    return {
        selectedColor,
        selectedToken,
        hexInput,
        tokenHexQuery,
        dataColorQuery,
        hoverToken,
        hoverHex,
        isLight,
        allSemanticTokens,
        allPaletteTokens,
        tokenHexSuggestions,
        dataColorSuggestions,
        selectToken,
        onHexInput,
        onTokenHexQueryInput,
        onDataColorQueryInput,
        onSwatchHover,
        clearHover,
        sizeTokens,
        selectedSize,
        customSize,
        selectSize,
        onCustomSize,
        isSelected,
        copyMode,
        searchQuery,
        getCopyProps,
        filtered_grouped,
        filteredGrouped: filtered_grouped,
    };
}
