<script setup lang="ts">
import CheckoutExperience from '~/components/checkout/CheckoutExperience.vue';
import { useMainCheckOutStore } from '~/stores/checkout/index.store';

definePageMeta({
	layout: 'checkout',
	middleware: 'cart-required',
});

const { setCheckoutStartedAt } = useMainCheckOutStore()
onMounted(() => setCheckoutStartedAt())
</script>

<template>
	<CheckoutExperience />
</template>