export type ProductCategoryKey = 'stickers' | 'roll-stickers' | 'sheet-stickers';

export type ProductItem = {
	id: string;
	name: string;
	icon: string;
	image: string;
	blurb: string;
};

export type ProductCategory = {
	key: ProductCategoryKey;
	title: string;
	defaultProductId: string;
	products: ProductItem[];
};