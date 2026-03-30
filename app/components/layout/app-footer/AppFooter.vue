<script setup lang="ts">
import AppFooterCompact from '~/components/layout/app-footer/AppFooterCompact.vue';
import AppFooterMain from '~/components/layout/app-footer/AppFooterMain.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const year = new Date().getFullYear();
const route = useRoute();
const is_auth_route = computed(() => /\/auth(\/|$)/.test(route.path));
const is_cart_route = computed(() => /\/cart(\/|$)/.test(route.path));
const use_compact_footer = computed(() => is_auth_route.value || is_cart_route.value);
const is_product_route = computed(() =>
	/\/(stickers|roll-stickers|sheet-stickers)(\/|$)/.test(route.path)
);
</script>

<template>
	<footer class="home-footer" :class="{ 'is-auth': use_compact_footer, 'is-product': is_product_route }" data-testid="app-footer">
		<AppFooterCompact v-if="use_compact_footer" :year="year" data-testid="app-footer-compact" />
		<AppFooterMain v-else :year="year" :is-product="is_product_route" data-testid="app-footer-main" />
	</footer>
</template>

<style scoped lang="scss">
.home-footer {
    --footer-bg: #232737;
    --footer-text-primary: var(--white-base);
    --footer-text-secondary: #f5f6fb;
    --footer-text-muted: #d6d8de;
    --footer-text-subtle: #c6c9d4;
    --footer-text-soft: #b9bdca;
    --footer-border: var(--white-base);

    background: var(--bg-page);
    padding: 0 24px 0;

    &.is-product {
        padding: 0;
        background: var(--footer-bg);
    }

    .home-footer-compact,
    .home-footer-inner {
        width: 100%;
    }
}
</style>