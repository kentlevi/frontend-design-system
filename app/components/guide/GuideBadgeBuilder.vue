<script setup lang="ts">
import { computed, ref } from 'vue';
import GuideCopy from '@/components/guide/GuideCopy.vue';
import UiBadge from '@/components/ui/Badge.vue';
import {
    badgeSizes,
    badgeTones,
    badgeVariants,
    type BadgeSize,
    type BadgeTone,
    type BadgeVariant,
} from '@/data/ui/badge';
import { toGuideLabel } from '@/utils/text';

const builderLabel = ref('Custom Badge');
const builderVariant = ref<BadgeVariant>('tonal');
const builderTone = ref<BadgeTone>('default');
const builderSize = ref<BadgeSize>('md');

const customStyleEnabled = ref(false);
const customBackground = ref('var(--brand-primary)');
const customText = ref('var(--text-inverse)');
const customBorder = ref('var(--brand-primary)');

const badgeStyle = computed<Record<string, string> | undefined>(() => {
    if (!customStyleEnabled.value) return undefined;

    if (builderVariant.value === 'outline') {
        return {
            background: 'transparent',
            color: customText.value,
            borderColor: customBorder.value,
        };
    }

    if (builderVariant.value === 'subtle') {
        return {
            color: customText.value,
        };
    }

    return {
        background: customBackground.value,
        color: customText.value,
        borderColor: customBorder.value,
    };
});

const previewCopyText = computed(() => {
    const baseProps = [
        `variant="${builderVariant.value}"`,
        `tone="${builderTone.value}"`,
        `size="${builderSize.value}"`,
    ];

    if (customStyleEnabled.value && badgeStyle.value) {
        baseProps.push(`:style='${JSON.stringify(badgeStyle.value)}'`);
    }

    return `<UiBadge ${baseProps.join(' ')}>${builderLabel.value}</UiBadge>`;
});
</script>

<template>
    <section class="guide-badge-builder">
        <div class="guide-badge-builder-controls">
            <div class="guide-badge-builder-control">
                <span class="guide-badge-builder-control-label">Label</span>
                <input
                    v-model="builderLabel"
                    type="text"
                    class="guide-badge-builder-input"
                >
            </div>

            <div class="guide-badge-builder-control">
                <span class="guide-badge-builder-control-label">Variant</span>
                <div class="guide-badge-builder-segmented">
                    <button
                        v-for="variant in badgeVariants"
                        :key="variant"
                        type="button"
                        class="guide-badge-builder-chip"
                        :data-active="builderVariant === variant || null"
                        @click="builderVariant = variant"
                    >
                        {{ toGuideLabel(variant) }}
                    </button>
                </div>
            </div>

            <div class="guide-badge-builder-control">
                <span class="guide-badge-builder-control-label">Tone</span>
                <div class="guide-badge-builder-segmented">
                    <button
                        v-for="tone in badgeTones"
                        :key="tone"
                        type="button"
                        class="guide-badge-builder-chip"
                        :data-active="builderTone === tone || null"
                        @click="builderTone = tone"
                    >
                        {{ toGuideLabel(tone) }}
                    </button>
                </div>
            </div>

            <div class="guide-badge-builder-control">
                <span class="guide-badge-builder-control-label">Size</span>
                <div class="guide-badge-builder-segmented">
                    <button
                        v-for="size in badgeSizes"
                        :key="size"
                        type="button"
                        class="guide-badge-builder-chip"
                        :data-active="builderSize === size || null"
                        @click="builderSize = size"
                    >
                        {{ toGuideLabel(size) }}
                    </button>
                </div>
            </div>

            <label class="guide-badge-builder-checkbox">
                <input
                    v-model="customStyleEnabled"
                    type="checkbox"
                >
                Enable custom style
            </label>

            <div class="guide-badge-builder-grid">
                <div class="guide-badge-builder-control">
                    <span class="guide-badge-builder-control-label">Background</span>
                    <input
                        v-model="customBackground"
                        type="text"
                        class="guide-badge-builder-input"
                        :disabled="!customStyleEnabled"
                        placeholder="var(--brand-primary)"
                    >
                </div>

                <div class="guide-badge-builder-control">
                    <span class="guide-badge-builder-control-label">Text</span>
                    <input
                        v-model="customText"
                        type="text"
                        class="guide-badge-builder-input"
                        :disabled="!customStyleEnabled"
                        placeholder="var(--text-inverse)"
                    >
                </div>

                <div class="guide-badge-builder-control">
                    <span class="guide-badge-builder-control-label">Border</span>
                    <input
                        v-model="customBorder"
                        type="text"
                        class="guide-badge-builder-input"
                        :disabled="!customStyleEnabled"
                        placeholder="var(--brand-primary)"
                    >
                </div>
            </div>

            <div class="guide-badge-builder-preview">
                <GuideCopy :text="previewCopyText">
                    <UiBadge
                        :variant="builderVariant"
                        :tone="builderTone"
                        :size="builderSize"
                        :style="badgeStyle"
                        class="guide-item-hoverable no-border"
                    >
                        {{ builderLabel }}
                    </UiBadge>
                </GuideCopy>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.guide-badge-builder {
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    padding: 0;
}

.guide-badge-builder-controls {
    display: grid;
    gap: 16px;
}

.guide-badge-builder-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 2px;
}

.guide-badge-builder-control {
    display: grid;
    gap: 8px;
}

.guide-badge-builder-control-label {
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    font-weight: var(--font-weight-semibold);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.guide-badge-builder-input {
    width: 100%;
    border: 1px solid var(--border-default);
    border-radius: 8px;
    background: var(--bg-page);
    color: var(--text-primary);
    padding: 8px 10px;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
}

.guide-badge-builder-input:disabled {
    background: var(--bg-muted);
    color: var(--text-muted);
    cursor: not-allowed;
}

.guide-badge-builder-segmented {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.guide-badge-builder-chip {
    border: 1px solid var(--border-default);
    background: var(--bg-surface);
    color: var(--text-secondary);
    border-radius: 8px;
    padding: 6px 12px;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    cursor: pointer;
    transition: all 0.15s ease;
}

.guide-badge-builder-chip:hover {
    background: var(--bg-muted);
}

.guide-badge-builder-chip[data-active='true'] {
    border-color: var(--brand-secondary);
    background: var(--brand-secondary);
    color: var(--contrast-light);
    box-shadow: 0 0 0 1px var(--brand-secondary);
}

.guide-badge-builder-checkbox {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: var(--type-size-100);
    line-height: var(--type-line-100);
    color: var(--text-primary);
}

.guide-badge-builder-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

@media (max-width: 900px) {
    .guide-badge-builder-grid {
        grid-template-columns: 1fr;
    }
}
</style>
