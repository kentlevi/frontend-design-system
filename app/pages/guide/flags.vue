<script setup lang="ts">
import { useGuideFlags } from '@/composables/guide/useGuideFlags';

const { flags, selectedSize, customSize, resolvedSize } = useGuideFlags();
</script>

<template>
    <ClientOnly>
        <section class="guide-wrapper guide-flags">
            <header class="guide-header">
                <p class="guide-eyebrow">Foundation</p>
                <h1 class="guide-title">Flags</h1>
                <p class="guide-description">
                    Visual representations of countries used across
                    localization, shipping, and regional identity.
                </p>
            </header>

            <GuideSizeSelector
                v-model="selectedSize"
                v-model:custom-value="customSize"
                label="SIZE"
            />

            <section class="guide-section">
                <h2 class="guide-section-title">Flags of the World</h2>

                <div class="guide-grid guide-grid-auto guide-grid-min-72">
                    <GuideCopy
                        v-for="code in flags"
                        :key="code"
                        component="UiFlag"
                        :props="{ code, size: resolvedSize }"
                        class="guide-item guide-item-hoverable"
                    >
                        <UiFlag :code="code" :size="resolvedSize" />
                        <code class="guide-label">{{
                            code.toUpperCase()
                        }}</code>
                    </GuideCopy>
                </div>
            </section>
        </section>
    </ClientOnly>
</template>
