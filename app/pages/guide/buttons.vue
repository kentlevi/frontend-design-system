<script setup lang="ts">
import GuideButtonBuilder from '@/components/guide/GuideButtonBuilder.vue';
import GuideCopy from '@/components/guide/GuideCopy.vue';
import UiButton from '@/components/ui/Button.vue';
import { useGuideButtons } from '@/composables/guide/useGuideButtons';

const { exampleSections } = useGuideButtons();
</script>

<template>
    <section class="guide-wrapper guide-buttons">
        <header class="guide-header">
            <p class="guide-eyebrow">Components</p>
            <h1 class="guide-title">Buttons</h1>
            <p class="guide-description">
                All button styles, tones, sizes, states, and accessibility
                behaviors.
            </p>
        </header>

        <div class="guide-two-col">
            <div class="guide-col">
                <GuideButtonBuilder />
            </div>

            <div class="guide-col">
                <section
                    v-for="section in exampleSections"
                    :key="section.title"
                    class="guide-section"
                >
                    <h2 class="guide-section-title">{{ section.title }}</h2>

                    <div class="guide-row">
                        <GuideCopy
                            v-for="item in section.items"
                            :key="item.label + JSON.stringify(item.props)"
                            component="UiButton"
                            :props="item.props"
                            :text="`<UiButton>${item.label}</UiButton>`"
                        >
                            <UiButton v-bind="item.props">
                                {{ item.label }}
                            </UiButton>
                        </GuideCopy>
                    </div>
                </section>
            </div>
        </div>
    </section>
</template>
