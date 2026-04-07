<script setup lang="ts">
import CheckoutInvoicePage from '~/components/checkout/invoice/CheckoutInvoicePage.vue';

definePageMeta({
	layout: 'checkout',
	hideHeader: true,
	hideFooter: true,
});
</script>

<template>
	<CheckoutInvoicePage />
</template>