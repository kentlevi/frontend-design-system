import type { ReviewCard } from '~/types/products/productReviews';

const reviewAssetsBase = 'products/reviews';

export const reviewCards: ReviewCard[] = [
	{
		id: 'glass',
		author: 'Ciara E.',
		date: '03/02/2023',
		mediaUrl: `${reviewAssetsBase}/review-image-1.png`,
		avatarUrl: `${reviewAssetsBase}/client-avatar-1.png`,
	},
	{
		id: 'bike',
		author: 'Renato F.',
		date: '03/02/2023',
		mediaUrl: `${reviewAssetsBase}/review-image-2.png`,
		avatarUrl: `${reviewAssetsBase}/client-avatar.png`,
	},
	{
		id: 'quality',
		author: 'Rendon L.',
		date: '03/02/2023',
		mediaUrl: `${reviewAssetsBase}/review-image-3.png`,
		avatarUrl: `${reviewAssetsBase}/client-avatar-2.png`,
	},
	{
		id: 'holo',
		author: 'Mitchiel A.',
		date: '03/02/2023',
		mediaUrl: `${reviewAssetsBase}/review-image-4.png`,
	},
];