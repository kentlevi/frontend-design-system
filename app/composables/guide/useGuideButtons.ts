import { computed } from 'vue';
import { buttonDemoSections } from '~/data/ui/button-demos';

export function useGuideButtons() {
    const exampleSections = computed(() =>
        buttonDemoSections.filter((section) => section.type !== 'builder')
    );

    return {
        exampleSections,
    };
}
