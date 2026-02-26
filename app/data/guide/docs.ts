export type GuideDocSection = {
    title: string;
    points: string[];
};

export type GuideDocDoDont = {
    do: string[];
    dont: string[];
};

export type GuideDocExample = {
    title: string;
    code: string;
};

export type GuideDocChangelogEntry = {
    version?: string;
    date: string;
    changes: string[];
    diffLinks?: Array<{
        label: string;
        path: string;
    }>;
};

export type GuideDocChecklistItem = {
    id: string;
    title: string;
    description: string;
    status: 'planned' | 'in-progress' | 'done';
    phase: 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4';
    ownerArea: string;
};

export type GuideDoc = {
    summary: string;
    sections: GuideDocSection[];
    owner?: {
        name: string;
        team?: string;
    };
    lastUpdatedAt?: string;
    lastUpdatedBy?: string;
    guideChecklist?: GuideDocChecklistItem[];
    doDont?: GuideDocDoDont;
    accessibilityChecklist?: string[];
    qaChecklist?: string[];
    motionGuidelines?: string[];
    responsiveNotes?: string[];
    contentGuidelines?: string[];
    tokenGuardrails?: string[];
    snippets?: Array<{
        title: string;
        language: string;
        code: string;
    }>;
    tokenInspector?: {
        tokens: string[];
        mappings: Array<{
            semantic: string;
            raw: string;
        }>;
    };
    testHooks?: Array<{
        hook: string;
        intent: string;
        target?: string;
    }>;
    performanceNotes?: string[];
    playground?: {
        supportsSize: boolean;
        supportsTone: boolean;
        supportsState: boolean;
        defaultSize?: string;
        defaultTone?: string;
        defaultState?: string;
    };
    examples?: GuideDocExample[];
    changelog?: GuideDocChangelogEntry[];
};

export const guideDocs: Record<string, GuideDoc> = {
    '/guide': {
        summary:
            'Entry point for the design system. Use this to navigate base and core primitives.',
        owner: { name: 'Design System Guild', team: 'Frontend Platform' },
        lastUpdatedAt: '2026-02-20',
        lastUpdatedBy: 'Codex',
        sections: [
            {
                title: 'What This Covers',
                points: [
                    'Foundation tokens and media assets.',
                    'Reusable component behavior and states.',
                    'Component references for implementation alignment.',
                ],
            },
            {
                title: 'Usage',
                points: [
                    'Start with base guides for tokens and primitives.',
                    'Use core guides for composed patterns and flows.',
                    'Pair this with code examples in each guide page.',
                ],
            },
            {
                title: 'Contribution Workflow',
                points: [
                    'Document a component in the guide before broad product rollout.',
                    'Keep naming aligned between design tokens, component props, and i18n keys.',
                    'Record accessibility expectations and edge cases in the related guide page.',
                ],
            },
        ],
        guideChecklist: [
            {
                id: 'guide-search-metadata',
                title: 'Guide search by metadata and docs content',
                description: 'Search should include title, category, tags, and documentation body.',
                status: 'done',
                phase: 'phase-1',
                ownerArea: 'Guide Layout',
            },
            {
                id: 'status-badges-model',
                title: 'Status badge model migration',
                description: 'Use draft, stable, deprecated badges across guide navigation and cards.',
                status: 'done',
                phase: 'phase-1',
                ownerArea: 'Guide Data',
            },
            {
                id: 'ownership-meta',
                title: 'Ownership metadata visibility',
                description: 'Render Last updated by and date in guide documentation header.',
                status: 'done',
                phase: 'phase-1',
                ownerArea: 'Guide Docs',
            },
            {
                id: 'copy-snippets',
                title: 'Copyable snippets and tokens',
                description: 'Ensure guide snippets and token blocks are copyable.',
                status: 'in-progress',
                phase: 'phase-2',
                ownerArea: 'Guide Components',
            },
            {
                id: 'used-in-production',
                title: 'Used in production references',
                description: 'Show repo-relative component file references for each guide.',
                status: 'done',
                phase: 'phase-2',
                ownerArea: 'Guide Data',
            },
            {
                id: 'test-hooks-map',
                title: 'Test hooks recommendations',
                description: 'Provide data-testid naming map and examples per guide.',
                status: 'done',
                phase: 'phase-2',
                ownerArea: 'QA',
            },
            {
                id: 'performance-notes',
                title: 'Performance notes for sensitive components',
                description: 'Document LCP/CLS-sensitive patterns and guardrails.',
                status: 'done',
                phase: 'phase-2',
                ownerArea: 'Performance',
            },
            {
                id: 'cross-links',
                title: 'Related guide cross-linking',
                description: 'Maintain reciprocal links between dependent guides.',
                status: 'done',
                phase: 'phase-2',
                ownerArea: 'Guide Data',
            },
            {
                id: 'do-dont-visuals',
                title: "Do/Don't visuals",
                description: "Use side-by-side examples for Do/Don't guidance.",
                status: 'in-progress',
                phase: 'phase-3',
                ownerArea: 'Guide UX',
            },
            {
                id: 'responsive-switcher',
                title: 'Responsive preview switcher',
                description: 'Support mobile/tablet/desktop preview frames.',
                status: 'done',
                phase: 'phase-3',
                ownerArea: 'Guide Preview',
            },
            {
                id: 'a11y-quick-checks',
                title: 'Accessibility quick checks',
                description: 'Show pass/fail indicators for deterministic preview checks.',
                status: 'done',
                phase: 'phase-3',
                ownerArea: 'Accessibility',
            },
            {
                id: 'playground-controls',
                title: 'Standardized playground controls',
                description: 'Support size/tone/state toggles through shared controls.',
                status: 'in-progress',
                phase: 'phase-3',
                ownerArea: 'Guide Components',
            },
            {
                id: 'token-inspector',
                title: 'Design token inspector panel',
                description: 'Render token values and semantic mappings per guide.',
                status: 'done',
                phase: 'phase-4',
                ownerArea: 'Design System',
            },
            {
                id: 'versioned-changelog',
                title: 'Versioned changelog with diff links',
                description: 'Include versions and repo-relative diffs in changelog entries.',
                status: 'done',
                phase: 'phase-4',
                ownerArea: 'Guide Docs',
            },
            {
                id: 'coverage-dashboard',
                title: 'Guide coverage dashboard',
                description: 'Track shared components with missing or partial guide coverage.',
                status: 'done',
                phase: 'phase-4',
                ownerArea: 'Governance',
            },
        ],
        qaChecklist: [
            'Preview and Documentation tabs both render correctly for every guide route.',
            'Side navigation remains usable when content overflows.',
            'Documentation copy stays synced with implemented component behavior.',
        ],
        snippets: [
            {
                title: 'Guide Entry Structure',
                language: 'ts',
                code: `{
  path: '/guide/buttons',
  status: 'stable',
  tags: ['actions', 'states'],
  usedIn: [{ label: 'Button', path: 'frontend/app/components/ui/Button.vue' }]
}`,
            },
        ],
        changelog: [
            {
                version: 'v1.2.0',
                date: '2026-02-19',
                changes: [
                    'Added structured documentation blocks: Do/Don’t, checklists, examples, and changelog.',
                    'Expanded engineering guidance for accessibility and QA decisions.',
                ],
                diffLinks: [
                    { label: 'Guide Layout', path: 'frontend/app/layouts/guide.vue' },
                    { label: 'Guide Docs', path: 'frontend/app/data/guide/docs.ts' },
                ],
            },
        ],
    },
    '/guide/colors': {
        summary: 'Semantic and palette color references for UI implementation.',
        lastUpdatedAt: '2026-02-20',
        lastUpdatedBy: 'Design System Guild',
        sections: [
            {
                title: 'Tokens',
                points: [
                    'Use semantic tokens for component styling.',
                    'Use palette tokens for controlled visual exploration only.',
                ],
            },
            {
                title: 'Guidelines',
                points: [
                    'Avoid hardcoded hex values in product components.',
                    'Prefer semantic aliases for theme flexibility.',
                    'Keep interactive states (hover, active, disabled) in the same tone family.',
                ],
            },
            {
                title: 'Accessibility',
                points: [
                    'Validate contrast for text, icons, and focus indicators before release.',
                    'Do not communicate status by color alone; pair with text or icon shape.',
                    'Use muted tokens only for secondary metadata, not core actions.',
                ],
            },
        ],
        doDont: {
            do: [
                'Use semantic tokens in components and map visual intent to token names.',
                'Run contrast checks for text and controls before merging.',
            ],
            dont: [
                'Do not hardcode hex values directly in product components.',
                'Do not use low-contrast muted tokens for primary actions.',
            ],
        },
        tokenGuardrails: [
            'Surfaces: use `--surface-*` or semantic background aliases only.',
            'Text: use `--text-*` semantic tokens based on hierarchy level.',
            'Borders and separators: use `--border-*` tokens to preserve theming.',
        ],
        tokenInspector: {
            tokens: [
                '--surface-card',
                '--text-primary',
                '--text-secondary',
                '--border-default',
            ],
            mappings: [
                { semantic: '--surface-card', raw: 'var(--gray-0)' },
                { semantic: '--text-primary', raw: 'var(--gray-90)' },
                { semantic: '--border-default', raw: 'var(--gray-20)' },
            ],
        },
        examples: [
            {
                title: 'Semantic Surface and Text',
                code: `<div class="card">
  <h3 class="title">Order Summary</h3>
  <p class="meta">Updated 2 minutes ago</p>
</div>

.card { background: var(--surface-card); border: 1px solid var(--border-default); }
.title { color: var(--text-primary); }
.meta { color: var(--text-secondary); }`,
            },
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    "Added color do/don't guidance, token guardrails, and code example.",
                ],
            },
        ],
    },
    '/guide/icons': {
        summary: 'System icon catalog with color and size exploration controls.',
        sections: [
            {
                title: 'Usage',
                points: [
                    'Use decorative icons with hidden assistive labeling when paired with text.',
                    'Provide accessible name via parent control for icon-only actions.',
                ],
            },
            {
                title: 'Sizing',
                points: [
                    'Prefer tokenized icon sizes for consistency.',
                    'Keep semantic intent consistent across icon weights.',
                    'Align icons to text baseline in mixed icon-text controls.',
                ],
            },
            {
                title: 'Implementation Notes',
                points: [
                    'Decorative icons should be hidden from assistive tech when adjacent text already explains intent.',
                    'For icon-only actions, provide explicit accessible labels on the parent button or link.',
                    'Avoid dynamically shifting icon size between loading and idle states to reduce layout movement.',
                ],
            },
        ],
        doDont: {
            do: [
                'Keep icon size tokenized across a single interface section.',
                'Use icon-only controls only when a clear label is provided.',
            ],
            dont: [
                'Do not mix icon stroke styles in the same control group.',
                'Do not use decorative icons as the only carrier of meaning.',
            ],
        },
        accessibilityChecklist: [
            'Decorative icons are hidden from assistive technology.',
            'Icon-only actions include explicit accessible names.',
            'Icon color contrast remains readable on all supported surfaces.',
        ],
        qaChecklist: [
            'All icon variants render at expected sizes without clipping.',
            'Icons stay aligned in mixed icon-text components.',
            'No visual shift occurs between idle and loading icon states.',
        ],
        examples: [
            {
                title: 'Icon with Accessible Button Label',
                code: `<UiButton
  icon="Search"
  variant="ghost"
  aria-label="Open search"
/>`,
            },
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    "Added icon do/don't guidance and checklist coverage.",
                    'Added an accessible icon usage example.',
                ],
            },
        ],
    },
    '/guide/buttons': {
        summary: 'Button variants, tones, states, and icon patterns.',
        lastUpdatedAt: '2026-02-20',
        lastUpdatedBy: 'Design System Guild',
        sections: [
            {
                title: 'Variants',
                points: [
                    'Use filled for primary actions and outline/subtle for secondary actions.',
                    'Use ghost for low-emphasis inline actions.',
                ],
            },
            {
                title: 'Accessibility',
                points: [
                    'Every icon-only button needs an accessible label.',
                    'Use loading and disabled states intentionally to reduce ambiguity.',
                    'Preserve visible focus styles for keyboard navigation and QA.',
                ],
            },
            {
                title: 'Interaction',
                points: [
                    'Match button emphasis to action priority: one primary action per section.',
                    'Use destructive tone only when action cannot be safely undone.',
                    'Keep button text concise and verb-led (for example: Save, Continue, Remove).',
                ],
            },
        ],
        doDont: {
            do: [
                'Use one primary button per action group and downgrade all secondary actions.',
                'Provide explicit `aria-label` for icon-only buttons.',
            ],
            dont: [
                'Do not combine disabled and loading simultaneously unless required by API latency state.',
                'Do not use destructive tone for neutral navigation actions.',
            ],
        },
        accessibilityChecklist: [
            'Icon-only buttons include an accessible name.',
            'Focus ring is visible and meets contrast requirements.',
            'Disabled controls are not focusable unless intentionally announced.',
        ],
        qaChecklist: [
            'Hover, active, focus, disabled, and loading states are all visually distinct.',
            'Button height and padding remain consistent across locales with longer labels.',
            'Primary and destructive actions match expected analytics IDs or data attributes.',
        ],
        motionGuidelines: [
            'Use short transitions (120ms-200ms) for hover and pressed states.',
            'Avoid bounce-style motion on essential controls to reduce distraction.',
            'Respect `prefers-reduced-motion` for non-essential animations.',
        ],
        contentGuidelines: [
            'Use verb-first labels: Save, Continue, Submit, Remove.',
            'Avoid vague labels like Click Here or Confirm Action.',
        ],
        playground: {
            supportsSize: true,
            supportsTone: true,
            supportsState: true,
            defaultSize: 'md',
            defaultTone: 'neutral',
            defaultState: 'default',
        },
        testHooks: [
            {
                hook: 'button-default-click',
                intent: 'Primary action in default state',
                target: 'UiButton',
            },
            {
                hook: 'button-loading-click',
                intent: 'Async submit action loading state',
                target: 'UiButton',
            },
        ],
        performanceNotes: [
            'Avoid layout shift by keeping button text and icon box dimensions stable across loading states.',
        ],
        examples: [
            {
                title: 'Accessible Icon Button',
                code: `<UiButton
  icon="ArrowLeft"
  variant="ghost"
  aria-label="Go to previous review"
/>`,
            },
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    "Added button do/don't guidance, accessibility checklist, and QA notes.",
                ],
            },
        ],
    },
    '/guide/cards': {
        summary:
            'Composable card patterns for content grouping, media, metadata, and action-driven layouts.',
        sections: [
            {
                title: 'Variants',
                points: [
                    'Use default cards for static grouped information.',
                    'Use interactive cards for clickable summaries that open detail views.',
                    'Use media cards when visual preview supports scanability.',
                ],
            },
            {
                title: 'Anatomy',
                points: [
                    'Typical structure: header, title, metadata, body, and footer actions.',
                    'Keep badges and status indicators near the title for quick scanning.',
                    'Use consistent internal spacing tokens for predictable rhythm.',
                ],
            },
            {
                title: 'States',
                points: [
                    'Support hover and focus-visible for interactive cards.',
                    'Provide loading or skeleton state when card content is async.',
                    'Use disabled only when the entire card interaction is unavailable.',
                ],
            },
        ],
        doDont: {
            do: [
                'Use semantic heading levels inside cards.',
                'Apply a single primary action per card when actions are present.',
            ],
            dont: [
                'Do not overload cards with too many competing actions.',
                'Do not use decorative imagery without clear content value.',
            ],
        },
        accessibilityChecklist: [
            'Clickable cards are keyboard reachable and show visible focus state.',
            'Card media includes meaningful alt text or is marked decorative when appropriate.',
            'Button and link actions inside cards have accessible names.',
        ],
        qaChecklist: [
            'Card content does not overflow with long localization strings.',
            'Hover, focus, active, and disabled states are visually distinct.',
            'Card grid wraps consistently across desktop and mobile breakpoints.',
        ],
        motionGuidelines: [
            'Use short elevation or border-color transitions for hover state feedback.',
            'Avoid large scale animations on cards to prevent layout shift.',
        ],
        responsiveNotes: [
            'Switch dense multi-column card grids to single-column layout on mobile.',
            'Clamp long text to preserve consistent card height where needed.',
        ],
        contentGuidelines: [
            'Keep titles concise and action-oriented when cards are clickable.',
            'Use body copy for supporting context, not repeated title phrasing.',
        ],
        tokenGuardrails: [
            'Use semantic surface, border, and text tokens for card layers.',
            'Avoid one-off shadow and radius values outside the design scale.',
        ],
        examples: [
            {
                title: 'Interactive Card Structure',
                code: `<article class="card card--interactive" tabindex="0">
  <header class="card__header">
    <h3 class="card__title">Premium Vinyl Sticker Pack</h3>
    <UiBadge tone="success" label="Popular" />
  </header>
  <p class="card__meta">Ships in 2-3 business days</p>
  <p class="card__body">Waterproof, UV-resistant, and made for outdoor durability.</p>
  <footer class="card__footer">
    <UiButton tone="primary">Customize</UiButton>
  </footer>
</article>`,
            },
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    'Added dedicated card guide with variants, states, accessibility, and QA guidance.',
                ],
            },
        ],
    },
    '/guide/carousel': {
        summary:
            'Slide-based content pattern for sequential items such as reviews, promos, and media.',
        lastUpdatedAt: '2026-02-20',
        lastUpdatedBy: 'Design System Guild',
        sections: [
            {
                title: 'Structure',
                points: [
                    'Use a viewport container with overflow hidden and a translated track.',
                    'Group each slide as a semantic item with stable heading and supporting content.',
                    'Expose deterministic next/previous controls for keyboard and pointer users.',
                ],
            },
            {
                title: 'Behavior',
                points: [
                    'Autoplay should pause on hover and resume on pointer leave.',
                    'Loop to the first item when advancing from the last visible slide.',
                    'Clamp current slide when viewport size changes and visible cards increase.',
                ],
            },
            {
                title: 'Accessibility',
                points: [
                    'Use `role=\"region\"` with `aria-roledescription=\"carousel\"` and a clear label.',
                    'Provide explicit accessible labels for previous and next controls.',
                    'Expose slide position context (for example: Review 2 of 4).',
                ],
            },
        ],
        doDont: {
            do: [
                'Keep movement duration short and predictable to avoid disorientation.',
                'Pause auto-advance when users interact with controls.',
            ],
            dont: [
                'Do not hide navigation controls for keyboard users.',
                'Do not autoplay large content jumps that create layout shift.',
            ],
        },
        accessibilityChecklist: [
            'Carousel region has explicit label and roledescription.',
            'Prev/next controls include explicit accessible names.',
            'Slide items expose readable position context for assistive tech.',
        ],
        qaChecklist: [
            'Track translation aligns with card width and configured gap.',
            'Buttons disable correctly on first and last slide boundaries.',
            'Carousel remains functional across desktop and mobile breakpoints.',
        ],
        motionGuidelines: [
            'Use linear or ease transition around 280ms-360ms for slide movement.',
            'Avoid bounce or overshoot effects for content-heavy carousels.',
            'Respect reduced-motion preferences for auto-advance behavior.',
        ],
        responsiveNotes: [
            'Switch from multi-card layout to single-card layout on narrow viewports.',
            'Recalculate slide width on resize to prevent clipping and drift.',
        ],
        contentGuidelines: [
            'Keep slide titles concise to prevent uneven card heights.',
            'Use supporting text for context and keep author metadata short.',
        ],
        playground: {
            supportsSize: true,
            supportsTone: true,
            supportsState: true,
            defaultState: 'autoplay',
        },
        testHooks: [
            {
                hook: 'carousel-prev-button',
                intent: 'Navigate to previous slide',
                target: 'UiButton',
            },
            {
                hook: 'carousel-next-button',
                intent: 'Navigate to next slide',
                target: 'UiButton',
            },
        ],
        performanceNotes: [
            'Use transform-only track movement to avoid CLS and keep animation on compositor.',
            'Pause autoplay when hidden to reduce unnecessary paint work.',
        ],
        examples: [
            {
                title: 'Accessible Carousel Shell',
                code: `<div role="region" aria-roledescription="carousel" aria-label="Client reviews carousel">
  <UiButton aria-label="Go to previous review" />
  <UiButton aria-label="Go to next review" />
  <article role="group" aria-label="Review 1 of 4">...</article>
</div>`,
            },
        ],
        changelog: [
            {
                date: '2026-02-20',
                changes: [
                    'Added dedicated carousel guide with behavior, accessibility, and QA guidance.',
                ],
            },
        ],
    },
    '/guide/form-controls': {
        summary: 'Input, textarea, select, and checkbox references for forms.',
        lastUpdatedAt: '2026-02-20',
        lastUpdatedBy: 'Design System Guild',
        sections: [
            {
                title: 'Validation',
                points: [
                    'Show state and helper text together when invalid.',
                    'Reserve error style for actionable validation feedback.',
                ],
            },
            {
                title: 'Behavior',
                points: [
                    'Use readonly for visible but locked values.',
                    'Use disabled for unavailable interactions.',
                    'Do not auto-shift focus unexpectedly after inline validation.',
                ],
            },
            {
                title: 'Accessibility',
                points: [
                    'Bind labels, hints, and error messages with semantic attributes.',
                    'Keep placeholder text supplemental, never as label replacement.',
                    'Use consistent field IDs to stabilize automation and analytics hooks.',
                ],
            },
        ],
        doDont: {
            do: [
                'Always render an explicit label and associated help/error message.',
                'Keep field IDs stable for QA selectors and analytics binding.',
            ],
            dont: [
                'Do not rely on placeholder text as the only field label.',
                'Do not clear user input after failed validation.',
            ],
        },
        playground: {
            supportsSize: true,
            supportsTone: false,
            supportsState: true,
            defaultSize: 'md',
            defaultState: 'default',
        },
        testHooks: [
            {
                hook: 'form-controls-email-input',
                intent: 'Validates user email format',
                target: 'UiInput',
            },
        ],
        accessibilityChecklist: [
            'Labels and descriptions are bound with semantic attributes.',
            'Validation errors are announced and visible near the field.',
            'Keyboard users can reach and operate all controls without traps.',
        ],
        qaChecklist: [
            'Field state transitions (default, focus, error, disabled) are regression-tested.',
            'Long labels and localization do not break layout.',
            'Server errors map to correct field and form-level messaging.',
        ],
        responsiveNotes: [
            'Stack fields in a single column on narrow viewports.',
            'Maintain minimum 44px touch targets for mobile controls.',
        ],
        contentGuidelines: [
            'Error messages should describe the fix, not only the problem.',
            'Use sentence case and concise helper text.',
        ],
        examples: [
            {
                title: 'Field with Helper and Error',
                code: `<UiInput
  id="email"
  label="Email address"
  :error="emailError"
  helper-text="We will send order updates to this email."
/>`,
            },
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    "Added form control do/don't guidance, accessibility checklist, and QA notes.",
                ],
            },
        ],
    },
    '/guide/tooltip': {
        summary:
            'Tooltip provides compact contextual helper text anchored to a trigger element.',
        owner: { name: 'Design System Guild', team: 'Frontend Platform' },
        lastUpdatedAt: '2026-02-25',
        lastUpdatedBy: 'Codex',
        sections: [
            {
                title: 'When To Use',
                points: [
                    'Supplement nearby controls with brief clarification.',
                    'Surface validation hints where inline text would add visual noise.',
                    'Keep message copy short and directly tied to the trigger.',
                ],
            },
            {
                title: 'Placement and Behavior',
                points: [
                    'Use side and mobileSide to keep content visible across viewport sizes.',
                    'Use tone="danger" only for corrective or blocking guidance.',
                    'Keep offset and slideDistance values consistent within a flow.',
                ],
            },
        ],
        doDont: {
            do: [
                'Pair tooltip content with a clear trigger affordance.',
                'Write concise actionable copy.',
                'Use tone and placement to reinforce context.',
            ],
            dont: [
                'Put long-form help text or multi-step instructions in a tooltip.',
                'Use tooltip as the only source of required information.',
                'Stack multiple open tooltips in the same compact area.',
            ],
        },
        accessibilityChecklist: [
            'Tooltip content is available when trigger receives focus.',
            'Trigger remains keyboard reachable and visually apparent.',
            'Tooltip meaning is understandable without relying only on color.',
        ],
        qaChecklist: [
            'Each side variant renders without clipping in common container widths.',
            'Danger tone text remains readable with expected contrast.',
            'Mobile side override behavior matches expected placement.',
        ],
        snippets: [
            {
                title: 'Tooltip Base Usage',
                language: 'vue',
                code: `<UiTooltip :open="isOpen" side="right" tone="default">
  Helpful guidance for the related control.
  <template #trigger>
    <button type="button">Trigger</button>
  </template>
</UiTooltip>`,
            },
        ],
        changelog: [
            {
                version: 'v1.0.0',
                date: '2026-02-25',
                changes: ['Added tooltip guide page and metadata coverage entry.'],
                diffLinks: [
                    { label: 'Tooltip Guide Page', path: 'frontend/app/pages/guide/tooltip.vue' },
                    { label: 'Tooltip Component', path: 'frontend/app/components/ui/Tooltip.vue' },
                ],
            },
        ],
    },
    '/guide/badges': {
        summary: 'Status and metadata badge patterns by tone and variant.',
        lastUpdatedAt: '2026-02-20',
        lastUpdatedBy: 'Design System Guild',
        sections: [
            {
                title: 'Semantics',
                points: [
                    'Use tone to communicate meaning, not decoration.',
                    'Keep badge labels short and scannable.',
                ],
            },
            {
                title: 'Layout',
                points: [
                    'Avoid dense badge clusters without spacing.',
                    'Use consistent badge size within a single context.',
                    'Maintain predictable wrapping behavior in narrow containers.',
                ],
            },
            {
                title: 'Accessibility',
                points: [
                    'Ensure status badges still make sense when read out of visual context.',
                    'Do not rely only on color changes for state transitions.',
                    'Keep badge copy short to prevent noisy screen reader output.',
                ],
            },
        ],
        doDont: {
            do: [
                'Keep badge labels short and tied to clear status meaning.',
                'Use a consistent badge size and tone scale per context.',
            ],
            dont: [
                'Do not stack many badges without spacing or grouping.',
                'Do not rely on color alone to communicate status changes.',
            ],
        },
        accessibilityChecklist: [
            'Badge labels remain understandable when read in isolation.',
            'Status badges include support text when color meaning is ambiguous.',
        ],
        qaChecklist: [
            'Badges wrap cleanly in narrow layouts without overlap.',
            'Tone variants match semantic intent across pages.',
            'Badge text remains legible in all supported themes.',
        ],
        responsiveNotes: [
            'Collapse dense badge groups into rows with clear spacing on mobile.',
            'Maintain consistent vertical rhythm when badge lines wrap.',
        ],
        playground: {
            supportsSize: true,
            supportsTone: true,
            supportsState: false,
            defaultSize: 'md',
            defaultTone: 'neutral',
        },
        testHooks: [
            {
                hook: 'badge-success-label',
                intent: 'Success state metadata badge',
                target: 'UiBadge',
            },
        ],
        examples: [
            {
                title: 'Semantic Status Badge',
                code: `<UiBadge tone="success" label="Paid" />`,
            },
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    "Added badge do/don't guidance and QA checklists.",
                    'Added responsive notes and a basic usage example.',
                ],
            },
        ],
    },
    '/guide/flags': {
        summary: 'Country flags for locale and region context.',
        sections: [
            {
                title: 'Usage',
                points: [
                    'Use with locale labels to avoid ambiguity.',
                    'Keep visual size consistent within selector lists.',
                    'Treat flags as regional hints, not language identifiers on their own.',
                ],
            },
            {
                title: 'Accessibility',
                points: [
                    'If the flag is decorative next to locale text, use empty alt handling.',
                    'If the flag conveys meaning independently, provide concise descriptive alt text.',
                    'Keep touch targets on locale options large enough for mobile interaction.',
                ],
            },
        ],
        doDont: {
            do: [
                'Pair every flag with locale or region text for clarity.',
                'Keep flag sizing consistent inside the same selector.',
            ],
            dont: [
                'Do not use flags as a sole language indicator.',
                'Do not stretch flag assets outside their intended ratio.',
            ],
        },
        accessibilityChecklist: [
            'Decorative flags use empty alt handling when text already explains context.',
            'Meaningful standalone flags use concise descriptive alt text.',
            'Locale options keep touch targets accessible on mobile.',
        ],
        qaChecklist: [
            'Flags render crisply at all documented sizes.',
            'No clipping or misalignment appears inside compact lists.',
            'Locale rows stay readable with long translated labels.',
        ],
        responsiveNotes: [
            'Preserve minimum touch target and spacing on small screens.',
            'Prevent flag and label overlap in narrow locale lists.',
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    "Added flag do/don't guidance and accessibility checklist.",
                    'Added responsive and QA checks for locale lists.',
                ],
            },
        ],
    },
    '/guide/social-icons': {
        summary: 'Social icon variants by surface contrast needs.',
        sections: [
            {
                title: 'Variants',
                points: [
                    'Use colored icons on neutral/light surfaces.',
                    'Use white/black variants based on contrast requirements.',
                    'Keep each platform mark visually balanced within shared icon bounds.',
                ],
            },
            {
                title: 'Link Behavior',
                points: [
                    'Provide clear accessible labels per network destination.',
                    'Open external links consistently and indicate behavior when needed.',
                    'Group social links in predictable order across footer and auth surfaces.',
                ],
            },
        ],
        doDont: {
            do: [
                'Use surface-appropriate icon variants for contrast.',
                'Provide explicit accessible labels for each destination.',
            ],
            dont: [
                'Do not reorder icon sets arbitrarily across pages.',
                'Do not place low-contrast icons on tinted or dark surfaces.',
            ],
        },
        accessibilityChecklist: [
            'Each social link has a unique accessible label.',
            'Focus state is visible for keyboard users.',
            'External link behavior is consistent and announced where required.',
        ],
        qaChecklist: [
            'All icon variants match brand asset guidance.',
            'Icons are evenly aligned and spaced in all breakpoints.',
            'Links remain clickable and stable in compact layouts.',
        ],
        contentGuidelines: [
            'Use platform names in labels (for example: Open Instagram).',
            'Keep ordering consistent across header, footer, and auth screens.',
        ],
        examples: [
            {
                title: 'Accessible Social Link',
                code: `<a href="https://instagram.com" aria-label="Open Instagram" target="_blank" rel="noopener noreferrer">
  <SocialIcon name="instagram" variant="brand" />
</a>`,
            },
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    'Added social icon accessibility and QA checklist guidance.',
                    'Added content rules and link example.',
                ],
            },
        ],
    },
    '/guide/logos': {
        summary: 'Brand mark/full logo usage across variants and colorways.',
        sections: [
            {
                title: 'Rules',
                points: [
                    'Prefer full logo where space allows.',
                    'Use mark logo for compact placements.',
                    'Choose white variant on dark backgrounds only.',
                    'Respect clear-space around logos to avoid visual crowding.',
                ],
            },
            {
                title: 'Asset Handling',
                points: [
                    'Use vector assets whenever possible for sharp rendering.',
                    'Do not stretch logos non-proportionally; preserve aspect ratio.',
                    'Avoid adding effects (glow, shadow, outline) not defined in brand standards.',
                ],
            },
        ],
        doDont: {
            do: [
                'Prefer full logo where horizontal room is available.',
                'Maintain clear-space around all logo placements.',
            ],
            dont: [
                'Do not distort logo proportions to fit a container.',
                'Do not apply unapproved visual effects to brand assets.',
            ],
        },
        qaChecklist: [
            'Logo variants switch correctly for light and dark surfaces.',
            'Logos remain crisp at standard and high-density displays.',
            'Minimum size and clear-space constraints are respected.',
        ],
        responsiveNotes: [
            'Fallback to mark variant when header width is constrained.',
            'Avoid shrinking full logo below the documented minimum size.',
        ],
        tokenGuardrails: [
            'Choose logo variant by surface contrast token, not ad-hoc color selection.',
            'Do not recolor brand logos outside approved variants.',
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    "Added logo do/don't guidance and QA checks.",
                    'Added responsive notes and token guardrails.',
                ],
            },
        ],
    },
    '/guide/modals': {
        summary: 'Overlay modal behavior and compositional guidance.',
        lastUpdatedAt: '2026-02-20',
        lastUpdatedBy: 'Design System Guild',
        sections: [
            {
                title: 'Behavior',
                points: [
                    'Use modal for focused task completion.',
                    'Provide clear close controls and keyboard dismissal.',
                ],
            },
            {
                title: 'Content',
                points: [
                    'Keep primary action clear and singular.',
                    'Avoid long, multi-step workflows in one modal.',
                    'Use concise titles that describe the user decision.',
                ],
            },
            {
                title: 'Accessibility',
                points: [
                    'Trap focus while modal is open and restore it to the triggering element on close.',
                    'Support keyboard dismissal and visible close controls.',
                    'Label the modal region with a clear heading and purpose.',
                ],
            },
        ],
        doDont: {
            do: [
                'Keep modal flows focused on one decision or task.',
                'Return focus to the triggering element after close.',
            ],
            dont: [
                'Do not place deep multi-step wizards in a standard modal.',
                'Do not remove close affordances for non-destructive flows.',
            ],
        },
        accessibilityChecklist: [
            'Focus is trapped while the modal is open.',
            'Escape closes the modal unless flow is intentionally blocking.',
            'Dialog has a programmatic label and description.',
        ],
        qaChecklist: [
            'Background scroll locking works on desktop and mobile.',
            'Modal content remains readable for long localization strings.',
            'Primary and secondary actions maintain correct order and keyboard focus.',
        ],
        motionGuidelines: [
            'Use subtle fade + scale for modal entry and exit.',
            'Keep transition under 220ms to maintain perceived responsiveness.',
        ],
        playground: {
            supportsSize: true,
            supportsTone: true,
            supportsState: true,
            defaultState: 'closed',
        },
        testHooks: [
            {
                hook: 'modal-open-button',
                intent: 'Opens modal with deterministic trigger',
                target: 'UiModal',
            },
            {
                hook: 'modal-confirm-button',
                intent: 'Confirms modal primary action',
                target: 'UiModal',
            },
        ],
        performanceNotes: [
            'Use opacity and transform transitions for modal entry/exit; avoid animating layout properties.',
        ],
        examples: [
            {
                title: 'Confirmation Modal Pattern',
                code: `<UiModal
  :open="isOpen"
  title="Remove item?"
  description="This action cannot be undone."
  @close="isOpen = false"
/>`,
            },
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    "Added modal do/don't guidance, checklist coverage, and example usage.",
                ],
            },
        ],
    },
    '/guide/locale-switcher': {
        summary: 'Locale switching control behavior and usage references.',
        sections: [
            {
                title: 'Usage',
                points: [
                    'Expose locale names clearly, not code only.',
                    'Indicate selected locale visually and semantically.',
                    'Persist user locale choice across relevant sessions.',
                ],
            },
            {
                title: 'Interaction',
                points: [
                    'Avoid full-page reloads when a localized route can be resolved client-side.',
                    'Keep switcher placement consistent in header and account contexts.',
                    'Support keyboard selection and announce locale changes when applicable.',
                ],
            },
        ],
        doDont: {
            do: [
                'Show human-readable locale names with a clear selected state.',
                'Keep locale control placement consistent across major layouts.',
            ],
            dont: [
                'Do not hide selected-state affordances from keyboard users.',
                'Do not force full reloads if route-level locale switching is available.',
            ],
        },
        accessibilityChecklist: [
            'Locale trigger has an accessible name and expanded state.',
            'Locale list is keyboard navigable with clear focus indication.',
            'Selected locale is announced semantically.',
        ],
        qaChecklist: [
            'Locale changes persist across key routes and sessions.',
            'Switching locale does not break active route context.',
            'Long locale names do not overflow dropdown and modal layouts.',
        ],
        examples: [
            {
                title: 'Locale Trigger with ARIA',
                code: `<button
  aria-label="Change language"
  aria-haspopup="listbox"
  :aria-expanded="isOpen"
>
  English
</button>`,
            },
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    "Added locale switcher do/don't and checklist guidance.",
                    'Added an accessible trigger example.',
                ],
            },
        ],
    },
    '/guide/i18n': {
        summary:
            'Localization architecture guidance for key naming, interpolation, and runtime locale behavior.',
        sections: [
            {
                title: 'Key Structure',
                points: [
                    'Use domain-based namespaces (for example: home.hero.title).',
                    'Keep leaf keys semantic and stable across copy updates.',
                    'Prefer reusable keys for shared UI labels used by multiple pages.',
                ],
            },
            {
                title: 'Runtime Behavior',
                points: [
                    'Use useI18n() in components and call t() at render time.',
                    'Pass params to t() for dynamic values (for example: count, price, name).',
                    'Switch locale through controlled UI triggers and persist user choice.',
                ],
            },
            {
                title: 'Fallback and Safety',
                points: [
                    'Ensure missing keys fall back predictably to the default locale.',
                    'Avoid hardcoded strings in components that should be localized.',
                    'Audit translated content for overflow and truncation in narrow layouts.',
                ],
            },
        ],
        doDont: {
            do: [
                'Keep translation keys consistent with file and folder structure.',
                'Use interpolation for dynamic copy instead of concatenating strings.',
            ],
            dont: [
                'Do not use locale-specific copy directly in Vue templates.',
                'Do not rename frequently-used keys without migration updates.',
            ],
        },
        accessibilityChecklist: [
            'Set the html lang attribute according to the active locale.',
            'Ensure locale switch controls announce selected and expanded states.',
            'Validate translated text direction and punctuation for screen readers.',
        ],
        qaChecklist: [
            'All critical pages render with both en and kr locales.',
            'Parameterized strings render correctly with sample dynamic values.',
            'No missing-key output appears in production UI.',
        ],
        responsiveNotes: [
            'Re-test long translated copy on mobile breakpoints.',
            'Allow flexible button and field widths for localized labels.',
        ],
        contentGuidelines: [
            'Use concise action labels that survive translation expansion.',
            'Avoid slang or culturally specific idioms in source copy.',
        ],
        examples: [
            {
                title: 'Component Translation Usage',
                code: `const { t } = useI18n();

const title = t('home.hero.title');
const preview = t('cart.cartPreview.previewTitle', { count: 3 });`,
            },
            {
                title: 'Key Naming Pattern',
                code: `home.hero.title
home.hero.subtitle
cart.cartPreview.previewTitle
cart.cartPreview.emptyDescription`,
            },
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    'Added dedicated i18n guide with architecture, QA, and accessibility guidance.',
                ],
            },
        ],
    },
    '/guide/color-swatches': {
        summary: 'Standalone swatch previews for token inspection and copy.',
        sections: [
            {
                title: 'Usage',
                points: [
                    'Use for quick token pickers and visual QA.',
                    'Pair token labels with swatches for clarity.',
                    'Show semantic token name first, then mapped fallback value if needed.',
                ],
            },
            {
                title: 'Quality Checks',
                points: [
                    'Verify token values match compiled CSS variables.',
                    'Avoid duplicate swatch labels that map to different values.',
                    'Keep swatch ordering aligned with design token categories.',
                ],
            },
        ],
        doDont: {
            do: [
                'Show token name and visual swatch together.',
                'Keep token grouping aligned with semantic categories.',
            ],
            dont: [
                'Do not expose duplicate labels for different token values.',
                'Do not present palette swatches as production semantic defaults.',
            ],
        },
        qaChecklist: [
            'Swatches map to live token values from compiled CSS variables.',
            'Copied token names are exact and stable.',
            'Swatch labels remain readable across viewport sizes.',
        ],
        tokenGuardrails: [
            'Use swatches to inspect tokens; apply semantic aliases in product components.',
            'Avoid direct palette token use unless explicitly documented for the use case.',
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    "Added swatch do/don't and token guardrail guidance.",
                    'Added QA checks for token consistency.',
                ],
            },
        ],
    },
    '/guide/toast': {
        summary:
            'Toast provides temporary, non-blocking feedback messages with semantic tone styling.',
        sections: [
            {
                title: 'When To Use',
                points: [
                    'Use to confirm background or secondary actions (for example: save complete).',
                    'Use for passive alerts that do not require immediate interruption.',
                    'Do not replace blocking validation or destructive confirmations with toast alone.',
                ],
            },
            {
                title: 'Behavior',
                points: [
                    'Toast appears near the viewport edge and auto-dismisses after a short delay.',
                    'Use one toast at a time per context to avoid stacked visual noise.',
                    'Allow manual dismissal for longer or more critical messages.',
                ],
            },
            {
                title: 'Tone Mapping',
                points: [
                    'primary: brand-highlighted confirmation for key product moments.',
                    'success: confirms completed action.',
                    'warning: highlights caution without blocking.',
                    'error: communicates failure and next step.',
                    'info: neutral system update.',
                ],
            },
        ],
        doDont: {
            do: [
                'Keep messages concise, clear, and action-oriented.',
                'Use semantic tone that matches message intent.',
            ],
            dont: [
                'Do not use toast for complex, multi-step error explanations.',
                'Do not show repeated toasts for the same action in quick succession.',
            ],
        },
        accessibilityChecklist: [
            'Toast uses polite live region announcements for non-blocking status updates.',
            'Dismiss button has an accessible label when visible.',
            'Message text remains readable at responsive widths.',
        ],
        qaChecklist: [
            'Auto-hide timing is predictable and reset when re-triggered.',
            'Close button dismisses toast immediately.',
            'Tone variants render correct icon and colors.',
        ],
        snippets: [
            {
                title: 'Basic Toast',
                language: 'vue',
                code: `<UiToast
  :visible="showToast"
  tone="primary"
  message="Your password has been successfully updated."
  @close="showToast = false"
/>`,
            },
        ],
        testHooks: [
            {
                hook: 'ui-toast',
                intent: 'Toast visibility and message assertions',
                target: 'UiToast',
            },
            {
                hook: 'ui-toast-close-button',
                intent: 'Dismiss interaction coverage',
                target: 'UiToast',
            },
        ],
        changelog: [
            {
                date: '2026-02-26',
                changes: ['Added dedicated Toast guide with tones, playground behavior, and QA/a11y checks.'],
                diffLinks: [
                    { label: 'Toast Guide Page', path: 'frontend/app/pages/guide/toast.vue' },
                    { label: 'Toast Component', path: 'frontend/app/components/ui/Toast.vue' },
                ],
            },
        ],
    },
    '/guide/typography': {
        summary: 'Type scale and text hierarchy references.',
        sections: [
            {
                title: 'Hierarchy',
                points: [
                    'Use display and headings for structure, not decoration.',
                    'Use body and caption styles for readable content density.',
                    'Keep heading levels sequential to preserve document structure.',
                ],
            },
            {
                title: 'Readability',
                points: [
                    'Maintain comfortable line length for long-form content.',
                    'Use adequate line-height for body text and metadata variants.',
                    'Ensure text styles retain contrast across light and muted surfaces.',
                ],
            },
        ],
        doDont: {
            do: [
                'Use heading levels in order to preserve semantic structure.',
                'Match text style to information priority.',
            ],
            dont: [
                'Do not skip heading levels for visual styling only.',
                'Do not use tiny captions for essential instructions.',
            ],
        },
        accessibilityChecklist: [
            'Typography maintains sufficient contrast in all supported surfaces.',
            'Heading structure remains semantic for assistive technologies.',
            'Body and metadata text maintain readable size and line-height pairings.',
        ],
        qaChecklist: [
            'Line length remains readable in wide desktop layouts.',
            'Localized copy does not overflow fixed-height text containers.',
            'Type scale tokens resolve consistently between pages.',
        ],
        responsiveNotes: [
            'Reduce large heading scale on narrow screens to prevent wrapping collisions.',
            'Retain readable body size on mobile without zoom dependency.',
        ],
        contentGuidelines: [
            'Use sentence case for long-form UI copy.',
            'Prefer concise labels and avoid punctuation-heavy headings.',
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    "Added typography do/don't guidance and checklist coverage.",
                    'Added responsive and content-writing notes.',
                ],
            },
        ],
    },
    '/guide/spacing': {
        summary: 'Spacing scale and rhythm references for layout consistency.',
        sections: [
            {
                title: 'Rules',
                points: [
                    'Use spacing scale values consistently across sections.',
                    'Avoid arbitrary one-off spacing values in components.',
                    'Prefer predictable spacing increments when composing new layouts.',
                ],
            },
            {
                title: 'Layout Application',
                points: [
                    'Separate component internal padding from external layout spacing.',
                    'Use tighter rhythm for dense UI controls and larger rhythm for content blocks.',
                    'Audit spacing at mobile breakpoints to prevent accidental overflow.',
                ],
            },
        ],
        doDont: {
            do: [
                'Use spacing tokens for layout and component composition.',
                'Apply spacing rhythm consistently within each section.',
            ],
            dont: [
                'Do not introduce one-off spacing values for visual tweaks.',
                'Do not mix dense and loose spacing patterns in the same block.',
            ],
        },
        qaChecklist: [
            'Spacing tokens remain consistent across responsive breakpoints.',
            'Component internal padding and external margins are clearly separated.',
            'No overflow is introduced by spacing at narrow widths.',
        ],
        responsiveNotes: [
            'Collapse wide horizontal spacing into vertical rhythm on mobile.',
            'Verify gutters and section spacing at each breakpoint threshold.',
        ],
        tokenGuardrails: [
            'Use spacing scale tokens only; avoid raw pixel values in feature components.',
            'Match spacing steps to documented rhythm increments.',
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    "Added spacing do/don't guidance and QA checklist.",
                    'Added responsive notes and spacing token guardrails.',
                ],
            },
        ],
    },
    '/guide/shadows': {
        summary: 'Shadow scale references for elevation, focus, and surface layering.',
        sections: [
            {
                title: 'Shadow Scale',
                points: [
                    'Use small shadows for subtle raised controls.',
                    'Use medium shadows for default elevated surfaces.',
                    'Use large and extra-large shadows for overlays and high-emphasis layers.',
                ],
            },
            {
                title: 'Usage Rules',
                points: [
                    'Keep one dominant elevation level per local UI cluster.',
                    'Combine border and shadow for clarity on light backgrounds.',
                    'Prefer consistent shadow tokens over ad-hoc RGBA values.',
                ],
            },
        ],
        doDont: {
            do: [
                'Use documented shadow scale values for consistency.',
                'Match shadow strength to interaction priority and depth.',
            ],
            dont: [
                'Do not stack multiple heavy shadows on adjacent elements.',
                'Do not use shadow-only separation when a border is required.',
            ],
        },
        qaChecklist: [
            'Elevation scale remains consistent across components using the same depth.',
            'Shadows remain visible but not overpowering on standard displays.',
            'Dark-mode or inverse surfaces maintain sufficient layer distinction.',
        ],
        tokenGuardrails: [
            'Prefer brand shadow tokens from `app/assets/scss/brand/_shadows.scss`.',
            'Avoid one-off shadow values in shared UI components.',
        ],
        changelog: [
            {
                date: '2026-02-26',
                changes: ['Added shadows guide with scale, usage rules, and QA guardrails.'],
            },
        ],
    },
    '/guide/cart-patterns': {
        summary:
            'Guidance for cart drawer layout, upload modal actions, and checkout handoff behavior.',
        lastUpdatedAt: '2026-02-20',
        lastUpdatedBy: 'Design System Guild',
        sections: [
            {
                title: 'Drawer Composition',
                points: [
                    'Keep drawer structure stable with fixed header and footer zones.',
                    'Body content should handle empty, single-line-item, and featured states.',
                    'Reserve one high-emphasis checkout action and one secondary fallback action.',
                ],
            },
            {
                title: 'Upload Flow',
                points: [
                    'Use outline or ghost controls for replace, remove, and skip actions.',
                    'Enable primary add-to-cart action only after required artwork state is valid.',
                    'Use helper text for accepted formats and special instructions behavior.',
                ],
            },
            {
                title: 'Resilience',
                points: [
                    'Do not allow drawer motion to block page interaction after close.',
                    'Preserve scroll positions when toggling featured content.',
                    'Include deterministic data-testid hooks for all cart control paths.',
                ],
            },
        ],
        doDont: {
            do: [
                'Use neutral button tones to keep cart actions visually consistent.',
                'Surface clear pricing breakdown before final checkout action.',
            ],
            dont: [
                'Do not hide close controls in cart overlays.',
                'Do not attach destructive styling to non-destructive cart actions.',
            ],
        },
        accessibilityChecklist: [
            'Icon-only edit and delete controls include accessible names.',
            'Drawer and modal close correctly with ESC and overlay interactions.',
            'Empty-state illustrations include meaningful alt text.',
        ],
        qaChecklist: [
            'Cart preview slide animation works in dev and preview builds.',
            'Upload modal actions follow disabled/active state rules.',
            'Checkout button and totals stay aligned across breakpoints.',
        ],
        responsiveNotes: [
            'Drawer width should clamp to viewport and avoid horizontal overflow.',
            'Footer actions should wrap cleanly on compact screens.',
        ],
        contentGuidelines: [
            'Use concise action labels: Continue shopping, View cart, Add to cart.',
            'Keep empty-state copy specific to recovery action.',
        ],
        testHooks: [
            {
                hook: 'cart-preview-toggle-button',
                intent: 'Opens cart preview drawer',
                target: 'AppCartPreview',
            },
            {
                hook: 'cart-checkout-button',
                intent: 'Starts checkout flow',
                target: 'AppCartPreview',
            },
        ],
        performanceNotes: [
            'Cart drawer transitions should use transform and opacity to prevent layout shift.',
            'Product thumbnail dimensions should be explicit to avoid reflow during image load.',
        ],
        changelog: [
            {
                date: '2026-02-20',
                changes: [
                    'Added dedicated cart-pattern guidance, accessibility checklist, and QA notes.',
                ],
            },
        ],
    },
    '/guide/header-patterns': {
        summary:
            'Patterns for global header composition, overlay priority, and interaction consistency.',
        lastUpdatedAt: '2026-02-20',
        lastUpdatedBy: 'Design System Guild',
        sections: [
            {
                title: 'Composition',
                points: [
                    'Split header into brand/navigation zone and action zone.',
                    'Keep action controls ordered by usage frequency and priority.',
                    'Maintain stable hit areas and spacing across breakpoints.',
                ],
            },
            {
                title: 'Overlay Behavior',
                points: [
                    'Search, locale, and account overlays should be mutually exclusive.',
                    'Opening one panel should close other open header panels.',
                    'Escape should close the active panel and restore focus to trigger.',
                ],
            },
            {
                title: 'Search and Locale',
                points: [
                    'Search should support recent history and keyboard navigation.',
                    'Locale options should use readable names with selected state.',
                    'Both patterns should avoid layout shift during open and close.',
                ],
            },
        ],
        doDont: {
            do: [
                'Use explicit accessible names for icon-only action buttons.',
                'Keep account and search interactions predictable across pages.',
            ],
            dont: [
                'Do not stack multiple header overlays simultaneously.',
                'Do not hide active route or selected locale indicators.',
            ],
        },
        accessibilityChecklist: [
            'Header actions are keyboard reachable in logical order.',
            'Icon-only controls expose screen-reader labels.',
            'Search and locale panels announce context and close behavior clearly.',
        ],
        qaChecklist: [
            'Header interactions remain functional in preview and production builds.',
            'Long nav labels and locale names do not overflow action areas.',
            'Overlay z-index ordering remains correct against page content.',
        ],
        responsiveNotes: [
            'On narrow widths, allow action controls to wrap without clipping.',
            'Ensure nav and action groups preserve tap targets on mobile.',
        ],
        contentGuidelines: [
            'Use concise labels for account and search actions.',
            'Avoid ambiguous action names in global navigation.',
        ],
        testHooks: [
            {
                hook: 'header-search-toggle-button',
                intent: 'Opens global search modal',
                target: 'AppHeader',
            },
            {
                hook: 'header-cart-toggle-button',
                intent: 'Opens cart preview drawer from header',
                target: 'AppHeader',
            },
        ],
        performanceNotes: [
            'Keep header layout dimensions stable to avoid CLS during route hydration.',
        ],
        changelog: [
            {
                date: '2026-02-20',
                changes: [
                    'Added dedicated header-pattern guide with interaction and accessibility guidance.',
                ],
            },
        ],
    },
    '/guide/product-configurator': {
        summary:
            'Guidance for product selection, option pills, pricing summary structure, and next-step progression.',
        lastUpdatedAt: '2026-02-20',
        lastUpdatedBy: 'Design System Guild',
        sections: [
            {
                title: 'Product Picker',
                points: [
                    'Expose clear selected state for the active product card.',
                    'Prioritize LCP candidate image discovery in initial HTML.',
                    'Use explicit dimensions and avoid lazy-loading the first critical picker image.',
                ],
            },
            {
                title: 'Size and Quantity Controls',
                points: [
                    'Use pill controls with consistent selected, hover, and disabled states.',
                    'Selection updates should immediately reflect in price summary.',
                    'Support keyboard activation for all selectable options.',
                ],
            },
            {
                title: 'Pricing and Progression',
                points: [
                    'Keep summary order stable: subtotal, discount, total.',
                    'Display discount source clearly when a rate is applied.',
                    'Disable next-step CTA until required upload criteria are met.',
                ],
            },
        ],
        doDont: {
            do: [
                'Use semantic pricing labels and deterministic formatting.',
                'Gate next-step action with explicit readiness checks.',
            ],
            dont: [
                'Do not hide pricing deltas behind ambiguous labels.',
                'Do not enable progression before required configuration state is valid.',
            ],
        },
        accessibilityChecklist: [
            'Picker images include concise descriptive alt text.',
            'Option pills are keyboard reachable and expose selected state.',
            'Primary progression button includes clear disabled and enabled affordances.',
        ],
        qaChecklist: [
            'First picker image uses eager loading and high fetch priority where appropriate.',
            'Price values update correctly for every size and quantity combination.',
            'Upload gating logic consistently controls next-step CTA across refresh and navigation.',
        ],
        responsiveNotes: [
            'Picker tiles should wrap without clipping at small widths.',
            'Price summary and CTA remain visible without overlap on mobile.',
        ],
        contentGuidelines: [
            'Use action-led labels: Next step, Upload artwork, Select size.',
            'Avoid vague labels for pricing rows and option groups.',
        ],
        testHooks: [
            {
                hook: 'product-size-option-button',
                intent: 'Selects size option',
                target: 'StickersPage',
            },
            {
                hook: 'product-next-step-button',
                intent: 'Moves user to upload stage when valid',
                target: 'StickersPage',
            },
        ],
        performanceNotes: [
            'First picker image should stay eager/high-priority for LCP.',
            'Avoid expensive recalculation loops when changing quantity or size.',
        ],
        changelog: [
            {
                date: '2026-02-20',
                changes: [
                    'Added dedicated product-configurator guidance with LCP, pricing, and progression checklists.',
                ],
            },
        ],
    },
    '/guide/auth-flow': {
        summary:
            'Patterns for login, register, verification modal handling, and profile setup progression.',
        sections: [
            {
                title: 'Entry States',
                points: [
                    'Separate member and non-member login paths clearly.',
                    'Show validation feedback close to each field.',
                    'Keep forgot-password access visible from the login context.',
                ],
            },
            {
                title: 'Verification',
                points: [
                    'Verification modal should open only after valid primary submit.',
                    'Preserve user-entered values when verification is interrupted.',
                    'Provide resend behavior with explicit timer and disabled state.',
                ],
            },
            {
                title: 'Profile Completion',
                points: [
                    'Use ordered steps with explicit active and completed states.',
                    'Persist completion progress across route changes when possible.',
                    'Use success feedback (toast/banner) after final profile completion.',
                ],
            },
        ],
        doDont: {
            do: [
                'Use neutral action hierarchy with one primary continuation action.',
                'Keep error messaging specific, actionable, and localized.',
            ],
            dont: [
                'Do not block recovery paths such as password reset or resend code.',
                'Do not reset valid form input unless user explicitly clears it.',
            ],
        },
        accessibilityChecklist: [
            'All auth fields have associated labels and clear error text.',
            'Verification modal traps focus and returns it to trigger on close.',
            'Keyboard users can complete each auth stage without pointer input.',
        ],
        qaChecklist: [
            'Validation states are consistent across login, register, and profile flows.',
            'Verification modal open/close behavior is stable in preview and production.',
            'Auth i18n keys render without overflow in long locale strings.',
        ],
        responsiveNotes: [
            'Form field spacing and actions should stack cleanly on narrow screens.',
            'Avoid modal overflow by constraining content and enabling internal scroll.',
        ],
        contentGuidelines: [
            'Use direct, action-led labels: Continue, Verify, Reset password.',
            'Keep helper and error copy short and field-specific.',
        ],
        changelog: [
            {
                date: '2026-02-20',
                changes: [
                    'Added dedicated auth-flow guidance with validation and verification checklists.',
                ],
            },
        ],
    },
    '/guide/animation': {
        summary:
            'Motion standards for transitions, feedback timing, and reduced-motion-safe interactions.',
        sections: [
            {
                title: 'Timing and Easing',
                points: [
                    'Use short durations (120ms-220ms) for micro interactions such as hover and press.',
                    'Use medium durations (220ms-360ms) for panel, card, and carousel transitions.',
                    'Prefer ease-out for entrances and ease-in for exits to keep motion readable.',
                ],
            },
            {
                title: 'Pattern Selection',
                points: [
                    'Use fade for subtle state changes and helper text updates.',
                    'Use slide for directional navigation such as drawers and carousels.',
                    'Use small scale changes for emphasis, never as a default transition.',
                ],
            },
            {
                title: 'Current Site References',
                points: [
                    'Header account dropdown: 0.18s ease with translateY and scale.',
                    'Search/locale modals: fade-only transitions around 0.18s-0.2s.',
                    'Cart preview drawer: 0.6s cubic-bezier slide + opacity transition.',
                    'Home reviews carousel: 360ms ease transform transition.',
                ],
            },
            {
                title: 'Accessibility',
                points: [
                    'Respect `prefers-reduced-motion` and remove non-essential animation.',
                    'Do not use looping animation for critical information or controls.',
                    'Keep focus order stable during animated mount and unmount transitions.',
                ],
            },
        ],
        doDont: {
            do: [
                'Keep transition values consistent across components in the same flow.',
                'Use animation only when it clarifies hierarchy, state, or direction.',
            ],
            dont: [
                'Do not combine multiple large-motion effects on the same component.',
                'Do not delay interaction readiness behind long entrance animation.',
            ],
        },
        accessibilityChecklist: [
            'Reduced-motion preference disables non-essential transitions.',
            'Animated elements do not trap focus or reorder keyboard navigation.',
            'Status changes remain understandable without relying on motion.',
        ],
        qaChecklist: [
            'Animations run smoothly at mobile and desktop breakpoints.',
            'No layout shift is introduced by entering or exiting transitions.',
            'Replay and repeated interactions keep consistent timing.',
        ],
        motionGuidelines: [
            'Hover/press: 120ms-180ms.',
            'Panel and card transitions: 220ms-320ms.',
            'Sequence stagger delays: 40ms-80ms between items.',
        ],
        responsiveNotes: [
            'Reduce travel distance for slide animations on narrow viewports.',
            'Avoid large transform offsets that cause clipped content on mobile.',
        ],
        contentGuidelines: [
            'Pair motion with clear labels so state meaning is still explicit.',
            'Avoid celebratory animation in transactional or error-critical flows.',
        ],
        examples: [
            {
                title: 'Reduced-Motion-Aware Transition',
                code: `.panel {
  transition: transform 260ms ease, opacity 260ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .panel { transition: none; }
}`,
            },
        ],
        changelog: [
            {
                date: '2026-02-20',
                changes: [
                    'Added dedicated animation guide covering timing, accessibility, and QA checks.',
                ],
            },
        ],
    },
    '/guide/testing': {
        summary:
            'Testing standards for design-system components: accessibility, interactions, visual regression, and release readiness.',
        lastUpdatedAt: '2026-02-20',
        lastUpdatedBy: 'Design System Guild',
        sections: [
            {
                title: 'Test ID Naming',
                points: [
                    'Use stable, kebab-case IDs in the format `component-state-action`.',
                    'Avoid transient data (timestamps, random values, index-only suffixes).',
                    'Keep naming consistent across guide examples and product implementations.',
                ],
            },
            {
                title: 'Accessibility Coverage',
                points: [
                    'Validate accessible names for buttons, links, and icon-only controls.',
                    'Verify non-redundant image alt text and semantic heading order.',
                    'Test keyboard-only navigation, focus visibility, and modal escape behavior.',
                ],
            },
            {
                title: 'Interaction and Visual Checks',
                points: [
                    'Run state matrix checks: hover, focus, active, disabled, loading.',
                    'Capture visual snapshots for core guide routes at key breakpoints.',
                    'Validate transition quality and reduced-motion behavior for overlays.',
                ],
            },
        ],
        doDont: {
            do: [
                'Treat design-system QA as a release gate for all shared components.',
                'Keep regression snapshots aligned with current neutral color tokens.',
            ],
            dont: [
                'Do not merge component changes without keyboard and screen-reader checks.',
                'Do not rely on visual checks alone when behavior has async states.',
            ],
        },
        accessibilityChecklist: [
            'All icon-only controls expose explicit labels.',
            'Modal focus handling is validated for open, close, and escape paths.',
            'Document language and reading order are correct for assistive tech.',
        ],
        qaChecklist: [
            'Critical journeys have stable `data-testid` selectors.',
            'Guide and product component states match expected behavior.',
            'No significant layout shifts or motion flicker in key flows.',
        ],
        responsiveNotes: [
            'Run snapshots on mobile, tablet, and desktop viewports.',
            'Check text overflow under long localized strings before release.',
        ],
        contentGuidelines: [
            'Prefer explicit action labels over generic terms like Submit Form.',
            'Keep error and helper messaging short and actionable.',
        ],
        testHooks: [
            {
                hook: 'component-state-action',
                intent: 'Canonical naming format for component selectors.',
                target: 'All components',
            },
            {
                hook: 'auth-login-submit-member-button',
                intent: 'Member login submit action selector.',
                target: 'Auth login form',
            },
        ],
        changelog: [
            {
                date: '2026-02-20',
                changes: [
                    'Added dedicated testing guide with accessibility, interaction, and QA standards.',
                ],
            },
        ],
    },
    '/guide/web-vitals': {
        summary:
            'Live route-level p75 summary for LCP, INP, and CLS based on collected real-user telemetry.',
        sections: [
            {
                title: 'What It Shows',
                points: [
                    'Each row represents a route that has received telemetry samples.',
                    'Metrics are p75 values for LCP, INP, and CLS.',
                    'Sample count and last-seen timestamp help validate data freshness.',
                ],
            },
            {
                title: 'Thresholds',
                points: [
                    'LCP: Good <= 2500ms, Needs Improvement <= 4000ms, Poor > 4000ms.',
                    'INP: Good <= 200ms, Needs Improvement <= 500ms, Poor > 500ms.',
                    'CLS: Good <= 0.10, Needs Improvement <= 0.25, Poor > 0.25.',
                ],
            },
            {
                title: 'Sample Quality Rules',
                points: [
                    'Insufficient: fewer than 30 samples.',
                    'Developing: 30 to 99 samples.',
                    'Reliable: 100 or more samples.',
                ],
            },
            {
                title: 'Collection Notes',
                points: [
                    'Telemetry must be enabled via runtime config before data appears.',
                    'Guide routes are excluded from summary to avoid skewing storefront metrics.',
                    'The summary endpoint aggregates in memory, so values reset on server restart.',
                ],
            },
            {
                title: 'No-Data Debugging',
                points: [
                    'Confirm `runtimeConfig.public.webVitalsEnabled` is true in the running environment.',
                    'Generate traffic by navigating storefront routes (not guide routes only).',
                    'Verify `/api/web-vitals/summary` responds and restart dev/preview server if empty state persists.',
                ],
            },
        ],
        accessibilityChecklist: [
            'Status badges use text labels (Good, Needs Improvement, Poor, No Data) and do not rely only on color.',
            'Table and chart-like bars include clear headings and contextual labels.',
            'Refresh action is keyboard reachable and has explicit button text.',
        ],
        qaChecklist: [
            'Guide route loads and refreshes summary without console errors.',
            'Metric badges reflect good, needs-improvement, and poor thresholds.',
            'No-data state clearly explains how to enable collection.',
            'Sample quality labels follow expected counts (<30, 30-99, 100+).',
        ],
        responsiveNotes: [
            'Status and metric cards stack cleanly on narrow breakpoints.',
            'Route table remains horizontally scrollable without clipping column labels.',
        ],
        examples: [
            {
                title: 'Summary Response Shape',
                code: `{
  "ok": true,
  "generatedAt": "2026-02-20T08:16:21.000Z",
  "routeCount": 2,
  "routes": [
    {
      "route": "/stickers",
      "count": 128,
      "lastSeen": "2026-02-20T08:12:03.000Z",
      "p75": { "LCP": 2190, "INP": 148, "CLS": 0.05 }
    }
  ]
}`,
            },
        ],
        changelog: [
            {
                date: '2026-02-20',
                changes: [
                    'Restored route-level Web Vitals guide with p75 summary table and refresh action.',
                    'Expanded docs with thresholds, sampling quality rules, debugging steps, and response example.',
                ],
            },
        ],
    },
    '/guide/feedback-empty-states': {
        summary:
            'Patterns for system feedback: status, loading, and empty states.',
        sections: [
            {
                title: 'Messaging',
                points: [
                    'Always state what happened and what the user can do next.',
                    'Use concise, action-oriented language.',
                ],
            },
            {
                title: 'Visuals',
                points: [
                    'Use semantic state colors for status cues.',
                    'Use empty-state illustration plus clear recovery action.',
                    'Keep loading states visually stable to avoid layout jump.',
                ],
            },
            {
                title: 'Behavior',
                points: [
                    'Pair async feedback with progress indication for long-running actions.',
                    'Provide retry pathways for failed requests when possible.',
                    'Use polite status announcements for important state changes.',
                ],
            },
        ],
        doDont: {
            do: [
                'Explain what happened and present the next best action.',
                'Use calm, concise tone for error and empty-state messages.',
            ],
            dont: [
                'Do not display technical API errors directly to end users.',
                'Do not leave blank states without a recovery path.',
            ],
        },
        accessibilityChecklist: [
            'Important status changes are announced with appropriate politeness.',
            'Loading indicators include meaningful text for assistive technologies.',
        ],
        qaChecklist: [
            'Empty states have a visible CTA in all breakpoints.',
            'Error and retry paths are tested with simulated failed requests.',
            'Skeleton/loading states do not cause major layout shifts.',
        ],
        responsiveNotes: [
            'Feedback cards should remain centered and readable on mobile widths.',
            'Keep illustrations optional when viewport height is limited.',
        ],
        contentGuidelines: [
            'Use direct language: Try again, Refresh, Continue shopping.',
            'Avoid blame language and all-caps alert copy.',
        ],
        changelog: [
            {
                date: '2026-02-19',
                changes: [
                    'Added feedback-state do/don\'t guidance and QA coverage.',
                ],
            },
        ],
    },
    '/guide/skeleton': {
        summary:
            'Skeleton loading patterns that keep structure stable while data is fetched.',
        owner: { name: 'Design System Guild', team: 'Frontend Platform' },
        lastUpdatedAt: '2026-02-20',
        lastUpdatedBy: 'Codex',
        sections: [
            {
                title: 'When To Use',
                points: [
                    'Use skeletons for async content where layout is already known.',
                    'Prefer short-lived placeholders; switch to real content as soon as data is ready.',
                    'Avoid skeletons for immediate actions where a spinner or disabled button is clearer.',
                ],
            },
            {
                title: 'Layout Rules',
                points: [
                    'Match final content dimensions to minimize CLS.',
                    'Use grouped lines for text blocks and dedicated blocks for media thumbnails.',
                    'Keep corner radius and spacing aligned with final component shape.',
                ],
            },
            {
                title: 'Motion',
                points: [
                    'Use subtle shimmer or pulse only; keep contrast low and non-distracting.',
                    'Respect reduced-motion preferences by disabling shimmer animation.',
                ],
            },
        ],
        doDont: {
            do: [
                'Mirror final card/list layout so loading-to-ready transition feels stable.',
                'Use consistent skeleton tokens across pages.',
            ],
            dont: [
                'Do not over-animate placeholders or use high-contrast flashing effects.',
                'Do not render skeletons when loading state exceeds practical timeout without fallback messaging.',
            ],
        },
        accessibilityChecklist: [
            'Skeleton containers are marked `aria-hidden="true"` when purely decorative.',
            'Loading state includes context text for screen readers when content is delayed.',
            'Reduced-motion users do not receive shimmer animation.',
        ],
        qaChecklist: [
            'No visible layout jump occurs when swapping skeleton to real content.',
            'Skeleton blocks align with final content widths/heights in mobile and desktop frames.',
            'Loading and resolved states are both covered in e2e assertions.',
        ],
        responsiveNotes: [
            'Keep skeleton line count lower on compact mobile cards.',
            'Avoid horizontal overflow in list placeholders at small widths.',
        ],
        performanceNotes: [
            'Skeletons should reserve space for images and text to protect CLS.',
            'Avoid large animated gradients on many rows simultaneously to reduce paint cost.',
        ],
        testHooks: [
            {
                hook: 'skeleton-list-loading',
                intent: 'Loading list placeholder container',
                target: 'Guide skeleton preview',
            },
            {
                hook: 'skeleton-card-item',
                intent: 'Individual skeleton placeholder card',
                target: 'Guide skeleton preview',
            },
        ],
        snippets: [
            {
                title: 'Skeleton Card Pattern',
                language: 'html',
                code: `<article class="skeleton-card" aria-hidden="true">
  <div class="skeleton-thumb"></div>
  <div class="skeleton-line skeleton-line-title"></div>
  <div class="skeleton-line"></div>
  <div class="skeleton-line skeleton-line-short"></div>
</article>`,
            },
        ],
        changelog: [
            {
                version: 'v1.0.0',
                date: '2026-02-20',
                changes: ['Added skeleton loading guide with layout, accessibility, and QA guardrails.'],
                diffLinks: [
                    { label: 'Skeleton Guide Page', path: 'frontend/app/pages/guide/skeleton.vue' },
                    { label: 'Guide Metadata', path: 'frontend/app/data/guide/guides.ts' },
                ],
            },
        ],
    },
    '/guide/coverage': {
        summary:
            'Coverage matrix for shared UI components and guide ownership gaps.',
        owner: { name: 'Design System Guild', team: 'Frontend Platform' },
        lastUpdatedAt: '2026-02-20',
        lastUpdatedBy: 'Codex',
        sections: [
            {
                title: 'How Coverage Is Scored',
                points: [
                    'Complete: component has dedicated guide plus test hooks and usage references.',
                    'Partial: component is referenced in docs but lacks a dedicated guide workflow.',
                    'Missing: shared component has no associated guide entry yet.',
                ],
            },
        ],
        qaChecklist: [
            'All UI shared components are represented in the matrix.',
            'Missing items include actionable next steps to add guide pages.',
        ],
        snippets: [
            {
                title: 'Coverage Mapping Example',
                language: 'ts',
                code: `{
  component: 'UiButton',
  guide: '/guide/buttons',
  status: 'complete'
}`,
            },
        ],
        changelog: [
            {
                version: 'v1.0.0',
                date: '2026-02-20',
                changes: ['Added guide coverage dashboard baseline and scoring model.'],
                diffLinks: [
                    { label: 'Coverage Page', path: 'frontend/app/pages/guide/coverage.vue' },
                ],
            },
        ],
    },
    '/guide/standards': {
        summary:
            'Current implemented standards for coding style, shared component workflow, and accessibility baseline.',
        owner: { name: 'Design System Guild', team: 'Frontend Platform' },
        lastUpdatedAt: '2026-02-26',
        lastUpdatedBy: 'Codex',
        sections: [
            {
                title: 'System Description',
                points: [
                    'Guide-driven design system with shared foundation tokens and UI primitives.',
                    'Guide pages are used to document shared component behavior.',
                    'Changes to shared UI should be reflected in guide docs in the same cycle.',
                ],
            },
            {
                title: 'Code Style and Linting (Required)',
                points: [
                    'Tabs are required for indentation.',
                    'Tab width is 4 spaces.',
                    'No trailing spaces.',
                    'No extra newline at EOF.',
                    'No unused variables (`no-unused-vars` is enforced as error).',
                ],
            },
            {
                title: 'Component and Guide Workflow (Required)',
                points: [
                    'Use existing semantic tokens and shared values before adding raw custom values.',
                    'Keep reusable primitives in `app/components/ui`.',
                    'Update the related guide page/docs when shared component behavior changes.',
                ],
            },
            {
                title: 'Accessibility Baseline (Required)',
                points: [
                    'Interactive controls must be keyboard reachable.',
                    'Visible focus indicators must remain enabled.',
                    'Icon-only controls require accessible names.',
                ],
            },
            {
                title: 'Class Naming and SCSS Structure (Required)',
                points: [
                    'Use descriptive, component-scoped class names.',
                    'Keep reusable UI in `app/components/ui`; keep feature-only styles in feature folders.',
                    'Prefer class selectors over deep descendant element selectors.',
                    'Use semantic CSS variables before raw values.',
                ],
            },
            {
                title: 'API Naming Standards (Required)',
                points: [
                    'Variables use `snake_case`.',
                    'Constants use `UPPER_CASE`.',
                    'Functions use `KebabCase`.',
                ],
            },
            {
                title: 'Recommended Practices',
                points: [
                    'Use ESLint, Prettier, and EditorConfig in your editor.',
                    'Run `npm run lint` before commit/push.',
                    'Attach screenshots when UI is changed.',
                    'Keep SCSS nesting shallow and use clear state class names.',
                ],
            },
            {
                title: 'Recommended Conventions',
                points: [
                    'File naming: components in PascalCase, composables in `useXxx.ts`, SCSS partials in `_kebab-case.scss`.',
                    'Import order: framework -> libraries -> app aliases -> relative imports.',
                    'Type props/emits and provide defaults for optional props.',
                    'Move complex template logic into `computed`.',
                    'Show user-friendly error messages instead of raw API errors.',
                    'Use i18n keys for reusable component copy.',
                    'Use stable `data-testid` only for critical actions.',
                    'Avoid `!important` and ID selectors in component styling.',
                ],
            },
            {
                title: 'Onboarding First Tasks',
                points: [
                    'Run app locally: `npm install`, `npm run dev`.',
                    'Run lint: `npm run lint`.',
                    'Implement using existing tokens/components first.',
                    'Update guide docs if shared behavior changed.',
                    'Attach screenshot proof for UI changes.',
                ],
            },
        ],
        doDont: {
            do: [
                'Keep implementation and guide docs updated in the same delivery cycle.',
                'Use shared linting and editor tooling for consistent formatting.',
            ],
            dont: [
                'Do not bypass token conventions with ad-hoc styling values.',
                'Do not merge code with unresolved lint errors.',
            ],
        },
        qaChecklist: [
            'Standards page is reachable from onboarding flow and guide navigation.',
            'Rules shown in standards match `.editorconfig`, `.prettierrc`, and `.eslintrc.json`.',
            'Versioned standards acknowledgment redirects correctly after confirm action.',
        ],
        accessibilityChecklist: [
            'Standards page heading structure remains semantic.',
            'Action buttons are keyboard reachable.',
        ],
        contentGuidelines: [
            'Keep rules limited to currently implemented standards.',
            'Avoid policy statements that are not enforced yet.',
        ],
        changelog: [
            {
                version: 'v2.1.0',
                date: '2026-02-26',
                changes: [
                    'Simplified standards content to currently implemented and enforced rules only.',
                    'Kept Required vs Recommended structure with compact checklist format.',
                    'Retained standards versioned acknowledgment flow (v2).',
                ],
                diffLinks: [
                    { label: 'Standards Page', path: 'frontend/app/pages/guide/standards.vue' },
                    { label: 'Guide Middleware', path: 'frontend/app/middleware/guide-onboarding.global.ts' },
                    { label: 'Guide Docs', path: 'frontend/app/data/guide/docs.ts' },
                ],
            },
        ],
    },
};
