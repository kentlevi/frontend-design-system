<script setup lang="ts">
import type { ReviewCard } from '~/data/products/product-reviews';

const { t } = useI18n();

defineProps<{
    card: ReviewCard;
}>();
</script>

<template>
    <article class="product-reviews-card" :data-testid="`product-reviews-card-${card.id}`">
        <div class="product-reviews-body" data-testid="product-reviews-card-body">
            <div class="product-reviews-media" :class="card.mediaClass" :data-testid="`product-reviews-card-media-${card.id}`"/>

            <div class="product-reviews-content" data-testid="product-reviews-card-content">
                <h3 class="product-reviews-card-title" :data-testid="`product-reviews-card-title-${card.id}`">{{ t(`product.reviews.cards.${card.id}.title`) }}</h3>
                <p class="product-reviews-card-text" :data-testid="`product-reviews-card-text-${card.id}`">{{ t(`product.reviews.cards.${card.id}.text`) }}</p>
            </div>
        </div>

        <div class="product-reviews-meta" data-testid="product-reviews-card-meta">
            <div class="product-reviews-card-author" data-testid="product-reviews-card-author">
                <span class="product-reviews-card-avatar" data-testid="product-reviews-card-avatar"/>
                <div class="product-reviews-card-author-details" data-testid="product-reviews-card-author-details">
                    <strong class="product-reviews-card-author-name" :data-testid="`product-reviews-card-author-name-${card.id}`">{{ card.author }}</strong>
                    <small class="product-reviews-card-date" :data-testid="`product-reviews-card-date-${card.id}`">{{ card.date }}</small>
                </div>
            </div>
            <span class="product-reviews-card-stars" :data-testid="`product-reviews-card-stars-${card.id}`">
                <UiIcon
                    v-for="star in 5"
                    :key="`${card.author}-star-${star}`"
                    name="strong-star"
                    :size="20"
                    color="var(--amber-base)"
                    :data-testid="`product-reviews-card-star-${card.id}-${star}`"
                />
            </span>
        </div>
    </article>
</template>

<style scoped lang="scss">
.product-reviews-card {
    width: 100%;
    height: 480px;
    background: var(--contrast-light);
    border-radius: 16px;
    border: 1px solid var(--border-default);
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .product-reviews-body {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .product-reviews-media {
            height: 200px;
            border-radius: 12px;
            border: 1px solid var(--border-default);
            background: linear-gradient(140deg, var(--gray-30) 0%, var(--gray-50) 100%);

            &.is-glass {
                background: linear-gradient(140deg, var(--gray-60) 0%, var(--gray-30) 100%);
            }

            &.is-bike {
                background: linear-gradient(140deg, var(--gray-70) 0%, var(--gray-40) 100%);
            }

            &.is-wheel {
                background: linear-gradient(140deg, var(--gray-50) 0%, var(--gray-20) 100%);
            }

            &.is-holo {
                background: linear-gradient(140deg, var(--gray-50) 0%, var(--gray-30) 100%);
            }
        }

        .product-reviews-content {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .product-reviews-card-title {
                margin: 0;
                font-size: 16px;
                line-height: 28px;
                font-weight: 500;
                color: var(--text-primary);
            }

            .product-reviews-card-text {
                margin: 0;
                font-size: 14px;
                line-height: 24px;
                color: var(--text-secondary);
            }
        }
    }

    .product-reviews-meta {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 10px;

        .product-reviews-card-author {
            display: flex;
            align-items: center;
            gap: 10px;

            .product-reviews-card-avatar {
                width: 42px;
                height: 42px;
                border-radius: 50%;
                background: var(--gray-30);
                border: 1px solid var(--gray-50);
            }

            .product-reviews-card-author-details {
                .product-reviews-card-author-name {
                    display: block;
                    font-size: 14px;
                    line-height: 24px;
                    color: var(--text-primary);
                }

                .product-reviews-card-date {
                    display: block;
                    font-size: 12px;
                    line-height: 20px;
                    color: var(--text-secondary);
                }
            }
        }

        .product-reviews-card-stars {
            display: inline-flex;
            gap: 2px;
        }
    }
}
</style>
