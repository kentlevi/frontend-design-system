import type { ProductItem } from '~/types/products/catalog';

export type CartPreviewItem = {
	id: string;
	product: ProductItem;
	sizeKey: string;
	sizeLabel: string;
	customSizeLabel?: string;
	qty: number;
	total: number;
	artworkName: string;
	artworkSizeLabel?: string;
	specialInstructions?: string;
	artworkPreviewUrl?: string;
}

export type CartPreviewSizeOptionModel = {
	key: string;
	name: string;
	dim: string;
}