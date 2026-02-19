export type GuideItem = {
    title: string;
    description?: string;
    path: string;
    category?: 'base' | 'core';
};

export const guides: GuideItem[] = [
    {
        title: 'Overview',
        description:
            'Browse all foundational components and design system resources.',
        path: '/guide',
    },
    {
        title: 'Colors',
        description: 'Semantic color tokens used across the interface.',
        path: '/guide/colors',
        category: 'base',
    },
    {
        title: 'Icons',
        description:
            'Solid, regular, and light system icons with usage references.',
        path: '/guide/icons',
        category: 'base',
    },
    {
        title: 'Buttons',
        description:
            'All button variants, states, sizes, and accessibility behaviors.',
        path: '/guide/buttons',
        category: 'base',
    },
    {
        title: 'Form Controls',
        description:
            'Reusable inputs, textareas, and checkboxes for auth, profile, and checkout forms.',
        path: '/guide/form-controls',
        category: 'base',
    },
    {
        title: 'Modals',
        description:
            'Overlay dialogs for focused actions and contextual workflows.',
        path: '/guide/modals',
        category: 'core',
    },
    {
        title: 'Badges',
        description:
            'Status and metadata indicators using semantic tones and variants.',
        path: '/guide/badges',
        category: 'base',
    },
    {
        title: 'Flags',
        description:
            'Country flag assets and sizing rules used across the interface.',
        path: '/guide/flags',
        category: 'base',
    },
    {
        title: 'Social Icons',
        description: 'Brand, white, and black social media icon variants.',
        path: '/guide/social-icons',
        category: 'base',
    },
    {
        title: 'Logos',
        description:
            'Full and mark logo usage, color variations, and spacing guidelines.',
        path: '/guide/logos',
        category: 'base',
    },
];
