<script setup lang="ts"></script>

<template>
    <div class="layout">
        <LayoutAppHeader />

        <main class="layout-main">
            <slot />
        </main>

        <LayoutAppFooter />
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
