<script setup lang="ts">
import { computed } from 'vue';
import AppHeaderRoot from '~/components/layout/app-header/AppHeader.vue';
import AppHeaderCheckoutBar from '~/components/layout/app-header/AppHeaderCheckoutBar.vue';
import AppFooterRoot from '~/components/layout/app-footer/AppFooter.vue';
import AppFooterCompact from '~/components/layout/app-footer/AppFooterCompact.vue';

const route = useRoute();
const year = new Date().getFullYear();
const headerVariant = computed(() =>
	route.meta.headerVariant === 'checkout' ? 'checkout' : 'default'
);
const footerVariant = computed(() =>
	route.meta.footerVariant === 'compact' ? 'compact' : 'full'
);
</script>

<template>
	<div class="home-layout">
		<AppHeaderRoot v-if="!route.meta.hideHeader && headerVariant === 'default'" />
		<AppHeaderCheckoutBar v-else-if="!route.meta.hideHeader && headerVariant === 'checkout'" />
		<main class="home-layout-main">
			<slot />
		</main>
		<AppFooterRoot v-if="!route.meta.hideFooter && footerVariant === 'full'" />
		<footer v-else-if="!route.meta.hideFooter" class="home-layout-compact-footer">
			<AppFooterCompact :year="year" />
		</footer>
	</div>
</template>

<style scoped lang="scss">
.home-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--brand-primary);

    .home-layout-main {
        flex: 1;
        width: 100%;
    }

    .home-layout-compact-footer {
        --footer-bg: #232737;
        --footer-text-primary: #ffffff;
        --footer-text-secondary: #f5f6fb;
        --footer-text-muted: #d6d8de;
        --footer-text-subtle: #c6c9d4;
        --footer-text-soft: #b9bdca;
        --footer-border: #70758b;

        background: var(--bg-page);
        padding: 0 24px;

        :deep(.home-footer-compact) {
            width: 100%;
        }
    }
}
</style>

<style lang="scss">
@use '~/assets/scss/site';
</style>