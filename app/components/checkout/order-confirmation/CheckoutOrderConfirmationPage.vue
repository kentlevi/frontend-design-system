<script setup lang="ts">
import { computed } from 'vue';
import { useCheckoutGuest } from '~/composables/checkout/guest/useCheckoutGuest';
import { useCountry } from '@/composables/app/country/useCountry';
import CheckoutOrderConfirmationDelivery from './CheckoutOrderConfirmationDelivery.vue';
import CheckoutOrderConfirmationHeader from './CheckoutOrderConfirmationHeader.vue';
import CheckoutOrderConfirmationNote from './CheckoutOrderConfirmationNote.vue';
import CheckoutOrderConfirmationSummary from './CheckoutOrderConfirmationSummary.vue';

const { t } = useI18n();
const { withCountry } = useCountry();
const { selected_checkout_items, order_subtotal, order_shipping_fee, order_discount, order_total, formatPrice, sizeDimOnly } = useCheckoutGuest({
	labelCountry: 'us',
});

const order_number = computed(() => '12405070009');
const order_details_path = computed(() => withCountry(`/orders/${order_number.value}`));
const estimated_arrival = computed(() => {
	const date = new Date();
	date.setDate(date.getDate() + 9);
	return date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});
});
</script>

<template>
	<section class="checkout-confirmation-page" data-testid="checkout-confirmation-page">
		<div class="checkout-confirmation-card" data-testid="checkout-confirmation-card">
			<CheckoutOrderConfirmationHeader
				:title="t('checkout.confirmation.title')"
				:home-label="t('checkout.confirmation.goHome')"
				:home-path="withCountry('/')"
			/>
			<CheckoutOrderConfirmationNote
				:prefix="t('checkout.confirmation.notePrefix')"
				:suffix="t('checkout.confirmation.noteSuffix')"
			/>
			<CheckoutOrderConfirmationDelivery
				:label="t('checkout.confirmation.expectedDelivery')"
				:value="t('checkout.confirmation.expectedArrival', { date: estimated_arrival })"
			/>
			<CheckoutOrderConfirmationSummary
				:title="t('checkout.confirmation.orderSummary')"
				:order-number-label="t('checkout.confirmation.orderNumber', { orderNumber: order_number })"
				:order-details-path="order_details_path"
				:items="selected_checkout_items"
				:item-meta="(sizeLabel, qty) => `${sizeDimOnly(sizeLabel)} / ${qty.toLocaleString()}`"
				:format-price="formatPrice"
				:subtotal-label="t('checkout.confirmation.summary.subtotal')"
				:shipping-fee-label="t('checkout.confirmation.summary.shippingFee')"
				:discount-label="t('checkout.confirmation.summary.discounts')"
				:total-label="t('checkout.confirmation.summary.total')"
				:subtotal="order_subtotal"
				:shipping-fee="order_shipping_fee"
				:discount="order_discount"
				:total="order_total"
			/>
		</div>
	</section>
</template>

<style scoped lang="scss">
.checkout-confirmation-page {
	position: relative;
	min-height: calc(100vh - 320px);
	padding: 56px 24px 120px;
	background: var(--white-base);
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		inset: 0 0 auto 0;
		height: 320px;
		background: var(--brand-primary);
		z-index: 0;
	}

	.checkout-confirmation-card {
		display: grid;
		gap: 24px;
		position: relative;
		z-index: 1;
		max-width: 792px;
		margin: 0 auto;
		background: var(--white-base);
		border: 1px solid var(--gray-50);
		border-radius: 16px;
		padding: 40px;
		box-shadow: 0 6px 18px rgba(18, 22, 34, 0.08);

	}
}

@media (max-width: 900px) {
	.checkout-confirmation-page {
		.checkout-confirmation-card {
			padding: 24px 18px;
		}
	}
}
</style>