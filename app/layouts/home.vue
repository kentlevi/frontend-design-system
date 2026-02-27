<script setup lang="ts">
import AppHeaderRoot from '~/components/layout/app-header/AppHeader.vue';
import AppFooterRoot from '~/components/layout/app-footer/AppFooter.vue';

const route = useRoute();
</script>

<template>
    <div class="home-layout">
        <AppHeaderRoot v-if="!route.meta.hideHeader" />
        <main class="home-layout-main">
            <slot />
        </main>
        <AppFooterRoot />
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
}
</style>

<style lang="scss">
@use '~/assets/scss/site';
</style>
