import { computed, ref } from 'vue';
import { icons } from '~/data/ui/icons';

export function useIcons() {
    /* ---------- GROUP ICONS BY PREFIX ---------- */
    const grouped = computed(() => {
        const groups: Record<string, string[]> = {};

        Object.keys(icons).forEach((name) => {
            const style = name.split('-')[0];

            if (!groups[style]) groups[style] = [];
            groups[style].push(name);
        });

        Object.values(groups).forEach((arr) => arr.sort());
        return groups;
    });

    /* ---------- DEFAULT COLOR ---------- */
    const selectedColor = ref('#0f1117');

    /* ---------- DESIGN SYSTEM PALETTE ---------- */
    const palette = [
        '#ffd826', // gold-60
        '#3d4557', // abyss-60
        '#525766', // gray-80
        '#28b428', // success-60
        '#e66f00', // warning-60
        '#e63939', // error-60
        '#2a43e6', // ultramarine-60
        '#1a8cff', // azure-50
        '#00b386', // aloha-60
        '#c93a4f', // blood-60
        '#e6a200', // amber-60
    ];

    function setColor(color: string) {
        selectedColor.value = color;
    }

    return {
        grouped,
        palette,
        selectedColor,
        setColor,
    };
}
