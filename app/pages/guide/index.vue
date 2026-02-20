<script setup lang="ts">
import { useGuideIndex } from '@/composables/guide/useGuideIndex';

const { baseGuides, coreGuides } = useGuideIndex();
const localePath = useLocalePath();
</script>

<template>
    <section class="guide-wrapper guide-index">
        <header class="guide-header">
            <p class="guide-eyebrow">Styleguide</p>
            <h1 class="guide-title">Design System Guides</h1>
            <p class="guide-description">
                Browse all foundational components, media assets, and UI
                elements used across the product interface.
            </p>
        </header>

        <section class="guide-index-group">
            <h2 class="guide-subtitle">Base</h2>
            <nav class="guide-grid guide-grid-auto guide-grid-min-240">
                <NuxtLink
                    v-for="guide in baseGuides"
                    :key="guide.path"
                    :to="localePath(guide.path)"
                    class="guide-card"
                >
                    <div class="guide-card-content">
                        <h3 class="guide-card-title">
                            {{ guide.title }}
                            <span class="guide-index-status" :class="`is-${guide.status ?? 'stable'}`">
                                {{ guide.status ?? 'stable' }}
                            </span>
                        </h3>
                        <p class="guide-card-description">
                            {{ guide.description }}
                        </p>
                    </div>

                    <UiIcon
                        name="light-long-arrow-right"
                        color="var(--text-primary)"
                        size="var(--size-icon-md)"
                        class="guide-card-arrow"
                        aria-hidden="true"
                    />
                </NuxtLink>
            </nav>
        </section>

        <section class="guide-index-group">
            <h2 class="guide-subtitle">Core</h2>
            <nav
                class="guide-grid guide-grid-auto guide-grid-min-240 guide-grid-compact"
            >
                <NuxtLink
                    v-for="guide in coreGuides"
                    :key="guide.path"
                    :to="localePath(guide.path)"
                    class="guide-card"
                >
                    <div class="guide-card-content">
                        <h3 class="guide-card-title">
                            {{ guide.title }}
                            <span class="guide-index-status" :class="`is-${guide.status ?? 'stable'}`">
                                {{ guide.status ?? 'stable' }}
                            </span>
                        </h3>
                        <p class="guide-card-description">
                            {{ guide.description }}
                        </p>
                    </div>

                    <UiIcon
                        name="light-long-arrow-right"
                        color="var(--text-primary)"
                        size="var(--size-icon-md)"
                        class="guide-card-arrow"
                        aria-hidden="true"
                    />
                </NuxtLink>
            </nav>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-index-status {
    margin-left: 8px;
    border-radius: 999px;
    padding: 2px 8px;
    font-size: 11px;
    line-height: 16px;
    text-transform: capitalize;
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
</style>
