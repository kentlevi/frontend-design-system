import { computed } from 'vue';
import { buttonDemoSections } from '~/data/ui/button-demos';

export function useGuideButtons() {
    const example_sections = computed(() =>
        buttonDemoSections.filter((section) => section.type !== 'builder')
    );

    return {
        example_sections,
        exampleSections: example_sections,
    };
}
