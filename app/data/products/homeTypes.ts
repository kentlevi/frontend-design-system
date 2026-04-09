import type { HomeProductType } from '~/types/products/homeTypes';

export const homeProductTypes: HomeProductType[] = [
	{
		key: 'dieCut',
		productId: 'die-cut-sticker',
		image: '/illustrations/products/stickers/die-cut.svg',
		to: '/stickers/die-cut',
	},
	{
		key: 'dieCutRoll',
		productId: 'die-cut-roll',
		image: '/illustrations/products/roll-stickers/die-cut-labels.svg',
		to: '/roll-stickers/die-cut-roll',
	},
	{
		key: 'sheet',
		productId: 'sticker-sheet',
		image: '/illustrations/products/stickers/sheet.svg',
		to: '/stickers/sticker-sheet',
	},
	{
		key: 'hologram',
		productId: 'hologram-sticker',
		image: '/illustrations/products/stickers/hologram.svg',
		to: '/stickers/hologram',
	},
	{
		key: 'vinyl',
		productId: 'vinyl-lettering',
		image: '/illustrations/products/stickers/vinyl-lettering.svg',
		to: '/stickers/vinyl-lettering',
	},
];

export const homeProductTypePathById = homeProductTypes.reduce<Record<string, string>>(
	(map, item) => {
		map[item.productId] = item.to;
		return map;
	},
	{}
);