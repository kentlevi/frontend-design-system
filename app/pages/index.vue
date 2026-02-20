<script setup lang="ts">
import HomeHeroSection from '~/components/home/HomeHeroSection.vue';
import HomeProductTypes from '~/components/home/HomeProductTypes.vue';
import { defineAsyncComponent } from 'vue';

const HomeFeatureHighlight = defineAsyncComponent(
    () => import('~/components/home/HomeFeatureHighlight.vue')
);
const HomeReviewsSection = defineAsyncComponent(
    () => import('~/components/home/HomeReviewsSection.vue')
);
const HomeGuarantees = defineAsyncComponent(
    () => import('~/components/home/HomeGuarantees.vue')
);
const HomeCtaSection = defineAsyncComponent(
    () => import('~/components/home/HomeCtaSection.vue')
);

definePageMeta({
    layout: 'home',
});

const { t } = useI18n();

useSeoMeta({
    title: () => t('home.seo.title'),
    description: () => t('home.seo.description'),
});

useHead({
    link: [
        {
            rel: 'preload',
            as: 'image',
            href: '/illustrations/products/sticker-kids/kid-decorating-sheet.svg',
            fetchpriority: 'high',
        },
    ],
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
