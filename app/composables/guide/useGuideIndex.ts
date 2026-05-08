import { computed } from 'vue';
import { guides } from '@/data/guide/guides';

export function useGuideIndex() {
    const visible_guides = computed(() =>
        guides.filter((g) => g.path !== '/guide')
    );
    const base_guides = computed(() =>
        visible_guides.value.filter((g) => g.category === 'base')
    );
    const core_guides = computed(() =>
        visible_guides.value.filter((g) => g.category === 'core')
    );

    return {
        visible_guides,
        visibleGuides: visible_guides,
        base_guides,
        baseGuides: base_guides,
        core_guides,
        coreGuides: core_guides,
    };
}
