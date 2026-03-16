import { productCatalog } from '~/data/products/catalog';
import type { ProductCategoryKey, ProductItem } from '~/types/products/catalog';
import type { StoredCartState } from '~/helpers/cart/cartState.helper';

export function normalizeProductCartState(payload: unknown): StoredCartState[] {
	if (Array.isArray(payload)) {
		return payload
			.filter(
				(item): item is StoredCartState =>
					Boolean(item) &&
					typeof item === 'object' &&
					typeof (item as StoredCartState).productId === 'string' &&
					typeof (item as StoredCartState).id === 'string'
			)
			.map((item) => ({
				...item,
				artworkPreviewUrl:
					typeof item.artworkPreviewUrl === 'string' ? item.artworkPreviewUrl : '',
			}));
	}

	if (
		payload &&
		typeof payload === 'object' &&
		typeof (payload as StoredCartState).productId === 'string'
	) {
		const single = payload as StoredCartState;
		return [
			{
				...single,
				id: single.id || `${single.productId}-${Date.now()}`,
				artworkPreviewUrl:
					typeof single.artworkPreviewUrl === 'string' ? single.artworkPreviewUrl : '',
			},
		];
	}

	return [];
}

export function isPlainProductCartItem(item: StoredCartState) {
	return !item.artworkName && !item.artworkPreviewUrl;
}

export function mergePlainProductCartItems(items: StoredCartState[]) {
	return [...items];
}

export function generateProductCartItemId(productId: string) {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}

	return `${productId}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function getProductSlugByCategory(
	productId: string,
	category: ProductCategoryKey
) {
	if (category === 'stickers') {
		return productId.replace(/-sticker$/, '');
	}

	return productId;
}

export function getProductIdFromSlug(
	slug: string,
	categoryKey: ProductCategoryKey
) {
	const category = productCatalog[categoryKey];
	const directMatch = category.products.find((item) => item.id === slug);
	if (directMatch) return directMatch.id;

	if (categoryKey === 'stickers') {
		const stickerMatch = category.products.find((item) => item.id === `${slug}-sticker`);
		if (stickerMatch) return stickerMatch.id;
	}

	return null;
}

export function findProductById(productId: string) {
	for (const category of Object.values(productCatalog)) {
		const product = category.products.find((item) => item.id === productId);
		if (product) return product;
	}

	return null;
}

export function getFeaturedProducts(featuredIds: string[], activeId: string | null) {
	return featuredIds
		.map((productId) => findProductById(productId))
		.filter((item): item is ProductItem => Boolean(item))
		.filter((item) => item.id !== activeId);
}

export function readProductArtworkAsDataUrl(file: File): Promise<string> {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
		reader.onerror = () => resolve('');
		reader.readAsDataURL(file);
	});
}

export function formatProductFileSize(bytes: number) {
	if (bytes <= 0) return '0 B';

	const units = ['B', 'KB', 'MB', 'GB'];
	const index = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		units.length - 1
	);
	const value = bytes / 1024 ** index;

	return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
}