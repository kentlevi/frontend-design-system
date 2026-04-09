import type { HomeProductType } from '~/types/products/homeTypes';

interface RawHomeProductType extends Omit<HomeProductType, 'to'> {
	category: string;
}

const rawHomeProductTypes: RawHomeProductType[] = [
	{
		key: 'dieCut',
		productId: 'die-cut-sticker',
		image: '/illustrations/products/stickers/die-cut.svg',
		category: 'stickers',
	},
	{
		key: 'dieCutRoll',
		productId: 'die-cut-roll',
		image: '/illustrations/products/roll-stickers/die-cut-labels.svg',
		category: 'roll-stickers',
	},
	{
		key: 'sheet',
		productId: 'sticker-sheet',
		image: '/illustrations/products/stickers/sheet.svg',
		category: 'stickers',
	},
	{
		key: 'hologram',
		productId: 'hologram-sticker',
		image: '/illustrations/products/stickers/hologram.svg',
		category: 'stickers',
	},
	{
		key: 'vinyl',
		productId: 'vinyl-lettering',
		image: '/illustrations/products/stickers/vinyl-lettering.svg',
		category: 'stickers',
	},
];

export const homeProductTypes: HomeProductType[] = rawHomeProductTypes.map((item) => ({
	...item,
	to: `/${item.category}/${item.productId}`,
}));

export const homeProductTypePathById = homeProductTypes.reduce<Record<string, string>>(
	(map, item) => {
		map[item.productId] = item.to;
		return map;
	},
	{},
);