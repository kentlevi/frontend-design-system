<script setup lang="ts">
import { useCheckoutExperienceFeatureContext } from '~/composables/checkout/checkoutExperienceFeatureContext';
import PaymentMethods from '../payment/PaymentMethods.vue';
import BillingAddress from '../address/BillingAddress.vue';

const { t } = useCheckoutExperienceFeatureContext();
</script>

<template>
	<section class="checkout-member-section">
		<h2 class="checkout-member-section-title">{{ t('checkout.member.payment') }}</h2>
		<PaymentMethods/>
		<BillingAddress/>
	</section>
</template>

<style scoped lang="scss">
.checkout-member-section {
	display: grid;
	gap: 12px;

	.checkout-member-section-title {
		font-size: var(--type-size-350);
		line-height: var(--type-line-200);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
	}
}
</style>