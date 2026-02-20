<script setup lang="ts">
import { computed } from 'vue';
import UiColorSwatch from '@/components/ui/ColorSwatch.vue';
import { semanticColors, paletteColors, paletteOrder } from '@/data/ui/colors';

const semanticTokens = computed(() => Object.values(semanticColors).flat());
const paletteTokens = computed(() =>
    paletteOrder.flatMap((group) => paletteColors[group])
);
</script>

<template>
    <section class="guide-wrapper guide-color-swatches">
        <header class="guide-header">
            <p class="guide-eyebrow">Components</p>
            <h1 class="guide-title">Color Swatches</h1>
            <p class="guide-description">
                Standalone swatch component previews for semantic and palette
                tokens.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Semantic Tokens</h2>
            <div class="guide-grid guide-grid-auto">
                <UiColorSwatch
                    v-for="token in semanticTokens"
                    :key="`semantic-${token}`"
                    :token="token"
                />
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Palette Tokens</h2>
            <div class="guide-grid guide-grid-auto">
                <UiColorSwatch
                    v-for="token in paletteTokens"
                    :key="`palette-${token}`"
                    :token="token"
                />
            </div>
        </section>
    </section>
</template>
