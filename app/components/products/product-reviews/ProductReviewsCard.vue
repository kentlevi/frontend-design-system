<script setup lang="ts">
import type { ReviewCard } from '~/types/products/productReviews';
import { useFileBaseUrl } from '~/composables/core/fileBaseUrl/useFileBaseUrl';
import {
	getProductReviewCopyKey,
	resolveProductReviewAvatarSrc,
	resolveProductReviewMediaSrc,
} from '~/helpers/products/productReviews.helper';

const { t } = useI18n();
const { resolveFileUrl } = useFileBaseUrl();
const defaultAvatarUrl = resolveFileUrl('products/reviews/client-avatar.png');

const props = defineProps<{
	card: ReviewCard;
}>();

const title = computed(() => t(getProductReviewCopyKey(props.card.id, 'title')));
const text = computed(() => t(getProductReviewCopyKey(props.card.id, 'text')));
const mediaSrc = computed(() =>
	resolveProductReviewMediaSrc(props.card, resolveFileUrl)
);
const avatarSrc = computed(() =>
	resolveProductReviewAvatarSrc(props.card, resolveFileUrl, defaultAvatarUrl)
);

const onAvatarError = (event: Event) => {
	const image = event.target as HTMLImageElement | null;
	if (!image || image.src === defaultAvatarUrl) return;
	image.src = defaultAvatarUrl;
};
</script>

<template>
	<article class="product-reviews-card" :data-testid="`product-reviews-card-${props.card.id}`">
		<div class="product-reviews-body" data-testid="product-reviews-card-body">
			<div class="product-reviews-media" :data-testid="`product-reviews-card-media-${props.card.id}`">
				<img
					:src="mediaSrc"
					:alt="title"
					loading="lazy"
					class="product-reviews-media-image"
				>
			</div>

			<div class="product-reviews-content" data-testid="product-reviews-card-content">
				<h3 class="product-reviews-card-title" :data-testid="`product-reviews-card-title-${props.card.id}`">{{ title }}</h3>
				<p class="product-reviews-card-text" :data-testid="`product-reviews-card-text-${props.card.id}`">{{ text }}</p>
			</div>
		</div>

		<div class="product-reviews-meta" data-testid="product-reviews-card-meta">
			<div class="product-reviews-card-author" data-testid="product-reviews-card-author">
				<img
					:src="avatarSrc"
					:alt="`${props.card.author} avatar`"
					class="product-reviews-card-avatar"
					data-testid="product-reviews-card-avatar"
					loading="lazy"
					@error="onAvatarError"
				>
				<div class="product-reviews-card-author-details" data-testid="product-reviews-card-author-details">
					<strong class="product-reviews-card-author-name" :data-testid="`product-reviews-card-author-name-${props.card.id}`">{{ props.card.author }}</strong>
					<small class="product-reviews-card-date" :data-testid="`product-reviews-card-date-${props.card.id}`">{{ props.card.date }}</small>
				</div>
			</div>
			<span class="product-reviews-card-stars" :data-testid="`product-reviews-card-stars-${props.card.id}`">
				<UiIcon
					v-for="star in 5"
					:key="`${props.card.author}-star-${star}`"
					name="strong-star"
					:size="20"
					color="var(--amber-base)"
					:data-testid="`product-reviews-card-star-${props.card.id}-${star}`"
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
            overflow: hidden;

            .product-reviews-media-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }
        }

        .product-reviews-content {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .product-reviews-card-title {

                font-size: var(--type-size-200);
                line-height: var(--type-line-200);
                font-weight: var(--font-weight-medium);
                color: var(--text-primary);
            }

            .product-reviews-card-text {

                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
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
                object-fit: cover;
                display: block;
            }

            .product-reviews-card-author-details {
                .product-reviews-card-author-name {
                    display: block;
                    font-size: var(--type-size-100);
                    line-height: var(--type-line-100);
                    color: var(--text-primary);
                }

                .product-reviews-card-date {
                    display: block;
                    font-size: var(--type-size-100);
                    line-height: var(--type-line-100);
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