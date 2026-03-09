<template>
	<ProductCategoryExperience category="roll-stickers" :products="products" />
</template>

<script setup lang="ts">
import ProductCategoryExperience from '~/components/products/product-category/ProductCategoryExperience.vue';
import { useProductByCategory } from '~/composables/products/useProductByCategory';

const { products } = useProductByCategory('roll-stickers')

definePageMeta({
	layout: 'home',
});
</script>