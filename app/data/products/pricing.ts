import { quantityOptions } from '~/data/products/categoryExperience';
import { productCatalog } from '~/data/products/catalog';
import type { ProductCategoryKey } from '~/types/products/catalog';

const categoryBasePrice: Record<ProductCategoryKey, number> = {
	stickers: 2.4,
	'roll-stickers': 1.7,
	'sheet-stickers': 1.9,
};

function findCategoryByProductId(productId: string): ProductCategoryKey | null {
	for (const [categoryKey, category] of Object.entries(productCatalog) as Array<[ProductCategoryKey, (typeof productCatalog)[ProductCategoryKey]]>) {
		if (category.products.some((product) => product.id === productId)) {
			return categoryKey;
		}
	}
	return null;
}

export function defaultStartPriceByProductId(productId: string): number {
	const startingQty = quantityOptions[0];
	const categoryKey = findCategoryByProductId(productId);
	const base = categoryKey ? categoryBasePrice[categoryKey] : categoryBasePrice.stickers;
	const unitPrice = Math.max(0.18, base - startingQty / 5000);
	return unitPrice * startingQty;
}