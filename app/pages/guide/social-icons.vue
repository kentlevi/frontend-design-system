<script setup lang="ts">
import { useGuideSocialIcons } from '@/composables/guide/useGuideSocialIcons';

const { socialIcons, socialVariants, selectedSize, customSize, resolvedSize } =
    useGuideSocialIcons();
</script>

<template>
    <section class="guide-wrapper guide-social">
        <header class="guide-header">
            <p class="guide-eyebrow">Media</p>
            <h1 class="guide-title">Social Icons</h1>
            <p class="guide-description">
                Social icons are visual representations of social media
                platforms used to link users to official brand channels.
            </p>
        </header>

        <GuideSizeSelector
            v-model="selectedSize"
            v-model:custom-value="customSize"
            label="SIZE"
        />

        <section
            v-for="variant in socialVariants"
            :key="variant.color"
            class="guide-section"
        >
            <h2 class="guide-section-title">{{ variant.label }}</h2>
            <p class="guide-section-description">{{ variant.desc }}</p>

            <div class="guide-row" :data-dark="variant.dark || null">
                <GuideCopy
                    v-for="name in socialIcons"
                    :key="name + variant.color"
                    component="UiSocialIcon"
                    :props="{
                        name,
                        variant: variant.color,
                        size: resolvedSize,
                    }"
                    class="guide-item guide-item-hoverable"
                    :class="{ 'guide-item-dark': variant.color === 'white' }"
                >
                    <UiSocialIcon
                        :name="name"
                        :variant="variant.color"
                        :size="resolvedSize"
                    />
                </GuideCopy>
            </div>
        </section>
    </section>
</template>
