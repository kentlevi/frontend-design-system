<script setup lang="ts">
import { useGuideLogos } from '@/composables/guide/useGuideLogos';

const { logos, variants, colors, selectedSize, customSize, resolvedSize } =
    useGuideLogos();
</script>

<template>
    <section class="guide-wrapper guide-logos">
        <header class="guide-header">
            <p class="guide-eyebrow">Media</p>
            <h1 class="guide-title">Logos</h1>
            <p class="guide-description">
                Official brand logos used across product interfaces, marketing
                materials, and documentation.
            </p>
        </header>

        <GuideSizeSelector
            v-model="selectedSize"
            v-model:custom-value="customSize"
            label="SIZE"
        />

        <section
            v-for="variant in variants"
            :key="variant"
            class="guide-section"
        >
            <h2 class="guide-section-title">
                {{ variant === 'full' ? 'Full Logo' : 'Mark Logo' }}
            </h2>

            <div v-for="color in colors" :key="color" class="guide-subsection">
                <h3 class="guide-subtitle">
                    {{ color === 'colored' ? 'Brand Color' : 'White Color' }}
                </h3>

                <div class="guide-grid guide-grid-auto guide-grid-min-160">
                    <GuideCopy
                        v-for="name in logos"
                        :key="name + variant + color"
                        component="UiLogo"
                        :props="{ name, variant, color, size: resolvedSize }"
                        class="guide-item guide-item-hoverable"
                        :class="{ 'guide-item-dark': color === 'white' }"
                    >
                        <UiLogo
                            :name="name"
                            :variant="variant"
                            :color="color"
                            :size="resolvedSize"
                        />

                        <span class="guide-label">{{ name }}</span>
                    </GuideCopy>
                </div>
            </div>
        </section>
    </section>
</template>
