import type { ProductItem } from '~/types/products/catalog';

export type CartPreviewItem = {
	id: string;
	product: ProductItem;
	sizeKey: string;
	sizeLabel: string;
	qty: number;
	total: number;
	artworkName: string;
	artworkPreviewUrl?: string;
}

export type CartPreviewSizeOptionModel = {
	key: string;
	name: string;
	dim: string;
}