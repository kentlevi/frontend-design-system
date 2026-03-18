<template>
	<ProductCategoryExperience category="roll-stickers" :products="products" />
</template>

<script setup lang="ts">
import ProductCategoryExperience from '~/components/products/product-category/ProductCategoryExperience.vue';
import { useNavigation } from '~/composables/navigation/useNavigation';
import { useNavigationStore } from '~/stores/navigation/navigation.store';

const navigation = useNavigation()
navigation.fetchAndStoreProducts('roll-stickers')
const { product_state } = storeToRefs(useNavigationStore())
const products = product_state.value

definePageMeta({
	layout: 'home',
});
</script>