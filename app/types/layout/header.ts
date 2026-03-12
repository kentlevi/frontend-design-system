import type { ProductCategoryKey } from '~/types/products/catalog';

export type CategoryData = {
	id?: number | string;
	name?: string;
	url_slug?: string;
	description?: string;
	sort?: number;
};

export type NavLinkItem = {
	key: string;
	label: string;
	to: string;
};

export type ApiClient = <T>(
	path: string,
	options?: {
		method?: string;
		body?: unknown;
		headers?: HeadersInit;
	}
) => Promise<T>;

export interface ProductCategoriesResponse {
	success: boolean;
	message: string;
	data: CategoryData[];
}

export type HeaderSearchCategory = ProductCategoryKey;