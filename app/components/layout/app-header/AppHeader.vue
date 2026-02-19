<script setup lang="ts">
import AppHeaderLocaleModal from '~/components/layout/app-header/AppHeaderLocaleModal.vue';
import AppHeaderMainBar from '~/components/layout/app-header/AppHeaderMainBar.vue';
import AppHeaderSearchModal from '~/components/layout/app-header/AppHeaderSearchModal.vue';
import { useAppHeaderAccount } from '~/composables/layout/useAppHeaderAccount';
import { useAppHeaderKeyboardShortcuts } from '~/composables/layout/useAppHeaderKeyboardShortcuts';
import { useAppHeaderSearch } from '~/composables/layout/useAppHeaderSearch';

const { locale } = useI18n();

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

function setAccountMenuRef(el: HTMLElement | null) {
    accountMenuRef.value = el;
}

function openLocaleModal() {
    closeSearchModal();
    openLocaleModalBase();
}

function openSearchModal() {
    closeAccountMenu();
    closeLocaleModal();
    openSearchModalBase();
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
            @toggle-account="toggleAccountMenu"
            @close-account="closeAccountMenu"
            @account-mouse-enter="onAccountMouseEnter"
            @account-mouse-leave="onAccountMouseLeave"
            @logout="logoutMock"
            data-testid="app-header-main-bar"
        />

        <AppHeaderLocaleModal
            :open="localeModalOpen"
            :locale-value="locale"
            :locale-options="localeOptions"
            @close="closeLocaleModal"
            @select="selectLocale"
            data-testid="app-header-locale-modal"
        />

        <AppHeaderSearchModal
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
    </header>
</template>

<style scoped lang="scss">
.home-header {
    background: var(--brand-primary);
}
</style>


