<script setup lang="ts">
import AppFooterCompact from '~/components/layout/app-footer/AppFooterCompact.vue';
import AppHeaderCheckoutBar from '~/components/layout/app-header/AppHeaderCheckoutBar.vue';

const year = new Date().getFullYear();
</script>

<template>
    <div class="checkout-layout">
        <AppHeaderCheckoutBar />
        <main class="checkout-layout-main">
            <slot />
        </main>
        <footer class="checkout-layout-footer">
            <AppFooterCompact :year="year" />
        </footer>
    </div>
</template>

<style scoped lang="scss">
.checkout-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-page);

    .checkout-layout-main {
        flex: 1;
    }

    .checkout-layout-footer {
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
