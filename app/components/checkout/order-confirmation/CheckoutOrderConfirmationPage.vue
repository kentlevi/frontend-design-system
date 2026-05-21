<script setup lang="ts">
import { computed } from 'vue';
import { useCountry } from '@/composables/app/country/useCountry';
import CheckoutOrderConfirmationDelivery from './CheckoutOrderConfirmationDelivery.vue';
import CheckoutOrderConfirmationHeader from './CheckoutOrderConfirmationHeader.vue';
import CheckoutOrderConfirmationNote from './CheckoutOrderConfirmationNote.vue';
import CheckoutOrderConfirmationSummary from './CheckoutOrderConfirmationSummary.vue';
import { useCheckoutConfirmationPage } from '~/composables/checkout/completion/useCheckoutConfirmationPage';
import { formatShippingDateRange } from '~/utils/shipping/dateRange';

const { t: translate } = useI18n();
const { withCountry } = useCountry();
const route = useRoute()

const order_id = computed(() => {
	const id = route.query.order_id
	return Array.isArray(id) ? Number(id[0]) : Number(id)
})

const {
	order_confirm_details,
	getOrderCompletionDetails,
} = useCheckoutConfirmationPage()

onMounted(() => {
	if (order_id.value) {
		getOrderCompletionDetails(order_id.value)
	}
})

watch(order_id, (new_id, old_id) => {
	if (new_id && new_id !== old_id) {
		getOrderCompletionDetails(new_id)
	}
})
</script>

<template>
	<section class="checkout-confirmation-page" data-testid="checkout-confirmation-page">
		<div class="checkout-confirmation-card" data-testid="checkout-confirmation-card">
			<CheckoutOrderConfirmationHeader
				:title="translate('checkout.confirmation.title')"
				:home-label="translate('checkout.confirmation.goHome')"
				:home-path="withCountry('/')"
			/>
			<CheckoutOrderConfirmationNote
				:prefix="translate('checkout.confirmation.notePrefix')"
				:middle="translate('checkout.confirmation.noteMiddle')"
				:suffix="translate('checkout.confirmation.noteSuffix')"
			/>
			<CheckoutOrderConfirmationDelivery
				:label="translate('checkout.confirmation.expectedDelivery')"
				:value="translate('checkout.confirmation.expectedArrival',
					{ date: formatShippingDateRange(
						order_confirm_details?.order_production_detail?.min_delivery_date_string as string,
						order_confirm_details?.order_production_detail?.max_delivery_date_string as string
					) }
				)"
			/>
			<CheckoutOrderConfirmationSummary
				:title="translate('checkout.confirmation.orderSummary')"
				:subtotal-label="translate('checkout.confirmation.summary.subtotal')"
				:shipping-fee-label="translate('checkout.confirmation.summary.shippingFee')"
				:discount-label="translate('checkout.confirmation.summary.discounts')"
				:total-label="translate('checkout.confirmation.summary.total')"
				:order-confirm-details="order_confirm_details"
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