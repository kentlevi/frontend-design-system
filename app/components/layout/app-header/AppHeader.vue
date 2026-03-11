<script setup lang="ts">
import AppHeaderMainBar from '~/components/layout/app-header/AppHeaderMainBar.vue';
import AppHeaderSearchModal from '~/components/layout/app-header/AppHeaderSearchModal.vue';
import { useAppHeaderAccount } from '~/composables/layout/appHeader/useAppHeaderAccount';
import { useAppHeaderCartPreview } from '~/composables/layout/appHeader/useAppHeaderCartPreview';
import { useAppHeaderKeyboardShortcuts } from '~/composables/layout/appHeader/useAppHeaderKeyboardShortcuts';
import { useAppHeaderSearch } from '~/composables/layout/appHeader/useAppHeaderSearch';
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const AppHeaderLocaleModal = defineAsyncComponent(
	() => import('~/components/layout/app-header/AppHeaderLocaleModal.vue')
);
const CartPreview = defineAsyncComponent(
	() => import('~/components/cart/CartPreview.vue')
);
const {
	accountOpen,
	accountMenuRef,
	localeModalOpen,
	navLinks,
	selectedLocale,
	localeOptions,
	accountLinks,
	isMockLoggedIn,
	isGuestLoggedIn,
	userInitial,
	userAvatarUrl,
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
	applySuggestedSearch,
	clearRecentSearches,
	applyRecentSearch,
	removeRecentSearch,
	selectSearchResult,
	highlightSearchMatch,
	handleSearchKeydown,
} = useAppHeaderSearch();

const {
	cartPreviewOpen,
	cartFeaturedOpen,
	cartFeaturedItems,
	cartItems,
	cartGrandTotal,
	cartItemCount,
	cartSizeOptionModels,
	cartQuantityOptions,
	getCartProductName,
	formatCartPrice,
	cartFeaturedStartPrice,
	openCartPreview: openCartPreviewBase,
	closeCartPreview,
	closeCartFeatured,
	removeCartItem,
	updateCartItem,
} = useAppHeaderCartPreview({
	closeAccountMenu,
	closeLocaleModal,
	closeSearchModal,
});
let bodyOverflowBeforeCartLock = '';
let cartBodyScrollLocked = false;
let idlePrefetchTimer: ReturnType<typeof setTimeout> | null = null;
let idlePrefetchHandle: number | null = null;
const prefetchedHeaderOverlays = ref(false);
const shouldLockBodyScroll = computed(
	() => cartPreviewOpen.value || searchModalOpen.value
);

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

async function openSearchModal() {
	void prefetchHeaderOverlayModules();
	closeAccountMenu();
	closeLocaleModal();
	closeCartPreview();
	searchModalOpen.value = true;
	await focusSearchInput();
}

function openCartPreview() {
	void prefetchHeaderOverlayModules();
	openCartPreviewBase();
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

watch(shouldLockBodyScroll, (should_lock) => {
	setCartBodyScrollLock(should_lock);
});

onBeforeUnmount(() => {
	if (typeof window === 'undefined') return;

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
			:is-guest-logged-in="isGuestLoggedIn"
			:account-open="accountOpen"
			:user-initial="userInitial"
			:user-avatar-url="userAvatarUrl"
			:display-name="displayName"
			:display-email="displayEmail"
			:account-transition-name="accountTransitionName"
			:account-links="accountLinks"
			:cart-item-count="cartItemCount"
			:set-account-menu-ref="setAccountMenuRef"
			data-testid="app-header-main-bar"
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
		/>

		<AppHeaderLocaleModal
			v-if="localeModalOpen"
			:open="localeModalOpen"
			:locale-value="selectedLocale"
			:locale-options="localeOptions"
			data-testid="app-header-locale-modal"
			@close="closeLocaleModal"
			@select="selectLocale"
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
			data-testid="app-header-search-modal"
			@close="closeSearchModal"
			@update:search-query="searchQuery = $event"
			@focus-input="focusSearchInput"
			@clear-recent="clearRecentSearches"
			@apply-recent="applyRecentSearch"
			@remove-recent="removeRecentSearch"
			@apply-suggested="applySuggestedSearch"
			@select-result="selectSearchResult"
		/>

		<CartPreview
			:open="cartPreviewOpen"
			:cart-item-count="cartItemCount"
			:cart-items="cartItems"
			:size-option-models="cartSizeOptionModels"
			:quantity-options="cartQuantityOptions"
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