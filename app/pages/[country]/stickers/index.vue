<template>
	<ProductCategoryExperience category="stickers" :products="products" />
</template>

<script setup lang="ts">
import ProductCategoryExperience from '~/components/products/product-category/ProductCategoryExperience.vue';
import { useProductByCategory } from '~/composables/products/useProductByCategory';

const { products } = useProductByCategory('stickers')

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