<script setup lang="ts">
import UiColor from '@/components/ui/Colors.vue';
import { useGuideColors } from '@/composables/guide/useGuideColors';

const { view, search, semanticEntries, paletteEntries, format } =
    useGuideColors();

const setView = (next: 'palette' | 'semantic') => {
    view.value = next;
};

const toggleFrom = (from: 'palette' | 'semantic') => {
    if (view.value !== from) return;
    view.value = from === 'palette' ? 'semantic' : 'palette';
};
</script>

<template>
    <section class="guide-wrapper guide-colors">
        <header class="guide-header">
            <p class="guide-eyebrow">Foundation</p>
            <h1 class="guide-title">Colors</h1>
            <p class="guide-description">
                Semantic tokens and raw palette scales used across the Musticker
                design system.
            </p>
        </header>

        <div class="guide-toolbar">
            <div
                class="guide-colors-toggle"
                role="radiogroup"
                aria-label="Color view"
            >
                <span
                    class="guide-colors-toggle-indicator"
                    :class="{ 'is-semantic': view === 'semantic' }"
                    aria-hidden="true"
                />

                <button
                    role="radio"
                    :aria-checked="view === 'palette'"
                    :class="{ active: view === 'palette' }"
                    @click="setView('palette')"
                    @dblclick="toggleFrom('palette')"
                >
                    Palette
                </button>

                <button
                    role="radio"
                    :aria-checked="view === 'semantic'"
                    :class="{ active: view === 'semantic' }"
                    @click="setView('semantic')"
                    @dblclick="toggleFrom('semantic')"
                >
                    Semantic
                </button>
            </div>

            <input
                v-model="search"
                type="text"
                placeholder="Search token, group, or #hex..."
                class="guide-search"
            />
        </div>

        <section v-if="view === 'palette'" class="guide-block">
            <section
                v-for="[group, tokens] in paletteEntries"
                :key="group"
                class="guide-section"
            >
                <h3 class="guide-section-title">{{ format(group) }}</h3>

                <div class="guide-grid guide-grid-auto">
                    <UiColor
                        v-for="token in tokens"
                        :key="token"
                        :token="token"
                    />
                </div>
            </section>
        </section>

        <section v-else class="guide-block">
            <section
                v-for="[group, tokens] in semanticEntries"
                :key="group"
                class="guide-section"
            >
                <h3 class="guide-section-title">{{ format(group) }}</h3>

                <div class="guide-grid guide-grid-auto">
                    <UiColor
                        v-for="token in tokens"
                        :key="token"
                        :token="token"
                    />
                </div>
            </section>
        </section>
    </section>
</template>
