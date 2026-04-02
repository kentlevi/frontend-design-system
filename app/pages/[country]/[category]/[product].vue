<script setup lang="ts">
import { useRoute } from 'vue-router';
import ProductCategoryExperience from '~/components/products/product-category/ProductCategoryExperience.vue';
import type { ProductCategoryKey } from '~/types/products/catalog';

const route = useRoute()
const category = computed(() => route.params.category as ProductCategoryKey)

definePageMeta({
	layout: 'home',
});
</script>

<template>
	<ProductCategoryExperience :category="category" />
</template>
