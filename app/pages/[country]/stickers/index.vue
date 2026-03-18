<template>
	<ProductCategoryExperience category="stickers" :products="products" />
</template>

<script setup lang="ts">
import ProductCategoryExperience from '~/components/products/product-category/ProductCategoryExperience.vue';
import { useNavigation } from '~/composables/navigation/useNavigation';
import { useNavigationStore } from '~/stores/navigation/navigation.store';

const navigation = useNavigation()
navigation.fetchAndStoreProducts('stickers')
const { product_state } = storeToRefs(useNavigationStore())
const products = product_state.value

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