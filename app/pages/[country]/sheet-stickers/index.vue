<template>
	<ProductCategoryExperience category="sheet-stickers" :products="products" />
</template>

<script setup lang="ts">
import ProductCategoryExperience from '~/components/products/product-category/ProductCategoryExperience.vue';
import { useProductByCategory } from '~/composables/products/byCategory/useProductByCategory';

const { products } = useProductByCategory('sheet-stickers')

definePageMeta({
	layout: 'home',
});
</script>