import type { ReviewCard } from '~/types/products/productReviews';

type ProductReviewCopyField = 'title' | 'text';

export function getProductReviewCopyKey(cardId: string, field: ProductReviewCopyField) {
	return `product.reviews.cards.${cardId}.${field}`;
}

export function resolveProductReviewMediaSrc(
	card: ReviewCard,
	resolveFileUrl: (path: string) => string
) {
	return resolveFileUrl(card.mediaUrl);
}

export function resolveProductReviewAvatarSrc(
	card: ReviewCard,
	resolveFileUrl: (path: string) => string,
	defaultAvatarUrl: string
) {
	return resolveFileUrl(card.avatarUrl || defaultAvatarUrl);
}