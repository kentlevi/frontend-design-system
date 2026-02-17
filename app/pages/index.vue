<script setup lang="ts">
definePageMeta({
    layout: 'home',
});

const { t } = useI18n();

useSeoMeta({
    title: () => t('home.seo.title'),
    description: () => t('home.seo.description'),
});
</script>

<template>
    <main class="home-page">
        <HomeHeroSection />
        <HomeProductTypes />
        <HomeFeatureHighlight />
        <HomeReviewsSection />
        <HomeGuarantees />
        <HomeCTASection />
    </main>
</template>

<style scoped lang="scss">
.home-page {
    background: var(--bg-page);
}
</style>
