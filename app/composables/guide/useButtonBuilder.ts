import { ref, computed, watch } from 'vue';
import {
    buttonSizes as sizes,
    buttonVariants as variants,
    buttonTones as tones,
} from '~/data/ui/buttons';

type ColorMode = 'tone' | 'custom';

export function useButtonBuilder(customIconLeft: any, customIconRight: any) {
    const colorMode = ref<ColorMode>('tone');

    const customVariant = ref(variants[0]);
    const customSize = ref(sizes[1] ?? sizes[0]);
    const customTone = ref(tones[0].value);

    /* ================= CUSTOM COLORS ================= */
    const customColor = ref('var(--brand-primary)');
    const customTextColor = ref('var(--brand-secondary)');

    /* 🔥 AUTO-SWITCH TO CUSTOM MODE WHEN COLORS CHANGE */
    watch(customColor, () => {
        colorMode.value = 'custom';
    });

    watch(customTextColor, () => {
        colorMode.value = 'custom';
    });

    const customLabel = ref('Custom Button');
    const iconOnly = ref(false);

    /* ================= SWITCH TO CUSTOM MODE ================= */
    const setCustomMode = () => {
        colorMode.value = 'custom';
    };

    /* ================= ICON-ONLY RULES ================= */
    watch(iconOnly, (val) => {
        if (!val) return;

        if (!customIconLeft.value && !customIconRight.value) {
            iconOnly.value = false;
        }

        if (customIconLeft.value && customIconRight.value) {
            customIconRight.value = undefined;
        }
    });

    const setTone = (tone: string) => {
        customTone.value = tone;
        colorMode.value = 'tone';
    };

    /* ================= INLINE CSS VARIABLES ================= */
    const customStyle = computed<Record<string, string>>(() =>
        colorMode.value === 'custom'
            ? {
                  '--btn-bg': customColor.value,
                  '--btn-fg': customTextColor.value,
              }
            : {}
    );

    /* ================= REMOVE TONE IN CUSTOM MODE ================= */
    const previewTone = computed(() =>
        colorMode.value === 'custom' ? undefined : customTone.value
    );

    return {
        variants,
        sizes,
        tones,

        customVariant,
        customSize,
        customTone,

        customColor,
        customTextColor,

        customLabel,
        iconOnly,

        customStyle,
        previewTone,

        setTone,
        setCustomMode,

        colorMode,
    };
}
