import { productCatalog } from '~/data/products/catalog';
import {
	CART_STORAGE_KEY,
	CART_UPDATED_EVENT,
	CHECKOUT_SELECTION_STORAGE_KEY,
} from '~/data/cart/page';
import type { ProductCategoryKey, ProductItem } from '~/types/products/catalog';
import type { FontSpec } from '~/types/products/attributes';

export type StoredCartState = {
	id: string;
	category: ProductCategoryKey;
	productId: number;
	sizeKey: string;
	customSizeLabel?: string;
	qty: number;
	total: number;
	artworkName: string;
	artworkSizeLabel?: string;
	specialInstructions?: string;
	artworkPreviewUrl?: string;
	font?: FontSpec;
	letteringText?: string;
};

export type LocalizedCatalogProduct = ProductItem & {
	name: string;
};

function stripStoredCartPreviewUrls(items: StoredCartState[]) {
	return items.map((item) => ({
		...item,
		artworkPreviewUrl: '',
	}));
}

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
			customSizeLabel:
				typeof item.customSizeLabel === 'string' ? item.customSizeLabel : '',
			artworkSizeLabel:
				typeof item.artworkSizeLabel === 'string' ? item.artworkSizeLabel : '',
			specialInstructions:
				typeof item.specialInstructions === 'string' ? item.specialInstructions : '',
			artworkPreviewUrl:
				typeof item.artworkPreviewUrl === 'string' ? item.artworkPreviewUrl : '',
			font:
				item.font && typeof item.font === 'object' ? item.font : undefined,
			letteringText:
				typeof item.letteringText === 'string' ? item.letteringText : undefined,
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

	try {
		if (next.length) {
			window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
		} else {
			window.localStorage.removeItem(CART_STORAGE_KEY);
		}
	} catch (error) {
		if (
			next.length
			&& error instanceof DOMException
			&& error.name === 'QuotaExceededError'
		) {
			const fallback_state = stripStoredCartPreviewUrls(next);
			window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(fallback_state));
			console.warn(
				'[cart] Local storage quota exceeded. Stored cart without artwork preview images.'
			);
		} else {
			throw error;
		}
	}

	window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function writeCheckoutSelectionIdsToStorage(ids: string[]) {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(CHECKOUT_SELECTION_STORAGE_KEY, JSON.stringify(ids));
}

export function resolveStoredCartProduct(
	entry: Pick<StoredCartState, 'category' | 'productId'>,
	localizeProductName: (productId: number) => string
) {
	const category = productCatalog[entry.category];
	const product = category?.products.find((item) => item.id === entry.productId);
	if (!product) return null;

	return {
		...product,
		name: localizeProductName(product.id),
	} satisfies LocalizedCatalogProduct;
}