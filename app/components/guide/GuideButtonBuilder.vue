<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';

import UiIcon from '@/components/ui/Icon.vue';
import UiButton from '@/components/ui/Button.vue';
import GuideCopy from '@/components/guide/GuideCopy.vue';

import { useIconSearch } from '@/composables/guide/useIconSearch';
import { useButtonBuilder } from '@/composables/guide/useButtonBuilder';
import {
    useColorSuggestions,
    tokenToCssVar,
} from '@/composables/guide/useColorSuggestions';

const iconSearch = useIconSearch();
const builder = useButtonBuilder(
    iconSearch.selectedLeft,
    iconSearch.selectedRight
);

const { semantic } = useColorSuggestions();

const showToneDropdown = ref(false);
const showTextDropdown = ref(false);

const previewProps = computed(() => {
    const icon =
        iconSearch.selectedRight.value ||
        iconSearch.selectedLeft.value ||
        undefined;

    const style =
        builder.customStyle.value &&
        Object.keys(builder.customStyle.value).length
            ? builder.customStyle.value
            : undefined;

    return {
        variant: builder.customVariant.value,
        size: builder.customSize.value,
        tone: builder.previewTone.value,
        style,
        icon,
        iconPosition: iconSearch.selectedRight.value ? 'right' : 'left',
        iconOnly: builder.iconOnly.value || undefined,
        ariaLabel: builder.iconOnly.value
            ? builder.customLabel.value
            : undefined,
    };
});

const previewCopyText = computed(() => {
    const propsEntries = Object.entries(previewProps.value)
        .filter(([k, v]) => {
            if (k === 'style' && (!v || Object.keys(v as any).length === 0))
                return false;
            return v !== undefined && v !== '';
        })
        .map(([k, v]) => {
            if (typeof v === 'object') return `:${k}='${JSON.stringify(v)}'`;
            if (typeof v === 'string') return `${k}="${v}"`;
            return `:${k}="${v}"`;
        })
        .join(' ');

    return builder.iconOnly.value
        ? `<UiButton ${propsEntries} />`
        : `<UiButton ${propsEntries}>${builder.customLabel.value}</UiButton>`;
});

const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (!target.closest('.guide-icon-search')) {
        iconSearch.showLeft.value = false;
        iconSearch.showRight.value = false;
    }

    if (!target.closest('.guide-color-dropdown')) {
        showToneDropdown.value = false;
        showTextDropdown.value = false;
    }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() =>
    document.removeEventListener('click', handleClickOutside)
);
</script>

<template>
    <div class="guide-builder">
        <div class="guide-builder-controls">
            <div v-if="!builder.iconOnly.value" class="guide-control">
                <span class="guide-control-label">Label</span>
                <input
                    v-model="builder.customLabel.value"
                    class="guide-input"
                />
            </div>

            <div class="guide-control">
                <span class="guide-control-label">Variant</span>
                <div class="guide-segmented">
                    <button
                        v-for="v in builder.variants"
                        :key="v"
                        class="guide-chip"
                        :data-active="builder.customVariant.value === v || null"
                        @click="builder.customVariant.value = v"
                    >
                        {{ v }}
                    </button>
                </div>
            </div>

            <div class="guide-control">
                <span class="guide-control-label">Size</span>
                <div class="guide-segmented">
                    <button
                        v-for="s in builder.sizes"
                        :key="s"
                        class="guide-chip"
                        :data-active="builder.customSize.value === s || null"
                        @click="builder.customSize.value = s"
                    >
                        {{ s }}
                    </button>
                </div>
            </div>

            <div class="guide-control">
                <span class="guide-control-label">Tone</span>

                <div class="guide-segmented">
                    <button
                        v-for="t in builder.tones"
                        :key="t.value"
                        class="guide-chip"
                        :data-active="
                            (builder.previewTone.value === t.value &&
                                builder.colorMode.value === 'tone') ||
                            null
                        "
                        @click="builder.setTone(t.value)"
                    >
                        {{ t.label }}
                    </button>

                    <button
                        class="guide-chip"
                        :data-active="
                            builder.colorMode.value === 'custom' || null
                        "
                        @click="builder.setCustomMode()"
                    >
                        Custom
                    </button>
                </div>

                <div class="guide-color-dropdown">
                    <input
                        v-model="builder.customColor.value"
                        class="guide-input"
                        placeholder="var(--brand-primary) or #FFD826"
                        :disabled="builder.colorMode.value !== 'custom'"
                        @focus="showToneDropdown = true"
                    />

                    <div
                        v-if="
                            showToneDropdown &&
                            builder.colorMode.value === 'custom'
                        "
                        class="guide-dropdown-panel"
                    >
                        <button
                            v-for="token in semantic"
                            :key="token"
                            class="guide-color-option"
                            @click="
                                () => {
                                    builder.customColor.value =
                                        tokenToCssVar(token);
                                    showToneDropdown = false;
                                }
                            "
                        >
                            <span
                                class="guide-color-swatch"
                                :style="{ background: tokenToCssVar(token) }"
                            />
                            <span class="guide-color-name">{{ token }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="guide-control">
                <span class="guide-control-label">Text Color</span>

                <div class="guide-color-dropdown">
                    <input
                        v-model="builder.customTextColor.value"
                        class="guide-input"
                        placeholder="var(--text-inverse) or #000000"
                        :disabled="builder.colorMode.value !== 'custom'"
                        @focus="showTextDropdown = true"
                    />

                    <div
                        v-if="
                            showTextDropdown &&
                            builder.colorMode.value === 'custom'
                        "
                        class="guide-dropdown-panel"
                    >
                        <button
                            v-for="token in semantic"
                            :key="token"
                            class="guide-color-option"
                            @click="
                                () => {
                                    builder.customTextColor.value =
                                        tokenToCssVar(token);
                                    showTextDropdown = false;
                                }
                            "
                        >
                            <span
                                class="guide-color-swatch"
                                :style="{ background: tokenToCssVar(token) }"
                            />
                            <span class="guide-color-name">{{ token }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <label class="guide-checkbox">
                <input
                    type="checkbox"
                    v-model="builder.iconOnly.value"
                    :disabled="
                        !iconSearch.selectedLeft.value &&
                        !iconSearch.selectedRight.value
                    "
                />
                Icon only
            </label>

            <div class="guide-controls">
                <div class="guide-control">
                    <span class="guide-control-label">Left Icon</span>

                    <div class="guide-icon-search">
                        <input
                            v-model="iconSearch.searchLeft.value"
                            class="guide-input"
                            placeholder="Search icon..."
                            :disabled="iconSearch.leftDisabled.value"
                            @focus="iconSearch.showLeft.value = true"
                        />

                        <div
                            v-if="iconSearch.showLeft.value"
                            class="guide-icon-dropdown"
                        >
                            <button
                                v-for="icon in iconSearch.getFilteredLeft()"
                                :key="icon"
                                class="guide-icon-option"
                                @click="iconSearch.chooseLeft(icon)"
                            >
                                <UiIcon :name="icon" size="sm" />
                                <span class="guide-icon-option-text">{{ icon }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="guide-control">
                    <span class="guide-control-label">Right Icon</span>

                    <div class="guide-icon-search">
                        <input
                            v-model="iconSearch.searchRight.value"
                            class="guide-input"
                            placeholder="Search icon..."
                            :disabled="iconSearch.rightDisabled.value"
                            @focus="iconSearch.showRight.value = true"
                        />

                        <div
                            v-if="iconSearch.showRight.value"
                            class="guide-icon-dropdown"
                        >
                            <button
                                v-for="icon in iconSearch.getFilteredRight()"
                                :key="icon"
                                class="guide-icon-option"
                                @click="iconSearch.chooseRight(icon)"
                            >
                                <UiIcon :name="icon" size="sm" />
                                <span class="guide-icon-option-text">{{ icon }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <GuideCopy :text="previewCopyText">
                <UiButton v-bind="previewProps">
                    <template v-if="!builder.iconOnly.value">
                        {{ builder.customLabel.value }}
                    </template>
                </UiButton>
            </GuideCopy>
        </div>
    </div>
</template>
