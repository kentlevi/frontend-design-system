import type { ApiResponse } from '~/types/config/api';

export type SearchItem = {
	id: string;
	product_id: string;
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

export type SearchApiData = {
	products: SearchApiProduct[];
};

export type SearchApiMeta = {
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
	has_more: boolean;
};

export type SearchApiResponse = ApiResponse<SearchApiData>;