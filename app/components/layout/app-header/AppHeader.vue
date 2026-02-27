<script setup lang="ts">
import AppHeaderMainBar from '~/components/layout/app-header/AppHeaderMainBar.vue';
import { useAppHeaderAccount } from '~/composables/layout/useAppHeaderAccount';
import { useAppHeaderKeyboardShortcuts } from '~/composables/layout/useAppHeaderKeyboardShortcuts';
import { useAppHeaderSearch } from '~/composables/layout/useAppHeaderSearch';
import { CART_STORAGE_KEY, CART_UPDATED_EVENT } from '~/data/cart/page';
import { quantityOptions, sizeOptions } from '~/data/products/categoryExperience';
import type { ProductItem } from '~/data/products/catalog';
import { productCatalog } from '~/data/products/catalog';
import { useCountry } from '~/composables/app/useCountry';
import { formatCurrencyByCountry } from '~/utils/currency';
import { defineAsyncComponent, onBeforeUnmount, onMounted, watch } from 'vue';

const AppHeaderLocaleModal = defineAsyncComponent(
    () => import('~/components/layout/app-header/AppHeaderLocaleModal.vue')
);
const AppHeaderSearchModal = defineAsyncComponent(
    () => import('~/components/layout/app-header/AppHeaderSearchModal.vue')
);
const CartPreview = defineAsyncComponent(
    () => import('~/components/cart/CartPreview.vue')
);
const { locale, t } = useI18n();
const { country } = useCountry();

type StoredCartState = {
    id: string;
    category: string;
    productId: string;
    sizeKey: string;
    qty: number;
    total: number;
    artworkName: string;
    artworkPreviewUrl?: string;
};

const {
    accountOpen,
    accountMenuRef,
    localeModalOpen,
    navLinks,
    selectedLocale,
    localeOptions,
    accountLinks,
    isMockLoggedIn,
    userInitial,
    displayName,
    displayEmail,
    accountTransitionName,
    isNavLinkActive,
    toggleAccountMenu,
    closeAccountMenu,
    onAccountMouseEnter,
    onAccountMouseLeave,
    openLocaleModal: openLocaleModalBase,
    closeLocaleModal,
    selectLocale,
    logoutMock,
} = useAppHeaderAccount();

const {
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
    openSearchModal: openSearchModalBase,
    applySuggestedSearch,
    clearRecentSearches,
    applyRecentSearch,
    removeRecentSearch,
    selectSearchResult,
    highlightSearchMatch,
    handleSearchKeydown,
} = useAppHeaderSearch();

const cartPreviewOpen = ref(false);
const cartFeaturedOpen = ref(true);
const cartFeaturedItems = computed(() => productCatalog.stickers.products.slice(0, 3));
const cartState = ref<StoredCartState[]>([]);
let bodyOverflowBeforeCartLock = '';
let cartBodyScrollLocked = false;

const cartItems = computed(() =>
    cartState.value
        .map((entry) => {
            for (const category of Object.values(productCatalog)) {
                const product = category.products.find((item) => item.id === entry.productId);
                if (product) {
                    return {
                        id: entry.id,
                        product,
                        sizeKey: entry.sizeKey,
                        sizeLabel: t(`product.sizes.${entry.sizeKey}.label`),
                        qty: entry.qty,
                        total: entry.total,
                        artworkName: entry.artworkName,
                        artworkPreviewUrl: entry.artworkPreviewUrl || '',
                    };
                }
            }
            return null;
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
);
const cartGrandTotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.total, 0)
);
const cartItemCount = computed(() => cartItems.value.length);
const cartSizeOptionModels = computed(() =>
    sizeOptions.map((size) => {
        const label = t(`product.sizes.${size}.label`);
        const [name, ...rest] = label.split(' ');
        return {
            key: size,
            name,
            dim: rest.join(' '),
        };
    })
);
let idlePrefetchTimer: ReturnType<typeof setTimeout> | null = null;
let idlePrefetchHandle: number | null = null;
const prefetchedHeaderOverlays = ref(false);

function getCartProductName(product: ProductItem) {
    return t(`product.items.${product.id}.name`);
}

function formatCartPrice(value: number) {
    return formatCurrencyByCountry(value, country.value);
}

function cartFeaturedStartPrice() {
    return formatCartPrice(29.74);
}

async function prefetchHeaderOverlayModules() {
    if (prefetchedHeaderOverlays.value) return;

    prefetchedHeaderOverlays.value = true;
    await Promise.allSettled([
        import('~/components/layout/app-header/AppHeaderLocaleModal.vue'),
        import('~/components/layout/app-header/AppHeaderSearchModal.vue'),
        import('~/components/cart/CartPreview.vue'),
    ]);
}

function setAccountMenuRef(el: HTMLElement | null) {
    accountMenuRef.value = el;
}

function openLocaleModal() {
    void prefetchHeaderOverlayModules();
    closeSearchModal();
    closeCartPreview();
    openLocaleModalBase();
}

function openSearchModal() {
    void prefetchHeaderOverlayModules();
    closeAccountMenu();
    closeLocaleModal();
    closeCartPreview();
    openSearchModalBase();
}

function openCartPreview() {
    void prefetchHeaderOverlayModules();
    closeAccountMenu();
    closeLocaleModal();
    closeSearchModal();
    cartFeaturedOpen.value = true;
    cartPreviewOpen.value = true;
}

function closeCartPreview() {
    cartPreviewOpen.value = false;
}

function closeCartFeatured() {
    cartFeaturedOpen.value = false;
}

function setCartBodyScrollLock(locked: boolean) {
    if (typeof document === 'undefined') return;

    if (locked) {
        if (cartBodyScrollLocked) return;
        bodyOverflowBeforeCartLock = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        cartBodyScrollLocked = true;
        return;
    }

    if (!cartBodyScrollLocked) return;
    document.body.style.overflow = bodyOverflowBeforeCartLock;
    cartBodyScrollLocked = false;
}

function isPlainItem(item: StoredCartState) {
    return !item.artworkName && !item.artworkPreviewUrl;
}

function mergePlainCartItems(items: StoredCartState[]) {
    const merged: StoredCartState[] = [];
    const plainIndexByKey = new Map<string, number>();

    for (const item of items) {
        if (!isPlainItem(item)) {
            merged.push(item);
            continue;
        }

        const key = `${item.category}::${item.productId}::${item.sizeKey}`;
        const existingIndex = plainIndexByKey.get(key);
        if (existingIndex === undefined) {
            plainIndexByKey.set(key, merged.length);
            merged.push(item);
            continue;
        }

        const existing = merged[existingIndex];
        merged[existingIndex] = {
            ...existing,
            qty: existing.qty + item.qty,
            total: existing.total + item.total,
        };
    }

    return merged;
}

function syncCartFromStorage() {
    if (typeof window === 'undefined') return;
    try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) {
            cartState.value = [];
            return;
        }
        const parsed = JSON.parse(raw) as StoredCartState | StoredCartState[];
        if (Array.isArray(parsed)) {
            cartState.value = mergePlainCartItems(
                parsed.filter((item) => Boolean(item?.productId))
            );
            return;
        }
        cartState.value = parsed?.productId ? mergePlainCartItems([parsed]) : [];
    } catch {
        cartState.value = [];
    }
}

function writeCartStateToStorage(next: StoredCartState[]) {
    if (typeof window === 'undefined') return;
    if (next.length) {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
    } else {
        window.localStorage.removeItem(CART_STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

function removeCartItem(itemId: string) {
    const nextState = cartState.value.filter((item) => item.id !== itemId);
    cartState.value = nextState;
    writeCartStateToStorage(nextState);
}

function updateCartItem(itemId: string, nextSizeKey: string, nextQty: number) {
    const qty = Number(nextQty);
    if (!Number.isFinite(qty) || qty <= 0) return;

    const normalizedSizeKey = sizeOptions.includes(
        nextSizeKey as (typeof sizeOptions)[number]
    )
        ? nextSizeKey
        : sizeOptions[0];

    const nextState = mergePlainCartItems(
        cartState.value.map((item) => {
            if (item.id !== itemId) return item;
            const unitPrice = item.qty > 0 ? item.total / item.qty : 0;
            return {
                ...item,
                sizeKey: normalizedSizeKey,
                qty,
                total: unitPrice * qty,
            };
        })
    );

    cartState.value = nextState;
    writeCartStateToStorage(nextState);
}

function handleStorage(event: StorageEvent) {
    if (event.key && event.key !== CART_STORAGE_KEY) return;
    syncCartFromStorage();
}

useAppHeaderKeyboardShortcuts({
    handleSearchKeydown,
    isSearchModalOpen: () => searchModalOpen.value,
    isLocaleModalOpen: () => localeModalOpen.value,
    closeSearchModal,
    closeLocaleModal,
    closeAccountMenu,
    openSearchModal,
});

onMounted(() => {
    if (typeof window === 'undefined') return;
    syncCartFromStorage();
    window.addEventListener('storage', handleStorage);
    window.addEventListener(
        CART_UPDATED_EVENT,
        syncCartFromStorage as EventListener
    );

    if ('requestIdleCallback' in window) {
        idlePrefetchHandle = window.requestIdleCallback(() => {
            void prefetchHeaderOverlayModules();
        });
        return;
    }

    idlePrefetchTimer = setTimeout(() => {
        void prefetchHeaderOverlayModules();
    }, 1200);
});

watch(
    () => cartPreviewOpen.value,
    (isOpen) => {
        setCartBodyScrollLock(isOpen);
    }
);

onBeforeUnmount(() => {
    if (typeof window === 'undefined') return;
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(
        CART_UPDATED_EVENT,
        syncCartFromStorage as EventListener
    );

    if (idlePrefetchHandle !== null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idlePrefetchHandle);
    }

    if (idlePrefetchTimer) {
        clearTimeout(idlePrefetchTimer);
    }

    setCartBodyScrollLock(false);
});
</script>

<template>
    <header class="home-header" data-testid="app-header">
        <AppHeaderMainBar
            :nav-links="navLinks"
            :is-nav-link-active="isNavLinkActive"
            :selected-locale="selectedLocale"
            :is-mock-logged-in="isMockLoggedIn"
            :account-open="accountOpen"
            :user-initial="userInitial"
            :display-name="displayName"
            :display-email="displayEmail"
            :account-transition-name="accountTransitionName"
            :account-links="accountLinks"
            :cart-item-count="cartItemCount"
            :set-account-menu-ref="setAccountMenuRef"
            @open-locale="openLocaleModal"
            @open-search="openSearchModal"
            @open-cart="openCartPreview"
            @prefetch-locale="prefetchHeaderOverlayModules"
            @prefetch-search="prefetchHeaderOverlayModules"
            @prefetch-cart="prefetchHeaderOverlayModules"
            @toggle-account="toggleAccountMenu"
            @close-account="closeAccountMenu"
            @account-mouse-enter="onAccountMouseEnter"
            @account-mouse-leave="onAccountMouseLeave"
            @logout="logoutMock"
            data-testid="app-header-main-bar"
        />

        <AppHeaderLocaleModal
            v-if="localeModalOpen"
            :open="localeModalOpen"
            :locale-value="locale"
            :locale-options="localeOptions"
            @close="closeLocaleModal"
            @select="selectLocale"
            data-testid="app-header-locale-modal"
        />

        <AppHeaderSearchModal
            v-if="searchModalOpen"
            :open="searchModalOpen"
            :search-query="searchQuery"
            :search-loading="searchLoading"
            :show-search-recent="showSearchRecent"
            :show-search-no-recent="showSearchNoRecent"
            :show-search-no-result="showSearchNoResult"
            :show-search-results="showSearchResults"
            :recent-search-entries="recentSearchEntries"
            :active-search-nav-index="activeSearchNavIndex"
            :search-result-groups="searchResultGroups"
            :search-nav-index-by-result-id="searchNavIndexByResultId"
            :search-empty-suggested-term="searchEmptySuggestedTerm"
            :highlight-search-match="highlightSearchMatch"
            :set-modal-ref="setSearchModalRef"
            :set-input-ref="setSearchInputRef"
            @close="closeSearchModal"
            @update:search-query="searchQuery = $event"
            @focus-input="focusSearchInput"
            @clear-recent="clearRecentSearches"
            @apply-recent="applyRecentSearch"
            @remove-recent="removeRecentSearch"
            @apply-suggested="applySuggestedSearch"
            @select-result="selectSearchResult"
            data-testid="app-header-search-modal"
        />

        <CartPreview
            :open="cartPreviewOpen"
            :cart-item-count="cartItemCount"
            :cart-items="cartItems"
            :size-option-models="cartSizeOptionModels"
            :quantity-options="quantityOptions"
            :grand-total="cartGrandTotal"
            :featured-open="cartFeaturedOpen"
            :featured-items="cartFeaturedItems"
            :get-product-name="getCartProductName"
            :format-price="formatCartPrice"
            :featured-start-price="cartFeaturedStartPrice"
            @close="closeCartPreview"
            @update-item="updateCartItem($event.itemId, $event.sizeKey, $event.qty)"
            @remove-item="removeCartItem($event)"
            @close-featured="closeCartFeatured"
        />
    </header>
</template>

<style scoped lang="scss">
.home-header {
    background: var(--brand-primary);
}
</style>


