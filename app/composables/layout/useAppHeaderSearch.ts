import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { productCatalog, type ProductCategoryKey } from '~/data/products/catalog';
import {
	HEADER_MAX_RECENT_SEARCHES,
	HEADER_SEARCH_DEBOUNCE_DELAY_MS,
	HEADER_SEARCH_LOADING_MIN_VISIBLE_MS,
	headerSearchCategories,
} from '~/data/layout/header';
import { useCountry } from '~/composables/app/useCountry';
import enProductMessages from '../../../i18n/locales/en/product/products.json';
import krProductMessages from '../../../i18n/locales/kr/product/products.json';

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

type ProductLocaleMessages = {
	product: {
		items: Record<
			string,
			{
				name: string;
			}
		>;
	};
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

export function useAppHeaderSearch() {
	const { t } = useI18n();
	const route = useRoute();
	const router = useRouter();
	const { withCountry } = useCountry();
	const searchRecentTermsCookie = useCookie<RecentSearchCookieEntry[]>('search_recent_terms', {
		default: () => [],
		sameSite: 'lax',
		path: '/',
	});

	const searchModalOpen = ref(false);
	const searchQuery = ref('');
	const debouncedSearchQuery = ref('');
	const searchLoading = ref(false);
	const searchInputRef = ref<HTMLInputElement | null>(null);
	const searchModalRef = ref<HTMLElement | null>(null);
	const activeSearchNavIndex = ref(-1);

	function toSafeTrimmedString(value: unknown) {
		return typeof value === 'string' ? value.trim() : '';
	}

	function toNormalizedWhitespace(value: unknown) {
		return toSafeTrimmedString(value).replace(/\s+/g, ' ');
	}

	const searchEmptySuggestedTerm = computed(() => t('layout.header.search.modal.suggestedTerm'));
	const trimmedSearchQuery = computed(() => toSafeTrimmedString(searchQuery.value));
	const trimmedDebouncedSearchQuery = computed(() =>
		toSafeTrimmedString(debouncedSearchQuery.value)
	);
	const hasSettledSearchQuery = computed(
		() =>
			trimmedDebouncedSearchQuery.value.length > 0 &&
            trimmedDebouncedSearchQuery.value === trimmedSearchQuery.value
	);
	const recentSearchEntriesRaw = computed<RecentSearchRecord[]>(() => {
		const entries = Array.isArray(searchRecentTermsCookie.value)
			? searchRecentTermsCookie.value
			: [];
		const seenKeys = new Set<string>();
		return entries
			.map((entry) => {
				if (typeof entry === 'string') {
					const normalized = toNormalizedWhitespace(entry);
					if (!normalized) return null;
					const inferredProductId = inferLegacyRecentProductId(normalized);

					return inferredProductId
						? {
							key: `product:${inferredProductId}`,
							type: 'product' as const,
							value: inferredProductId,
						}
						: {
							key: `term:${normalizeSearchValue(normalized)}`,
							type: 'term' as const,
							value: normalized,
						};
				}

				if (!entry || typeof entry !== 'object') return null;
				const value = toNormalizedWhitespace(entry.value);
				if (!value) return null;

				const inferredProductId =
					entry.type === 'product' ? value : inferLegacyRecentProductId(value);
				if (inferredProductId) {
					return {
						key: `product:${inferredProductId}`,
						type: 'product' as const,
						value: inferredProductId,
					};
				}

				return {
					key: `term:${normalizeSearchValue(value)}`,
					type: 'term' as const,
					value,
				};
			})
			.filter((entry): entry is RecentSearchRecord => {
				if (!entry) return false;
				if (seenKeys.has(entry.key)) return false;
				seenKeys.add(entry.key);
				return true;
			})
			.slice(0, HEADER_MAX_RECENT_SEARCHES);
	});

	const searchItems = computed<SearchItem[]>(() =>
		headerSearchCategories.flatMap((categoryKey) =>
			productCatalog[categoryKey].products.map((product) => {
				const productSlug =
					categoryKey === 'stickers'
						? product.id.replace(/-sticker$/, '')
						: product.id;
				return {
					id: product.id,
					categoryKey,
					categoryLabel:
                        categoryKey === 'stickers'
                        	? t('layout.header.nav.stickers')
                        	: categoryKey === 'roll-stickers'
                        		? t('layout.header.nav.rollStickers')
                        		: t('layout.header.nav.sheetStickers'),
					name: toSearchDisplayName(t(`product.items.${product.id}.name`)),
					blurb: t(`product.items.${product.id}.blurb`),
					image: product.image,
					to: withCountry(`/${categoryKey}/${productSlug}`),
				};
			})
		)
	);

	const filteredSearchItems = computed(() => {
		const term = trimmedDebouncedSearchQuery.value.toLowerCase();
		if (!term || searchLoading.value) return [];
		return searchItems.value.filter((item) => {
			const haystack = `${item.name} ${item.blurb}`.toLowerCase();
			return haystack.includes(term);
		});
	});

	const searchResultGroups = computed(() => {
		const groups = new Map<ProductCategoryKey, SearchItem[]>();
		for (const item of filteredSearchItems.value) {
			const current = groups.get(item.categoryKey) || [];
			current.push(item);
			groups.set(item.categoryKey, current);
		}
		return Array.from(groups.entries()).map(([key, items]) => ({
			key,
			label: items[0]?.categoryLabel || '',
			items,
		}));
	});

	const recentSearchEntries = computed(() =>
		recentSearchEntriesRaw.value.map((entry) => {
			const matchedItem =
				entry.type === 'product'
					? searchItems.value.find((item) => item.id === entry.value) || null
					: matchSearchItemFromTerm(entry.value);
			return { key: entry.key, term: entry.value, matchedItem };
		})
	);
	const showSearchRecent = computed(
		() =>
			!searchLoading.value &&
            trimmedSearchQuery.value.length === 0 &&
            recentSearchEntriesRaw.value.length > 0
	);
	const showSearchNoRecent = computed(
		() =>
			!searchLoading.value &&
            trimmedSearchQuery.value.length === 0 &&
            recentSearchEntriesRaw.value.length === 0
	);
	const showSearchNoResult = computed(
		() =>
			!searchLoading.value &&
            hasSettledSearchQuery.value &&
            filteredSearchItems.value.length === 0
	);
	const showSearchResults = computed(
		() =>
			!searchLoading.value &&
            hasSettledSearchQuery.value &&
            filteredSearchItems.value.length > 0
	);

	const searchNavItems = computed<SearchNavItem[]>(() => {
		if (showSearchRecent.value) {
			return recentSearchEntriesRaw.value.map((entry) => ({
				id: `recent:${entry.key}`,
				type: 'recent' as const,
				entryKey: entry.key,
			}));
		}

		if (showSearchResults.value) {
			return filteredSearchItems.value.map((item) => ({
				id: `result:${item.id}`,
				type: 'result' as const,
				item,
			}));
		}

		return [];
	});

	const searchNavIndexByResultId = computed<Record<string, number>>(() =>
		searchNavItems.value.reduce<Record<string, number>>((acc, navItem, index) => {
			if (navItem.type === 'result') {
				acc[navItem.item.id] = index;
			}
			return acc;
		}, {})
	);

	let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	let searchLoadingHideTimer: ReturnType<typeof setTimeout> | null = null;
	let searchLoadingShownAt = 0;
	let bodyOverflowBeforeSearchLock = '';

	function setSearchModalRef(el: HTMLElement | null) {
		searchModalRef.value = el;
	}

	function setSearchInputRef(el: HTMLInputElement | null) {
		searchInputRef.value = el;
	}

	function focusSearchInput() {
		searchInputRef.value?.focus();
	}

	function clearSearchTimers() {
		if (searchDebounceTimer) {
			clearTimeout(searchDebounceTimer);
			searchDebounceTimer = null;
		}
		if (searchLoadingHideTimer) {
			clearTimeout(searchLoadingHideTimer);
			searchLoadingHideTimer = null;
		}
	}

	function resetSearchState() {
		searchQuery.value = '';
		debouncedSearchQuery.value = '';
		searchLoading.value = false;
		clearSearchTimers();
		searchLoadingShownAt = 0;
	}

	function completeSearchLoading() {
		const elapsedSinceShown = searchLoadingShownAt
			? Date.now() - searchLoadingShownAt
			: 0;
		const remainingVisibleTime =
			HEADER_SEARCH_LOADING_MIN_VISIBLE_MS - elapsedSinceShown;

		if (searchLoading.value && remainingVisibleTime > 0) {
			searchLoadingHideTimer = setTimeout(() => {
				searchLoading.value = false;
				searchLoadingHideTimer = null;
				searchLoadingShownAt = 0;
			}, remainingVisibleTime);
			return;
		}

		searchLoading.value = false;
		searchLoadingShownAt = 0;
	}

	function matchSearchItemFromTerm(term: string): SearchItem | null {
		const inferredProductId = inferLegacyRecentProductId(term);
		if (inferredProductId) {
			return searchItems.value.find((item) => item.id === inferredProductId) || null;
		}

		const normalizedTerm = normalizeSearchValue(term);
		return (
			searchItems.value.find(
				(item) =>
					normalizeSearchValue(item.name) === normalizedTerm ||
                    normalizeSearchValue(item.id) === normalizedTerm
			) ||
            searchItems.value.find((item) =>
            	normalizeSearchValue(item.name).includes(normalizedTerm)
            ) ||
            searchItems.value.find((item) =>
            	normalizedTerm.includes(normalizeSearchValue(item.name))
            ) ||
            null
		);
	}

	function escapeHtml(value: string) {
		return value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function highlightSearchMatch(value: string) {
		const escapedValue = escapeHtml(value);
		const term = debouncedSearchQuery.value;
		if (!term) return escapedValue;

		const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const matcher = new RegExp(`(${escapedTerm})`, 'ig');
		return escapedValue.replace(matcher, '<mark>$1</mark>');
	}

	function toSearchDisplayName(name: string) {
		if (!/[A-Za-z]/.test(name)) return name;
		if (/\bSticker$/i.test(name)) return name.replace(/\bSticker$/i, 'Stickers');
		if (/\bRoll$/i.test(name)) return name.replace(/\bRoll$/i, 'Rolls');
		if (/\bSheet$/i.test(name)) return name.replace(/\bSheet$/i, 'Sheets');
		if (/\bLettering$/i.test(name)) return `${name}s`;
		return name.endsWith('s') ? name : `${name}s`;
	}

	function normalizeSearchValue(value: unknown) {
		return toSafeTrimmedString(value)
			.toLowerCase()
			.replace(/\s+/g, ' ')
			.replace(/s$/, '');
	}

	function inferLegacyRecentProductId(term: unknown) {
		const normalizedTerm = normalizeSearchValue(term);
		if (!normalizedTerm) return null;

		const localeMessages = [
			enProductMessages as ProductLocaleMessages,
			krProductMessages as ProductLocaleMessages,
		];

		for (const category of Object.values(productCatalog)) {
			for (const product of category.products) {
				const aliases = new Set<string>([
					normalizeSearchValue(product.id),
					normalizeSearchValue(product.name),
					normalizeSearchValue(toSearchDisplayName(product.name)),
				]);

				for (const messages of localeMessages) {
					const localizedName = messages.product.items[product.id]?.name;
					if (!localizedName) continue;
					aliases.add(normalizeSearchValue(localizedName));
					aliases.add(normalizeSearchValue(toSearchDisplayName(localizedName)));
				}

				if (aliases.has(normalizedTerm)) {
					return product.id;
				}
			}
		}

		return null;
	}

	function openSearchModal() {
		resetSearchState();
		searchModalOpen.value = true;
		nextTick(() => {
			searchInputRef.value?.focus();
		});
	}

	function closeSearchModal() {
		searchModalOpen.value = false;
		resetSearchState();
	}

	function applySuggestedSearch() {
		searchQuery.value = searchEmptySuggestedTerm.value;
	}

	function addRecentProductSearch(item: SearchItem) {
		const current = recentSearchEntriesRaw.value.filter(
			(entry) => !(entry.type === 'product' && entry.value === item.id)
		);
		searchRecentTermsCookie.value = [
			createRecentSearchCookieEntry('product', item.id),
			...current.map((entry) => createRecentSearchCookieEntry(entry.type, entry.value)),
		].slice(0, HEADER_MAX_RECENT_SEARCHES);
	}

	function applyRecentSearch(entryKey: string) {
		const entry = recentSearchEntriesRaw.value.find((item) => item.key === entryKey);
		if (!entry) return;

		const matchedItem =
			entry.type === 'product'
				? searchItems.value.find((item) => item.id === entry.value) || null
				: matchSearchItemFromTerm(entry.value);
		if (matchedItem) {
			selectSearchResult(matchedItem);
			return;
		}

		searchQuery.value = entry.value;
		nextTick(() => {
			searchInputRef.value?.focus();
		});
	}

	function removeRecentSearch(entryKey: string) {
		searchRecentTermsCookie.value = recentSearchEntriesRaw.value
			.filter((item) => item.key !== entryKey)
			.map((item) => createRecentSearchCookieEntry(item.type, item.value));
	}

	function clearRecentSearches() {
		searchRecentTermsCookie.value = [];
	}

	function selectSearchResult(item: SearchItem) {
		addRecentProductSearch(item);
		closeSearchModal();
		void router.push(item.to);
	}

	function applySearchKeyboardSelection(item: SearchNavItem) {
		if (item.type === 'recent') {
			applyRecentSearch(item.entryKey);
			return;
		}
		selectSearchResult(item.item);
	}

	function syncActiveSearchItemIntoView() {
		nextTick(() => {
			const modal = searchModalRef.value;
			if (!modal || activeSearchNavIndex.value < 0) return;
			const activeItem = modal.querySelector<HTMLElement>(
				`[data-search-nav-index="${activeSearchNavIndex.value}"]`
			);
			activeItem?.scrollIntoView({ block: 'nearest' });
		});
	}

	function moveSearchSelection(direction: 1 | -1) {
		const total = searchNavItems.value.length;
		if (!total) return;

		if (activeSearchNavIndex.value < 0) {
			activeSearchNavIndex.value = direction > 0 ? 0 : total - 1;
		} else {
			activeSearchNavIndex.value =
				(activeSearchNavIndex.value + direction + total) % total;
		}

		syncActiveSearchItemIntoView();
	}

	function handleSearchKeydown(event: KeyboardEvent) {
		if (
			!searchModalOpen.value ||
            (event.key !== 'ArrowDown' &&
                event.key !== 'ArrowUp' &&
                event.key !== 'Enter')
		) {
			return false;
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			moveSearchSelection(1);
			return true;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			moveSearchSelection(-1);
			return true;
		}

		const index = activeSearchNavIndex.value < 0 ? 0 : activeSearchNavIndex.value;
		const activeItem = searchNavItems.value[index];
		if (activeItem) {
			event.preventDefault();
			applySearchKeyboardSelection(activeItem);
			return true;
		}

		return false;
	}

	function setSearchBodyScrollLock(locked: boolean) {
		if (typeof document === 'undefined') return;

		if (locked) {
			bodyOverflowBeforeSearchLock = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return;
		}

		document.body.style.overflow = bodyOverflowBeforeSearchLock;
	}

	watch(
		() => route.fullPath,
		() => {
			closeSearchModal();
		}
	);

	watch(
		() => trimmedSearchQuery.value,
		(value) => {
			clearSearchTimers();

			if (!value) {
				debouncedSearchQuery.value = '';
				searchLoading.value = false;
				searchLoadingShownAt = 0;
				return;
			}
			if (!searchLoading.value) {
				searchLoading.value = true;
				searchLoadingShownAt = Date.now();
			}

			searchDebounceTimer = setTimeout(() => {
				debouncedSearchQuery.value = value;
				completeSearchLoading();
				searchDebounceTimer = null;
			}, HEADER_SEARCH_DEBOUNCE_DELAY_MS);
		}
	);

	watch(
		() => searchModalOpen.value,
		(isOpen) => {
			setSearchBodyScrollLock(isOpen);
			activeSearchNavIndex.value = -1;
		}
	);

	watch(
		() => searchNavItems.value.length,
		() => {
			activeSearchNavIndex.value = -1;
		}
	);

	onBeforeUnmount(() => {
		setSearchBodyScrollLock(false);
		clearSearchTimers();
	});

	return {
		searchModalOpen,
		searchQuery,
		searchLoading,
		activeSearchNavIndex,
		searchResultGroups,
		searchNavIndexByResultId,
		recentSearchEntries,
		searchEmptySuggestedTerm,
		showSearchRecent,
		showSearchNoRecent,
		showSearchNoResult,
		showSearchResults,
		setSearchModalRef,
		setSearchInputRef,
		focusSearchInput,
		closeSearchModal,
		openSearchModal,
		applySuggestedSearch,
		clearRecentSearches,
		applyRecentSearch,
		removeRecentSearch,
		selectSearchResult,
		highlightSearchMatch,
		handleSearchKeydown,
	};
}