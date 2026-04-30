export type ProductCategoryKey = 'stickers' | 'roll-stickers' | 'sheet-stickers' | 'vinyl-lettering';

export type ProductItem = {
	id: number;
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