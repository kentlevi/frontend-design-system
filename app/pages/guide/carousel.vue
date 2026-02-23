<script setup lang="ts">
import GuideCopy from '@/components/guide/GuideCopy.vue';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type CarouselItem = {
    title: string;
    text: string;
    author: string;
    image?: string;
    imageAlt?: string;
};

const reviewItems: CarouselItem[] = [
    {
        title: 'Excellent Service',
        text: 'From design to printing, turnaround was fast and the final quality was excellent.',
        author: 'James',
        image: '/illustrations/products/stickers/die-cut.svg',
        imageAlt: 'Die-cut sticker sample',
    },
    {
        title: 'Football Stickers',
        text: 'Great finish and consistency. Several teammates asked where I ordered them.',
        author: 'Hans',
        image: '/illustrations/products/stickers/rectangle.svg',
        imageAlt: 'Rectangle sticker sample',
    },
    {
        title: 'Great Print Quality',
        text: 'Color reproduction was sharp and the material felt durable after weeks of use.',
        author: 'Ari',
        image: '/illustrations/products/stickers/rounded.svg',
        imageAlt: 'Rounded sticker sample',
    },
    {
        title: 'Fast Delivery',
        text: 'Production moved quickly after approval and shipping arrived exactly on schedule.',
        author: 'Mina',
        image: '/illustrations/products/stickers/circle.svg',
        imageAlt: 'Circle sticker sample',
    },
    {
        title: 'Reliable Quality',
        text: 'Print quality stayed consistent across repeat orders, which helped our fulfillment team.',
        author: 'Dani',
        image: '/illustrations/products/stickers/square.svg',
        imageAlt: 'Square sticker sample',
    },
    {
        title: 'Visual Product Preview',
        text: 'Use visuals in carousel cards when you want to showcase a product or feature snapshot.',
        author: 'Guide Team',
        image: '/illustrations/products/stickers/hologram.svg',
        imageAlt: 'Hologram sticker visual preview',
    },
];

const carouselMarkup = `<div class="carousel" role="region" aria-roledescription="carousel" aria-label="Client reviews carousel">
  <button aria-label="Go to previous review">Prev</button>
  <button aria-label="Go to next review">Next</button>
  <article role="group" aria-label="Review 1 of 4">...</article>
</div>`;

const carouselGap = 16;
const currentSlide = ref(0);
const cardWidth = ref(0);
const viewportRef = ref<HTMLElement | null>(null);
const firstCardRef = ref<HTMLElement | null>(null);
const autoTimer = ref<ReturnType<typeof setInterval> | null>(null);

const trackStyle = computed(() => ({
    transform: `translateX(-${currentSlide.value * (cardWidth.value + carouselGap)}px)`,
}));

const visibleCards = computed(() => {
    const viewportWidth = viewportRef.value?.getBoundingClientRect().width ?? 0;
    const slideWidth = cardWidth.value + carouselGap;

    if (!viewportWidth || !slideWidth) return 1;
    return Math.max(1, Math.floor((viewportWidth + carouselGap) / slideWidth));
});

const maxSlide = computed(() =>
    Math.max(0, reviewItems.length - visibleCards.value)
);
const canGoPrev = computed(() => currentSlide.value > 0);
const canGoNext = computed(() => currentSlide.value < maxSlide.value);

function syncCardWidth() {
    if (!firstCardRef.value) return;
    cardWidth.value = firstCardRef.value.getBoundingClientRect().width;
}

function nextSlide() {
    if (currentSlide.value >= maxSlide.value) {
        currentSlide.value = 0;
        return;
    }

    currentSlide.value += 1;
}

function prevSlide() {
    if (currentSlide.value === 0) return;
    currentSlide.value -= 1;
}

function startAuto() {
    stopAuto();
    autoTimer.value = setInterval(nextSlide, 3200);
}

function stopAuto() {
    if (!autoTimer.value) return;
    clearInterval(autoTimer.value);
    autoTimer.value = null;
}

watch(maxSlide, (nextMax) => {
    if (currentSlide.value > nextMax) currentSlide.value = nextMax;
});

onMounted(() => {
    syncCardWidth();
    startAuto();
    window.addEventListener('resize', syncCardWidth);
});

onBeforeUnmount(() => {
    stopAuto();
    window.removeEventListener('resize', syncCardWidth);
});
</script>

<template>
    <section class="guide-wrapper guide-carousel">
        <header class="guide-header">
            <p class="guide-eyebrow">Components</p>
            <h1 class="guide-title">Carousel</h1>
            <p class="guide-description">
                Horizontal slide pattern for reviews and other sequential content.
            </p>
        </header>

        <section class="guide-section">
            <h2 class="guide-section-title">Review Carousel</h2>
            <p class="guide-section-description">
                Includes autoplay, hover pause, navigation controls, and accessible
                carousel semantics.
            </p>

            <GuideCopy
                class="guide-copy-start guide-carousel-copy-wrap"
                :text="carouselMarkup"
                :ignore-interactive-click="true"
            >
                <div class="guide-carousel-shell">
                    <div class="guide-carousel-controls">
                        <UiButton
                            variant="outline"
                            tone="neutral"
                            size="md"
                            icon-only
                            icon="strong-long-arrow-left"
                            aria-label="Go to previous review"
                            sr-label="Go to previous review"
                            :disabled="!canGoPrev"
                            @click="prevSlide"
                        />
                        <UiButton
                            variant="outline"
                            tone="neutral"
                            size="md"
                            icon-only
                            icon="strong-long-arrow-right"
                            aria-label="Go to next review"
                            sr-label="Go to next review"
                            :disabled="!canGoNext"
                            @click="nextSlide"
                        />
                    </div>

                    <div
                        ref="viewportRef"
                        class="guide-carousel-viewport"
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Client reviews carousel"
                        @mouseenter="stopAuto"
                        @mouseleave="startAuto"
                    >
                        <div class="guide-carousel-track" :style="trackStyle">
                            <article
                                v-for="(item, idx) in reviewItems"
                                :key="`${item.title}-${idx}`"
                                class="guide-carousel-card"
                                role="group"
                                :aria-label="`Review ${idx + 1} of ${reviewItems.length}`"
                                :ref="
                                    (el) => {
                                        if (idx === 0)
                                            firstCardRef = el as HTMLElement | null;
                                    }
                                "
                            >
                                <img
                                    v-if="item.image"
                                    :src="item.image"
                                    :alt="item.imageAlt || item.title"
                                    class="guide-carousel-card-image"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <h3 class="guide-carousel-card-title">{{ item.title }}</h3>
                                <p class="guide-carousel-card-text">{{ item.text }}</p>
                                <p class="guide-carousel-card-meta">
                                    <UiIcon
                                        v-for="star in 5"
                                        :key="`${item.title}-star-${star}`"
                                        name="strong-star"
                                        color="var(--amber-base)"
                                        size="var(--size-icon-md)"
                                    />
                                    <span>{{ item.author }}</span>
                                </p>
                            </article>
                        </div>
                    </div>
                </div>
            </GuideCopy>
        </section>
    </section>
</template>

<style scoped lang="scss">
.guide-carousel-copy-wrap {
    border-radius: 14px;
}

.guide-carousel-shell {
    display: grid;
    gap: 16px;
}

.guide-carousel-controls {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.guide-carousel-viewport {
    overflow: hidden;
}

.guide-carousel-track {
    display: flex;
    gap: 16px;
    transition: transform 320ms ease;
    will-change: transform;
}

.guide-carousel-card {
    // Show two full cards plus a partial "peek" card on the edge.
    flex: 0 0 calc((100% - 16px) / 2.25);
    border: 1px solid var(--border-default);
    border-radius: 14px;
    background: var(--contrast-light);
    padding: 16px;
}

.guide-carousel-card-image {
    width: 100%;
    max-height: 140px;
    object-fit: contain;
    border: 1px solid var(--border-default);
    border-radius: 10px;
    padding: 8px;
    background: var(--bg-surface);
    margin-bottom: 10px;
}

.guide-carousel-card-title {
    margin: 0;
    color: var(--text-primary);
    font-size: 18px;
    line-height: 28px;
}

.guide-carousel-card-text {
    margin: 10px 0 0;
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 24px;
}

.guide-carousel-card-meta {
    margin: 14px 0 0;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--text-secondary);
}

.guide-carousel-card-meta span {
    margin-left: 8px;
}

@media (max-width: 860px) {
    .guide-carousel-card {
        // Keep one full card with a slight peek on mobile/tablet.
        flex: 0 0 calc((100% - 12px) / 1.15);
    }
}
</style>
