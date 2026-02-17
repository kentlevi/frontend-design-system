import { computed } from 'vue';
import { guides } from '@/data/guide/guides';

export function useGuideIndex() {
    const visibleGuides = computed(() =>
        guides.filter((g) => g.path !== '/guide')
    );
    const baseGuides = computed(() =>
        visibleGuides.value.filter((g) => g.category === 'base')
    );
    const coreGuides = computed(() =>
        visibleGuides.value.filter((g) => g.category === 'core')
    );

    return {
        visibleGuides,
        baseGuides,
        coreGuides,
    };
}
