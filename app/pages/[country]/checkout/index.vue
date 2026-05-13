<script setup lang="ts">
import CheckoutExperience from '~/components/checkout/CheckoutExperience.vue';

definePageMeta({
	layout: 'checkout',
	middleware: 'cart-required',
});
</script>

<template>
	<CheckoutExperience />
</template>