<script setup lang="ts">
import ProductReviewsCard from '@/components/products/product-reviews/ProductReviewsCard.vue';
import ProductReviewsHeader from '@/components/products/product-reviews/ProductReviewsHeader.vue';
import { useProductReviewsCarousel } from '@/composables/products/useProductReviewsCarousel';
import { reviewCards } from '~/data/products/product-reviews';

const {
    viewportRef,
    trackStyle,
    canGoPrev,
    canGoNext,
    setCardRef,
    nextReview,
    prevReview,
    startAuto,
    stopAuto,
} = useProductReviewsCarousel(reviewCards.length);
</script>

<template>
    <section class="product-reviews" data-testid="product-reviews-section">
        <div class="product-reviews-wrap" data-testid="product-reviews-wrap">
            <ProductReviewsHeader
                :can-go-prev="canGoPrev"
                :can-go-next="canGoNext"
                @prev="prevReview"
                @next="nextReview"
                data-testid="product-reviews-header"
            />

            <div
                ref="viewportRef"
                class="product-reviews-viewport"
                @mouseenter="stopAuto"
                @mouseleave="startAuto"
                data-testid="product-reviews-viewport"
            >
                <div class="product-reviews-track" :style="trackStyle" data-testid="product-reviews-track">
                    <div
                        v-for="(card, index) in reviewCards"
                        :key="`${card.id}-${index}`"
                        class="product-reviews-card-shell"
                        :ref="(el) => setCardRef(el as Element | null, index)"
                        :data-testid="`product-reviews-card-shell-${card.id}-${index}`"
                    >
                        <ProductReviewsCard :card="card" :data-testid="`product-reviews-card-${card.id}-${index}`" />
                    </div>
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

        .product-reviews-viewport {
            margin-top: 24px;
            overflow: hidden;

            .product-reviews-track {
                display: flex;
                gap: 18px;
                transition: transform 360ms ease;
                will-change: transform;

                .product-reviews-card-shell {
                    flex: 0 0 330px;
                    width: 330px;
                }
            }
        }
    }
}

@media (max-width: 980px) {
    .product-reviews {
        .product-reviews-wrap {
            .product-reviews-viewport {
                .product-reviews-track {
                    .product-reviews-card-shell {
                        flex: 0 0 calc((100% - 18px) / 2);
                    }
                }
            }
        }
    }
}

@media (max-width: 700px) {
    .product-reviews {
        .product-reviews-wrap {
            .product-reviews-viewport {
                .product-reviews-track {
                    .product-reviews-card-shell {
                        flex: 0 0 100%;
                    }
                }
            }
        }
    }
}
</style>
