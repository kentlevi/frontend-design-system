<script setup lang="ts">
const { t } = useI18n();

defineProps<{
    canGoPrev: boolean;
    canGoNext: boolean;
}>();

const emit = defineEmits<{
    (e: 'prev'): void;
    (e: 'next'): void;
}>();
</script>

<template>
    <div class="product-reviews-head" data-testid="product-reviews-head">
        <div class="product-reviews-rating" data-testid="product-reviews-rating">
            <span class="rating-badge" data-testid="product-reviews-rating-badge">{{ t('product.reviews.badge') }}</span>
            <span class="rating-stars" data-testid="product-reviews-rating-stars">
                <UiIcon
                    v-for="star in 5"
                    :key="`head-star-${star}`"
                    name="strong-star"
                    :size="20"
                    color="var(--amber-base)"
                    :data-testid="`product-reviews-rating-star-${star}`"
                />
            </span>
            <span class="rating-score" data-testid="product-reviews-rating-score">5.0</span>
        </div>

        <h2 class="product-reviews-headline" data-testid="product-reviews-headline">{{ t('product.reviews.headline') }}</h2>
        <p class="product-reviews-description" data-testid="product-reviews-description">{{ t('product.reviews.description') }}</p>

        <div class="product-reviews-controls" data-testid="product-reviews-controls">
            <UiButton
                type="button"
                variant="outline"
                tone="neutral"
                size="md"
                icon-only
                icon="strong-long-arrow-left"
                :aria-label="t('product.reviews.controls.previous')"
                :sr-label="t('product.reviews.controls.previous')"
                class="product-reviews-control-button"
                :disabled="!canGoPrev"
                @click="emit('prev')"
                data-testid="product-reviews-prev-button"
            />
            <UiButton
                type="button"
                variant="outline"
                tone="neutral"
                size="md"
                icon-only
                icon="strong-long-arrow-right"
                :aria-label="t('product.reviews.controls.next')"
                :sr-label="t('product.reviews.controls.next')"
                class="product-reviews-control-button"
                :disabled="!canGoNext"
                @click="emit('next')"
                data-testid="product-reviews-next-button"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.product-reviews-head {
    position: relative;
    padding-right: 120px;

    .product-reviews-rating {
        display: inline-flex;
        align-items: center;
        gap: 10px;

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
            font-size: 14px;
            line-height: 24px;
            color: var(--text-primary);
        }
    }

    .product-reviews-headline {
        margin: 16px 0 10px;
        font-size: 36px;
        line-height: 52px;
        color: var(--text-primary);
    }

    .product-reviews-description {
        margin: 0;
        font-size: 16px;
        line-height: 28px;
        color: var(--text-secondary);
    }

    .product-reviews-controls {
        position: absolute;
        right: 0;
        top: 58px;
        display: flex;
        gap: 10px;

        .product-reviews-control-button {
            width: 44px;
            height: 44px;
            min-width: 44px;
            border: 1px solid var(--border-default);
            border-radius: 999px;
            background: var(--contrast-light);
            color: var(--text-primary);
            box-shadow: none;
            padding: 0;
            transition: all 0.2s ease;

            &:hover:not(:disabled) {
                background: var(--gray-20);
            }

            &:disabled {
                opacity: 0.4;
            }
        }
    }
}

@media (max-width: 980px) {
    .product-reviews-head {
        padding-right: 0;

        .product-reviews-headline {
            font-size: 30px;
            line-height: 44px;
        }

        .product-reviews-controls {
            position: static;
            margin-top: 14px;
        }
    }
}
</style>
