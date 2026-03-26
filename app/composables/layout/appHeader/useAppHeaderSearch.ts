import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
	HEADER_MAX_RECENT_SEARCHES,
	HEADER_SEARCH_DEBOUNCE_DELAY_MS,
} from '~/data/layout/header';
import { useCountry } from '~/composables/app/country/useCountry';
import { useFileBaseUrl } from '~/composables/core/fileBaseUrl/useFileBaseUrl';
import {
	getRecentSearchedProducts,
	saveRecentSearchedProducts,
	searchProducts,
} from '~/services/search/search.service';
import { useUsersStore } from '~/stores/users/users.store';
import type {
	RecentSearchEntry,
	RecentSearchRecord,
	RecentSearchStorageEntry,
	RecentSearchStorageProduct,
	SearchApiMeta,
	SearchApiProduct,
	SearchItem,
	SearchNavItem,
	SearchPagination,
	SearchRecentApiProduct,
	SearchResultGroup,
} from '~/types/layout/appHeaderSearch';

const search_page_size = 10;
const search_result_scroll_threshold = 56;
const search_default_image = '/illustrations/products/stickers/die-cut.svg';
const search_recent_storage_key = 'search_recent_terms';

function normalizeText(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

function normalizeSearchText(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/\s+/g, ' ');
}

function createEmptyPagination(per_page = search_page_size): SearchPagination {
	return {
		current_page: 1,
		last_page: 1,
		per_page,
		total: 0,
		has_more: false,
	};
}

function toPositiveInteger(value: unknown, fallback: number): number {
	const parsed_value = Number(value);
	if (!Number.isFinite(parsed_value)) return fallback;
	const normalized_value = Math.trunc(parsed_value);
	return normalized_value > 0 ? normalized_value : fallback;
}

function createRecentSearchStorageEntry(
	type: 'product' | 'term',
	value: string | RecentSearchStorageProduct
): RecentSearchStorageEntry {
	return {
		type,
		value,
	};
}

function dedupeSearchItems(items: SearchItem[]): SearchItem[] {
	const seen_ids = new Set<string>();

	return items.filter((item) => {
		if (seen_ids.has(item.id)) {
			return false;
		}

		seen_ids.add(item.id);
		return true;
	});
}

export function useAppHeaderSearch(params: {
	closeModal: () => void;
}) {
	const { t } = useI18n();
	const router = useRouter();
	const { withCountry } = useCountry();
	const { resolveFileUrl } = useFileBaseUrl();
	const users_store = useUsersStore();

	const search_query = ref('');
	const debounced_search_query = ref('');
	const search_loading = ref(false);
	const search_loading_more = ref(false);
	const recent_search_loading = ref(false);
	const search_results = ref<SearchItem[]>([]);
	const active_search_nav_index = ref(-1);
	const search_input_ref = ref<HTMLInputElement | null>(null);
	const search_modal_ref = ref<HTMLElement | null>(null);
	const search_pagination = ref<SearchPagination>(
		createEmptyPagination(search_page_size)
	);
	const search_request_id = ref(0);
	const recent_search_storage_entries = ref<RecentSearchStorageEntry[]>([]);
	let search_debounce_timeout: ReturnType<typeof setTimeout> | null = null;

	const is_authenticated = computed(() => users_store.state.id > 0);

	function clearSearchDebounceTimeout() {
		if (!search_debounce_timeout) return;
		clearTimeout(search_debounce_timeout);
		search_debounce_timeout = null;
	}

	function resetSearchNavigation() {
		active_search_nav_index.value = -1;
	}

	function clearSearchResults() {
		search_results.value = [];
		search_pagination.value = createEmptyPagination(search_page_size);
	}

	function resolveSearchEmptySuggestedTerm() {
		const translation_key = 'product.items.die-cut-sticker.name';
		const translated_value = t(translation_key);
		return translated_value !== translation_key ? translated_value : 'Die Cut Sticker';
	}

	function resolveSearchImage(image_path: unknown): string {
		const normalized_image = normalizeText(image_path);

		if (!normalized_image) {
			return search_default_image;
		}

		if (/^https?:\/\//i.test(normalized_image) || normalized_image.startsWith('/')) {
			return normalized_image;
		}

		const resolved_url = resolveFileUrl(normalized_image);
		return resolved_url || search_default_image;
	}

	function mapApiProductToSearchItem(api_product: SearchApiProduct): SearchItem | null {
		const product_id = Number(api_product.id ?? '');
		const product_slug = normalizeText(api_product.url_slug);
		const category_slug = normalizeText(api_product.category_url_slug);
		const product_name = normalizeText(api_product.name);

		if (!product_id || !product_slug || !category_slug || !product_name) {
			return null;
		}

		const category_name = normalizeText(api_product.category_name) || category_slug;
		const product_blurb = normalizeText(api_product.description);

		return {
			id: `${category_slug}:${product_id}`,
			product_id,
			category_key: category_slug,
			category_label: category_name,
			name: product_name,
			blurb: product_blurb,
			image: resolveSearchImage(api_product.image),
			to: withCountry(`/${category_slug}/${product_slug}`),
		};
	}

	function resolvePaginationMeta(meta: Record<string, unknown> | null, fallback_page: number): SearchPagination {
		const current_page = toPositiveInteger(meta?.current_page, fallback_page);
		const last_page = toPositiveInteger(meta?.last_page, current_page);
		const per_page = toPositiveInteger(meta?.per_page, search_page_size);
		const total = Math.max(0, Number(meta?.total) || 0);
		const has_more = Boolean(meta?.has_more ?? current_page < last_page);

		return {
			current_page,
			last_page,
			per_page,
			total,
			has_more,
		};
	}

	function normalizeRecentProduct(value: unknown): SearchItem | null {
		if (!value || typeof value !== 'object') return null;

		const product_value = value as RecentSearchStorageProduct;
		const id = normalizeText(product_value.id);
		const product_id = product_value.product_id;
		const category_key = normalizeText(product_value.category_key);
		const category_label = normalizeText(product_value.category_label) || category_key;
		const name = normalizeText(product_value.name);
		const blurb = normalizeText(product_value.blurb);
		const image = normalizeText(product_value.image);
		const to = normalizeText(product_value.to);

		if (!id || !product_id || !category_key || !name || !to) {
			return null;
		}

		return {
			id,
			product_id,
			category_key,
			category_label,
			name,
			blurb,
			image: image || search_default_image,
			to,
		};
	}

	function mapSearchItemToStorageProduct(item: SearchItem): RecentSearchStorageProduct {
		return {
			id: item.id,
			product_id: item.product_id,
			category_key: item.category_key,
			category_label: item.category_label,
			name: item.name,
			blurb: item.blurb,
			image: item.image,
			to: item.to,
		};
	}

	function mapRecentApiProductToStorageEntry(product: SearchRecentApiProduct): RecentSearchStorageEntry | null {
		const mapped_item = mapApiProductToSearchItem(product);
		if (!mapped_item) return null;

		return createRecentSearchStorageEntry('product', mapSearchItemToStorageProduct(mapped_item));
	}

	function loadRecentSearchesFromLocalStorage(): RecentSearchStorageEntry[] {
		if (!import.meta.client) return [];

		try {
			const raw_value = window.localStorage.getItem(search_recent_storage_key);
			if (!raw_value) return [];

			const parsed_value = JSON.parse(raw_value);
			return Array.isArray(parsed_value)
				? parsed_value as RecentSearchStorageEntry[]
				: [];
		} catch {
			return [];
		}
	}

	function writeRecentSearchesToLocalStorage(entries: RecentSearchStorageEntry[]) {
		if (!import.meta.client) return;

		try {
			if (!entries.length) {
				window.localStorage.removeItem(search_recent_storage_key);
				return;
			}

			window.localStorage.setItem(search_recent_storage_key, JSON.stringify(entries));
		} catch {
			// ignore storage failures
		}
	}

	function setRecentSearchStorageEntries(entries: RecentSearchStorageEntry[]) {
		recent_search_storage_entries.value = entries;
		writeRecentSearchesToLocalStorage(entries);
	}

	const normalized_recent_searches = computed<RecentSearchRecord[]>(() => {
		return recent_search_storage_entries.value
			.map((entry) => {
				if (typeof entry === 'string') {
					const term = normalizeText(entry);
					if (!term) return null;

					return {
						key: `term:${term}`,
						type: 'term' as const,
						value: term,
						item: null,
					};
				}

				if (!entry || typeof entry !== 'object') {
					return null;
				}

				const type = entry.type === 'product' ? 'product' : 'term';
				if (type === 'product') {
					const item = normalizeRecentProduct(entry.value);
					if (!item) return null;

					return {
						key: `product:${item.id}`,
						type,
						value: item.name,
						item,
					};
				}

				const term = normalizeText(entry.value);
				if (!term) return null;

				return {
					key: `term:${term}`,
					type,
					value: term,
					item: null,
				};
			})
			.filter((entry): entry is RecentSearchRecord => Boolean(entry))
			.slice(0, HEADER_MAX_RECENT_SEARCHES);
	});

	const recent_search_entries = computed<RecentSearchEntry[]>(() => {
		return normalized_recent_searches.value.reduce<RecentSearchEntry[]>(
			(entries, entry) => {
				const duplicate_entry = entries.find((candidate) => {
					if (entry.item && candidate.matchedItem) {
						return candidate.matchedItem.id === entry.item.id;
					}

					if (!entry.item && !candidate.matchedItem) {
						return normalizeSearchText(candidate.term) === normalizeSearchText(entry.value);
					}

					return false;
				});

				if (duplicate_entry) {
					return entries;
				}

				entries.push({
					key: entry.key,
					term: entry.value,
					matchedItem: entry.item,
				});

				return entries;
			},
			[]
		);
	});

	const search_result_groups = computed<SearchResultGroup[]>(() => {
		const grouped_results = new Map<string, SearchResultGroup>();

		for (const item of search_results.value) {
			if (!grouped_results.has(item.category_key)) {
				grouped_results.set(item.category_key, {
					key: item.category_key,
					label: item.category_label,
					items: [],
				});
			}

			grouped_results.get(item.category_key)?.items.push(item);
		}

		return Array.from(grouped_results.values());
	});

	const search_empty_suggested_term = computed(resolveSearchEmptySuggestedTerm);

	const is_search_loading = computed(
		() => search_loading.value || (recent_search_loading.value && !search_query.value.trim())
	);

	const show_search_recent = computed(
		() =>
			!is_search_loading.value
			&& !search_query.value.trim()
			&& recent_search_entries.value.length > 0
	);

	const show_search_no_recent = computed(
		() =>
			!is_search_loading.value
			&& !search_query.value.trim()
			&& recent_search_entries.value.length === 0
	);

	const show_search_no_result = computed(
		() =>
			!is_search_loading.value
			&& Boolean(search_query.value.trim())
			&& search_results.value.length === 0
	);

	const show_search_results = computed(
		() => !is_search_loading.value && search_results.value.length > 0
	);

	const search_nav_items = computed<SearchNavItem[]>(() => {
		if (show_search_recent.value) {
			return recent_search_entries.value.map((entry) => ({
				id: `recent:${entry.key}`,
				type: 'recent',
				entry_key: entry.key,
			}));
		}

		if (!show_search_results.value) {
			return [];
		}

		return search_results.value.map((item) => ({
			id: `result:${item.id}`,
			type: 'result',
			item,
		}));
	});

	const search_nav_index_by_result_id = computed<Record<string, number>>(() => {
		return search_results.value.reduce<Record<string, number>>((accumulator, item, index) => {
			accumulator[item.id] = index;
			return accumulator;
		}, {});
	});

	const can_load_more_results = computed(
		() =>
			show_search_results.value
			&& !search_loading.value
			&& !search_loading_more.value
			&& search_pagination.value.has_more
	);

	function persistRecentSearch(item: { type: 'product'; value: SearchItem } | { type: 'term'; value: string }) {
		const next_entries = [
			item.type === 'product'
				? createRecentSearchStorageEntry('product', mapSearchItemToStorageProduct(item.value))
				: createRecentSearchStorageEntry('term', item.value),
			...normalized_recent_searches.value
				.filter((entry) => {
					if (item.type === 'product') {
						return entry.key !== `product:${item.value.id}`;
					}

					return !(entry.type === 'term' && normalizeSearchText(entry.value) === normalizeSearchText(item.value));
				})
				.map((entry) => {
					if (entry.type === 'product' && entry.item) {
						return createRecentSearchStorageEntry('product', mapSearchItemToStorageProduct(entry.item));
					}

					return createRecentSearchStorageEntry('term', entry.value);
				}),
		].slice(0, HEADER_MAX_RECENT_SEARCHES);

		setRecentSearchStorageEntries(next_entries);
	}

	async function syncRecentSearchesFromDatabase() {
		if (!is_authenticated.value) return;

		recent_search_loading.value = true;

		try {
			const response = await getRecentSearchedProducts();
			if (!response.success) return;

			const products = Array.isArray(response.data?.products)
				? response.data.products
				: [];
			const mapped_entries = products
				.map(mapRecentApiProductToStorageEntry)
				.filter((entry): entry is RecentSearchStorageEntry => Boolean(entry))
				.slice(0, HEADER_MAX_RECENT_SEARCHES);

			setRecentSearchStorageEntries(mapped_entries);
		} catch {
			// keep local state on failure
		} finally {
			recent_search_loading.value = false;
		}
	}

	async function focusSearchInput() {
		await nextTick();
		search_input_ref.value?.focus();
	}

	function setSearchModalRef(element: HTMLElement | null) {
		search_modal_ref.value = element;
	}

	function setSearchInputRef(element: HTMLInputElement | null) {
		search_input_ref.value = element;
	}

	function clearRecentSearches() {
		setRecentSearchStorageEntries([]);
		resetSearchNavigation();
	}

	function removeRecentSearch(entry_key: string) {
		const next_entries = normalized_recent_searches.value
			.filter((entry) => entry.key !== entry_key)
			.map((entry) => {
				if (entry.type === 'product' && entry.item) {
					return createRecentSearchStorageEntry('product', mapSearchItemToStorageProduct(entry.item));
				}

				return createRecentSearchStorageEntry('term', entry.value);
			});

		setRecentSearchStorageEntries(next_entries);
		resetSearchNavigation();
	}

	async function selectSearchResult(item: SearchItem) {
		if (is_authenticated.value) {
			const response = saveRecentSearchedProducts({
				product_id: item.product_id
			})
		}

		persistRecentSearch({
			type: 'product',
			value: item,
		});
		params.closeModal();
		await router.push(item.to);
	}

	async function applyRecentSearch(entry_key: string) {
		const entry = normalized_recent_searches.value.find(
			(candidate) => candidate.key === entry_key
		);
		if (!entry) return;

		if (entry.item) {
			await selectSearchResult(entry.item);
			return;
		}

		persistRecentSearch({
			type: 'term',
			value: entry.value,
		});

		clearSearchDebounceTimeout();
		search_query.value = entry.value;
		debounced_search_query.value = entry.value;
		resetSearchNavigation();
		await focusSearchInput();
	}

	function applySuggestedSearch() {
		const suggested_term = search_empty_suggested_term.value;
		persistRecentSearch({
			type: 'term',
			value: suggested_term,
		});

		clearSearchDebounceTimeout();
		search_query.value = suggested_term;
		debounced_search_query.value = suggested_term;
		resetSearchNavigation();
		void focusSearchInput();
	}

	function closeSearchModal() {
		params.closeModal();
	}

	async function fetchSearchResults(page: number, append = false) {
		const current_search_query = debounced_search_query.value.trim();
		if (!current_search_query) {
			search_loading.value = false;
			search_loading_more.value = false;
			clearSearchResults();
			return;
		}

		const current_request_id = search_request_id.value + 1;
		search_request_id.value = current_request_id;

		if (append) {
			search_loading_more.value = true;
		} else {
			search_loading.value = true;
		}

		try {
			const response = await searchProducts({
				query: current_search_query,
				page,
				per_page: search_page_size,
			});

			if (current_request_id !== search_request_id.value) return;

			const response_products = Array.isArray(response.data?.products)
				? response.data.products
				: [];
			const mapped_results = response_products
				.map(mapApiProductToSearchItem)
				.filter((item): item is SearchItem => Boolean(item));

			search_results.value = append
				? dedupeSearchItems([...search_results.value, ...mapped_results])
				: dedupeSearchItems(mapped_results);

			search_pagination.value = resolvePaginationMeta(
				response.meta as SearchApiMeta | null,
				page
			);
		} catch {
			if (current_request_id !== search_request_id.value) return;

			if (!append) {
				clearSearchResults();
			}
		} finally {
			const is_latest_request = current_request_id === search_request_id.value;
			if (is_latest_request) {
				search_loading.value = false;
				search_loading_more.value = false;
			}
		}
	}

	function handleSearchKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (!search_nav_items.value.length) return;

			active_search_nav_index.value = Math.min(
				active_search_nav_index.value + 1,
				search_nav_items.value.length - 1
			);
			return;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (!search_nav_items.value.length) return;

			active_search_nav_index.value =
				active_search_nav_index.value <= 0
					? 0
					: active_search_nav_index.value - 1;
			return;
		}

		if (event.key === 'Enter') {
			event.preventDefault();
			const target = search_nav_items.value[active_search_nav_index.value];
			if (!target) return;

			if (target.type === 'recent') {
				void applyRecentSearch(target.entry_key);
				return;
			}

			void selectSearchResult(target.item);
			return;
		}

		if (event.key === 'Escape') {
			event.preventDefault();
			closeSearchModal();
		}
	}

	function handleSearchResultsScroll(event: Event) {
		if (!can_load_more_results.value) return;

		const target = event.target as HTMLElement | null;
		if (!target) return;

		const scroll_position = target.scrollTop + target.clientHeight;
		const scroll_trigger_position = target.scrollHeight - search_result_scroll_threshold;
		if (scroll_position < scroll_trigger_position) return;

		void fetchSearchResults(search_pagination.value.current_page + 1, true);
	}

	watch(search_query, (value) => {
		clearSearchDebounceTimeout();
		resetSearchNavigation();
		search_request_id.value += 1;

		if (!value.trim()) {
			debounced_search_query.value = '';
			search_loading.value = false;
			search_loading_more.value = false;
			clearSearchResults();
			return;
		}

		search_loading.value = true;
		search_debounce_timeout = setTimeout(() => {
			debounced_search_query.value = value.trim();
		}, HEADER_SEARCH_DEBOUNCE_DELAY_MS);
	});

	watch(debounced_search_query, (value) => {
		if (!value.trim()) {
			search_loading.value = false;
			search_loading_more.value = false;
			clearSearchResults();
			return;
		}

		search_pagination.value = createEmptyPagination(search_page_size);
		void fetchSearchResults(1);
	});

	watch(is_authenticated, (next_state, previous_state) => {
		if (!next_state || previous_state === next_state) return;
		void syncRecentSearchesFromDatabase();
	});

	onMounted(() => {
		recent_search_storage_entries.value = loadRecentSearchesFromLocalStorage();
		void focusSearchInput();

		if (is_authenticated.value) {
			void syncRecentSearchesFromDatabase();
		}
	});

	onBeforeUnmount(() => {
		clearSearchDebounceTimeout();
	});

	return {
		search_query,
		search_loading: is_search_loading,
		search_loading_more,
		active_search_nav_index,
		search_result_groups,
		search_nav_index_by_result_id,
		recent_search_entries,
		search_empty_suggested_term,
		show_search_recent,
		show_search_no_recent,
		show_search_no_result,
		show_search_results,
		setSearchModalRef,
		setSearchInputRef,
		focusSearchInput,
		closeSearchModal,
		applySuggestedSearch,
		clearRecentSearches,
		applyRecentSearch,
		removeRecentSearch,
		selectSearchResult,
		handleSearchKeydown,
		handleSearchResultsScroll,
	};
}