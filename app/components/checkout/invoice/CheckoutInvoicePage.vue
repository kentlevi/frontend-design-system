<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import CheckoutInvoiceBillingModal from '~/components/checkout/modals/CheckoutInvoiceBillingModal.vue';
import { useCountry } from '~/composables/app/country/useCountry';
import { useCheckoutMember } from '~/composables/checkout/member/useCheckoutMember';
import { checkoutShippingMethods } from '~/data/checkout/options';
import CheckoutInvoiceFooter from './CheckoutInvoiceFooter.vue';
import CheckoutInvoiceHero from './CheckoutInvoiceHero.vue';
import CheckoutInvoiceItemsTable from './CheckoutInvoiceItemsTable.vue';
import CheckoutInvoiceTopbar from './CheckoutInvoiceTopbar.vue';
import CheckoutInvoiceTotals from './CheckoutInvoiceTotals.vue';
import type { BillingDetails } from './types';

const { withCountry } = useCountry();
const {
	t,
	selected_checkout_items,
	selected_shipping_address,
	selected_shipping_method,
	order_subtotal,
	order_shipping_fee,
	order_discount,
	order_total,
	formatPrice,
	sizeDimOnly,
} = useCheckoutMember();

const billing_modal_open = ref(false);
const billing_toast_visible = ref(false);
const invoice_number = computed(() => '62411190001');
const issued_date = computed(() =>
	new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	}).format(new Date('2026-03-25'))
);

const billing_details = reactive<BillingDetails>({
	fullName: selected_shipping_address.value?.recipient || 'Joy Love',
	company: selected_shipping_address.value?.company || 'Summit Inc.',
	address1: selected_shipping_address.value?.line1 || '176-6, Yusan-ri, Gusan-myeon',
	address2: '',
	province: 'incheon',
	city: 'Gaseong-si',
	postalCode: '01000',
});

const shipping_method_name = computed(() => {
	const method = checkoutShippingMethods.find((entry) => entry.key === selected_shipping_method.value);
	return method ? t(`${method.i18nKey}.name`) : 'Express Shipping';
});

const province_label = computed(() => {
	const map: Record<string, string> = {
		incheon: 'Incheon',
		seoul: 'Seoul',
		busan: 'Busan',
	};
	return map[billing_details.province] || billing_details.province;
});

const billing_name = computed(() => billing_details.fullName || 'Joy Love');
const billing_address = computed(() =>
	[
		billing_details.address1,
		billing_details.address2,
		billing_details.city,
		province_label.value,
		billing_details.postalCode,
		'Republic of Korea',
	].filter(Boolean).join(', ')
);
const billing_company = computed(() => billing_details.company || 'Summit Inc.');
const invoice_items = computed(() =>
	selected_checkout_items.value.map((item) => ({
		id: item.id,
		label: `${t(`product.items.${item.product.id}.name`)} / ${sizeDimOnly(item.sizeLabel)}`,
		qty: item.qty.toLocaleString(),
		amount: formatPrice(item.total),
	}))
);
let billing_toast_timeout: ReturnType<typeof setTimeout> | null = null;

function closeInvoice() {
	void navigateTo(withCountry('/checkout'));
}

function printInvoice() {
	window.print();
}

function downloadInvoice() {
	window.print();
}

function hideBillingToast() {
	billing_toast_visible.value = false;
	if (billing_toast_timeout) {
		clearTimeout(billing_toast_timeout);
		billing_toast_timeout = null;
	}
}

function saveBillingDetails(next_value: BillingDetails) {
	Object.assign(billing_details, next_value);
	billing_toast_visible.value = true;
	if (billing_toast_timeout) {
		clearTimeout(billing_toast_timeout);
	}
	billing_toast_timeout = setTimeout(() => {
		billing_toast_visible.value = false;
		billing_toast_timeout = null;
	}, 3200);
}

onBeforeUnmount(() => {
	if (billing_toast_timeout) {
		clearTimeout(billing_toast_timeout);
	}
});
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
					:invoice-number="invoice_number"
					:issued-date="issued_date"
					:billing-name="billing_name"
					:billing-address="billing_address"
					:billing-company="billing_company"
					@edit-billing="billing_modal_open = true"
				/>

				<CheckoutInvoiceItemsTable :items="invoice_items" />

				<CheckoutInvoiceTotals
					:subtotal="formatPrice(order_subtotal)"
					:shipping-label="shipping_method_name"
					:shipping-fee="formatPrice(order_shipping_fee)"
					:discount="formatPrice(order_discount)"
					:total="formatPrice(order_total)"
				/>

				<CheckoutInvoiceFooter />
			</article>
		</div>

		<CheckoutInvoiceBillingModal
			v-model="billing_modal_open"
			:value="billing_details"
			@save="saveBillingDetails"
		/>

		<UiToast
			:visible="billing_toast_visible"
			:message="t('checkout.invoice.billingToast')"
			tone="primary"
			variant="outlined"
			dismissible
			class="checkout-invoice-success-toast"
			@close="hideBillingToast"
		/>
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