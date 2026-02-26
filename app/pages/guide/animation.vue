<script setup lang="ts">
import { ref } from 'vue';

const showFade = ref(true);
const showSlide = ref(true);
const replaySeed = ref(0);
const siteMotionReferences = [
    {
        label: 'Header account dropdown',
        source: 'AppHeaderAccountMenu.vue',
        transition: 'opacity 0.18s ease, transform 0.18s ease',
        detail: 'translateY(-6px) + scale(0.96) on enter/leave',
        durationMs: 180,
        easing: 'ease',
    },
    {
        label: 'Header search modal',
        source: 'AppHeaderSearchModal.vue',
        transition: 'opacity 0.18s ease',
        detail: 'fade-only overlay transition',
        durationMs: 180,
        easing: 'ease',
    },
    {
        label: 'Header locale modal',
        source: 'AppHeaderLocaleModal.vue',
        transition: 'opacity 0.2s ease',
        detail: 'fade-only transition',
        durationMs: 200,
        easing: 'ease',
    },
    {
        label: 'Shared UiModal',
        source: 'assets/scss/components/modal/_index.scss',
        transition: 'overlay opacity 0.2s, modal transform+opacity 0.2s',
        detail: 'translateY(-8px) + scale(0.98) for enter/leave',
        durationMs: 200,
        easing: 'ease',
    },
    {
        label: 'Cart preview drawer',
        source: 'CartPreview.vue',
        transition: 'opacity 0.6s + panel transform 0.6s cubic-bezier(0.65,0,0.35,1)',
        detail: 'slide-in from translateX(100%)',
        durationMs: 600,
        easing: 'cubic-bezier(0.65,0,0.35,1)',
    },
    {
        label: 'Home reviews carousel',
        source: 'HomeReviewsSection.vue',
        transition: 'track transform 360ms ease',
        detail: 'horizontal slide between review cards',
        durationMs: 360,
        easing: 'ease',
    },
];

function replayStagger() {
    replaySeed.value += 1;
}
</script>

<template>
    <section class="guide-wrapper guide-animation">
        <header class="guide-header">
            <p class="guide-eyebrow">Core</p>
            <h1 class="guide-title">Animation</h1>
            <p class="guide-description">
                Motion examples for fade, slide, and staggered reveal patterns.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Fade Transition</h2>
            <p class="guide-section-description">
                Use fade for subtle state changes and helper content.
            </p>
            <div class="guide-row guide-row-align-center">
                <UiButton tone="neutral" variant="outline" @click="showFade = !showFade">
                    Toggle Fade
                </UiButton>
                <Transition name="guide-fade">
                    <div v-if="showFade" class="animation-demo-card">
                        Fade content block
                    </div>
                </Transition>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Slide Transition</h2>
            <p class="guide-section-description">
                Use slide for directional movement and panel-like content.
            </p>
            <div class="guide-row guide-row-align-center">
                <UiButton tone="neutral" variant="outline" @click="showSlide = !showSlide">
                    Toggle Slide
                </UiButton>
                <Transition name="guide-slide-up">
                    <div v-if="showSlide" class="animation-demo-card animation-demo-card-strong">
                        Slide-up content block
                    </div>
                </Transition>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Stagger Sequence</h2>
            <p class="guide-section-description">
                Use stagger for related lists entering together with clear hierarchy.
            </p>
            <div class="guide-row guide-row-stack">
                <UiButton tone="neutral" variant="outline" @click="replayStagger">
                    Replay Stagger
                </UiButton>
                <div :key="replaySeed" class="animation-stagger-grid">
                    <article
                        v-for="item in 4"
                        :key="item"
                        class="animation-stagger-item"
                        :style="{ '--stagger-index': item - 1 }"
                    >
                        Item {{ item }}
                    </article>
                </div>
            </div>
        </section>

        <section class="guide-section">
            <h2 class="guide-section-title">Site Motion References</h2>
            <p class="guide-section-description">
                These values are pulled from current production components.
            </p>

            <div class="animation-reference-grid">
                <article
                    v-for="item in siteMotionReferences"
                    :key="item.label"
                    class="animation-reference-card"
                >
                    <h3 class="animation-reference-title">{{ item.label }}</h3>
                    <p class="animation-reference-source">{{ item.source }}</p>
                    <div class="animation-reference-meta">
                        <span class="animation-reference-chip">{{ item.durationMs }}ms</span>
                        <span class="animation-reference-chip animation-reference-chip-soft">{{ item.easing }}</span>
                    </div>
                    <div class="animation-reference-meter">
                        <span
                            class="animation-reference-meter-fill"
                            :style="{
                                '--motion-duration': `${item.durationMs}ms`,
                                '--motion-easing': item.easing,
                            }"
                        />
                    </div>
                    <p class="animation-reference-transition">{{ item.transition }}</p>
                    <p class="animation-reference-detail">{{ item.detail }}</p>
                </article>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-animation {
    .animation-demo-card {
        border: 1px solid var(--border-default);
        border-radius: 12px;
        background: var(--contrast-light);
        color: var(--text-primary);
        padding: 14px 16px;
        min-width: 220px;
    }

    .animation-demo-card-strong {
        border-color: var(--brand-secondary);
        background: color-mix(in srgb, var(--brand-primary) 36%, var(--contrast-light));
    }

    .animation-stagger-grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
    }

    .animation-stagger-item {
        border: 1px solid var(--border-default);
        border-radius: 12px;
        padding: 12px 14px;
        background: var(--contrast-light);
        color: var(--text-primary);
        animation: guide-stagger-in 280ms ease both;
        animation-delay: calc(var(--stagger-index) * 60ms);
    }

    .animation-reference-grid {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .animation-reference-card {
        border: 1px solid var(--border-default);
        border-radius: 12px;
        background: var(--contrast-light);
        padding: 14px;
    }

    .animation-reference-title {
        margin: 0;
        color: var(--text-primary);
        font-size: 16px;
        line-height: 28px;
    }

    .animation-reference-source {
        margin: 2px 0 0;
        color: var(--text-muted);
        font-size: 12px;
        line-height: 18px;
    }

    .animation-reference-transition {
        margin: 8px 0 0;
        color: var(--text-primary);
        font-size: 13px;
        line-height: 20px;
        font-weight: 600;
    }

    .animation-reference-detail {
        margin: 6px 0 0;
        color: var(--text-secondary);
        font-size: 13px;
        line-height: 20px;
    }

    .animation-reference-meta {
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .animation-reference-chip {
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 11px;
        line-height: 16px;
        color: var(--contrast-light);
        background: var(--text-primary);
    }

    .animation-reference-chip-soft {
        color: var(--text-primary);
        background: color-mix(in srgb, var(--brand-primary) 48%, var(--contrast-light));
    }

    .animation-reference-meter {
        margin-top: 10px;
        width: 100%;
        height: 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--border-default) 75%, transparent);
        overflow: hidden;
    }

    .animation-reference-meter-fill {
        display: block;
        height: 100%;
        width: 38%;
        border-radius: inherit;
        background: linear-gradient(90deg, var(--brand-secondary), var(--brand-primary));
        animation: guide-reference-sweep var(--motion-duration, 240ms) var(--motion-easing, ease) infinite alternate;
    }
}

.guide-fade-enter-active,
.guide-fade-leave-active {
    transition: opacity 180ms ease;
}

.guide-fade-enter-from,
.guide-fade-leave-to {
    opacity: 0;
}

.guide-slide-up-enter-active,
.guide-slide-up-leave-active {
    transition:
        transform 280ms ease,
        opacity 280ms ease;
}

.guide-slide-up-enter-from,
.guide-slide-up-leave-to {
    transform: translateY(12px);
    opacity: 0;
}

@keyframes guide-stagger-in {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes guide-reference-sweep {
    from {
        transform: translateX(-58%);
    }
    to {
        transform: translateX(162%);
    }
}

@media (max-width: 860px) {
    .guide-animation {
        .animation-stagger-grid {
            grid-template-columns: 1fr;
        }

        .animation-reference-grid {
            grid-template-columns: 1fr;
        }
    }
}

@media (prefers-reduced-motion: reduce) {
    .guide-fade-enter-active,
    .guide-fade-leave-active,
    .guide-slide-up-enter-active,
    .guide-slide-up-leave-active {
        transition: none;
    }

    .guide-animation .animation-stagger-item {
        animation: none;
    }

    .guide-animation .animation-reference-meter-fill {
        animation: none;
        transform: none;
    }
}
</style>
