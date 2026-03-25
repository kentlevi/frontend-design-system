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
const route = useRoute();
const {
	account_open,
	account_menu_ref,
	locale_modal_open,
	nav_links,
	selected_locale,
	locale_options,
	account_links,
	is_mock_logged_in,
	is_guest_logged_in,
	user_avatar_url,
	display_email,
	account_transition_name,
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
	search_modal_open,
	search_query,
	search_loading,
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
	highlightSearchMatch,
	handleSearchKeydown,
} = useAppHeaderSearch();

const {
	cart_preview_open,
	cart_featured_open,
	cart_featured_items,
	cart_items,
	cart_grand_total,
	cart_item_count,
	cart_size_option_models,
	cart_quantity_options,
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
let body_overflow_before_cart_lock = '';
let cart_body_scroll_locked = false;
let idle_prefetch_timer: ReturnType<typeof setTimeout> | null = null;
let idle_prefetch_handle: number | null = null;
const prefetched_header_overlays = ref(false);
const should_lock_body_scroll = computed(
	() => cart_preview_open.value || search_modal_open.value
);

async function prefetchHeaderOverlayModules() {
	if (prefetched_header_overlays.value) return;

	prefetched_header_overlays.value = true;
	await Promise.allSettled([
		import('~/components/layout/app-header/AppHeaderLocaleModal.vue'),
		import('~/components/cart/CartPreview.vue'),
	]);
}

function setAccountMenuRef(el: HTMLElement | null) {
	account_menu_ref.value = el;
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
	search_modal_open.value = true;
	await focusSearchInput();
}

function openCartPreview() {
	void prefetchHeaderOverlayModules();
	openCartPreviewBase();
}

function setCartBodyScrollLock(locked: boolean) {
	if (typeof document === 'undefined') return;

	if (locked) {
		if (cart_body_scroll_locked) return;
		body_overflow_before_cart_lock = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		cart_body_scroll_locked = true;
		return;
	}

	if (!cart_body_scroll_locked) return;
	document.body.style.overflow = body_overflow_before_cart_lock;
	cart_body_scroll_locked = false;
}

useAppHeaderKeyboardShortcuts({
	handleSearchKeydown,
	isSearchModalOpen: () => search_modal_open.value,
	isLocaleModalOpen: () => locale_modal_open.value,
	closeSearchModal,
	closeLocaleModal,
	closeAccountMenu,
	openSearchModal,
});

onMounted(() => {
	if (typeof window === 'undefined') return;

	if ('requestIdleCallback' in window) {
		idle_prefetch_handle = window.requestIdleCallback(() => {
			void prefetchHeaderOverlayModules();
		});
		return;
	}

	idle_prefetch_timer = setTimeout(() => {
		void prefetchHeaderOverlayModules();
	}, 1200);
});

watch(should_lock_body_scroll, (should_lock) => {
	setCartBodyScrollLock(should_lock);
});

onBeforeUnmount(() => {
	if (typeof window === 'undefined') return;

	if (idle_prefetch_handle !== null && 'cancelIdleCallback' in window) {
		window.cancelIdleCallback(idle_prefetch_handle);
	}

	if (idle_prefetch_timer) {
		clearTimeout(idle_prefetch_timer);
	}

	setCartBodyScrollLock(false);
});
</script>

<template>
	<header class="home-header" data-testid="app-header">
		<AppHeaderMainBar
			:simple="route.meta.isSimpleHeader === true"
			:nav-links="nav_links"
			:is-nav-link-active="isNavLinkActive"
			:selected-locale="selected_locale"
			:is-mock-logged-in="is_mock_logged_in"
			:is-guest-logged-in="is_guest_logged_in"
			:account-open="account_open"
			:user-avatar-url="user_avatar_url"
			:display-email="display_email"
			:account-transition-name="account_transition_name"
			:account-links="account_links"
			:cart-item-count="cart_item_count"
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
			v-if="locale_modal_open"
			:open="locale_modal_open"
			:locale-value="selected_locale"
			:locale-options="locale_options"
			data-testid="app-header-locale-modal"
			@close="closeLocaleModal"
			@select="selectLocale"
		/>

		<AppHeaderSearchModal
			v-if="search_modal_open"
			:open="search_modal_open"
			:search-query="search_query"
			:search-loading="search_loading"
			:show-search-recent="show_search_recent"
			:show-search-no-recent="show_search_no_recent"
			:show-search-no-result="show_search_no_result"
			:show-search-results="show_search_results"
			:recent-search-entries="recent_search_entries"
			:active-search-nav-index="active_search_nav_index"
			:search-result-groups="search_result_groups"
			:search-nav-index-by-result-id="search_nav_index_by_result_id"
			:search-empty-suggested-term="search_empty_suggested_term"
			:highlight-search-match="highlightSearchMatch"
			:set-modal-ref="setSearchModalRef"
			:set-input-ref="setSearchInputRef"
			data-testid="app-header-search-modal"
			@close="closeSearchModal"
			@update:search-query="search_query = $event"
			@focus-input="focusSearchInput"
			@clear-recent="clearRecentSearches"
			@apply-recent="applyRecentSearch"
			@remove-recent="removeRecentSearch"
			@apply-suggested="applySuggestedSearch"
			@select-result="selectSearchResult"
		/>

		<CartPreview
			:open="cart_preview_open"
			:cart-item-count="cart_item_count"
			:cart-items="cart_items"
			:size-option-models="cart_size_option_models"
			:quantity-options="cart_quantity_options"
			:grand-total="cart_grand_total"
			:featured-open="cart_featured_open"
			:featured-items="cart_featured_items"
			:get-product-name="getCartProductName"
			:format-price="formatCartPrice"
			:featured-start-price="cartFeaturedStartPrice"
			@close="closeCartPreview"
			@update-item="updateCartItem($event.itemId, $event.sizeKey, $event.qty, $event.customSizeLabel || '')"
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