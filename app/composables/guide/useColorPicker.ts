import { ref, computed, onMounted } from 'vue';
import {
    semanticColors,
    paletteColors,
    type SemanticColorToken,
    type PaletteColorToken,
} from '~/data/ui/colors';
import { getHexFromToken, isValidHex } from '~/utils/color';

/* ---------------- helpers ---------------- */

const isLightColor = (hex: string) => {
    const c = hex.replace('#', '');
    if (c.length !== 6) return false;

    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
};

/* =====================================================
   CLEAN COLOR PICKER (single source of truth)
===================================================== */

export function useColorPicker() {
    /* ---------- SINGLE SOURCE ---------- */
    const hexInput = ref('#000000');

    /* ---------- optional token ---------- */
    const selectedToken = ref<SemanticColorToken | PaletteColorToken | ''>('');
    const tokenHexQuery = ref('');
    const dataColorQuery = ref('');

    /* ---------- DERIVED VALUES ---------- */
    const selected_color = computed(() =>
        selectedToken.value ? `var(--${selectedToken.value})` : hexInput.value
    );

    const is_light = computed(() => isLightColor(hexInput.value));

    /* ---------- TOKENS ---------- */
    const all_semantic_tokens = computed(() =>
        Object.values(semanticColors).flat()
    );

    const all_palette_tokens = computed(() =>
        Object.values(paletteColors).flat()
    );
    const all_color_tokens = computed(() => [
        ...all_semantic_tokens.value,
        ...all_palette_tokens.value,
    ]);
    const is_color_token = (
        token: string
    ): token is SemanticColorToken | PaletteColorToken =>
        all_color_tokens.value.some((value) => value === token);

    const token_hex_suggestions = computed(() => {
        const q = tokenHexQuery.value.trim().toLowerCase();
        if (!q) return all_color_tokens.value;

        return all_color_tokens.value.filter((token) => {
            const tokenHex = getHexFromToken(token).toLowerCase();
            return (
                token.toLowerCase().includes(q) ||
                `var(--${token})`.toLowerCase().includes(q) ||
                tokenHex.includes(q)
            );
        });
    });

    const data_color_suggestions = computed(() => {
        const q = dataColorQuery.value.trim().toLowerCase();
        if (!q) return all_color_tokens.value;

        return all_color_tokens.value.filter((token) =>
            token.toLowerCase().includes(q)
        );
    });

    /* ---------- TOOLTIP ---------- */
    const hoverToken = ref<string | null>(null);
    const hoverHex = ref('');

    /* ---------- ACTIONS ---------- */

    function selectToken(token: string) {
        selectedToken.value = token as SemanticColorToken | PaletteColorToken;

        hexInput.value = getHexFromToken(token);
        tokenHexQuery.value = token;
        dataColorQuery.value = token;
    }

    function onSwatchHover(token: string) {
        hoverToken.value = token;
        hoverHex.value = getHexFromToken(token);
    }

    function clearHover() {
        hoverToken.value = null;
    }

    function onHexInput() {
        if (!isValidHex(hexInput.value)) return;
        selectedToken.value = '';
        hexInput.value = hexInput.value.toLowerCase();
        tokenHexQuery.value = hexInput.value;
    }

    function onTokenHexQueryInput() {
        const q = tokenHexQuery.value.trim().toLowerCase();
        if (!q) return;

        const directVar = q.match(/^var\(--([a-z0-9-]+)\)$/);
        if (directVar) {
            const token = directVar[1];
            if (token && is_color_token(token)) selectToken(token);
            return;
        }

        if (is_color_token(q)) {
            selectToken(q);
            return;
        }

        const byHexToken = all_color_tokens.value.find(
            (token) => getHexFromToken(token).toLowerCase() === q
        );
        if (byHexToken) {
            selectToken(byHexToken);
            return;
        }

        if (isValidHex(q)) {
            selectedToken.value = '';
            hexInput.value = q;
            dataColorQuery.value = '';
        }
    }

    function onDataColorQueryInput() {
        const q = dataColorQuery.value.trim().toLowerCase();
        if (!q) return;

        if (is_color_token(q)) {
            selectToken(q);
            return;
        }

        const groupEntry = Object.entries(paletteColors).find(
            ([group]) => group.toLowerCase() === q
        );
        if (groupEntry?.[1]?.length) {
            selectToken(groupEntry[1][0]);
        }
    }

    onMounted(() => {
        if (selectedToken.value) {
            hexInput.value = getHexFromToken(selectedToken.value);
            tokenHexQuery.value = selectedToken.value;
            dataColorQuery.value = selectedToken.value;
        }
    });

    return {
        /* state */
        hexInput,
        selected_color,
        selectedColor: selected_color,
        selectedToken,
        tokenHexQuery,
        dataColorQuery,

        /* ui */
        hoverToken,
        hoverHex,
        is_light,
        isLight: is_light,
        token_hex_suggestions,
        tokenHexSuggestions: token_hex_suggestions,
        data_color_suggestions,
        dataColorSuggestions: data_color_suggestions,

        /* data */
        all_semantic_tokens,
        allSemanticTokens: all_semantic_tokens,
        all_palette_tokens,
        allPaletteTokens: all_palette_tokens,

        /* actions */
        selectToken,
        onHexInput,
        onTokenHexQueryInput,
        onDataColorQueryInput,
        onSwatchHover,
        clearHover,
    };
}
