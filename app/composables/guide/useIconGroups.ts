import { computed } from 'vue';
import { icons } from '~/data/ui/icons';

export function useIconGroups() {
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

    return { grouped };
}
