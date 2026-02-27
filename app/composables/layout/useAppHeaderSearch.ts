import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { productCatalog, type ProductCategoryKey } from '~/data/products/catalog';
import {
    HEADER_MAX_RECENT_SEARCHES,
    HEADER_SEARCH_DEBOUNCE_DELAY_MS,
    HEADER_SEARCH_LOADING_MIN_VISIBLE_MS,
    headerSearchCategories,
} from '~/data/layout/header';
import { useCountry } from '~/composables/app/useCountry';

export type SearchItem = {
    id: string;
    categoryKey: ProductCategoryKey;
    categoryLabel: string;
    name: string;
    blurb: string;
    image: string;
    to: string;
};

type SearchNavItem =
    | {
          id: string;
          type: 'recent';
          term: string;
      }
    | {
          id: string;
          type: 'result';
          item: SearchItem;
      };

export function useAppHeaderSearch() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const { withCountry } = useCountry();
    const searchRecentTermsCookie = useCookie<string[]>('search_recent_terms', {
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

    const searchEmptySuggestedTerm = computed(() => t('layout.header.search.modal.suggestedTerm'));
    const trimmedSearchQuery = computed(() => searchQuery.value.trim());
    const trimmedDebouncedSearchQuery = computed(() =>
        debouncedSearchQuery.value.trim()
    );
    const hasSettledSearchQuery = computed(
        () =>
            trimmedDebouncedSearchQuery.value.length > 0 &&
            trimmedDebouncedSearchQuery.value === trimmedSearchQuery.value
    );
    const recentSearchTerms = computed(() => {
        const terms = Array.isArray(searchRecentTermsCookie.value)
            ? searchRecentTermsCookie.value
            : [];
        return terms
            .filter(
                (term): term is string =>
                    typeof term === 'string' && term.trim().length > 0
            )
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
            const haystack = `${item.name} ${item.blurb} ${item.categoryLabel}`.toLowerCase();
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
        recentSearchTerms.value.map((term) => {
            const matchedItem = matchSearchItemFromTerm(term);
            return { term, matchedItem };
        })
    );
    const showSearchRecent = computed(
        () =>
            !searchLoading.value &&
            trimmedSearchQuery.value.length === 0 &&
            recentSearchTerms.value.length > 0
    );
    const showSearchNoRecent = computed(
        () =>
            !searchLoading.value &&
            trimmedSearchQuery.value.length === 0 &&
            recentSearchTerms.value.length === 0
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
            return recentSearchTerms.value.map((term) => ({
                id: `recent:${term.toLowerCase()}`,
                type: 'recent' as const,
                term,
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
        const normalizedTerm = term.toLowerCase();
        return (
            searchItems.value.find(
                (item) =>
                    item.name.toLowerCase() === normalizedTerm ||
                    item.id.toLowerCase() === normalizedTerm
            ) ||
            searchItems.value.find((item) =>
                item.name.toLowerCase().includes(normalizedTerm)
            ) ||
            searchItems.value.find((item) =>
                normalizedTerm.includes(item.name.toLowerCase())
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
        if (/\bSticker$/i.test(name)) return name.replace(/\bSticker$/i, 'Stickers');
        if (/\bRoll$/i.test(name)) return name.replace(/\bRoll$/i, 'Rolls');
        if (/\bSheet$/i.test(name)) return name.replace(/\bSheet$/i, 'Sheets');
        if (/\bLettering$/i.test(name)) return `${name}s`;
        return name.endsWith('s') ? name : `${name}s`;
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

    function addRecentSearch(term: string) {
        const normalized = term.trim().replace(/\s+/g, ' ');
        if (!normalized) return;

        const current = recentSearchTerms.value.filter(
            (item) => item.toLowerCase() !== normalized.toLowerCase()
        );
        searchRecentTermsCookie.value = [normalized, ...current].slice(
            0,
            HEADER_MAX_RECENT_SEARCHES
        );
    }

    function applyRecentSearch(term: string) {
        const matchedItem = matchSearchItemFromTerm(term);
        if (matchedItem) {
            selectSearchResult(matchedItem);
            return;
        }

        searchQuery.value = term;
        nextTick(() => {
            searchInputRef.value?.focus();
        });
    }

    function removeRecentSearch(term: string) {
        searchRecentTermsCookie.value = recentSearchTerms.value.filter(
            (item) => item.toLowerCase() !== term.toLowerCase()
        );
    }

    function clearRecentSearches() {
        searchRecentTermsCookie.value = [];
    }

    function selectSearchResult(item: SearchItem) {
        addRecentSearch(item.name);
        closeSearchModal();
        void router.push(item.to);
    }

    function applySearchKeyboardSelection(item: SearchNavItem) {
        if (item.type === 'recent') {
            applyRecentSearch(item.term);
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
