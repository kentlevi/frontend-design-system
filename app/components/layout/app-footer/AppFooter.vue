<script setup lang="ts">
import AppFooterCompact from '~/components/layout/app-footer/AppFooterCompact.vue';
import AppFooterMain from '~/components/layout/app-footer/AppFooterMain.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const year = new Date().getFullYear();
const route = useRoute();
const isAuthRoute = computed(() => route.path.startsWith('/auth'));
const isProductRoute = computed(() =>
    /\/(stickers|roll-stickers|sheet-stickers)(\/|$)/.test(route.path)
);
</script>

<template>
    <footer class="home-footer" :class="{ 'is-auth': isAuthRoute, 'is-product': isProductRoute }" data-testid="app-footer">
        <AppFooterCompact v-if="isAuthRoute" :year="year" data-testid="app-footer-compact" />
        <AppFooterMain v-else :year="year" :is-product="isProductRoute" data-testid="app-footer-main" />
    </footer>
</template>

<style scoped lang="scss">
.home-footer {
    --footer-bg: #232737;
    --footer-text-primary: #ffffff;
    --footer-text-secondary: #f5f6fb;
    --footer-text-muted: #d6d8de;
    --footer-text-subtle: #c6c9d4;
    --footer-text-soft: #b9bdca;
    --footer-border: #70758b;

    background: var(--bg-page);
    padding: 0 24px 0;

    &.is-product {
        padding: 0;
    }

    .home-footer-compact,
    .home-footer-inner {
        width: 100%;
    }
}
</style>
