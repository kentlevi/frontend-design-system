<script setup lang="ts">
import GuideCopy from '@/components/guide/GuideCopy.vue';
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

                <div class="guide-grid guide-grid-auto guide-grid-min-120">
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
        </section>
    </section>
</template>
