import type { GuideSizeOption } from '@/composables/guide/useGuideSize';
import {
    useGuideMappedSize,
    useGuideTokenSize,
} from '@/composables/guide/useGuideSize';

export function useGuideMediaTokenSize(initialCustom = 72) {
    return useGuideTokenSize('md', initialCustom);
}

export function useGuideMediaMappedSize<
    T extends Record<'sm' | 'md' | 'lg', number>,
>(map: T, initialCustom = 72, initial: GuideSizeOption = 'md') {
    return useGuideMappedSize(map, initial, initialCustom);
}
