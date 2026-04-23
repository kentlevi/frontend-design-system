import type { ApiResponse } from '~/types/config/api';

export type SearchItem = {
	id: string;
	product_id: number;
	product_slug: string;
	category_key: string;
	category_label: string;
	name: string;
	blurb: string;
	image: string;
	to: string;
};

export type SearchResultGroup = {
	key: string;
	label: string;
	items: SearchItem[];
};

export type RecentSearchEntry = {
	key: string;
	term: string;
	matchedItem: SearchItem | null;
};

export type HighlightPart = {
	text: string;
	isMatch: boolean;
};

export type SearchApiProduct = {
	id: number | string;
	url_slug: string;
	name: string;
	description: string | null;
	image: string | null;
	category_url_slug: string;
	category_name: string;
};

export type SearchRecentApiProduct = SearchApiProduct & {
	last_viewed_at?: string;
	view_count?: number;
};

export type SearchApiData = {
	products: SearchApiProduct[];
};

export type SearchRecentApiData = {
	products: SearchRecentApiProduct[];
};

export type SearchApiMeta = {
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
	has_more: boolean;
};

export type RecentSearchStorageProduct = {
	id?: unknown;
	product_id?: number;
	product_slug?: unknown;
	category_key?: unknown;
	category_label?: unknown;
	name?: unknown;
	blurb?: unknown;
	image?: unknown;
	to?: unknown;
};

export type RecentSearchStorageEntry =
	| string
	| {
		type?: 'product' | 'term';
		value?: unknown;
	};

export type SearchApiResponse = ApiResponse<SearchApiData>;
export type SearchRecentApiResponse = ApiResponse<SearchRecentApiData>;

export type RecentSearchRecord = {
	key: string;
	type: 'product' | 'term';
	value: string;
	item: SearchItem | null;
};

export type SearchNavItem =
	| {
		id: string;
		type: 'recent';
		entry_key: string;
	}
	| {
		id: string;
		type: 'result';
		item: SearchItem;
	};

export type SearchPagination = {
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
	has_more: boolean;
};