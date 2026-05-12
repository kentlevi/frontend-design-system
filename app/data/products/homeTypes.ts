import { featuredProducts } from './featured';
import type { HomeProductType } from '~/types/products/homeTypes';

// We map featured products to the HomeProductType required by the landing page.
// Note: We exclude 'Clear Sticker' from the home page icons if necessary,
// but for now we follow the user's request to keep them synced.
export const homeProductTypes: HomeProductType[] = featuredProducts.map((item) => ({
	key: item.key,
	productId: Number(item.id),
	image: item.image,
	to: `/${item.category}/${item.id}`,
	name: item.name,
}));

export const homeProductTypePathById = homeProductTypes.reduce<Record<string, string>>(
	(map, item) => {
		map[item.productId] = item.to;
		return map;
	},
	{},
);