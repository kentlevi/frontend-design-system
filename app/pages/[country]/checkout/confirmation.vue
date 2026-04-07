<script setup lang="ts">
import CheckoutOrderConfirmationPage from '~/components/checkout/order-confirmation/CheckoutOrderConfirmationPage.vue';

definePageMeta({
	layout: 'checkout',
	headerVariant: 'default',
	footerVariant: 'compact',
});
</script>

<template>
	<CheckoutOrderConfirmationPage />
</template>