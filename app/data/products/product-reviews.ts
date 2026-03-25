import type { ReviewCard } from '~/types/products/productReviews';

const review_assets_base = 'products/reviews';

export const review_cards: ReviewCard[] = [
	{
		id: 'glass',
		author: 'Ciara E.',
		date: '03/02/2023',
		mediaUrl: `${review_assets_base}/review-image-1.png`,
		avatarUrl: `${review_assets_base}/client-avatar-1.png`,
	},
	{
		id: 'bike',
		author: 'Renato F.',
		date: '03/02/2023',
		mediaUrl: `${review_assets_base}/review-image-2.png`,
		avatarUrl: `${review_assets_base}/client-avatar.png`,
	},
	{
		id: 'quality',
		author: 'Rendon L.',
		date: '03/02/2023',
		mediaUrl: `${review_assets_base}/review-image-3.png`,
		avatarUrl: `${review_assets_base}/client-avatar-2.png`,
	},
	{
		id: 'holo',
		author: 'Mitchiel A.',
		date: '03/02/2023',
		mediaUrl: `${review_assets_base}/review-image-4.png`,
	},
];