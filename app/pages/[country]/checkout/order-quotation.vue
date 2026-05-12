<script setup lang="ts">
import CheckoutoutOrderQuotationPage from '~/components/checkout/invoice/CheckoutOrderQuotationPage.vue';
import { provideQuotation } from '~/composables/checkout/qoutation/useQuotationContext';

definePageMeta({
	layout: 'checkout',
	hideHeader: true,
	hideFooter: true,
});

provideQuotation()

</script>

<template>
	<CheckoutoutOrderQuotationPage />
</template>