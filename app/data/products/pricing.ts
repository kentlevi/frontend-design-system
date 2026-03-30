import { quantity_options } from '~/data/products/categoryExperience';
import { productCatalog } from '~/data/products/catalog';
import type { ProductCategoryKey } from '~/types/products/catalog';

const category_base_price: Record<ProductCategoryKey, number> = {
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
	const starting_qty = quantity_options[0];
	const category_key = findCategoryByProductId(productId);
	const base = category_key ? category_base_price[category_key] : category_base_price.stickers;
	const unit_price = Math.max(0.18, base - starting_qty / 5000);
	return unit_price * starting_qty;
}