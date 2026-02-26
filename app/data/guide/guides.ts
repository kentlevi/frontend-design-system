export type GuideItem = {
    title: string;
    description?: string;
    path: string;
    category?: 'base' | 'core';
    status?: 'draft' | 'stable' | 'deprecated';
    tags?: string[];
    usedIn?: Array<{
        label: string;
        path: string;
        line?: number;
    }>;
    related?: string[];
};

export const guides: GuideItem[] = [
    {
        title: 'Overview',
        description:
            'Browse all foundational components and design system resources.',
        path: '/guide',
        status: 'stable',
        tags: ['foundations', 'navigation', 'governance'],
    },
    {
        title: 'Colors',
        description: 'Semantic color tokens used across the interface.',
        path: '/guide/colors',
        category: 'base',
        status: 'stable',
        tags: ['tokens', 'color', 'semantics', 'theme'],
        usedIn: [
            { label: 'Button', path: 'frontend/app/components/ui/Button.vue' },
            { label: 'Badge', path: 'frontend/app/components/ui/Badge.vue' },
        ],
        related: ['/guide/icons', '/guide/buttons', '/guide/color-swatches'],
    },
    {
        title: 'Icons',
        description:
            'Solid, regular, and light system icons with usage references.',
        path: '/guide/icons',
        category: 'base',
        status: 'stable',
        tags: ['icons', 'assets', 'accessibility'],
        usedIn: [
            { label: 'Header Actions', path: 'frontend/app/components/layout/app-header/AppHeader.vue' },
        ],
        related: ['/guide/buttons', '/guide/social-icons'],
    },
    {
        title: 'Buttons',
        description:
            'All button variants, states, sizes, and accessibility behaviors.',
        path: '/guide/buttons',
        category: 'base',
        status: 'stable',
        tags: ['actions', 'states', 'inputs'],
        usedIn: [
            { label: 'Button Component', path: 'frontend/app/components/ui/Button.vue' },
            { label: 'Auth Login', path: 'frontend/app/pages/auth/login/index.vue' },
        ],
        related: ['/guide/icons', '/guide/form-controls', '/guide/testing'],
    },
    {
        title: 'Cards',
        description:
            'Composable card layouts for media, metadata, actions, and interactive containers.',
        path: '/guide/cards',
        category: 'base',
        status: 'stable',
        tags: ['layout', 'cards', 'media'],
        usedIn: [
            { label: 'Product List', path: 'frontend/app/pages/stickers/index.vue' },
        ],
        related: ['/guide/carousel', '/guide/spacing'],
    },
    {
        title: 'Carousel',
        description:
            'Slide-based content patterns with controls, autoplay behavior, and accessibility semantics.',
        path: '/guide/carousel',
        category: 'base',
        status: 'draft',
        tags: ['motion', 'slider', 'reviews'],
        usedIn: [
            { label: 'Guide Carousel Demo', path: 'frontend/app/pages/guide/carousel.vue' },
        ],
        related: ['/guide/cards', '/guide/animation', '/guide/testing'],
    },
    {
        title: 'Form Controls',
        description:
            'Reusable inputs, textareas, and checkboxes for auth, profile, and checkout forms.',
        path: '/guide/form-controls',
        category: 'base',
        status: 'stable',
        tags: ['forms', 'validation', 'input'],
        usedIn: [
            { label: 'Auth Flow Guide', path: 'frontend/app/pages/guide/auth-flow.vue' },
            { label: 'Form Controls UI', path: 'frontend/app/components/ui/Input.vue' },
        ],
        related: ['/guide/buttons', '/guide/auth-flow'],
    },
    {
        title: 'Tooltip',
        description:
            'Contextual helper messaging for validation and inline control guidance.',
        path: '/guide/tooltip',
        category: 'base',
        status: 'stable',
        tags: ['tooltip', 'validation', 'feedback'],
        usedIn: [
            { label: 'Tooltip UI', path: 'frontend/app/components/ui/Tooltip.vue' },
            { label: 'Auth Register', path: 'frontend/app/components/auth/register/AuthRegisterCard.vue' },
        ],
        related: ['/guide/form-controls', '/guide/auth-flow', '/guide/testing'],
    },
    {
        title: 'Typography',
        description:
            'Type scale, weights, and text usage patterns for headings and body copy.',
        path: '/guide/typography',
        category: 'base',
        status: 'stable',
        tags: ['type', 'content', 'readability'],
        related: ['/guide/spacing', '/guide/i18n'],
    },
    {
        title: 'Spacing',
        description:
            'Spacing scale and layout rhythm examples used across components.',
        path: '/guide/spacing',
        category: 'base',
        status: 'stable',
        tags: ['layout', 'spacing', 'rhythm'],
        related: ['/guide/typography', '/guide/cards'],
    },
    {
        title: 'Shadows',
        description:
            'Elevation scale and shadow usage for surfaces, overlays, and emphasis.',
        path: '/guide/shadows',
        category: 'base',
        status: 'stable',
        tags: ['elevation', 'shadow', 'surface'],
        usedIn: [
            { label: 'Button UI', path: 'frontend/app/components/ui/Button.vue' },
            { label: 'Select UI', path: 'frontend/app/components/ui/Select.vue' },
        ],
        related: ['/guide/spacing', '/guide/cards', '/guide/modals'],
    },
    {
        title: 'Animation',
        description:
            'Motion patterns, timing, and reduced-motion behavior for component transitions.',
        path: '/guide/animation',
        category: 'core',
        status: 'draft',
        tags: ['motion', 'transitions', 'reduced-motion'],
        usedIn: [
            { label: 'Animation Guide Page', path: 'frontend/app/pages/guide/animation.vue' },
            { label: 'Cart Drawer', path: 'frontend/app/components/cart/CartPreview.vue' },
        ],
        related: ['/guide/carousel', '/guide/modals', '/guide/header-patterns'],
    },
    {
        title: 'Feedback States',
        description:
            'Status, alert, loading, and empty-state communication patterns.',
        path: '/guide/feedback-empty-states',
        category: 'core',
        status: 'stable',
        tags: ['feedback', 'loading', 'empty-state'],
        related: ['/guide/modals', '/guide/testing', '/guide/skeleton'],
    },
    {
        title: 'Skeleton',
        description:
            'Loading placeholders that preserve layout while async content resolves.',
        path: '/guide/skeleton',
        category: 'core',
        status: 'draft',
        tags: ['loading', 'skeleton', 'placeholder'],
        usedIn: [
            {
                label: 'Header Search Loading',
                path: 'frontend/app/components/layout/app-header/AppHeaderSearchModal.vue',
            },
        ],
        related: ['/guide/feedback-empty-states', '/guide/cards', '/guide/web-vitals'],
    },
    {
        title: 'Cart Patterns',
        description:
            'Drawer preview, upload flow, pricing summary, and empty cart guidance.',
        path: '/guide/cart-patterns',
        category: 'core',
        status: 'draft',
        tags: ['cart', 'drawer', 'checkout'],
        usedIn: [
            { label: 'Cart Preview', path: 'frontend/app/components/cart/CartPreview.vue' },
        ],
        related: ['/guide/carousel', '/guide/product-configurator', '/guide/animation'],
    },
    {
        title: 'Header Patterns',
        description:
            'Main header bar, account controls, search modal, and locale interactions.',
        path: '/guide/header-patterns',
        category: 'core',
        status: 'stable',
        tags: ['header', 'search', 'navigation'],
        usedIn: [
            { label: 'App Header', path: 'frontend/app/components/layout/app-header/AppHeader.vue' },
        ],
        related: ['/guide/modals', '/guide/locale-switcher', '/guide/animation'],
    },
    {
        title: 'Product Configurator',
        description:
            'Picker, size and quantity controls, pricing summary, and progression flow.',
        path: '/guide/product-configurator',
        category: 'core',
        status: 'stable',
        tags: ['product', 'configurator', 'pricing'],
        usedIn: [
            { label: 'Stickers Page', path: 'frontend/app/pages/stickers/index.vue' },
        ],
        related: ['/guide/cart-patterns', '/guide/testing'],
    },
    {
        title: 'Auth Flow',
        description:
            'Login, register, verification, and profile setup interaction patterns.',
        path: '/guide/auth-flow',
        category: 'core',
        status: 'stable',
        tags: ['auth', 'verification', 'forms'],
        usedIn: [
            { label: 'Login Page', path: 'frontend/app/pages/auth/login/index.vue' },
        ],
        related: ['/guide/form-controls', '/guide/modals', '/guide/testing'],
    },
    {
        title: 'Testing',
        description:
            'Testing conventions for accessibility, interaction, visual regression, and QA readiness.',
        path: '/guide/testing',
        category: 'core',
        status: 'stable',
        tags: ['qa', 'e2e', 'testid'],
        usedIn: [
            { label: 'Smoke Spec', path: 'frontend/tests/e2e/smoke.spec.ts' },
        ],
        related: ['/guide/web-vitals', '/guide/buttons', '/guide/carousel'],
    },
    {
        title: 'Web Vitals',
        description:
            'Live route-level LCP, INP, and CLS p75 summary from collected real-user metrics.',
        path: '/guide/web-vitals',
        category: 'core',
        status: 'draft',
        tags: ['performance', 'lcp', 'cls', 'inp'],
        usedIn: [
            { label: 'Web Vitals Page', path: 'frontend/app/pages/guide/web-vitals.vue' },
        ],
        related: ['/guide/testing', '/guide/product-configurator'],
    },
    {
        title: 'Locale Switcher',
        description:
            'Language switching patterns and basic locale selection behavior.',
        path: '/guide/locale-switcher',
        category: 'core',
        status: 'stable',
        tags: ['locale', 'i18n', 'header'],
        usedIn: [
            { label: 'Locale Modal', path: 'frontend/app/components/layout/app-header/AppHeaderLocaleModal.vue' },
        ],
        related: ['/guide/i18n', '/guide/header-patterns'],
    },
    {
        title: 'i18n',
        description:
            'Translation key conventions, interpolation, and localization QA guidance.',
        path: '/guide/i18n',
        category: 'core',
        status: 'stable',
        tags: ['i18n', 'translations', 'content'],
        related: ['/guide/locale-switcher', '/guide/typography', '/guide/testing'],
    },
    {
        title: 'Color Swatches',
        description:
            'Standalone swatch previews for semantic and palette color tokens.',
        path: '/guide/color-swatches',
        category: 'base',
        status: 'stable',
        tags: ['tokens', 'swatches', 'palette'],
        related: ['/guide/colors'],
    },
    {
        title: 'Modals',
        description:
            'Overlay dialogs for focused actions and contextual workflows.',
        path: '/guide/modals',
        category: 'core',
        status: 'stable',
        tags: ['overlay', 'dialog', 'focus'],
        usedIn: [
            { label: 'UI Modal', path: 'frontend/app/components/ui/Modal.vue' },
        ],
        related: ['/guide/header-patterns', '/guide/auth-flow', '/guide/animation'],
    },
    {
        title: 'Badges',
        description:
            'Status and metadata indicators using semantic tones and variants.',
        path: '/guide/badges',
        category: 'base',
        status: 'stable',
        tags: ['badge', 'status', 'metadata'],
        usedIn: [
            { label: 'Badge UI', path: 'frontend/app/components/ui/Badge.vue' },
        ],
        related: ['/guide/cards', '/guide/feedback-empty-states'],
    },
    {
        title: 'Flags',
        description:
            'Country flag assets and sizing rules used across the interface.',
        path: '/guide/flags',
        category: 'base',
        status: 'stable',
        tags: ['assets', 'flags', 'locale'],
        related: ['/guide/locale-switcher'],
    },
    {
        title: 'Social Icons',
        description: 'Brand, white, and black social media icon variants.',
        path: '/guide/social-icons',
        category: 'base',
        status: 'stable',
        tags: ['icons', 'brand', 'social'],
        related: ['/guide/icons'],
    },
    {
        title: 'Logos',
        description:
            'Full and mark logo usage, color variations, and spacing guidelines.',
        path: '/guide/logos',
        category: 'base',
        status: 'stable',
        tags: ['brand', 'logo', 'assets'],
        related: ['/guide/colors', '/guide/spacing'],
    },
    {
        title: 'Coverage Dashboard',
        description:
            'Coverage matrix for shared UI components and guide documentation status.',
        path: '/guide/coverage',
        category: 'core',
        status: 'draft',
        tags: ['coverage', 'governance', 'documentation'],
    },
];
