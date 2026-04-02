<template>
	<ProductCategoryExperience :category="category" :products="products" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import ProductCategoryExperience from '~/components/products/product-category/ProductCategoryExperience.vue';
import { useNavigation } from '~/composables/navigation/useNavigation';
import { useNavigationStore } from '~/stores/navigation/navigation.store';
import type { ProductCategoryKey } from '~/types/products/catalog';

const route = useRoute()
const category = computed(() => route.params.category as ProductCategoryKey)

const clear_cache = computed(() => {
	const clear_cache_query = route.query['clear-cache']
	return Array.isArray(clear_cache_query)
		? clear_cache_query.includes('true')
		: clear_cache_query === 'true'
})

const navigation = useNavigation()

await useAsyncData(
	() => `navigation-products:${category.value}:${clear_cache.value ? 'clear' : 'cached'}`,
	async () => {
		if (!category.value) return false
		return await navigation.fetchAndStoreProducts(category.value as string, clear_cache.value)
	},
	{
		watch: [category, clear_cache],
	}
)

const navigation_store = useNavigationStore()
const products = computed(() => ({ products: navigation_store.product_state[category.value] || [] }))

definePageMeta({
	layout: 'home',
});

// Conditionally preload main category images for performance
const categoryPrefills = {
	stickers: '/illustrations/products/stickers/die-cut.svg',
	'roll-stickers': '/illustrations/products/roll-stickers/die-cut-labels.svg',
	'sheet-stickers': '/illustrations/products/sheet-stickers/die-cut-sheet.svg',
} as const

useHead({
	link: computed(() => {
		const href = categoryPrefills[category.value]
		if (href) {
			return [
				{
					rel: 'preload',
					as: 'image',
					href,
					fetchpriority: 'high',
				},
			]
		}
		return []
	}),
});
</script>
