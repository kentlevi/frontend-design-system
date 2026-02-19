<script setup lang="ts">
import HomeCtaSection from '~/components/home/HomeCtaSection.vue';
import HomeFeatureHighlight from '~/components/home/HomeFeatureHighlight.vue';
import HomeGuarantees from '~/components/home/HomeGuarantees.vue';
import HomeHeroSection from '~/components/home/HomeHeroSection.vue';
import HomeProductTypes from '~/components/home/HomeProductTypes.vue';
import HomeReviewsSection from '~/components/home/HomeReviewsSection.vue';

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
        <HomeCtaSection />
    </main>
</template>

<style scoped lang="scss">
.home-page {
    background: var(--bg-page);
}
</style>
