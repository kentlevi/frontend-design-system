<template>
    <div class="home-layout">
        <LayoutAppHeader />
        <main class="home-layout-main">
            <slot />
        </main>
        <LayoutAppFooter />
    </div>
</template>

<style scoped lang="scss">
.home-layout {
    min-height: 100vh;
    background: var(--brand-primary);

    .home-layout-main {
        width: 100%;
    }
}
</style>
