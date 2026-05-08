import { computed, ref } from 'vue';

export type GuideSizeOption = 'lg' | 'md' | 'sm' | 'custom';

export function useGuideTokenSize(
    initial: GuideSizeOption = 'md',
    initialCustom = 72
) {
    const selectedSize = ref<GuideSizeOption>(initial);
    const customSize = ref(initialCustom);

    const resolved_size = computed(() =>
        selectedSize.value === 'custom' ? customSize.value : selectedSize.value
    );

    return {
        selectedSize,
        customSize,
        resolved_size,
        resolvedSize: resolved_size,
    };
}

export function useGuideMappedSize<
    T extends Record<'sm' | 'md' | 'lg', number>,
>(map: T, initial: GuideSizeOption = 'md', initialCustom = 72) {
    const selectedSize = ref<GuideSizeOption>(initial);
    const customSize = ref(initialCustom);

    const resolved_size = computed(() =>
        selectedSize.value === 'custom'
            ? customSize.value
            : map[selectedSize.value]
    );

    return {
        selectedSize,
        customSize,
        resolved_size,
        resolvedSize: resolved_size,
    };
}
