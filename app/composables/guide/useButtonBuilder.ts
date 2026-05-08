import { ref, computed, watch } from 'vue';
import {
    buttonSizes as sizes,
    buttonVariants as variants,
    buttonTones as tones,
    type ButtonSize,
    type ButtonTone,
    type ButtonVariant,
} from '~/data/ui/buttons';

type ColorMode = 'tone' | 'custom';

export function useButtonBuilder(customIconLeft: any, customIconRight: any) {
    const colorMode = ref<ColorMode>('tone');

    const customVariant = ref<ButtonVariant>(variants[0]);
    const customSize = ref<ButtonSize>(sizes[1] ?? sizes[0]);
    const defaultNeutralTone =
        tones.find((tone) => tone.value === 'neutral')?.value ?? tones[0].value;
    const customTone = ref<ButtonTone>(defaultNeutralTone);

    /* ================= CUSTOM COLORS ================= */
    const customColor = ref('var(--brand-secondary)');
    const customTextColor = ref('var(--text-inverse)');

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

    const setTone = (tone: ButtonTone) => {
        customTone.value = tone;
        colorMode.value = 'tone';
    };

    /* ================= INLINE CSS VARIABLES ================= */
    const custom_style = computed<Record<string, string>>(() =>
        colorMode.value === 'custom'
            ? {
                  '--btn-bg': customColor.value,
                  '--btn-fg': customTextColor.value,
              }
            : ({} as Record<string, string>)
    );

    /* ================= REMOVE TONE IN CUSTOM MODE ================= */
    const preview_tone = computed(() =>
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

        custom_style,
        customStyle: custom_style,
        preview_tone,
        previewTone: preview_tone,

        setTone,
        setCustomMode,

        colorMode,
    };
}
