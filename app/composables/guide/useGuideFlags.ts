import { flags } from '~/data/ui/flags';
import { useGuideMediaMappedSize } from '@/composables/guide/useGuideMediaSize';

const flagSizeMap = {
    sm: 24,
    md: 32,
    lg: 48,
} as const;

export function useGuideFlags() {
    const { selectedSize, customSize, resolvedSize } =
        useGuideMediaMappedSize(flagSizeMap);

    return {
        flags,
        selectedSize,
        customSize,
        resolvedSize,
    };
}
