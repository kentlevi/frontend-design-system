import type { HomeProductKey } from '~/types/products/homeTypes';

export interface FeaturedProduct {
	id: string;
	key: HomeProductKey;
	name: string;
	image: string;
	icon: string;
	blurb: string;
	category: string;
}

export const featuredProducts: FeaturedProduct[] = [
	{
		id: 'die-cut-sticker',
		key: 'dieCut',
		name: 'Die Cut Sticker',
		image: '/illustrations/products/stickers/die-cut.svg',
		icon: 'strong-star',
		blurb: 'Precision-cut shape.',
		category: 'stickers',
	},
	{
		id: 'die-cut-roll',
		key: 'dieCutRoll',
		name: 'Die Cut Roll',
		image: '/illustrations/products/roll-stickers/die-cut-labels.svg',
		icon: 'strong-star',
		blurb: 'Stickers on a roll.',
		category: 'roll-stickers',
	},
	{
		id: 'sticker-sheet',
		key: 'sheet',
		name: 'Sticker Sheet',
		image: '/illustrations/products/stickers/sheet.svg',
		icon: 'strong-stars',
		blurb: 'Multiple stickers on a sheet.',
		category: 'stickers',
	},
	{
		id: 'hologram-sticker',
		key: 'hologram',
		name: 'Hologram Sticker',
		image: '/illustrations/products/stickers/hologram.svg',
		icon: 'strong-star',
		blurb: 'Premium holographic finish.',
		category: 'stickers',
	},
	{
		id: 'vinyl-lettering',
		key: 'vinyl',
		name: 'Vinyl Lettering',
		image: '/illustrations/products/stickers/vinyl-lettering.svg',
		icon: 'strong-text',
		blurb: 'Custom vinyl lettering.',
		category: 'stickers',
	}
];