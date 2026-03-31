<template>
	<ProductCategoryExperience category="stickers" :products="products" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import ProductCategoryExperience from '~/components/products/product-category/ProductCategoryExperience.vue';
import { useNavigation } from '~/composables/navigation/useNavigation';
import { useNavigationStore } from '~/stores/navigation/navigation.store';

const route = useRoute()
const clear_cache = computed(() => {
	const clear_cache_query = route.query['clear-cache']
	return Array.isArray(clear_cache_query)
		? clear_cache_query.includes('true')
		: clear_cache_query === 'true'
})

const navigation = useNavigation()
watch(
	() => clear_cache.value,
	(should_clear_cache) => {
		void navigation.fetchAndStoreProducts('stickers', should_clear_cache)
	},
	{ immediate: true }
)
const { product_state } = storeToRefs(useNavigationStore())
const products = computed(() => product_state.value)

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
