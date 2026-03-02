<script setup lang="ts">
import ProductCategoryExperience from '~/components/products/product-category/ProductCategoryExperience.vue';

definePageMeta({
    layout: 'home',
    middleware: ['require-auth'],
});
</script>

<template>
    <ProductCategoryExperience category="stickers" />
</template>

