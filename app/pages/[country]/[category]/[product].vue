<script setup lang="ts">
import { useRoute } from 'vue-router';
import ProductCategoryExperience from '~/components/products/product-category/ProductCategoryExperience.vue';
import type { ProductCategoryKey } from '~/types/products/catalog';

const route = useRoute()
const category = computed<ProductCategoryKey | null>(() => {
	const route_category = route.params.category
	return typeof route_category === 'string' ? route_category as ProductCategoryKey : null
})

definePageMeta({
	layout: 'home',
});
</script>

<template>
	<ProductCategoryExperience v-if="category" :category="category" />
</template>