<script setup lang="ts">
import { computed, ref } from 'vue';
import GuideCopy from '@/components/guide/GuideCopy.vue';
import UiTooltip from '@/components/ui/Tooltip.vue';
import UiCheckbox from '@/components/ui/Checkbox.vue';
import UiSelect from '@/components/ui/Select.vue';
import UiInput from '@/components/ui/Input.vue';
import { tooltipSides } from '@/data/ui/tooltip';
import type { TooltipSide, TooltipTone } from '@/data/ui/tooltip';

type GuideTooltipTone =
    | TooltipTone
    | 'primary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'neutral';

const isOpen = ref(false);
const side = ref<(typeof tooltipSides)[number]>('right');
const tone = ref<GuideTooltipTone>('default');
const guideToneOptions: GuideTooltipTone[] = [
    'default',
    'primary',
    'accent',
    'neutral',
    'success',
    'warning',
    'danger',
];
const sideOptions = tooltipSides.map((value) => ({ label: value, value }));
const toneOptions = guideToneOptions.map((value) => ({ label: value, value }));
const mobileSideOptions = [
    { label: 'none', value: 'none' },
    ...tooltipSides.map((value) => ({ label: value, value })),
];
const mobileSide = ref<(typeof tooltipSides)[number] | null>('left');
const offset = ref(10);
const slideDistance = ref(24);

const mobileSideSnippet = computed(() =>
    mobileSide.value === null ? 'null' : `'${mobileSide.value}'`
);
const playgroundSnippet = computed(
    () =>
        `<UiTooltip :open="${isOpen.value}" side="${side.value}" tone="${tone.value}" :mobile-side="${mobileSideSnippet.value}" :offset="${offset.value}" :slide-distance="${slideDistance.value}">Tooltip copy</UiTooltip>`
);
const activeVariantId = ref('default-right');
const previewHoverOpen = ref(false);
const previewPinnedOpen = ref(false);
const playgroundHoverOpen = ref(false);
const playgroundPinnedOpen = ref(false);

const variantItems: Array<{
    id: string;
    label: string;
    message: string;
    tone: GuideTooltipTone;
    side: TooltipSide;
    note: string;
}> = [
    {
        id: 'default-right',
        label: 'Right',
        message: 'Tooltip content on the right.',
        tone: 'default',
        side: 'right',
        note: 'Default informational usage',
    },
    {
        id: 'default-top',
        label: 'Top',
        message: 'Tooltip content above trigger.',
        tone: 'default',
        side: 'top',
        note: 'Best for tight horizontal space',
    },
    {
        id: 'primary-right',
        label: 'Primary',
        message: 'Primary tone uses brand emphasis styling.',
        tone: 'primary',
        side: 'right',
        note: 'Brand-forward emphasis',
    },
    {
        id: 'accent-right',
        label: 'Accent',
        message: 'Accent tone uses the hover brand tone.',
        tone: 'accent',
        side: 'right',
        note: 'Secondary highlighted emphasis',
    },
    {
        id: 'neutral-left',
        label: 'Neutral',
        message: 'Neutral tone blends with dark text surfaces.',
        tone: 'neutral',
        side: 'left',
        note: 'Low-emphasis utility guidance',
    },
    {
        id: 'success-left',
        label: 'Success',
        message: 'Looks good. You can continue.',
        tone: 'success',
        side: 'left',
        note: 'Affirmative feedback',
    },
    {
        id: 'warning-bottom',
        label: 'Warning',
        message: 'Double-check this value before submitting.',
        tone: 'warning',
        side: 'bottom',
        note: 'Non-blocking caution',
    },
    {
        id: 'danger-right',
        label: 'Danger',
        message: 'Please accept terms before continuing.',
        tone: 'danger',
        side: 'right',
        note: 'Blocking validation guidance',
    },
];

const presets: Array<{
    id: string;
    label: string;
    description: string;
    side: TooltipSide;
    tone: GuideTooltipTone;
    offset: number;
    slideDistance: number;
    mobileSide?: (typeof tooltipSides)[number] | null;
}> = [
    {
        id: 'hint',
        label: 'Hint',
        description: 'default / right',
        side: 'right',
        tone: 'default',
        offset: 10,
        slideDistance: 24,
        mobileSide: 'left',
    },
    {
        id: 'primary',
        label: 'Primary',
        description: 'primary / right',
        side: 'right',
        tone: 'primary',
        offset: 10,
        slideDistance: 24,
        mobileSide: 'left',
    },
    {
        id: 'accent',
        label: 'Accent',
        description: 'accent / right',
        side: 'right',
        tone: 'accent',
        offset: 10,
        slideDistance: 24,
        mobileSide: 'left',
    },
    {
        id: 'warning',
        label: 'Warning',
        description: 'warning / bottom',
        side: 'bottom',
        tone: 'warning',
        offset: 10,
        slideDistance: 24,
        mobileSide: 'left',
    },
    {
        id: 'error',
        label: 'Error',
        description: 'danger / right',
        side: 'right',
        tone: 'danger',
        offset: 8,
        slideDistance: 18,
        mobileSide: 'left',
    },
    {
        id: 'neutral',
        label: 'Neutral',
        description: 'neutral / right',
        side: 'right',
        tone: 'neutral',
        offset: 10,
        slideDistance: 20,
        mobileSide: 'left',
    },
    {
        id: 'success',
        label: 'Success',
        description: 'success / left',
        side: 'left',
        tone: 'success',
        offset: 12,
        slideDistance: 20,
        mobileSide: 'left',
    },
    {
        id: 'top-info',
        label: 'Top Info',
        description: 'default / top',
        side: 'top',
        tone: 'default',
        offset: 10,
        slideDistance: 24,
        mobileSide: 'left',
    },
    {
        id: 'compact',
        label: 'Compact',
        description: 'small gap / fast',
        side: 'right',
        tone: 'default',
        offset: 6,
        slideDistance: 12,
        mobileSide: 'left',
    },
    {
        id: 'relaxed',
        label: 'Relaxed',
        description: 'large gap / soft',
        side: 'right',
        tone: 'default',
        offset: 16,
        slideDistance: 32,
        mobileSide: 'left',
    },
    {
        id: 'mobile-safe',
        label: 'Mobile Safe',
        description: 'right + mobile left',
        side: 'right',
        tone: 'neutral',
        offset: 10,
        slideDistance: 20,
        mobileSide: 'left',
    },
];

function resetPlayground() {
    isOpen.value = false;
    side.value = 'right';
    tone.value = 'default';
    mobileSide.value = 'left';
    offset.value = 10;
    slideDistance.value = 24;
    playgroundHoverOpen.value = false;
    playgroundPinnedOpen.value = false;
}

function toggleOpen() {
    isOpen.value = !isOpen.value;
}

const activeVariant = computed(
    () => variantItems.find((item) => item.id === activeVariantId.value) ?? variantItems[0]
);
const isPreviewOpen = computed(() => previewHoverOpen.value || previewPinnedOpen.value);

function selectVariant(id: string) {
    activeVariantId.value = id;
    previewHoverOpen.value = false;
    previewPinnedOpen.value = false;
}

function togglePreviewPinned() {
    previewPinnedOpen.value = !previewPinnedOpen.value;
}

const isPlaygroundOpen = computed(
    () => isOpen.value || playgroundHoverOpen.value || playgroundPinnedOpen.value
);

function togglePlaygroundPinned() {
    playgroundPinnedOpen.value = !playgroundPinnedOpen.value;
}

function applyPreset(preset: (typeof presets)[number]) {
    side.value = preset.side;
    tone.value = preset.tone;
    offset.value = preset.offset;
    slideDistance.value = preset.slideDistance;
    mobileSide.value = preset.mobileSide ?? null;
    isOpen.value = true;
    playgroundHoverOpen.value = false;
    playgroundPinnedOpen.value = false;
}

function isPresetActive(preset: (typeof presets)[number]) {
    const normalizedMobile = preset.mobileSide ?? null;
    return (
        side.value === preset.side &&
        tone.value === preset.tone &&
        offset.value === preset.offset &&
        slideDistance.value === preset.slideDistance &&
        mobileSide.value === normalizedMobile
    );
}

const mobileSideModel = computed<string>({
    get: () => mobileSide.value ?? 'none',
    set: (value) => {
        mobileSide.value = value === 'none' ? null : (value as (typeof tooltipSides)[number]);
    },
});

const offsetModel = computed<string>({
    get: () => String(offset.value),
    set: (value) => {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isNaN(parsed)) offset.value = parsed;
    },
});

const slideDistanceModel = computed<string>({
    get: () => String(slideDistance.value),
    set: (value) => {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isNaN(parsed)) slideDistance.value = parsed;
    },
});
</script>

<template>
    <section class="guide-wrapper guide-tooltip">
        <header class="guide-header">
            <p class="guide-eyebrow">Components</p>
            <h1 class="guide-title">Tooltip</h1>
            <p class="guide-description">
                Lightweight contextual messaging for validation hints and
                inline guidance near controls.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Default Variants</h2>
            <div class="guide-tooltip-variant-picker">
                <button
                    v-for="item in variantItems"
                    :key="item.id"
                    type="button"
                    class="guide-tooltip-variant-pill"
                    :class="{ 'is-active': item.id === activeVariant.id }"
                    :data-tone="item.tone"
                    @click="selectVariant(item.id)"
                >
                    <span class="guide-tooltip-variant-pill-label">{{ item.label }}</span>
                    <span
                        class="guide-tooltip-variant-pill-swatch"
                        :data-tone="item.tone"
                        :title="`tone: ${item.tone}`"
                        aria-hidden="true"
                    />
                </button>
            </div>

            <article class="guide-tooltip-variant-preview">
                <div class="guide-tooltip-variant-meta">
                    <h3 class="guide-tooltip-variant-title">{{ activeVariant.label }}</h3>
                    <p class="guide-tooltip-variant-note">{{ activeVariant.note }}</p>
                    <p class="guide-tooltip-variant-side">
                        Side: <strong>{{ activeVariant.side }}</strong>
                    </p>
                </div>

                <GuideCopy
                    component="UiTooltip"
                    :props="{
                        open: isPreviewOpen,
                        side: activeVariant.side,
                        tone: activeVariant.tone,
                    }"
                >
                    <div class="guide-tooltip-stage">
                        <div
                            class="guide-tooltip-anchor"
                            :data-side="activeVariant.side"
                            @mouseenter="previewHoverOpen = true"
                            @mouseleave="previewHoverOpen = false"
                        >
                            <UiTooltip
                                :open="isPreviewOpen"
                                :side="activeVariant.side"
                                :tone="activeVariant.tone"
                            >
                                {{ activeVariant.message }}
                                <template #trigger>
                                    <button
                                        type="button"
                                        class="guide-tooltip-trigger"
                                        :aria-expanded="isPreviewOpen"
                                        @focus="previewHoverOpen = true"
                                        @blur="previewHoverOpen = false"
                                        @click="togglePreviewPinned"
                                    >
                                        {{ activeVariant.label }}
                                    </button>
                                </template>
                            </UiTooltip>
                        </div>
                    </div>
                </GuideCopy>
            </article>
            <p class="guide-tooltip-interaction-hint">
                Hover or focus a trigger to preview. Click to pin/unpin a tooltip.
            </p>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Interactive Playground</h2>
            <div class="guide-tooltip-playground">
                <div class="guide-tooltip-toolbar">
                    <p class="guide-tooltip-toolbar-copy">
                        Tune side, tone, and spacing values, then copy the snippet.
                    </p>
                    <div class="guide-tooltip-toolbar-actions">
                        <button type="button" class="guide-tooltip-toolbar-btn" @click="toggleOpen">
                            {{ isOpen ? 'Hide Tooltip' : 'Show Tooltip' }}
                        </button>
                        <button type="button" class="guide-tooltip-toolbar-btn" @click="resetPlayground">
                            Reset
                        </button>
                    </div>
                </div>
                <div class="guide-tooltip-presets">
                    <button
                        v-for="preset in presets"
                        :key="preset.id"
                        type="button"
                        class="guide-tooltip-preset-btn"
                        :class="{ 'is-active': isPresetActive(preset) }"
                        @click="applyPreset(preset)"
                    >
                        <span class="guide-tooltip-preset-label">{{ preset.label }}</span>
                        <span class="guide-tooltip-preset-meta">{{ preset.description }}</span>
                    </button>
                </div>
                <div class="guide-tooltip-controls">
                    <label class="guide-tooltip-control guide-tooltip-control--toggle">
                        <span>Open</span>
                        <UiCheckbox v-model="isOpen" />
                    </label>

                    <label class="guide-tooltip-control">
                        <span>Side</span>
                        <UiSelect v-model="side" :options="sideOptions" />
                    </label>

                    <label class="guide-tooltip-control">
                        <span>Tone</span>
                        <UiSelect v-model="tone" :options="toneOptions" />
                    </label>

                    <label class="guide-tooltip-control">
                        <span>Mobile Side</span>
                        <UiSelect v-model="mobileSideModel" :options="mobileSideOptions" />
                    </label>

                    <label class="guide-tooltip-control">
                        <span>Offset</span>
                        <UiInput v-model="offsetModel" type="text" />
                    </label>

                    <label class="guide-tooltip-control">
                        <span>Slide Distance</span>
                        <UiInput v-model="slideDistanceModel" type="text" />
                    </label>
                </div>

                <GuideCopy
                    component="UiTooltip"
                    :props="{ open: isPlaygroundOpen, side, mobileSide, tone, offset, slideDistance }"
                    :text="playgroundSnippet"
                >
                    <div class="guide-tooltip-stage is-playground">
                        <div
                            class="guide-tooltip-anchor"
                            :data-side="side"
                            @mouseenter="playgroundHoverOpen = true"
                            @mouseleave="playgroundHoverOpen = false"
                        >
                            <UiTooltip
                                :open="isPlaygroundOpen"
                                :side="side"
                                :mobile-side="mobileSide"
                                :tone="tone"
                                :offset="offset"
                                :slide-distance="slideDistance"
                            >
                                This message tracks the selected side, tone, and spacing.
                                <template #trigger>
                                    <button
                                        type="button"
                                        class="guide-tooltip-trigger"
                                        :aria-expanded="isPlaygroundOpen"
                                        @focus="playgroundHoverOpen = true"
                                        @blur="playgroundHoverOpen = false"
                                        @click="togglePlaygroundPinned"
                                    >
                                        Playground Trigger
                                    </button>
                                </template>
                            </UiTooltip>
                        </div>
                    </div>
                </GuideCopy>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-tooltip-variant-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 12px;
}

.guide-tooltip-variant-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--border-default);
    border-radius: 999px;
    min-height: 34px;
    padding: 6px 12px;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-primary);
    background: var(--bg-surface);
    transition: border-color 150ms ease, background-color 150ms ease;
}

.guide-tooltip-variant-pill.is-active {
    border-color: color-mix(in srgb, var(--brand-primary) 30%, var(--border-default));
    background: color-mix(in srgb, var(--brand-primary) 8%, var(--bg-surface));
}

.guide-tooltip-variant-pill-label {
    font-weight: var(--font-weight-medium);
}

.guide-tooltip-variant-pill-swatch {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--border-default) 70%, transparent);
    background: var(--gray-40);
}

.guide-tooltip-variant-pill-swatch[data-tone='default'] {
    background: var(--gray-40);
}

.guide-tooltip-variant-pill-swatch[data-tone='primary'] {
    background: var(--brand-primary);
}

.guide-tooltip-variant-pill-swatch[data-tone='accent'] {
    background: var(--brand-primary-hover);
}

.guide-tooltip-variant-pill-swatch[data-tone='neutral'] {
    background: var(--text-primary);
}

.guide-tooltip-variant-pill-swatch[data-tone='danger'] {
    background: #ef2e2e;
}

.guide-tooltip-variant-pill-swatch[data-tone='success'] {
    background: var(--success);
}

.guide-tooltip-variant-pill-swatch[data-tone='warning'] {
    background: var(--warning);
}

.guide-tooltip-variant-preview {
    display: grid;
    grid-template-columns: minmax(220px, 260px) minmax(0, 1fr);
    gap: 12px;
    border: 1px solid var(--border-default);
    border-radius: 12px;
    padding: 12px;
    background: var(--bg-surface);
}

.guide-tooltip-variant-meta {
    border: 1px solid var(--border-default);
    border-radius: 10px;
    padding: 12px;
    background: var(--bg-page);
}

.guide-tooltip-variant-note {
    margin: 4px 0 10px;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-secondary);
}

.guide-tooltip-variant-title {
    margin: 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-primary);
}

.guide-tooltip-variant-side {
    margin: 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-secondary);
}

.guide-tooltip-interaction-hint {
    margin: 10px 0 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-secondary);
}

.guide-tooltip-stage {
    --guide-tooltip-bubble-max: 220px;
    --guide-tooltip-side-buffer: calc(var(--guide-tooltip-bubble-max) + 24px);
    --guide-tooltip-vertical-buffer: 70px;
    display: grid;
    min-height: 160px;
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    border: 1px dashed var(--border-default);
    border-radius: 10px;
    background: var(--bg-subtle);
    overflow: visible;
}

.guide-tooltip-anchor {
    width: 100%;
    min-height: 118px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.guide-tooltip-anchor[data-side='right'] {
    justify-content: flex-start;
    padding-right: var(--guide-tooltip-side-buffer);
}

.guide-tooltip-anchor[data-side='left'] {
    justify-content: flex-end;
    padding-left: var(--guide-tooltip-side-buffer);
}

.guide-tooltip-anchor[data-side='top'] {
    align-items: flex-end;
    padding-bottom: var(--guide-tooltip-vertical-buffer);
}

.guide-tooltip-anchor[data-side='bottom'] {
    align-items: flex-start;
    padding-top: var(--guide-tooltip-vertical-buffer);
}

.guide-tooltip-stage.is-playground {
    min-height: 180px;
}

.guide-tooltip-stage :deep(.ui-tooltip) {
    isolation: isolate;
    max-width: 100%;
}

.guide-tooltip-stage :deep(.ui-tooltip-content) {
    display: block;
    width: auto;
    max-width: none;
    min-width: 120px;
    white-space: nowrap;
    word-break: keep-all;
    overflow-wrap: normal;
    border-radius: 14px;
    padding: 10px 12px;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    letter-spacing: 0;
}

.guide-tooltip-stage :deep(.ui-tooltip[data-tone='success'] .ui-tooltip-content) {
    border: 1px solid color-mix(in srgb, var(--success) 30%, var(--contrast-light));
    background: var(--success-bg);
    color: var(--success-90);
}

.guide-tooltip-stage :deep(.ui-tooltip[data-tone='default'] .ui-tooltip-content) {
    border: 1px solid var(--border-default);
    background: var(--contrast-light);
    color: var(--text-primary);
}

.guide-tooltip-stage :deep(.ui-tooltip[data-tone='primary'] .ui-tooltip-content) {
    border: 1px solid var(--brand-primary);
    background: var(--brand-primary);
    color: var(--text-inverse);
}

.guide-tooltip-stage :deep(.ui-tooltip[data-tone='accent'] .ui-tooltip-content) {
    border: 1px solid var(--brand-primary-hover);
    background: var(--brand-primary-hover);
    color: var(--text-inverse);
}

.guide-tooltip-stage :deep(.ui-tooltip[data-tone='neutral'] .ui-tooltip-content) {
    border: 1px solid var(--border-default);
    background: var(--text-primary);
    color: var(--text-inverse);
}

.guide-tooltip-stage :deep(.ui-tooltip[data-tone='warning'] .ui-tooltip-content) {
    border: 1px solid color-mix(in srgb, var(--warning) 35%, var(--contrast-light));
    background: var(--warning-bg);
    color: var(--warning-90);
}

.guide-tooltip-stage :deep(.ui-tooltip[data-tone='danger'] .ui-tooltip-content) {
    border: 1px solid color-mix(in srgb, #ef2e2e 80%, var(--contrast-light));
    background: #ef2e2e;
    color: var(--contrast-light);
}

.guide-tooltip-trigger {
    border: 1px solid var(--border-default);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-primary);
    background: var(--bg-surface);
    cursor: pointer;
    transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
}

.guide-tooltip-trigger:hover,
.guide-tooltip-trigger:focus-visible {
    border-color: color-mix(in srgb, var(--brand-primary) 35%, var(--border-default));
    box-shadow: 0 8px 18px rgba(34, 41, 47, 0.12);
}

.guide-tooltip-trigger:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--brand-primary) 36%, transparent);
    outline-offset: 2px;
}

.guide-tooltip-playground {
    display: grid;
    gap: 14px;
    border: 1px solid var(--border-default);
    border-radius: 12px;
    padding: 16px;
    background: var(--bg-surface);
    box-shadow: 0 12px 24px rgba(34, 41, 47, 0.05);
}

.guide-tooltip-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.guide-tooltip-toolbar-copy {
    margin: 0;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-secondary);
}

.guide-tooltip-toolbar-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.guide-tooltip-toolbar-btn {
    border: 1px solid var(--border-default);
    border-radius: 8px;
    min-height: 32px;
    padding: 6px 10px;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-primary);
    background: var(--bg-page);
    transition: border-color 150ms ease, background-color 150ms ease;
}

.guide-tooltip-toolbar-btn:hover {
    border-color: color-mix(in srgb, var(--brand-primary) 30%, var(--border-default));
    background: color-mix(in srgb, var(--brand-primary) 7%, var(--bg-page));
}

.guide-tooltip-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.guide-tooltip-preset-btn {
    display: grid;
    justify-items: start;
    gap: 2px;
    border: 1px solid var(--border-default);
    border-radius: 10px;
    min-height: 44px;
    padding: 6px 10px;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-primary);
    background: var(--bg-page);
    transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
}

.guide-tooltip-preset-btn:hover {
    border-color: color-mix(in srgb, var(--brand-primary) 30%, var(--border-default));
    background: color-mix(in srgb, var(--brand-primary) 8%, var(--bg-page));
}

.guide-tooltip-preset-btn.is-active {
    border-color: color-mix(in srgb, var(--brand-primary) 45%, var(--border-default));
    background: color-mix(in srgb, var(--brand-primary) 10%, var(--bg-page));
    box-shadow: 0 8px 16px rgba(34, 41, 47, 0.08);
}

.guide-tooltip-preset-label {
    font-weight: var(--font-weight-semibold);
}

.guide-tooltip-preset-meta {
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-muted);
}

.guide-tooltip-controls {
    display: flex;
    gap: 12px;
}

.guide-tooltip-control {
    width: 100%;
    display: grid;
    gap: 6px;
    align-content: start;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-secondary);
    border: 1px solid var(--border-default);
    border-radius: 10px;
    padding: 10px;
    background: color-mix(in srgb, var(--bg-page) 75%, var(--bg-surface));
}

.guide-tooltip-control--toggle {
    min-width: 0;
}

.guide-tooltip-control :deep(.ui-select),
.guide-tooltip-control :deep(.ui-input) {
    width: 100%;
}

.guide-tooltip-control :deep(.ui-checkbox) {
    width: fit-content;
}

@media (max-width: 760px) {
    .guide-tooltip-variant-preview {
        grid-template-columns: 1fr;
    }

    .guide-tooltip-anchor[data-side='right'],
    .guide-tooltip-anchor[data-side='left'] {
        justify-content: center;
        padding-right: 0;
        padding-left: 0;
    }

    .guide-tooltip-anchor[data-side='top'],
    .guide-tooltip-anchor[data-side='bottom'] {
        align-items: center;
        padding-top: 0;
        padding-bottom: 0;
    }

    .guide-tooltip-stage :deep(.ui-tooltip-content) {
        max-width: min(200px, calc(100% - 12px));
    }

    .guide-tooltip-toolbar {
        align-items: flex-start;
        flex-direction: column;
    }
}
</style>
