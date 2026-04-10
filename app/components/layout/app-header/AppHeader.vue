<script setup lang="ts">
import AppHeaderMainBar from '~/components/layout/app-header/AppHeaderMainBar.vue';
import AppHeaderSearchModal from '~/components/layout/app-header/AppHeaderSearchModal.vue';
import { provideAppHeader } from '~/composables/layout/appHeader/useAppHeader';

const {
	AppHeaderLocaleModal,
	CartPreview,
	locale_modal_open,
	search_modal_open,
	cart_preview_rendered,
	selected_locale,
	locale_options,
	closeLocaleModal,
	selectLocale,
	closeSearchModal,
} = provideAppHeader();
</script>

<template>
	<header class="home-header" data-testid="app-header">
		<AppHeaderMainBar />

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
			data-testid="app-header-search-modal"
			@close="closeSearchModal"
		/>

		<CartPreview
			v-if="cart_preview_rendered"
		/>
	</header>
</template>

<style scoped lang="scss">
.home-header {
    background: var(--brand-primary);
}
</style>