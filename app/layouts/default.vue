<script setup lang="ts">
import AppHeaderRoot from '~/components/layout/app-header/AppHeader.vue';
import AppFooterRoot from '~/components/layout/app-footer/AppFooter.vue';
</script>

<template>
    <div class="layout">
        <AppHeaderRoot />

        <main class="layout-main">
            <slot />
        </main>

        <AppFooterRoot />
    </div>
</template>

<style scoped lang="scss">
.layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    .layout-main {
        flex: 1;
    }
}
</style>

<style lang="scss">
@use '~/assets/scss/site';
</style>
