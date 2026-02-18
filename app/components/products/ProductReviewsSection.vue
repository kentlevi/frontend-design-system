<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
const { t } = useI18n();

type ReviewCard = {
    id: string;
    author: string;
    date: string;
    mediaClass: string;
};

const cards: ReviewCard[] = [
    {
        id: 'glass',
        author: 'Ciara E.',
        date: '03/02/2023',
        mediaClass: 'is-glass',
    },
    {
        id: 'bike',
        author: 'Renato F.',
        date: '03/02/2023',
        mediaClass: 'is-bike',
    },
    {
        id: 'quality',
        author: 'Rendon L.',
        date: '03/02/2023',
        mediaClass: 'is-wheel',
    },
    {
        id: 'holo',
        author: 'Mitchiel A.',
        date: '03/02/2023',
        mediaClass: 'is-holo',
    },
];

const reviewGap = 18;
const currentSlide = ref(0);
const cardWidth = ref(0);
const viewportRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLElement | null>(null);
const autoTimer = ref<ReturnType<typeof setInterval> | null>(null);

const trackStyle = computed(() => ({
    transform: `translateX(-${currentSlide.value * (cardWidth.value + reviewGap)}px)`,
}));

const visibleCards = computed(() => {
    const viewportWidth = viewportRef.value?.getBoundingClientRect().width ?? 0;
    const slideWidth = cardWidth.value + reviewGap;
    if (!viewportWidth || !slideWidth) return 1;
    return Math.max(1, Math.floor((viewportWidth + reviewGap) / slideWidth));
});

const maxSlide = computed(() => Math.max(0, cards.length - visibleCards.value));
const canGoPrev = computed(() => currentSlide.value > 0);
const canGoNext = computed(() => currentSlide.value < maxSlide.value);

function syncCardWidth() {
    if (!cardRef.value) return;
    cardWidth.value = cardRef.value.getBoundingClientRect().width;
}

function nextReview() {
    if (currentSlide.value >= maxSlide.value) {
        currentSlide.value = 0;
        return;
    }
    currentSlide.value += 1;
}

function prevReview() {
    if (currentSlide.value === 0) return;
    currentSlide.value -= 1;
}

function startAuto() {
    stopAuto();
    autoTimer.value = setInterval(nextReview, 3200);
}

function stopAuto() {
    if (!autoTimer.value) return;
    clearInterval(autoTimer.value);
    autoTimer.value = null;
}

onMounted(() => {
    syncCardWidth();
    currentSlide.value = 0;
    startAuto();
    window.addEventListener('resize', syncCardWidth);
});

onBeforeUnmount(() => {
    stopAuto();
    window.removeEventListener('resize', syncCardWidth);
});
</script>

<template>
    <section class="product-reviews">
        <div class="product-reviews-wrap">
            <div class="product-reviews-head">
                <div class="product-reviews-rating">
                    <span class="rating-badge">{{ t('products.reviews.badge') }}</span>
                    <span class="rating-stars">
                        <UiIcon
                            v-for="star in 5"
                            :key="`head-star-${star}`"
                            name="strong-star"
                            :size="14"
                            color="var(--gold-base)"
                        />
                    </span>
                    <span class="rating-score">5.0</span>
                </div>

                <h2>{{ t('products.reviews.headline') }}</h2>
                <p>
                    {{ t('products.reviews.description') }}
                </p>

                <div class="product-reviews-controls">
                    <button
                        type="button"
                        :disabled="!canGoPrev"
                        @click="prevReview"
                    >
                        <UiIcon
                            name="strong-long-arrow-left"
                            :size="18"
                            color="var(--text-primary)"
                        />
                    </button>
                    <button
                        type="button"
                        :disabled="!canGoNext"
                        @click="nextReview"
                    >
                        <UiIcon
                            name="strong-long-arrow-right"
                            :size="18"
                            color="var(--text-primary)"
                        />
                    </button>
                </div>
            </div>

            <div
                ref="viewportRef"
                class="product-reviews-viewport"
                @mouseenter="stopAuto"
                @mouseleave="startAuto"
            >
                <div class="product-reviews-track" :style="trackStyle">
                    <article
                        v-for="(card, index) in cards"
                        :key="`${card.id}-${index}`"
                        class="product-reviews-card"
                        :ref="
                            (el) => {
                                if (index === 0)
                                    cardRef = el as HTMLElement | null;
                            }
                        "
                    >
                        <div
                            class="product-reviews-media"
                            :class="card.mediaClass"
                        ></div>
                        <h3>{{ t(`products.reviews.cards.${card.id}.title`) }}</h3>
                        <p>{{ t(`products.reviews.cards.${card.id}.text`) }}</p>

                        <div class="product-reviews-meta">
                            <div class="author">
                                <span class="avatar"></span>
                                <div>
                                    <strong>{{ card.author }}</strong>
                                    <small>{{ card.date }}</small>
                                </div>
                            </div>
                            <span class="stars">
                                <UiIcon
                                    v-for="star in 5"
                                    :key="`${card.author}-star-${star}`"
                                    name="strong-star"
                                    :size="12"
                                    color="var(--gold-base)"
                                />
                            </span>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.product-reviews {
    padding: 120px 0;
    background: var(--gray-10);

    .product-reviews-wrap {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
    }

    .product-reviews-head {
        position: relative;
        padding-right: 120px;

        h2 {
            margin: 16px 0 10px;
            font-size: clamp(34px, 3vw, 48px);
            line-height: 1.1;
            letter-spacing: -0.02em;
            color: var(--text-primary);
        }

        p {
            margin: 0;
            font-size: 16px;
            line-height: 1.6;
            color: var(--text-secondary);
        }
    }

    .product-reviews-rating {
        display: inline-flex;
        align-items: center;
        gap: 10px;
    }

    .rating-badge {
        background: var(--text-primary);
        color: var(--contrast-light);
        border-radius: 999px;
        padding: 6px 12px;
        font-size: 12px;
        font-weight: 700;
    }

    .rating-stars {
        display: inline-flex;
        gap: 2px;
    }

    .rating-score {
        font-weight: 600;
        color: var(--text-primary);
    }

    .product-reviews-controls {
        position: absolute;
        right: 0;
        top: 58px;
        display: flex;
        gap: 10px;

        button {
            width: 44px;
            height: 44px;
            border: 1px solid var(--border-default);
            border-radius: 999px;
            background: var(--contrast-light);
            display: grid;
            place-items: center;
            cursor: pointer;

            &:disabled {
                opacity: 0.4;
                cursor: default;
            }
        }
    }

    .product-reviews-viewport {
        margin-top: 24px;
        overflow: hidden;
    }

    .product-reviews-track {
        display: flex;
        gap: 18px;
        transition: transform 360ms ease;
        will-change: transform;
    }

    .product-reviews-card {
        flex: 0 0 calc((100% - 54px) / 3.2);
        background: var(--contrast-light);
        border-radius: 16px;
        border: 1px solid var(--border-default);
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .product-reviews-media {
        height: 194px;
        border-radius: 12px;
        border: 1px solid var(--border-default);
        background: linear-gradient(140deg, var(--gray-30) 0%, var(--gray-50) 100%);
    }

    .product-reviews-media.is-glass {
        background: linear-gradient(140deg, var(--gray-60) 0%, var(--gray-30) 100%);
    }

    .product-reviews-media.is-bike {
        background: linear-gradient(140deg, var(--gray-70) 0%, var(--gray-40) 100%);
    }

    .product-reviews-media.is-wheel {
        background: linear-gradient(140deg, var(--gray-50) 0%, var(--gray-20) 100%);
    }

    .product-reviews-media.is-holo {
        background: linear-gradient(140deg, var(--gray-50) 0%, var(--gray-30) 100%);
    }

    h3 {
        margin: 0;
        font-size: 18px;
        line-height: 1.35;
        font-weight: 600;
        color: var(--text-primary);
    }

    p {
        margin: 0;
        font-size: 14px;
        line-height: 1.55;
        color: var(--text-secondary);
    }

    .product-reviews-meta {
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }

    .author {
        display: flex;
        align-items: center;
        gap: 10px;

        .avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: var(--gray-30);
            border: 1px solid var(--gray-50);
        }

        strong {
            display: block;
            font-size: 14px;
            color: var(--text-primary);
        }

        small {
            display: block;
            font-size: 12px;
            color: var(--text-muted);
        }
    }

    .stars {
        display: inline-flex;
        gap: 2px;
    }

    @media (max-width: 980px) {
        .product-reviews-head {
            padding-right: 0;

            h2 {
                font-size: 36px;
            }
        }

        .product-reviews-controls {
            position: static;
            margin-top: 14px;
        }

        .product-reviews-card {
            flex-basis: calc((100% - 18px) / 2);
        }

        h3 {
            font-size: 24px;
        }
    }

    @media (max-width: 700px) {
        .product-reviews-card {
            flex-basis: 100%;
        }
    }
}
</style>
