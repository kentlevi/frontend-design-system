<script setup lang="ts">
import ProductCategoryExperience from '~/components/products/product-category/ProductCategoryExperience.vue';

definePageMeta({
    layout: 'home',
});

useHead({
    link: [
        {
            rel: 'preload',
            as: 'image',
            href: '/illustrations/products/stickers/die-cut.svg',
            fetchpriority: 'high',
        },
    ],
});
</script>

<template>
    <ProductCategoryExperience category="stickers" />
</template>

