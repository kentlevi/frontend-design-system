<script setup lang="ts">
import CheckoutInvoiceBillingModal from '~/components/checkout/modals/CheckoutInvoiceBillingModal.vue';
import { useCountry } from '~/composables/app/country/useCountry';
import CheckoutInvoiceFooter from './CheckoutInvoiceFooter.vue';
import CheckoutInvoiceHero from './CheckoutInvoiceHero.vue';
import CheckoutInvoiceItemsTable from './CheckoutInvoiceItemsTable.vue';
import CheckoutInvoiceTopbar from './CheckoutInvoiceTopbar.vue';
import CheckoutInvoiceTotals from './CheckoutInvoiceTotals.vue';
import { formatPrice } from '~/utils/currency/formatPrice';
import { useCheckoutSummaryFlow } from '~/composables/checkout/summary/useCheckoutSummaryFlow';
import { useQuotationFlow } from '~/composables/checkout/qoutation/useQuotationFlow';
import { provideCheckoutInvoiceBilling } from '~/composables/checkout/invoice/billing-address/context/useCheckoutInvoiceBillingContext';

provideCheckoutInvoiceBilling()

const { withCountry } = useCountry();

const {
	selected_items,
	total_cost,
	sub_total_cost,
	shipping_cost,
} = useCheckoutSummaryFlow()
const { order_quotation, issued_date } = useQuotationFlow()

function closeInvoice() {
	void navigateTo(withCountry('/checkout'));
}

function printInvoice() {
	window.print();
}

function downloadInvoice() {
	window.print();
}
</script>

<template>
	<section class="checkout-invoice-page" data-testid="checkout-invoice-page">
		<CheckoutInvoiceTopbar
			:on-close="closeInvoice"
			:on-print="printInvoice"
			:on-download="downloadInvoice"
		/>

		<div class="checkout-invoice-shell">
			<article class="checkout-invoice-card">
				<CheckoutInvoiceHero
					:invoice-number="order_quotation ? order_quotation.quote_number : '...'"
					:issued-date="issued_date"
				/>

				<CheckoutInvoiceItemsTable :items="selected_items" />

				<CheckoutInvoiceTotals
					:subtotal="formatPrice(sub_total_cost)"
					shipping-label="Standard Shipping"
					:shipping-fee="formatPrice(shipping_cost)"
					:discount="formatPrice(0)"
					:total="formatPrice(total_cost)"
				/>
				<CheckoutInvoiceFooter />
			</article>
		</div>

		<CheckoutInvoiceBillingModal />
	</section>
</template>

<style scoped lang="scss">
.checkout-invoice-page {
	min-height: 100vh;
	background:
		linear-gradient(180deg, #ffffff 0%, #fbfbfd 100%);
}

.checkout-invoice-shell {
	padding: 28px 24px 64px;
}

.checkout-invoice-card {
	max-width: 696px;
	margin: 0 auto;
	border: 1px solid #e5e7ef;
	border-radius: 18px;
	background: var(--contrast-light);
	box-shadow: 0 12px 28px rgba(24, 28, 39, 0.08);
	overflow: hidden;
}

@media (max-width: 640px) {
	.checkout-invoice-shell {
		padding: 20px 16px 40px;
	}
}

@media print {
	.checkout-invoice-page {
		background: #ffffff;
	}

	.checkout-invoice-shell {
		padding: 0;
	}

	.checkout-invoice-card {
		max-width: none;
		border: 0;
		border-radius: 0;
		box-shadow: none;
	}
}

:global(.ui-toast.checkout-invoice-success-toast) {
	width: fit-content;
	max-width: min(460px, calc(100vw - 24px));
	background: #ffe14a;
	color: #1f2330;
	border: 2px solid #f1c94a;
	box-shadow: 0 10px 24px rgba(24, 28, 39, 0.18);
	border-radius: 14px;
	padding: 14px 20px;
	gap: 20px;
}

:global(.ui-toast.checkout-invoice-success-toast .ui-toast-main) {
	gap: 10px;
}

:global(.ui-toast.checkout-invoice-success-toast .ui-toast-text) {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-semibold);
	white-space: nowrap;
}

:global(.ui-toast.checkout-invoice-success-toast .ui-toast-close) {
	color: #1f2330;
	width: 24px;
	height: 24px;
}

@media (max-width: 560px) {
	:global(.ui-toast.checkout-invoice-success-toast) {
		width: calc(100vw - 24px);
	}

	:global(.ui-toast.checkout-invoice-success-toast .ui-toast-text) {
		white-space: normal;
	}
}
</style>