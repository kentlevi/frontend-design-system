import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { productCatalog } from '~/data/products/catalog';
import {
	HEADER_MAX_RECENT_SEARCHES,
	HEADER_SEARCH_DEBOUNCE_DELAY_MS,
	HEADER_SEARCH_LOADING_MIN_VISIBLE_MS,
	headerSearchCategories,
} from '~/data/layout/header';
import { useCountry } from '~/composables/app/country/useCountry';
import { getProductSlugByCategory } from '~/helpers/products/productCategory.helper';
import type { ProductCategoryKey } from '~/types/products/catalog';

export type SearchItem = {
	id: string;
	categoryKey: ProductCategoryKey;
	categoryLabel: string;
	name: string;
	blurb: string;
	image: string;
	to: string;
};

type RecentSearchCookieEntry =
	| string
	| {
		type?: 'product' | 'term';
		value?: unknown;
	};

type RecentSearchRecord = {
	key: string;
	type: 'product' | 'term';
	value: string;
};

type SearchNavItem =
	| {
		id: string;
		type: 'recent';
		entryKey: string;
	}
	| {
		id: string;
		type: 'result';
		item: SearchItem;
	};

function createRecentSearchCookieEntry(
	type: 'product' | 'term',
	value: string
): RecentSearchCookieEntry {
	return { type, value };
}

function normalizeProductName(value: unknown, fallback: string) {
	return typeof value === 'string' && value.trim() ? value : fallback;
}

function normalizeSearchText(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replace(/\bstickers\b/g, 'sticker')
		.replace(/\s+/g, ' ');
}

export function useAppHeaderSearch() {
	const { t } = useI18n();
	const route = useRoute();
	const router = useRouter();
	const { withCountry } = useCountry();
	const search_recent_terms_cookie = useCookie<RecentSearchCookieEntry[]>(
		'search_recent_terms',
		{
			default: () => [],
			sameSite: 'lax',
			path: '/',
		}
	);

	const search_modal_open = ref(false);
	const search_query = ref('');
	const debounced_search_query = ref('');
	const search_loading = ref(false);
	const active_search_nav_index = ref(-1);
	const search_input_ref = ref<HTMLInputElement | null>(null);
	const search_modal_ref = ref<HTMLElement | null>(null);
	const search_loading_timeout = ref<ReturnType<typeof setTimeout> | null>(null);
	const search_debounce_timeout = ref<ReturnType<typeof setTimeout> | null>(null);

	function getLocalizedProductName(product_id: string, fallback: string) {
		const translation_key = `product.items.${product_id}.name`;
		const translated_name = t(translation_key);
		return normalizeProductName(
			translated_name !== translation_key ? translated_name : fallback,
			fallback
		);
	}

	function getLocalizedProductBlurb(product_id: string, fallback_name: string) {
		const translation_key = `product.items.${product_id}.blurb`;
		const translated_blurb = t(translation_key, fallback_name);
		return typeof translated_blurb === 'string' && translated_blurb !== translation_key
			? translated_blurb
			: '';
	}

	const search_results = computed<SearchItem[]>(() => {
		const term = normalizeSearchText(debounced_search_query.value);
		if (!term) return [];

		return headerSearchCategories.flatMap((category_key) => {
			const category = productCatalog[category_key];
			if (!category) return [];

			return category.products
				.map((product) => {
					const localized_name = getLocalizedProductName(
						product.id,
						product.name
					);
					const normalized_localized_name = normalizeSearchText(localized_name);
					const normalized_product_id = normalizeSearchText(product.id);
					const matches =
						normalized_localized_name.includes(term) ||
						normalized_product_id.includes(term);

					if (!matches) return null;

					return {
						id: product.id,
						categoryKey: category_key,
						categoryLabel: t(`product.categories.${category_key}`),
						name: localized_name,
						blurb: getLocalizedProductBlurb(product.id, localized_name),
						image: product.image,
						to: withCountry(
							`/${category_key}/${getProductSlugByCategory(product.id, category_key)}`
						),
					} satisfies SearchItem;
				})
				.filter((item): item is SearchItem => Boolean(item));
		});
	});

	const search_result_groups = computed(() => {
		const groups = new Map<string, { key: string; label: string; items: SearchItem[] }>();

		for (const item of search_results.value) {
			if (!groups.has(item.categoryKey)) {
				groups.set(item.categoryKey, {
					key: item.categoryKey,
					label: item.categoryLabel,
					items: [],
				});
			}

			groups.get(item.categoryKey)?.items.push(item);
		}

		return Array.from(groups.values());
	});

	const normalized_recent_searches = computed<RecentSearchRecord[]>(() => {
		return (search_recent_terms_cookie.value || [])
			.map((entry) => {
				if (typeof entry === 'string') {
					const value = entry.trim();
					return value
						? { key: `term:${value}`, type: 'term' as const, value }
						: null;
				}

				if (!entry || typeof entry !== 'object') return null;

				const type = entry.type === 'product' ? 'product' : 'term';
				const value = typeof entry.value === 'string' ? entry.value.trim() : '';
				if (!value) return null;

				return {
					key: `${type}:${value}`,
					type,
					value,
				};
			})
			.filter((entry): entry is RecentSearchRecord => Boolean(entry))
			.slice(0, HEADER_MAX_RECENT_SEARCHES);
	});

	function findMatchingProduct(term: string): SearchItem | null {
		const normalized_term = normalizeSearchText(term);
		if (!normalized_term) return null;

		for (const category_key of headerSearchCategories) {
			const category = productCatalog[category_key];
			if (!category) continue;

			for (const product of category.products) {
				const localized_name = getLocalizedProductName(
					product.id,
					product.name
				);
				const name_matches =
					normalizeSearchText(localized_name) === normalized_term;
				const fallback_name_matches =
					normalizeSearchText(product.name) === normalized_term;
				const id_matches =
					normalizeSearchText(product.id) === normalized_term;

				if (!name_matches && !fallback_name_matches && !id_matches) continue;

				return {
					id: product.id,
					categoryKey: category_key,
					categoryLabel: t(`product.categories.${category_key}`),
					name: localized_name,
					blurb: getLocalizedProductBlurb(product.id, localized_name),
					image: product.image,
					to: withCountry(
						`/${category_key}/${getProductSlugByCategory(product.id, category_key)}`
					),
				};
			}
		}

		return null;
	}

	const recent_search_entries = computed(() =>
		normalized_recent_searches.value.reduce<
			Array<{
				key: string;
				term: string;
				matchedItem: SearchItem | null;
			}>
		>((entries, entry) => {
			const matched_item = findMatchingProduct(entry.value);
			const duplicate_entry = entries.find((candidate) => {
				if (matched_item && candidate.matchedItem) {
					return candidate.matchedItem.id === matched_item.id;
				}

				if (!matched_item && !candidate.matchedItem) {
					return candidate.term.trim().toLowerCase() === entry.value.trim().toLowerCase();
				}

				return false;
			});

			if (duplicate_entry) {
				return entries;
			}

			entries.push({
				key: entry.key,
				term: entry.value,
				matchedItem: matched_item,
			});

			return entries;
		}, [])
	);

	const search_nav_items = computed<SearchNavItem[]>(() => {
		const items: SearchNavItem[] = recent_search_entries.value.map((entry) => ({
			id: `recent:${entry.key}`,
			type: 'recent',
			entryKey: entry.key,
		}));

		for (const item of search_results.value) {
			items.push({
				id: `result:${item.id}`,
				type: 'result',
				item,
			});
		}

		return items;
	});

	const search_nav_index_by_result_id = computed<Record<string, number>>(() => {
		return search_results.value.reduce<Record<string, number>>((accumulator, item, index) => {
			accumulator[item.id] = recent_search_entries.value.length + index;
			return accumulator;
		}, {});
	});

	const search_empty_suggested_term = computed(
		() => getLocalizedProductName('die-cut-sticker', 'Die Cut Sticker')
	);

	const show_search_recent = computed(
		() =>
			search_modal_open.value &&
			!search_loading.value &&
			!search_query.value.trim() &&
			recent_search_entries.value.length > 0
	);

	const show_search_no_recent = computed(
		() =>
			search_modal_open.value &&
			!search_loading.value &&
			!search_query.value.trim() &&
			recent_search_entries.value.length === 0
	);

	const show_search_no_result = computed(
		() =>
			search_modal_open.value &&
			!search_loading.value &&
			Boolean(search_query.value.trim()) &&
			search_results.value.length === 0
	);

	const show_search_results = computed(
		() =>
			search_modal_open.value &&
			!search_loading.value &&
			search_results.value.length > 0
	);

	function clearSearchLoadingTimeout() {
		if (!search_loading_timeout.value) return;
		clearTimeout(search_loading_timeout.value);
		search_loading_timeout.value = null;
	}

	function clearSearchDebounceTimeout() {
		if (!search_debounce_timeout.value) return;
		clearTimeout(search_debounce_timeout.value);
		search_debounce_timeout.value = null;
	}

	function resetSearchNavigation() {
		active_search_nav_index.value = -1;
	}

	function persistRecentSearch(type: 'product' | 'term', value: string) {
		const normalized_value = value.trim();
		if (!normalized_value) return;

		const next_entries = [
			createRecentSearchCookieEntry(type, normalized_value),
			...normalized_recent_searches.value
				.filter(
					(entry) =>
						!(entry.type === type && entry.value === normalized_value)
				)
				.map((entry) =>
					createRecentSearchCookieEntry(entry.type, entry.value)
				),
		].slice(0, HEADER_MAX_RECENT_SEARCHES);

		search_recent_terms_cookie.value = next_entries;
	}

	async function focusSearchInput() {
		await nextTick();
		search_input_ref.value?.focus();
	}

	async function openSearchModal() {
		search_modal_open.value = true;
		await focusSearchInput();
	}

	function closeSearchModal() {
		search_modal_open.value = false;
		search_loading.value = false;
		clearSearchLoadingTimeout();
		clearSearchDebounceTimeout();
	}

	function clearSearch() {
		search_query.value = '';
		debounced_search_query.value = '';
		resetSearchNavigation();
		search_loading.value = false;
		clearSearchLoadingTimeout();
		clearSearchDebounceTimeout();
	}

	function clearRecentSearches() {
		search_recent_terms_cookie.value = [];
		resetSearchNavigation();
	}

	function removeRecentSearch(entry_key: string) {
		search_recent_terms_cookie.value = normalized_recent_searches.value
			.filter((entry) => entry.key !== entry_key)
			.map((entry) => createRecentSearchCookieEntry(entry.type, entry.value));
		resetSearchNavigation();
	}

	async function applyRecentSearch(entry_key: string) {
		const entry = normalized_recent_searches.value.find(
			(candidate) => candidate.key === entry_key
		);
		if (!entry) return;

		const matched_item =
			findMatchingProduct(entry.value);

		if (matched_item) {
			await selectSearchResult(matched_item);
			return;
		}

		persistRecentSearch(entry.type, entry.value);
		const next_query = entry.value;
		search_query.value = next_query;
		debounced_search_query.value = next_query;
		resetSearchNavigation();
		await focusSearchInput();
	}

	function applySuggestedSearch() {
		search_query.value = search_empty_suggested_term.value;
		debounced_search_query.value = search_empty_suggested_term.value;
		persistRecentSearch('term', search_empty_suggested_term.value);
		resetSearchNavigation();
		void focusSearchInput();
	}

	function highlightSearchMatch(value: string) {
		return value;
	}

	function setSearchModalRef(element: HTMLElement | null) {
		search_modal_ref.value = element;
	}

	function setSearchInputRef(element: HTMLInputElement | null) {
		search_input_ref.value = element;
	}

	async function selectSearchResult(item: SearchItem) {
		persistRecentSearch('product', item.id);
		closeSearchModal();
		await router.push(item.to);
	}

	function handleSearchKeydown(event: KeyboardEvent) {
		if (!search_modal_open.value) return false;

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (!search_nav_items.value.length) return true;
			active_search_nav_index.value = Math.min(
				active_search_nav_index.value + 1,
				search_nav_items.value.length - 1
			);
			return true;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (!search_nav_items.value.length) return true;
			active_search_nav_index.value =
				active_search_nav_index.value <= 0
					? 0
					: active_search_nav_index.value - 1;
			return true;
		}

		if (event.key === 'Enter') {
			event.preventDefault();
			const target = search_nav_items.value[active_search_nav_index.value];
			if (!target) return true;

			if (target.type === 'recent') {
				void applyRecentSearch(target.entryKey);
				return true;
			}

			void selectSearchResult(target.item);
			return true;
		}

		return false;
	}

	watch(search_query, (value) => {
		clearSearchDebounceTimeout();
		clearSearchLoadingTimeout();

		if (!value.trim()) {
			debounced_search_query.value = '';
			search_loading.value = false;
			resetSearchNavigation();
			return;
		}

		search_loading.value = true;
		search_debounce_timeout.value = setTimeout(() => {
			debounced_search_query.value = value;
			resetSearchNavigation();
			search_loading_timeout.value = setTimeout(() => {
				search_loading.value = false;
				search_loading_timeout.value = null;
			}, HEADER_SEARCH_LOADING_MIN_VISIBLE_MS);
		}, HEADER_SEARCH_DEBOUNCE_DELAY_MS);
	});

	watch(
		() => route.fullPath,
		() => {
			closeSearchModal();
			clearSearch();
		}
	);

	onBeforeUnmount(() => {
		clearSearchLoadingTimeout();
		clearSearchDebounceTimeout();
	});

	return {
		searchModalOpen: search_modal_open,
		searchQuery: search_query,
		searchLoading: search_loading,
		activeSearchNavIndex: active_search_nav_index,
		searchResultGroups: search_result_groups,
		searchNavIndexByResultId: search_nav_index_by_result_id,
		recentSearchEntries: recent_search_entries,
		searchEmptySuggestedTerm: search_empty_suggested_term,
		showSearchRecent: show_search_recent,
		showSearchNoRecent: show_search_no_recent,
		showSearchNoResult: show_search_no_result,
		showSearchResults: show_search_results,
		setSearchModalRef: setSearchModalRef,
		setSearchInputRef: setSearchInputRef,
		focusSearchInput: focusSearchInput,
		closeSearchModal: closeSearchModal,
		openSearchModal: openSearchModal,
		applySuggestedSearch: applySuggestedSearch,
		clearRecentSearches: clearRecentSearches,
		applyRecentSearch: applyRecentSearch,
		removeRecentSearch: removeRecentSearch,
		selectSearchResult: selectSearchResult,
		highlightSearchMatch: highlightSearchMatch,
		handleSearchKeydown: handleSearchKeydown,
	};
}