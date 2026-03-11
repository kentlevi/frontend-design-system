import type { SearchItem } from '~/composables/layout/appHeader/useAppHeaderSearch';

export type SearchResultGroup = {
	key: string;
	label: string;
	items: SearchItem[];
}

export type RecentSearchEntry = {
	key: string;
	term: string;
	matchedItem: SearchItem | null;
}

export type HighlightPart = {
	text: string;
	isMatch: boolean;
}