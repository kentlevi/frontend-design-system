<script setup lang="ts">
import AppHeaderMainBar from '~/components/layout/app-header/AppHeaderMainBar.vue';
import { useAppHeaderAccount } from '~/composables/layout/useAppHeaderAccount';
import { useAppHeaderKeyboardShortcuts } from '~/composables/layout/useAppHeaderKeyboardShortcuts';
import { useAppHeaderSearch } from '~/composables/layout/useAppHeaderSearch';
import type { ProductItem } from '~/data/products/catalog';
import { productCatalog } from '~/data/products/catalog';
import { defineAsyncComponent, onBeforeUnmount, onMounted } from 'vue';

const AppHeaderLocaleModal = defineAsyncComponent(
    () => import('~/components/layout/app-header/AppHeaderLocaleModal.vue')
);
const AppHeaderSearchModal = defineAsyncComponent(
    () => import('~/components/layout/app-header/AppHeaderSearchModal.vue')
);
const CartPreview = defineAsyncComponent(
    () => import('~/components/cart/CartPreview.vue')
);
const { locale } = useI18n();
const { t } = useI18n();

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

const cartSelectedProduct = computed<ProductItem | null>(() => null);
const cartArtworkPreviewUrl = computed(() => '');
const cartArtworkName = computed(() => '');
const cartSelectedSizeLabel = computed(() => '-');
const cartSelectedQty = computed(() => 0);
const cartTotal = computed(() => 0);
const cartItemCount = computed(() => 0);
let idlePrefetchTimer: ReturnType<typeof setTimeout> | null = null;
let idlePrefetchHandle: number | null = null;
const prefetchedHeaderOverlays = ref(false);

function getCartProductName(product: ProductItem) {
    return t(`product.items.${product.id}.name`);
}

function formatCartPrice(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(value);
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

onBeforeUnmount(() => {
    if (typeof window === 'undefined') return;

    if (idlePrefetchHandle !== null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idlePrefetchHandle);
    }

    if (idlePrefetchTimer) {
        clearTimeout(idlePrefetchTimer);
    }
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
            :selected-product="cartSelectedProduct"
            :artwork-preview-url="cartArtworkPreviewUrl"
            :cart-artwork-name="cartArtworkName"
            :selected-size-label="cartSelectedSizeLabel"
            :selected-qty="cartSelectedQty"
            :total="cartTotal"
            :featured-open="cartFeaturedOpen"
            :featured-items="cartFeaturedItems"
            :get-product-name="getCartProductName"
            :format-price="formatCartPrice"
            :featured-start-price="cartFeaturedStartPrice"
            @close="closeCartPreview"
            @close-featured="closeCartFeatured"
        />
    </header>
</template>

<style scoped lang="scss">
.home-header {
    background: var(--brand-primary);
}
</style>


