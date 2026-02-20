<script setup lang="ts">
import GuideCopy from '@/components/guide/GuideCopy.vue';
import GuideBadgeBuilder from '@/components/guide/GuideBadgeBuilder.vue';
import UiBadge from '@/components/ui/Badge.vue';

import { useGuideBadges } from '@/composables/guide/useGuideBadges';

const { badgeVariants, badgeTones, badgeSizes, labelize } = useGuideBadges();
</script>

<template>
    <section class="guide-wrapper guide-badges">
        <header class="guide-header">
            <p class="guide-eyebrow">Components</p>
            <h1 class="guide-title">Badge</h1>
            <p class="guide-description">
                Badges communicate status, category, or metadata using semantic
                colors.
            </p>
        </header>

        <section class="guide-block">
            <div class="guide-badges-layout">
                <section class="guide-section">
                    <h2 class="guide-section-title">Custom Builder</h2>
                    <GuideBadgeBuilder />
                </section>

                <section class="guide-section">
                    <h2 class="guide-section-title">Samples</h2>
                <div class="guide-badges-samples">
                    <section class="guide-section">
                        <h2 class="guide-section-title">Tones</h2>

                        <div class="guide-row">
                            <GuideCopy
                                v-for="tone in badgeTones"
                                :key="tone"
                                component="UiBadge"
                                :props="{ tone }"
                            >
                                <UiBadge
                                    :tone="tone"
                                    class="guide-item-hoverable no-border"
                                >
                                    {{ labelize(tone) }}
                                </UiBadge>
                            </GuideCopy>
                        </div>
                    </section>

                    <section class="guide-section">
                        <h2 class="guide-section-title">Variants</h2>

                        <div class="guide-grid">
                            <div v-for="variant in badgeVariants" :key="variant">
                                <p class="guide-subtitle">{{ labelize(variant) }}</p>

                                <div class="guide-row">
                                    <GuideCopy
                                        v-for="tone in badgeTones"
                                        :key="variant + tone"
                                        component="UiBadge"
                                        :props="{ variant, tone }"
                                    >
                                        <UiBadge
                                            :variant="variant"
                                            :tone="tone"
                                            class="guide-item-hoverable no-border"
                                        >
                                            {{ labelize(tone) }}
                                        </UiBadge>
                                    </GuideCopy>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="guide-section">
                        <h2 class="guide-section-title">Sizes</h2>

                        <div class="guide-row">
                            <GuideCopy
                                v-for="size in badgeSizes"
                                :key="size"
                                component="UiBadge"
                                :props="{ size }"
                            >
                                <UiBadge
                                    :size="size"
                                    class="guide-item-hoverable no-border"
                                >
                                    {{ labelize(size) }}
                                </UiBadge>
                            </GuideCopy>
                        </div>
                    </section>
                </div>
                </section>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-badges-layout {
    display: grid;
    grid-template-columns: minmax(0, .65fr) minmax(0, .35fr);
    gap: 40px;
    align-items: start;
    .guide-section {
        margin-top: 0;
    }
}

.guide-badges-samples {
    display: grid;
    gap: 24px;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
}

.guide-badges-layout > .guide-section + .guide-section {
    border-left: 1px solid var(--border-default);
    padding-left: 36px;
}

@media (max-width: 1200px) {
    .guide-badges-layout {
        grid-template-columns: 1fr;
    }

    .guide-badges-layout > .guide-section + .guide-section {
        border-left: 0;
        border-top: 1px solid var(--border-default);
        padding-left: 0;
        padding-top: 32px;
    }
}
</style>
