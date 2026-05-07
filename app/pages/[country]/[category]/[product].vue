<script setup lang="ts">
import { useRoute } from 'vue-router';
import ProductCategoryExperience from '~/components/products/product-category/ProductCategoryExperience.vue';
import { productCatalog } from '~/data/products/catalog';
import { getProductIdFromSlug } from '~/helpers/products/productCategory.helper';
import type { ProductCategoryKey } from '~/types/products/catalog';

const route = useRoute()
const route_category = route.params.category
const route_product = route.params.product
const resolved_category = typeof route_category === 'string' && isProductCategoryKey(route_category)
	? route_category
	: null

if (
	!resolved_category ||
	typeof route_product !== 'string' ||
	!getProductIdFromSlug(route_product, resolved_category)
) {
	await navigateTo('/', { replace: true, redirectCode: 302 })
}

const category = computed<ProductCategoryKey>(() => resolved_category || 'stickers')

function isProductCategoryKey(value: string): value is ProductCategoryKey {
	return Object.prototype.hasOwnProperty.call(productCatalog, value)
}

definePageMeta({
	layout: 'home',
});
</script>

<template>
	<ProductCategoryExperience :category="category" />
</template>
