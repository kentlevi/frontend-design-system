<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { guides } from '@/data/guide/guides';
import { guideDocs } from '@/data/guide/docs';
import GuideCopy from '@/components/guide/GuideCopy.vue';
import GuidePlaygroundControls from '@/components/guide/GuidePlaygroundControls.vue';

const route = useRoute();
const { locales } = useI18n();
const localePath = useLocalePath();
const GUIDE_STANDARDS_VERSION = 'v2';
const GUIDE_STANDARDS_COOKIE = `guide_standards_read_${GUIDE_STANDARDS_VERSION}`;
const standardsCookie = useCookie<string | null>(GUIDE_STANDARDS_COOKIE, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
});
const baseGuides = guides.filter((item) => item.category === 'base');
const coreGuides = guides.filter(
    (item) => item.category === 'core' && item.path !== '/guide/standards'
);
const standardsGuideItem = guides.find((item) => item.path === '/guide/standards') ?? null;
const guideQuery = ref('');
const checklistStatusFilter = ref<'all' | 'planned' | 'in-progress' | 'done'>('all');
const checklistPhaseFilter = ref<'all' | 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4'>('all');
const guideSearchInputRef = ref<HTMLInputElement | null>(null);
const previewFrame = ref<'mobile' | 'tablet' | 'desktop'>('desktop');
const showPreviewTools = ref(false);
const playgroundState = ref({
    size: 'md',
    tone: 'neutral',
    state: 'default',
});
const viewMode = useState<'preview' | 'documentation'>(
    'guide-view-mode',
    () => 'preview'
);

const normalizedRoutePath = computed(() =>
    route.path !== '/' && route.path.endsWith('/')
        ? route.path.slice(0, -1)
        : route.path
);
const localeCodes = computed(() =>
    locales.value.map((item) => (typeof item === 'string' ? item : item.code))
);
const guidePath = computed(() => {
    const path = normalizedRoutePath.value;
    for (const code of localeCodes.value) {
        const prefix = `/${code}`;
        if (path === prefix) {
            return '/';
        }
        if (path.startsWith(`${prefix}/`)) {
            return path.slice(prefix.length);
        }
    }
    return path;
});
const isOverviewPath = computed(
    () => guidePath.value === '/guide' || guidePath.value === '/'
);
const currentDoc = computed(
    () => guideDocs[guidePath.value] ?? (isOverviewPath.value ? guideDocs['/guide'] : null)
);
const canShowDocs = computed(() => Boolean(currentDoc.value));
const isDocumentationOnlyGuide = computed(() => guidePath.value === '/guide/standards');
const currentGuideItem = computed(() =>
    guides.find((item) =>
        isOverviewPath.value ? item.path === '/guide' : item.path === guidePath.value
    ) ?? null
);
const normalizedGuideQuery = computed(() => guideQuery.value.trim().toLowerCase());
const a11yQuickChecks = ref<
    Array<{ id: string; label: string; passed: boolean; detail: string }>
>([]);
const currentDocLastUpdated = computed(
    () => currentDoc.value?.lastUpdatedAt ?? currentDoc.value?.changelog?.[0]?.date ?? null
);

const searchIndexByPath = computed<Record<string, string>>(() => {
    return guides.reduce<Record<string, string>>((acc, item) => {
        const doc = guideDocs[item.path];
        const docTokens = [
            doc?.summary ?? '',
            ...(doc?.sections ?? []).map((section) => section.title),
            ...(doc?.sections ?? []).flatMap((section) => section.points),
            ...(doc?.qaChecklist ?? []),
            ...(doc?.accessibilityChecklist ?? []),
            ...(doc?.contentGuidelines ?? []),
            ...(doc?.performanceNotes ?? []),
        ];

        acc[item.path] = [
            item.title,
            item.description ?? '',
            item.category ?? '',
            ...(item.tags ?? []),
            ...docTokens,
        ]
            .join(' ')
            .toLowerCase();
        return acc;
    }, {});
});

const matchesGuideQuery = (item: (typeof guides)[number]) => {
    if (!normalizedGuideQuery.value) return true;
    return searchIndexByPath.value[item.path]?.includes(normalizedGuideQuery.value);
};

const filteredBaseGuides = computed(() =>
    baseGuides.filter((item) => matchesGuideQuery(item))
);

const filteredCoreGuides = computed(() =>
    coreGuides.filter((item) => matchesGuideQuery(item))
);

const overviewGuide = guides.find((item) => item.path === '/guide');
const hasSidebarMatches = computed(
    () =>
        filteredBaseGuides.value.length > 0 ||
        filteredCoreGuides.value.length > 0 ||
        (overviewGuide ? matchesGuideQuery(overviewGuide) : false)
);

const relatedGuides = computed(() => {
    const relatedPaths = currentGuideItem.value?.related ?? [];
    if (!relatedPaths.length) return [];
    return relatedPaths
        .map((path) => guides.find((item) => item.path === path))
        .filter((item): item is (typeof guides)[number] => Boolean(item));
});

const guideStatusLabel = (status?: 'draft' | 'stable' | 'deprecated') => {
    if (!status) return 'Stable';
    if (status === 'draft') return 'Draft';
    if (status === 'deprecated') return 'Deprecated';
    return 'Stable';
};

const checklistItems = computed(() => currentDoc.value?.guideChecklist ?? []);
const filteredChecklistItems = computed(() =>
    checklistItems.value.filter((item) => {
        if (
            checklistStatusFilter.value !== 'all' &&
            item.status !== checklistStatusFilter.value
        ) {
            return false;
        }
        if (
            checklistPhaseFilter.value !== 'all' &&
            item.phase !== checklistPhaseFilter.value
        ) {
            return false;
        }
        return true;
    })
);
const snippetsForDoc = computed(() => {
    const snippets = currentDoc.value?.snippets ?? [];
    if (snippets.length) return snippets;
    const derivedFromExamples = (currentDoc.value?.examples ?? []).map((example) => ({
        title: example.title,
        language: 'vue',
        code: example.code,
    }));
    if (derivedFromExamples.length) return derivedFromExamples;

    if (!currentGuideItem.value) return [];
    return [
        {
            title: `${currentGuideItem.value.title} Metadata`,
            language: 'ts',
            code: `{
  path: '${currentGuideItem.value.path}',
  status: '${currentGuideItem.value.status ?? 'stable'}',
  tags: ${JSON.stringify(currentGuideItem.value.tags ?? [])}
}`,
        },
    ];
});
const usedInReferences = computed(() => currentGuideItem.value?.usedIn ?? []);
const changelogEntries = computed(() =>
    (currentDoc.value?.changelog ?? []).map((entry, index) => ({
        ...entry,
        version: entry.version ?? `v1.${Math.max(0, (currentDoc.value?.changelog?.length ?? 1) - index - 1)}.0`,
        diffLinks:
            entry.diffLinks && entry.diffLinks.length
                ? entry.diffLinks
                : usedInReferences.value.slice(0, 2).map((ref) => ({
                      label: ref.label,
                      path: toFileLink(ref.path, ref.line),
                  })),
    }))
);
const currentPlaygroundConfig = computed(() => currentDoc.value?.playground ?? null);
const previewFrameStyle = computed(() => {
    const sizeScale =
        playgroundState.value.size === 'sm'
            ? 0.92
            : playgroundState.value.size === 'lg'
                ? 1.08
                : 1;
    const stateOpacity = playgroundState.value.state === 'disabled' ? 0.72 : 1;
    return {
        '--guide-playground-scale': `${sizeScale}`,
        '--guide-playground-opacity': `${stateOpacity}`,
    };
});

const normalizedChecklistState = (status: 'planned' | 'in-progress' | 'done') =>
    status === 'in-progress' ? 'In Progress' : status[0].toUpperCase() + status.slice(1);
const phaseLabel = (phase: 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4') =>
    phase.replace('phase-', 'Phase ');
const checklistTagClass = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
const checklistSummary = computed(() => {
    const total = checklistItems.value.length;
    const done = checklistItems.value.filter((item) => item.status === 'done').length;
    const inProgress = checklistItems.value.filter(
        (item) => item.status === 'in-progress'
    ).length;
    const planned = checklistItems.value.filter((item) => item.status === 'planned').length;

    return {
        total,
        done,
        inProgress,
        planned,
        completion: total ? Math.round((done / total) * 100) : 0,
    };
});
const checklistPhaseProgress = computed(() =>
    (['phase-1', 'phase-2', 'phase-3', 'phase-4'] as const).map((phase) => {
        const items = checklistItems.value.filter((item) => item.phase === phase);
        const done = items.filter((item) => item.status === 'done').length;
        const percent = items.length ? Math.round((done / items.length) * 100) : 0;
        return {
            phase,
            total: items.length,
            done,
            percent,
        };
    })
);

const toFileLink = (path: string, line?: number) => (line ? `${path}:${line}` : path);
const doDontVisualCopyByPath: Record<string, { do: string; dont: string }> = {
    '/guide': {
        do: 'Use base-first then core patterns with clear ownership and update cadence.',
        dont: 'Ship shared UI changes without updating guide docs and QA criteria.',
    },
    '/guide/colors': {
        do: 'Use semantic tokens consistently for surfaces, text, and borders.',
        dont: 'Mix ad-hoc hex values with semantic tokens in the same component.',
    },
    '/guide/icons': {
        do: 'Keep icon size and style consistent within each control set.',
        dont: 'Use decorative icons as the only signal for critical meaning.',
    },
    '/guide/buttons': {
        do: 'Primary action stands out, secondary action is subdued and aligned.',
        dont: 'Multiple primary buttons compete in the same action group.',
    },
    '/guide/cards': {
        do: 'Card title, metadata, and actions follow a clear vertical rhythm.',
        dont: 'Card content and actions are crowded with uneven spacing.',
    },
    '/guide/carousel': {
        do: 'Visible prev/next controls with stable slide alignment.',
        dont: 'Hidden controls and jumpy slide movement with no context.',
    },
    '/guide/form-controls': {
        do: 'Label, field, and helper/error text are consistently grouped.',
        dont: 'Placeholder-only fields with detached or missing error text.',
    },
    '/guide/typography': {
        do: 'Apply heading/body scale with predictable spacing and contrast.',
        dont: 'Mix random sizes/weights that break reading hierarchy.',
    },
    '/guide/spacing': {
        do: 'Use spacing tokens to keep rhythm between sections and controls.',
        dont: 'Hardcode arbitrary gaps that create inconsistent layouts.',
    },
    '/guide/animation': {
        do: 'Use short, purposeful transitions with reduced-motion support.',
        dont: 'Add motion that reflows layout or distracts from primary tasks.',
    },
    '/guide/feedback-empty-states': {
        do: 'Explain state clearly and provide a next best action.',
        dont: 'Show vague or dead-end feedback without recovery paths.',
    },
    '/guide/skeleton': {
        do: 'Keep placeholders aligned to final content dimensions with subtle motion.',
        dont: 'Use flashing, mismatched blocks that cause layout jump on load.',
    },
    '/guide/cart-patterns': {
        do: 'Drawer summary and checkout CTA remain fixed and readable.',
        dont: 'Totals and actions shift or disappear between cart states.',
    },
    '/guide/header-patterns': {
        do: 'Keep header actions ordered and overlays mutually exclusive.',
        dont: 'Allow overlapping panels that confuse focus and control flow.',
    },
    '/guide/product-configurator': {
        do: 'Keep picker, options, and pricing updates synchronized in real time.',
        dont: 'Enable progression before required configuration is valid.',
    },
    '/guide/auth-flow': {
        do: 'Separate entry states clearly with inline validation feedback.',
        dont: 'Merge auth states into one ambiguous form flow.',
    },
    '/guide/testing': {
        do: 'Use stable `component-state-action` hooks across core interactions.',
        dont: 'Use brittle selectors tied to transient DOM text or index.',
    },
    '/guide/web-vitals': {
        do: 'Track route p75 trends with quality thresholds and clear status bands.',
        dont: 'Compare sparse samples as if they were production-reliable.',
    },
    '/guide/locale-switcher': {
        do: 'Show selected locale clearly with keyboard-navigable options.',
        dont: 'Hide selection state or force full reloads unnecessarily.',
    },
    '/guide/i18n': {
        do: 'Use consistent translation keys and interpolation patterns.',
        dont: 'Embed hardcoded copy in reusable shared components.',
    },
    '/guide/color-swatches': {
        do: 'Preview palette/semantic swatches with explicit token names.',
        dont: 'Present color chips without token/context labeling.',
    },
    '/guide/modals': {
        do: 'Clear title, short body copy, and ordered confirm/cancel actions.',
        dont: 'Ambiguous modal actions with overloaded content.',
    },
    '/guide/badges': {
        do: 'Use concise status labels with semantic tone consistency.',
        dont: 'Overload badges with long copy or purely decorative color usage.',
    },
    '/guide/flags': {
        do: 'Pair flags with locale/region text for unambiguous meaning.',
        dont: 'Use flags alone as a language indicator.',
    },
    '/guide/social-icons': {
        do: 'Use brand-consistent icons with explicit accessible link labels.',
        dont: 'Render social icons without clear interactive context.',
    },
    '/guide/logos': {
        do: 'Respect logo clear-space and approved variant contrast rules.',
        dont: 'Stretch, recolor, or over-effect brand assets.',
    },
    '/guide/coverage': {
        do: 'Track missing/partial guides and close gaps before shared rollout.',
        dont: 'Assume component maturity without documented guide coverage.',
    },
};
const doDontVisualCopy = computed(
    () =>
        doDontVisualCopyByPath[guidePath.value] ?? {
            do: 'Clear hierarchy + aligned controls.',
            dont: 'Mixed hierarchy + inconsistent controls.',
        }
);

const runA11yQuickChecks = () => {
    if (typeof document === 'undefined' || viewMode.value !== 'preview') {
        a11yQuickChecks.value = [];
        return;
    }

    const previewPanel = document.querySelector('#guide-panel-preview');
    const focusable = previewPanel?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const iconOnlyButtons = previewPanel?.querySelectorAll(
        'button[aria-label]'
    );
    const hasFocusVisibleDeclaration = Array.from(document.styleSheets).some((sheet) => {
        try {
            return Array.from(sheet.cssRules).some((rule) =>
                rule.cssText.includes(':focus-visible')
            );
        } catch {
            return false;
        }
    });
    const hasTokenGuidance = Boolean(currentDoc.value?.tokenGuardrails?.length);

    a11yQuickChecks.value = [
        {
            id: 'keyboard',
            label: 'Keyboard reachable controls',
            passed: Boolean(focusable && focusable.length > 0),
            detail: focusable?.length
                ? `${focusable.length} focusable controls found`
                : 'No focusable controls found in preview.',
        },
        {
            id: 'focus',
            label: 'Visible focus style declaration',
            passed: hasFocusVisibleDeclaration,
            detail: hasFocusVisibleDeclaration
                ? 'At least one :focus-visible style rule detected.'
                : 'No :focus-visible rule detected.',
        },
        {
            id: 'labels',
            label: 'Icon-only accessible labels',
            passed: Boolean(iconOnlyButtons && iconOnlyButtons.length > 0),
            detail: iconOnlyButtons?.length
                ? `${iconOnlyButtons.length} labeled icon-only controls detected.`
                : 'No labeled icon-only controls detected in preview.',
        },
        {
            id: 'contrast',
            label: 'Color/contrast guidance declared',
            passed: hasTokenGuidance,
            detail: hasTokenGuidance
                ? 'Token guardrails include color contrast guidance.'
                : 'No token guardrails declared for this guide.',
        },
    ];
};

const isTypingTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return (
        target.isContentEditable ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
    );
};

function onGuideShortcut(event: KeyboardEvent) {
    if (event.defaultPrevented) return;
    const isSlashKey =
        event.key === '/' || event.code === 'Slash' || event.code === 'NumpadDivide';
    if (!isSlashKey) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (isTypingTarget(event.target)) return;

    event.preventDefault();
    guideSearchInputRef.value?.focus();
    guideSearchInputRef.value?.select();
}

const toAnchorId = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const standardsContinueTarget = computed(() => {
    const redirect = route.query.redirect;
    const value = Array.isArray(redirect) ? redirect[0] : redirect;
    if (typeof value === 'string' && value.includes('/guide')) return value;
    return localePath('/guide');
});

function confirmStandardsRead() {
    standardsCookie.value = '1';
    navigateTo(standardsContinueTarget.value);
}

watch(
    guidePath,
    (nextPath, previousPath) => {
        if (isDocumentationOnlyGuide.value) {
            viewMode.value = 'documentation';
            return;
        }

        if (previousPath === '/guide/standards') {
            viewMode.value = 'preview';
            return;
        }

        if (!canShowDocs.value) {
            viewMode.value = 'preview';
        }
    },
    { immediate: true }
);

onMounted(() => {
    if (currentPlaygroundConfig.value) {
        playgroundState.value = {
            size: currentPlaygroundConfig.value.defaultSize ?? 'md',
            tone: currentPlaygroundConfig.value.defaultTone ?? 'neutral',
            state: currentPlaygroundConfig.value.defaultState ?? 'default',
        };
    }

    document.addEventListener('keydown', onGuideShortcut);
    window.addEventListener('keydown', onGuideShortcut);
    runA11yQuickChecks();
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', onGuideShortcut);
    window.removeEventListener('keydown', onGuideShortcut);
});

watch([guidePath, viewMode, previewFrame], async () => {
    await nextTick();
    const config = currentPlaygroundConfig.value;
    if (config) {
        playgroundState.value = {
            size: config.defaultSize ?? 'md',
            tone: config.defaultTone ?? 'neutral',
            state: config.defaultState ?? 'default',
        };
    }
    runA11yQuickChecks();
});
</script>

<template>
    <div class="guide-layout">
        <aside class="guide-sidebar">
            <div class="guide-brand">
                <p class="guide-eyebrow">Design System</p>
                <h2 class="guide-heading">Guide</h2>
            </div>

            <div class="guide-sidebar-primary">
                <NuxtLink
                    v-if="standardsGuideItem"
                    :to="localePath('/guide/standards')"
                    class="guide-link guide-link-overview"
                    :class="{ 'is-active': guidePath.startsWith('/guide/standards') }"
                >
                    {{ standardsGuideItem.title }}
                    <span class="guide-link-status" :class="`is-${standardsGuideItem.status ?? 'stable'}`">
                        {{ guideStatusLabel(standardsGuideItem.status) }}
                    </span>
                </NuxtLink>

                <NuxtLink
                    :to="localePath('/guide')"
                    class="guide-link guide-link-overview"
                    :class="{ 'is-active': isOverviewPath }"
                >
                    Overview
                    <span class="guide-link-status is-stable">Stable</span>
                </NuxtLink>
            </div>

            <label class="guide-sidebar-search">
                <span class="guide-sidebar-search-label">Search guides</span>
                <input
                    ref="guideSearchInputRef"
                    v-model="guideQuery"
                    type="search"
                    class="guide-sidebar-search-input"
                    placeholder="Search by name or purpose"
                    data-testid="guide-sidebar-search-input"
                />
            </label>

            <div class="guide-sidebar-nav-wrap">
                <nav class="guide-nav">
                    <section
                        v-if="filteredBaseGuides.length"
                        class="guide-nav-group"
                    >
                        <p class="guide-nav-label">Base</p>
                        <NuxtLink
                            v-for="item in filteredBaseGuides"
                            :key="item.path"
                            :to="localePath(item.path)"
                            class="guide-link"
                            :class="{
                                'is-active': guidePath.startsWith(item.path),
                            }"
                        >
                            {{ item.title }}
                            <span
                                class="guide-link-status"
                                :class="`is-${item.status ?? 'stable'}`"
                            >
                                {{ guideStatusLabel(item.status) }}
                            </span>
                        </NuxtLink>
                    </section>

                    <section
                        v-if="filteredCoreGuides.length"
                        class="guide-nav-group"
                    >
                        <p class="guide-nav-label">Core</p>
                        <NuxtLink
                            v-for="item in filteredCoreGuides"
                            :key="item.path"
                            :to="localePath(item.path)"
                            class="guide-link"
                            :class="{
                                'is-active': guidePath.startsWith(item.path),
                            }"
                        >
                            {{ item.title }}
                            <span
                                class="guide-link-status"
                                :class="`is-${item.status ?? 'stable'}`"
                            >
                                {{ guideStatusLabel(item.status) }}
                            </span>
                        </NuxtLink>
                    </section>

                    <p v-if="!hasSidebarMatches" class="guide-nav-empty">
                        No matching guides.
                    </p>
                </nav>
            </div>

            <footer class="guide-sidebar-footer">
                <div
                    v-if="isDocumentationOnlyGuide"
                    class="guide-view-toggle"
                    role="tablist"
                    aria-label="Guide content view"
                >
                    <button
                        type="button"
                        role="tab"
                        id="guide-tab-documentation-only"
                        class="guide-view-toggle-button is-active"
                        aria-controls="guide-panel-documentation"
                        aria-selected="true"
                        tabindex="0"
                        disabled
                    >
                        Documentation
                    </button>
                </div>
                <div
                    v-else
                    class="guide-view-toggle"
                    role="tablist"
                    aria-label="Guide content view"
                >
                    <button
                        type="button"
                        role="tab"
                        id="guide-tab-preview"
                        class="guide-view-toggle-button"
                        :class="{ 'is-active': viewMode === 'preview' }"
                        aria-controls="guide-panel-preview"
                        :aria-selected="viewMode === 'preview'"
                        :tabindex="viewMode === 'preview' ? 0 : -1"
                        @click="viewMode = 'preview'"
                    >
                        Preview
                    </button>
                    <button
                        type="button"
                        role="tab"
                        id="guide-tab-documentation"
                        class="guide-view-toggle-button"
                        :class="{ 'is-active': viewMode === 'documentation' }"
                        aria-controls="guide-panel-documentation"
                        :aria-selected="viewMode === 'documentation'"
                        :disabled="!canShowDocs"
                        :tabindex="viewMode === 'documentation' ? 0 : -1"
                        @click="viewMode = 'documentation'"
                    >
                        Documentation
                    </button>
                </div>
            </footer>
        </aside>

        <main class="guide-content">
            <section
                v-if="!isDocumentationOnlyGuide && (viewMode === 'preview' || !currentDoc)"
                id="guide-panel-preview"
                class="guide-preview-panel"
                role="tabpanel"
                aria-labelledby="guide-tab-preview"
            >
                <div class="guide-preview-toolbar-toggle-wrap">
                    <button
                        type="button"
                        class="guide-preview-tools-toggle"
                        :aria-expanded="showPreviewTools"
                        data-testid="guide-preview-tools-toggle"
                        @click="showPreviewTools = !showPreviewTools"
                    >
                        {{ showPreviewTools ? 'Hide Preview Tools' : 'Show Preview Tools' }}
                    </button>
                </div>

                <header v-if="showPreviewTools" class="guide-preview-toolbar">
                    <div class="guide-preview-frames" role="group" aria-label="Preview device frame">
                        <button
                            v-for="frame in ['mobile', 'tablet', 'desktop'] as const"
                            :key="frame"
                            type="button"
                            class="guide-preview-frame-toggle"
                            :class="{ 'is-active': previewFrame === frame }"
                            @click="previewFrame = frame"
                        >
                            {{ frame }}
                        </button>
                    </div>
                    <GuidePlaygroundControls
                        v-if="currentPlaygroundConfig"
                        v-model="playgroundState"
                        :config="currentPlaygroundConfig"
                    />
                    <div class="guide-preview-checks">
                        <UiBadge
                            v-for="check in a11yQuickChecks"
                            :key="check.id"
                            variant="tonal"
                            :tone="check.passed ? 'success' : 'danger'"
                            :title="check.detail"
                        >
                            {{ check.label }}: {{ check.passed ? 'Pass' : 'Fail' }}
                        </UiBadge>
                    </div>
                </header>
                <div
                    class="guide-preview-frame-wrap"
                    :class="`is-${previewFrame}`"
                    :data-tone="playgroundState.tone"
                    :data-state="playgroundState.state"
                    :style="previewFrameStyle"
                >
                    <NuxtPage />
                </div>
            </section>

            <section
                v-else
                id="guide-panel-documentation"
                class="guide-docs"
                role="tabpanel"
                aria-labelledby="guide-tab-documentation"
                data-testid="guide-documentation-panel"
            >
                <header class="guide-docs-header">
                    <h1 class="guide-docs-title">Documentation</h1>
                    <p class="guide-docs-summary">
                        {{ currentDoc.summary }}
                    </p>
                    <p v-if="currentGuideItem?.status" class="guide-docs-meta">
                        Status:
                        <span
                            class="guide-docs-status-chip"
                            :class="`is-${currentGuideItem.status}`"
                        >
                            {{ guideStatusLabel(currentGuideItem.status) }}
                        </span>
                    </p>
                    <p
                        v-if="
                            currentDoc.owner?.name ||
                            currentDoc.lastUpdatedBy ||
                            currentDocLastUpdated
                        "
                        class="guide-docs-meta"
                    >
                        <span v-if="currentDoc.owner?.name">
                            Owner: {{ currentDoc.owner.name }}
                            <span v-if="currentDoc.owner.team">({{ currentDoc.owner.team }})</span>
                        </span>
                        <span v-if="currentDoc.lastUpdatedBy || currentDocLastUpdated">
                            • Last updated
                            <template v-if="currentDoc.lastUpdatedBy">
                                by {{ currentDoc.lastUpdatedBy }}
                            </template>
                            <template v-if="currentDocLastUpdated">
                                on {{ currentDocLastUpdated }}
                            </template>
                        </span>
                    </p>
                </header>

                <section
                    v-if="isOverviewPath && checklistItems.length"
                    class="guide-docs-section guide-overview-snapshot"
                    id="doc-overview-snapshot"
                >
                    <h2 class="guide-docs-section-title">Maturity Snapshot</h2>
                    <div class="guide-overview-metrics">
                        <article class="guide-overview-metric-card">
                            <p class="guide-overview-metric-label">Overall Completion</p>
                            <p class="guide-overview-metric-value">
                                {{ checklistSummary.completion }}%
                            </p>
                            <p class="guide-overview-metric-meta">
                                {{ checklistSummary.done }} of {{ checklistSummary.total }} done
                            </p>
                        </article>
                        <article class="guide-overview-metric-card">
                            <p class="guide-overview-metric-label">In Progress</p>
                            <p class="guide-overview-metric-value">
                                {{ checklistSummary.inProgress }}
                            </p>
                            <p class="guide-overview-metric-meta">
                                Active checklist items
                            </p>
                        </article>
                        <article class="guide-overview-metric-card">
                            <p class="guide-overview-metric-label">Planned</p>
                            <p class="guide-overview-metric-value">
                                {{ checklistSummary.planned }}
                            </p>
                            <p class="guide-overview-metric-meta">
                                Pending implementation
                            </p>
                        </article>
                    </div>

                    <div class="guide-overview-phase-grid">
                        <article
                            v-for="phase in checklistPhaseProgress"
                            :key="phase.phase"
                            class="guide-overview-phase-card"
                        >
                            <div class="guide-overview-phase-head">
                                <p class="guide-overview-phase-title">{{ phaseLabel(phase.phase) }}</p>
                                <UiBadge
                                    variant="tonal"
                                    :tone="phase.percent === 100 ? 'success' : phase.percent >= 50 ? 'warning' : 'default'"
                                >
                                    {{ phase.percent }}%
                                </UiBadge>
                            </div>
                            <div class="guide-overview-phase-bar">
                                <span
                                    class="guide-overview-phase-bar-fill"
                                    :class="`is-${phase.percent === 100 ? 'success' : phase.percent >= 50 ? 'warning' : 'default'}`"
                                    :style="{ width: `${phase.percent}%` }"
                                />
                            </div>
                            <p class="guide-overview-phase-meta">
                                {{ phase.done }} / {{ phase.total }} completed
                            </p>
                        </article>
                    </div>
                </section>

                <section
                    v-if="checklistItems.length"
                    class="guide-docs-section"
                    id="doc-guide-maturity-checklist"
                >
                    <div class="guide-docs-section-head">
                        <h2 class="guide-docs-section-title">Guide Maturity Checklist</h2>
                        <div class="guide-checklist-filters">
                            <select
                                v-model="checklistPhaseFilter"
                                class="guide-docs-filter-select"
                                aria-label="Filter checklist by phase"
                            >
                                <option value="all">All phases</option>
                                <option value="phase-1">Phase 1</option>
                                <option value="phase-2">Phase 2</option>
                                <option value="phase-3">Phase 3</option>
                                <option value="phase-4">Phase 4</option>
                            </select>
                            <select
                                v-model="checklistStatusFilter"
                                class="guide-docs-filter-select"
                                aria-label="Filter checklist by status"
                            >
                                <option value="all">All statuses</option>
                                <option value="planned">Planned</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>
                    <div class="guide-checklist-grid">
                        <article
                            v-for="item in filteredChecklistItems"
                            :key="item.id"
                            class="guide-checklist-card"
                        >
                            <p class="guide-checklist-card-title">{{ item.title }}</p>
                            <p class="guide-checklist-card-description">{{ item.description }}</p>
                            <p class="guide-checklist-card-meta">
                                <UiBadge
                                    variant="tonal"
                                    :tone="
                                        item.status === 'done'
                                            ? 'success'
                                            : item.status === 'in-progress'
                                                ? 'warning'
                                                : 'default'
                                    "
                                >
                                    {{ normalizedChecklistState(item.status) }}
                                </UiBadge>
                                <span class="guide-checklist-chip guide-checklist-phase" :class="`is-${item.phase}`">
                                    {{ item.phase }}
                                </span>
                                <span class="guide-checklist-chip guide-checklist-owner" :class="`is-${checklistTagClass(item.ownerArea)}`">
                                    {{ item.ownerArea }}
                                </span>
                            </p>
                        </article>
                    </div>
                </section>

                <section
                    v-for="section in currentDoc.sections"
                    :key="section.title"
                    class="guide-docs-section"
                    :id="`doc-${toAnchorId(section.title)}`"
                >
                    <h2 class="guide-docs-section-title">{{ section.title }}</h2>
                    <ul class="guide-docs-list">
                        <li
                            v-for="point in section.points"
                            :key="point"
                            class="guide-docs-list-item"
                        >
                            {{ point }}
                        </li>
                    </ul>
                </section>

                <section
                    v-if="currentDoc.doDont"
                    class="guide-docs-section guide-docs-section-dual"
                    id="doc-do-dont"
                >
                    <article class="guide-docs-card guide-docs-card-do">
                        <h2 class="guide-docs-section-title">Do</h2>
                        <div class="guide-docs-visual-example is-do">
                            {{ doDontVisualCopy.do }}
                        </div>
                        <ul class="guide-docs-list">
                            <li
                                v-for="item in currentDoc.doDont.do"
                                :key="item"
                                class="guide-docs-list-item"
                            >
                                {{ item }}
                            </li>
                        </ul>
                    </article>

                    <article class="guide-docs-card guide-docs-card-dont">
                        <h2 class="guide-docs-section-title">Don't</h2>
                        <div class="guide-docs-visual-example is-dont">
                            {{ doDontVisualCopy.dont }}
                        </div>
                        <ul class="guide-docs-list">
                            <li
                                v-for="item in currentDoc.doDont.dont"
                                :key="item"
                                class="guide-docs-list-item"
                            >
                                {{ item }}
                            </li>
                        </ul>
                    </article>
                </section>

                <section
                    v-if="currentDoc.accessibilityChecklist?.length"
                    class="guide-docs-section"
                    id="doc-accessibility-checklist"
                >
                    <h2 class="guide-docs-section-title">Accessibility Checklist</h2>
                    <ul class="guide-docs-list guide-docs-checklist">
                        <li
                            v-for="item in currentDoc.accessibilityChecklist"
                            :key="item"
                            class="guide-docs-list-item"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </section>

                <section
                    v-if="currentDoc.qaChecklist?.length"
                    class="guide-docs-section"
                    id="doc-qa-checklist"
                >
                    <h2 class="guide-docs-section-title">QA Checklist</h2>
                    <ul class="guide-docs-list guide-docs-checklist">
                        <li
                            v-for="item in currentDoc.qaChecklist"
                            :key="item"
                            class="guide-docs-list-item"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </section>

                <section
                    v-if="currentDoc.motionGuidelines?.length"
                    class="guide-docs-section"
                    id="doc-motion"
                >
                    <h2 class="guide-docs-section-title">Motion</h2>
                    <ul class="guide-docs-list">
                        <li
                            v-for="item in currentDoc.motionGuidelines"
                            :key="item"
                            class="guide-docs-list-item"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </section>

                <section
                    v-if="currentDoc.responsiveNotes?.length"
                    class="guide-docs-section"
                    id="doc-responsive-notes"
                >
                    <h2 class="guide-docs-section-title">Responsive Notes</h2>
                    <ul class="guide-docs-list">
                        <li
                            v-for="item in currentDoc.responsiveNotes"
                            :key="item"
                            class="guide-docs-list-item"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </section>

                <section
                    v-if="currentDoc.contentGuidelines?.length"
                    class="guide-docs-section"
                    id="doc-content-guidelines"
                >
                    <h2 class="guide-docs-section-title">Content Guidelines</h2>
                    <ul class="guide-docs-list">
                        <li
                            v-for="item in currentDoc.contentGuidelines"
                            :key="item"
                            class="guide-docs-list-item"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </section>

                <section
                    v-if="currentDoc.tokenGuardrails?.length"
                    class="guide-docs-section"
                    id="doc-token-guardrails"
                >
                    <h2 class="guide-docs-section-title">Token Guardrails</h2>
                    <ul class="guide-docs-list">
                        <li
                            v-for="item in currentDoc.tokenGuardrails"
                            :key="item"
                            class="guide-docs-list-item"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </section>

                <section
                    v-if="currentDoc.tokenInspector"
                    class="guide-docs-section"
                    id="doc-token-inspector"
                >
                    <h2 class="guide-docs-section-title">Design Token Inspector</h2>
                    <ul class="guide-docs-list">
                        <li
                            v-for="token in currentDoc.tokenInspector.tokens"
                            :key="token"
                            class="guide-docs-list-item"
                        >
                            <GuideCopy :text="token">{{ token }}</GuideCopy>
                        </li>
                    </ul>
                    <div class="guide-token-mapping-grid">
                        <div
                            v-for="mapping in currentDoc.tokenInspector.mappings"
                            :key="`${mapping.semantic}-${mapping.raw}`"
                            class="guide-token-mapping-item"
                        >
                            <GuideCopy :text="`${mapping.semantic} -> ${mapping.raw}`">
                                <strong>{{ mapping.semantic }}</strong> -> {{ mapping.raw }}
                            </GuideCopy>
                        </div>
                    </div>
                </section>

                <section
                    v-if="snippetsForDoc.length"
                    class="guide-docs-section"
                    id="doc-snippets"
                >
                    <h2 class="guide-docs-section-title">Copyable Snippets</h2>
                    <article
                        v-for="snippet in snippetsForDoc"
                        :key="snippet.title"
                        class="guide-docs-example"
                    >
                        <h3 class="guide-docs-example-title">
                            {{ snippet.title }} <span class="guide-docs-language">{{ snippet.language }}</span>
                        </h3>
                        <GuideCopy :text="snippet.code">
                            <pre class="guide-docs-code-block"><code>{{ snippet.code }}</code></pre>
                        </GuideCopy>
                    </article>
                </section>

                <section
                    v-if="usedInReferences.length"
                    class="guide-docs-section"
                    id="doc-used-in-production"
                >
                    <h2 class="guide-docs-section-title">Used In Production</h2>
                    <div class="guide-docs-related-links">
                        <div
                            v-for="ref in usedInReferences"
                            :key="`${ref.path}-${ref.line ?? 0}`"
                            class="guide-docs-related-link"
                        >
                            <span>{{ ref.label }}</span>
                            <GuideCopy :text="toFileLink(ref.path, ref.line)">
                                <code>{{ toFileLink(ref.path, ref.line) }}</code>
                            </GuideCopy>
                        </div>
                    </div>
                </section>

                <section
                    v-if="currentDoc.testHooks?.length"
                    class="guide-docs-section"
                    id="doc-test-hooks"
                >
                    <h2 class="guide-docs-section-title">Test Hooks</h2>
                    <div class="guide-token-mapping-grid">
                        <div
                            v-for="hook in currentDoc.testHooks"
                            :key="hook.hook"
                            class="guide-token-mapping-item"
                        >
                            <GuideCopy :text="hook.hook">
                                <strong>{{ hook.hook }}</strong>
                            </GuideCopy>
                            <p class="guide-docs-list-item">{{ hook.intent }}</p>
                            <p v-if="hook.target" class="guide-docs-meta">Target: {{ hook.target }}</p>
                        </div>
                    </div>
                </section>

                <section
                    v-if="currentDoc.performanceNotes?.length"
                    class="guide-docs-section"
                    id="doc-performance-notes"
                >
                    <h2 class="guide-docs-section-title">Performance Notes</h2>
                    <ul class="guide-docs-list">
                        <li
                            v-for="item in currentDoc.performanceNotes"
                            :key="item"
                            class="guide-docs-list-item"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </section>

                <section
                    v-if="currentDoc.examples?.length"
                    class="guide-docs-section"
                    id="doc-code-examples"
                >
                    <h2 class="guide-docs-section-title">Code Examples</h2>
                    <article
                        v-for="example in currentDoc.examples"
                        :key="example.title"
                        class="guide-docs-example"
                    >
                        <h3 class="guide-docs-example-title">
                            {{ example.title }}
                        </h3>
                        <pre class="guide-docs-code-block"><code>{{ example.code }}</code></pre>
                    </article>
                </section>

                <section
                    v-if="changelogEntries.length"
                    class="guide-docs-section"
                    id="doc-changelog"
                >
                    <h2 class="guide-docs-section-title">Changelog</h2>
                    <article
                        v-for="entry in changelogEntries"
                        :key="`${entry.version}-${entry.date}`"
                        class="guide-docs-changelog-item"
                    >
                        <p class="guide-docs-changelog-date">{{ entry.date }}</p>
                        <p v-if="entry.version" class="guide-docs-meta">
                            Version: {{ entry.version }}
                        </p>
                        <ul class="guide-docs-list">
                            <li
                                v-for="change in entry.changes"
                                :key="change"
                                class="guide-docs-list-item"
                            >
                                {{ change }}
                            </li>
                        </ul>
                        <div
                            v-if="entry.diffLinks?.length"
                            class="guide-docs-related-links"
                        >
                            <div
                                v-for="diff in entry.diffLinks"
                                :key="`${entry.date}-${diff.path}`"
                                class="guide-docs-related-link"
                            >
                                <span>{{ diff.label }}</span>
                                <GuideCopy :text="diff.path">
                                    <code>{{ diff.path }}</code>
                                </GuideCopy>
                            </div>
                        </div>
                    </article>
                </section>

                <section
                    v-if="relatedGuides.length"
                    class="guide-docs-section"
                    id="doc-related-guides"
                >
                    <h2 class="guide-docs-section-title">Related Guides</h2>
                    <div class="guide-docs-related-links">
                        <NuxtLink
                            v-for="item in relatedGuides"
                            :key="item.path"
                            :to="localePath(item.path)"
                            class="guide-docs-related-link"
                        >
                            <span>{{ item.title }}</span>
                            <span
                                class="guide-docs-status-chip"
                                :class="`is-${item.status ?? 'stable'}`"
                            >
                                {{ guideStatusLabel(item.status) }}
                            </span>
                        </NuxtLink>
                    </div>
                </section>

                <section
                    v-if="isDocumentationOnlyGuide"
                    class="guide-docs-section"
                    id="doc-standards-acknowledgement"
                >
                    <div class="guide-standards-actions">
                        <UiButton variant="filled" tone="neutral" size="md" @click="confirmStandardsRead">
                            I have read the standards
                        </UiButton>
                    </div>
                </section>
            </section>
        </main>
    </div>
</template>

<style lang="scss">
@use '~/assets/scss/guide';
</style>

<style scoped lang="scss">
.guide-sidebar-nav-wrap {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-right: 4px;
    --guide-scroll-track: color-mix(in srgb, var(--border-default) 60%, transparent);
    --guide-scroll-thumb-start: var(--brand-secondary);
    --guide-scroll-thumb-end: var(--brand-primary);
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;

    &::-webkit-scrollbar {
        width: 10px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 999px;
        transition: background-color 0.24s ease;
    }

    &::-webkit-scrollbar-thumb {
        background: linear-gradient(
            180deg,
            var(--guide-scroll-thumb-start) 0%,
            var(--guide-scroll-thumb-end) 100%
        );
        border-radius: 999px;
        border: 2px solid color-mix(in srgb, var(--contrast-light) 85%, transparent);
        opacity: 0;
        transition:
            opacity 0.24s ease 0.08s,
            transform 0.24s ease,
            box-shadow 0.24s ease;
    }

    &::-webkit-scrollbar-thumb:hover {
        opacity: 0.95;
        transform: scaleX(1.04);
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--brand-primary) 42%, transparent);
    }

    &:focus-within {
        scrollbar-color: var(--guide-scroll-thumb-start) var(--guide-scroll-track);
    }

    .guide-sidebar:hover &,
    &:hover,
    &:focus-within {
        scrollbar-color: var(--guide-scroll-thumb-start) var(--guide-scroll-track);
    }

    .guide-sidebar:hover &::-webkit-scrollbar-track,
    &:hover::-webkit-scrollbar-track,
    &:focus-within::-webkit-scrollbar-track {
        background: var(--guide-scroll-track);
    }

    .guide-sidebar:hover &::-webkit-scrollbar-thumb,
    &:hover::-webkit-scrollbar-thumb,
    &:focus-within::-webkit-scrollbar-thumb {
        opacity: 0.62;
        transition-delay: 0s;
    }
}

.guide-link-overview {
    margin-right: 4px;
}

.guide-sidebar-primary {
    display: grid;
    gap: 6px;
    margin-right: 4px;
    margin-bottom: 8px;
}

.guide-sidebar-search {
    display: grid;
    gap: 6px;
    margin-right: 4px;
}

.guide-sidebar-search-label {
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
}

.guide-sidebar-search-input {
    width: 100%;
    border: 1px solid var(--border-default);
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 13px;
    line-height: 20px;
    background: var(--contrast-light);
    color: var(--text-primary);

    &::placeholder {
        color: var(--text-muted);
    }
}

.guide-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.guide-link-status {
    flex-shrink: 0;
    border-radius: 999px;
    padding: 2px 8px;
    font-size: 11px;
    line-height: 16px;
    color: var(--text-primary);
    background: color-mix(in srgb, var(--gray-20) 70%, var(--contrast-light));

    &.is-stable {
        background: color-mix(in srgb, #16a34a 18%, var(--contrast-light));
    }

    &.is-draft {
        background: color-mix(in srgb, #f59e0b 24%, var(--contrast-light));
    }

    &.is-deprecated {
        background: color-mix(in srgb, #dc2626 18%, var(--contrast-light));
    }
}

.guide-nav-empty {
    margin: 0;
    padding: 6px 12px;
    font-size: 13px;
    line-height: 20px;
    color: var(--text-muted);
}

.guide-sidebar-footer {
    padding-top: 12px;
    border-top: 1px solid var(--border-default);
}

.guide-view-toggle {
    display: flex;
    align-items: center;
    border: 1px solid var(--border-default);
    border-radius: 999px;
    padding: 4px;
    background: var(--contrast-light);
    width: 100%;
}

.guide-view-toggle-button {
    flex: 1;
    border: 0;
    background: transparent;
    color: var(--text-secondary);
    border-radius: 999px;
    padding: 8px 14px;
    font-size: 13px;
    line-height: 20px;
    cursor: pointer;

    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }

    &.is-active {
        background: var(--brand-secondary);
        color: var(--contrast-light);
    }
}

.guide-docs {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 24px 64px;
}

.guide-docs-header {
    margin-bottom: 26px;
    border: 1px solid color-mix(in srgb, var(--brand-secondary) 22%, var(--border-default));
    border-radius: 16px;
    padding: 18px 18px 16px;
    background: var(--contrast-light);
    box-shadow: 0 8px 24px color-mix(in srgb, var(--gray-90) 8%, transparent);
}

.guide-docs-title {
    margin: 0 0 12px;
    font-size: 32px;
    line-height: 44px;
    color: var(--text-primary);
    letter-spacing: -0.02em;
}

.guide-docs-summary {
    margin: 0;
    font-size: 16px;
    line-height: 28px;
    color: var(--text-secondary);
}

.guide-docs-meta {
    margin: 10px 0 0;
    color: var(--text-muted);
    font-size: 13px;
    line-height: 20px;
}

.guide-docs-status-chip {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 2px 8px;
    margin-left: 6px;
    font-size: 11px;
    line-height: 16px;
    color: var(--text-primary);
    background: color-mix(in srgb, var(--gray-20) 70%, var(--contrast-light));

    &.is-stable {
        background: color-mix(in srgb, #16a34a 18%, var(--contrast-light));
    }

    &.is-draft {
        background: color-mix(in srgb, #f59e0b 24%, var(--contrast-light));
    }

    &.is-deprecated {
        background: color-mix(in srgb, #dc2626 18%, var(--contrast-light));
    }
}

.guide-preview-panel {
    padding: 20px;
}

.guide-preview-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.guide-preview-toolbar-toggle-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
}

.guide-preview-tools-toggle {
    border: 1px solid var(--border-default);
    border-radius: 999px;
    background: var(--contrast-light);
    color: var(--text-secondary);
    padding: 6px 12px;
    font-size: 12px;
    line-height: 18px;
    cursor: pointer;
    transition:
        background-color 0.2s ease,
        color 0.2s ease,
        border-color 0.2s ease;

    &:hover {
        background: color-mix(in srgb, var(--brand-secondary) 14%, var(--contrast-light));
        border-color: color-mix(in srgb, var(--brand-secondary) 36%, var(--border-default));
        color: var(--text-primary);
    }
}

.guide-preview-frames {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.guide-preview-frame-toggle {
    border: 1px solid var(--border-default);
    border-radius: 999px;
    background: var(--contrast-light);
    color: var(--text-secondary);
    padding: 6px 10px;
    text-transform: capitalize;
    cursor: pointer;

    &.is-active {
        background: var(--brand-secondary);
        color: var(--contrast-light);
    }
}

.guide-preview-checks {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.guide-preview-frame-wrap {
    margin-inline: auto;
    width: 100%;
    border: 1px solid var(--border-default);
    border-radius: 14px;
    padding: 12px;
    background: var(--contrast-light);
    transition: max-width 0.2s ease;
    transform: scale(var(--guide-playground-scale, 1));
    transform-origin: top center;
    opacity: var(--guide-playground-opacity, 1);

    &.is-mobile {
        max-width: 390px;
    }

    &.is-tablet {
        max-width: 860px;
    }

    &.is-desktop {
        max-width: 1200px;
    }

    &[data-tone='success'] {
        border-color: color-mix(in srgb, #16a34a 45%, var(--border-default));
    }

    &[data-tone='warning'] {
        border-color: color-mix(in srgb, #f59e0b 45%, var(--border-default));
    }

    &[data-tone='danger'] {
        border-color: color-mix(in srgb, #dc2626 45%, var(--border-default));
    }

    &[data-state='active'] {
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--brand-primary) 30%, transparent);
    }

    &[data-state='hover'] {
        box-shadow: 0 8px 28px color-mix(in srgb, var(--gray-90) 12%, transparent);
    }
}

.guide-docs-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
}

.guide-checklist-filters {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.guide-docs-filter-select {
    border: 1px solid var(--border-default);
    border-radius: 10px;
    padding: 8px 36px 8px 12px;
    background-color: var(--contrast-light);
    color: var(--text-primary);
    min-width: 140px;
    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--contrast-light) 75%, var(--gray-20));
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' fill='none' stroke='%23334155' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 12px 12px;
}

#doc-guide-maturity-checklist {
    padding: 22px 24px 24px;
}

#doc-guide-maturity-checklist .guide-docs-section-head {
    margin-bottom: 18px;
}

.guide-checklist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
    align-items: stretch;
}

.guide-checklist-card {
    border: 1px solid var(--border-default);
    border-radius: 12px;
    background:
        linear-gradient(
            180deg,
            color-mix(in srgb, var(--contrast-light) 94%, var(--gray-20)) 0%,
            color-mix(in srgb, var(--contrast-light) 88%, var(--gray-20)) 100%
        );
    padding: 16px 16px 14px;
    display: flex;
    flex-direction: column;
    height: 100%;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        border-color 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        border-color: color-mix(in srgb, var(--brand-secondary) 36%, var(--border-default));
        box-shadow: 0 10px 20px color-mix(in srgb, var(--gray-90) 8%, transparent);
    }
}

.guide-checklist-card-title {
    margin: 0;
    font-size: 14px;
    line-height: 22px;
    color: var(--text-primary);
    font-weight: 600;
}

.guide-checklist-card-description {
    margin: 8px 0 12px;
    font-size: 13px;
    line-height: 20px;
    color: var(--text-secondary);
}

.guide-checklist-card-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin: 0;
    margin-top: auto;
    font-size: 12px;
    color: var(--text-muted);
}

.guide-checklist-chip {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border: 1px solid var(--border-default);
    border-radius: 999px;
    background: color-mix(in srgb, var(--contrast-light) 92%, var(--gray-20));
}

.guide-checklist-phase.is-phase-1 {
    background: color-mix(in srgb, #3b82f6 18%, var(--contrast-light));
    border-color: color-mix(in srgb, #3b82f6 36%, var(--border-default));
    color: #1e40af;
}

.guide-checklist-phase.is-phase-2 {
    background: color-mix(in srgb, #14b8a6 18%, var(--contrast-light));
    border-color: color-mix(in srgb, #14b8a6 34%, var(--border-default));
    color: #0f766e;
}

.guide-checklist-phase.is-phase-3 {
    background: color-mix(in srgb, #f59e0b 22%, var(--contrast-light));
    border-color: color-mix(in srgb, #f59e0b 38%, var(--border-default));
    color: #b45309;
}

.guide-checklist-phase.is-phase-4 {
    background: color-mix(in srgb, #a855f7 18%, var(--contrast-light));
    border-color: color-mix(in srgb, #a855f7 34%, var(--border-default));
    color: #7e22ce;
}

.guide-checklist-owner.is-guide-layout {
    background: color-mix(in srgb, #0ea5e9 16%, var(--contrast-light));
    border-color: color-mix(in srgb, #0ea5e9 30%, var(--border-default));
    color: #0369a1;
}

.guide-checklist-owner.is-guide-data {
    background: color-mix(in srgb, #22c55e 16%, var(--contrast-light));
    border-color: color-mix(in srgb, #22c55e 30%, var(--border-default));
    color: #15803d;
}

.guide-checklist-owner.is-guide-docs {
    background: color-mix(in srgb, #6366f1 16%, var(--contrast-light));
    border-color: color-mix(in srgb, #6366f1 30%, var(--border-default));
    color: #4338ca;
}

.guide-checklist-owner.is-guide-components,
.guide-checklist-owner.is-guide-ui {
    background: color-mix(in srgb, #f97316 16%, var(--contrast-light));
    border-color: color-mix(in srgb, #f97316 30%, var(--border-default));
    color: #c2410c;
}

.guide-checklist-owner.is-guide-preview,
.guide-checklist-owner.is-guide-ux {
    background: color-mix(in srgb, #eab308 18%, var(--contrast-light));
    border-color: color-mix(in srgb, #eab308 32%, var(--border-default));
    color: #a16207;
}

.guide-checklist-owner.is-accessibility,
.guide-checklist-owner.is-qa {
    background: color-mix(in srgb, #ef4444 14%, var(--contrast-light));
    border-color: color-mix(in srgb, #ef4444 28%, var(--border-default));
    color: #b91c1c;
}

.guide-checklist-owner.is-performance {
    background: color-mix(in srgb, #f43f5e 14%, var(--contrast-light));
    border-color: color-mix(in srgb, #f43f5e 28%, var(--border-default));
    color: #be123c;
}

.guide-checklist-owner.is-design-system,
.guide-checklist-owner.is-governance {
    background: color-mix(in srgb, #64748b 16%, var(--contrast-light));
    border-color: color-mix(in srgb, #64748b 30%, var(--border-default));
    color: #334155;
}

.guide-docs-visual-example {
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 13px;
    line-height: 20px;

    &.is-do {
        background: color-mix(in srgb, #16a34a 14%, var(--contrast-light));
    }

    &.is-dont {
        background: color-mix(in srgb, #dc2626 14%, var(--contrast-light));
    }
}

.guide-docs-language {
    font-size: 12px;
    color: var(--text-muted);
    margin-left: 6px;
}

.guide-token-mapping-grid {
    display: grid;
    gap: 10px;
}

.guide-token-mapping-item {
    border: 1px solid var(--border-default);
    border-radius: 10px;
    padding: 10px;
    background: var(--contrast-light);
    transition: border-color 0.2s ease;

    &:hover {
        border-color: color-mix(in srgb, var(--brand-secondary) 34%, var(--border-default));
    }
}

.guide-overview-snapshot {
    background:
        radial-gradient(circle at top right, color-mix(in srgb, var(--brand-secondary) 14%, transparent), transparent 46%),
        var(--contrast-light);
}

.guide-overview-metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
}

.guide-overview-metric-card {
    border: 1px solid var(--border-default);
    border-radius: 12px;
    background: var(--contrast-light);
    padding: 12px;
    box-shadow: 0 6px 16px color-mix(in srgb, var(--gray-90) 6%, transparent);
}

.guide-overview-metric-label {
    margin: 0;
    margin-top: auto;
    font-size: 12px;
    line-height: 18px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.guide-overview-metric-value {
    margin: 6px 0 2px;
    font-size: 28px;
    line-height: 36px;
    color: var(--text-primary);
    font-weight: 700;
}

.guide-overview-metric-meta {
    margin: 0;
    margin-top: auto;
    font-size: 12px;
    line-height: 18px;
    color: var(--text-secondary);
}

.guide-overview-phase-grid {
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}

.guide-overview-phase-card {
    border: 1px solid var(--border-default);
    border-radius: 12px;
    background: var(--contrast-light);
    padding: 10px;
    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--contrast-light) 70%, var(--gray-20));
}

.guide-overview-phase-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.guide-overview-phase-title {
    margin: 0;
    font-size: 13px;
    line-height: 20px;
    color: var(--text-primary);
    font-weight: 600;
}

.guide-overview-phase-bar {
    margin-top: 8px;
    width: 100%;
    height: 8px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--gray-20) 85%, var(--contrast-light));
    overflow: hidden;
}

.guide-overview-phase-bar-fill {
    display: block;
    height: 100%;
    background: color-mix(in srgb, var(--brand-secondary) 68%, var(--contrast-light));
    border-radius: inherit;

    &.is-success {
        background: color-mix(in srgb, #16a34a 72%, var(--contrast-light));
    }

    &.is-warning {
        background: color-mix(in srgb, #f59e0b 78%, var(--contrast-light));
    }

    &.is-default {
        background: color-mix(in srgb, var(--brand-secondary) 68%, var(--contrast-light));
    }
}

.guide-overview-phase-meta {
    margin: 8px 0 0;
    font-size: 12px;
    line-height: 18px;
    color: var(--text-secondary);
}

.guide-docs-section {
    margin-top: 24px;
    border: 1px solid var(--border-default);
    border-radius: 12px;
    background:
        linear-gradient(
            180deg,
            color-mix(in srgb, var(--contrast-light) 96%, var(--gray-20)) 0%,
            var(--contrast-light) 100%
        );
    padding: 20px;
    box-shadow: 0 4px 14px color-mix(in srgb, var(--gray-90) 5%, transparent);
}

.guide-docs-section-title {
    margin: 0 0 12px;
    font-size: 16px;
    line-height: 28px;
    color: var(--text-primary);
}

.guide-docs-list {
    margin: 0;
    padding-left: 18px;
}

.guide-docs-list-item {
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 26px;
}

.guide-docs-section-dual {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.guide-docs-card {
    border: 1px solid var(--border-default);
    border-radius: 10px;
    padding: 12px;
}

.guide-docs-card-do {
    background: color-mix(in srgb, #16a34a 9%, var(--contrast-light));
}

.guide-docs-card-dont {
    background: color-mix(in srgb, #dc2626 8%, var(--contrast-light));
}

.guide-docs-checklist {
    list-style: none;
    padding-left: 0;
}

.guide-docs-checklist .guide-docs-list-item {
    position: relative;
    padding-left: 24px;
}

.guide-docs-checklist .guide-docs-list-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 9px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--brand-secondary);
}

.guide-docs-example + .guide-docs-example {
    margin-top: 16px;
}

.guide-docs-example-title {
    margin: 0 0 12px;
    font-size: 14px;
    line-height: 22px;
    color: var(--text-primary);
}

.guide-docs-code-block {
    margin: 0;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid var(--border-default);
    background: #0f172a;
    color: #e2e8f0;
    font-size: 12px;
    line-height: 18px;
    overflow-x: auto;
}

.guide-docs-changelog-item + .guide-docs-changelog-item {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border-default);
}

.guide-docs-changelog-item .guide-docs-list {
    margin-top: 6px;
}

.guide-docs-changelog-item .guide-docs-related-links {
    margin-top: 10px;
}

.guide-docs-changelog-date {
    margin: 0 0 10px;
    color: var(--text-primary);
    font-size: 13px;
    line-height: 20px;
    font-weight: 600;
}

.guide-docs-related-links {
    display: grid;
    gap: 10px;
}

.guide-docs-related-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border: 1px solid var(--border-default);
    border-radius: 10px;
    padding: 12px 14px;
    text-decoration: none;
    color: var(--text-primary);
    background: var(--contrast-light);
}

.guide-standards-actions {
    display: flex;
    justify-content: flex-start;
}

@media (max-width: 860px) {
    #doc-guide-maturity-checklist {
        padding: 20px;
    }

    #doc-guide-maturity-checklist .guide-docs-section-head {
        margin-bottom: 12px;
    }

    .guide-checklist-grid {
        grid-template-columns: 1fr;
    }

    .guide-docs-filter-select {
        min-width: 132px;
    }

    .guide-docs-section-dual {
        grid-template-columns: 1fr;
    }

    .guide-overview-metrics {
        grid-template-columns: 1fr;
    }

    .guide-overview-phase-grid {
        grid-template-columns: 1fr;
    }
}
</style>














