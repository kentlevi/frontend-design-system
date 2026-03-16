import { productCatalog } from '~/data/products/catalog';
import {
	CART_STORAGE_KEY,
	CART_UPDATED_EVENT,
	CHECKOUT_SELECTION_STORAGE_KEY,
} from '~/data/cart/page';
import type { ProductCategoryKey, ProductItem } from '~/types/products/catalog';

export type StoredCartState = {
	id: string;
	category: ProductCategoryKey;
	productId: string;
	sizeKey: string;
	qty: number;
	total: number;
	artworkName: string;
	artworkPreviewUrl?: string;
};

export type LocalizedCatalogProduct = ProductItem & {
	name: string;
};

export function normalizeStoredCartState(payload: unknown): StoredCartState[] {
	if (!Array.isArray(payload)) return [];

	return payload
		.filter(
			(item): item is StoredCartState =>
				Boolean(item) &&
				typeof item === 'object' &&
				typeof (item as StoredCartState).id === 'string' &&
				typeof (item as StoredCartState).productId === 'string'
		)
		.map((item) => ({
			...item,
			artworkPreviewUrl:
				typeof item.artworkPreviewUrl === 'string' ? item.artworkPreviewUrl : '',
		}));
}

export function readStoredCartStateFromStorage() {
	if (typeof window === 'undefined') return [];

	try {
		const raw = window.localStorage.getItem(CART_STORAGE_KEY);
		if (!raw) return [];
		return normalizeStoredCartState(JSON.parse(raw));
	} catch {
		return [];
	}
}

export function readCheckoutSelectionIdsFromStorage() {
	if (typeof window === 'undefined') return [];

	try {
		const raw = window.localStorage.getItem(CHECKOUT_SELECTION_STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((item): item is string => typeof item === 'string');
	} catch {
		return [];
	}
}

export function writeStoredCartStateToStorage(next: StoredCartState[]) {
	if (typeof window === 'undefined') return;

	if (next.length) {
		window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
	} else {
		window.localStorage.removeItem(CART_STORAGE_KEY);
	}

	window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function writeCheckoutSelectionIdsToStorage(ids: string[]) {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(CHECKOUT_SELECTION_STORAGE_KEY, JSON.stringify(ids));
}

export function resolveStoredCartProduct(
	entry: Pick<StoredCartState, 'category' | 'productId'>,
	localizeProductName: (productId: string) => string
) {
	const category = productCatalog[entry.category];
	const product = category?.products.find((item) => item.id === entry.productId);
	if (!product) return null;

	return {
		...product,
		name: localizeProductName(product.id),
	} satisfies LocalizedCatalogProduct;
}