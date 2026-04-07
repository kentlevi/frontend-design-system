<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import CheckoutInvoiceBillingModal from '~/components/checkout/CheckoutInvoiceBillingModal.vue';
import { useCountry } from '~/composables/app/country/useCountry';
import { useCheckoutMember } from '~/composables/checkout/member/useCheckoutMember';
import { checkoutShippingMethods } from '~/data/checkout/options';

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

type BillingDetails = {
	fullName: string;
	company: string;
	address1: string;
	address2: string;
	province: string;
	city: string;
	postalCode: string;
};

const invoice_card_ref = ref<HTMLElement | null>(null);
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

function itemLabel(name: string, sizeLabel: string) {
	return `${name} / ${sizeDimOnly(sizeLabel)}`;
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
		<header class="checkout-invoice-topbar">
			<div class="checkout-invoice-topbar-inner">
				<button type="button" class="checkout-invoice-topbar-button" @click="closeInvoice">
					Close
				</button>
				<h1 class="checkout-invoice-topbar-title">Invoice</h1>
				<div class="checkout-invoice-topbar-actions">
					<button type="button" class="checkout-invoice-topbar-button checkout-invoice-topbar-button--icon" @click="printInvoice">
						<UiIcon name="regular-print" size="18" color="currentColor" decorative />
						Print
					</button>
					<button type="button" class="checkout-invoice-topbar-button checkout-invoice-topbar-button--icon" @click="downloadInvoice">
						<UiIcon name="regular-download" size="18" color="currentColor" decorative />
						Download Invoice
					</button>
				</div>
			</div>
		</header>

		<div class="checkout-invoice-shell">
			<article ref="invoice_card_ref" class="checkout-invoice-card">
				<section class="checkout-invoice-hero">
					<div class="checkout-invoice-brand">
						<img
							src="/logos/full/white/musticker.svg"
							alt="Musticker"
							class="checkout-invoice-logo"
						>
						<div class="checkout-invoice-brand-copy">
							<div>Tel No: +65 3158 2800</div>
							<div>Email: info@musticker.com</div>
							<div>Website: www.musticker.com</div>
						</div>
					</div>

					<div class="checkout-invoice-meta">
						<div class="checkout-invoice-number">Invoice #: {{ invoice_number }}</div>
						<div class="checkout-invoice-date">Date Issued: {{ issued_date }}</div>
					</div>

					<div class="checkout-invoice-billing">
						<div class="checkout-invoice-billing-copy">
							<div class="checkout-invoice-billing-title">Billing Details:</div>
							<div class="checkout-invoice-billing-line">Name: <strong>{{ billing_name }}</strong></div>
							<div class="checkout-invoice-billing-line">Address: <strong>{{ billing_address }}</strong></div>
							<div class="checkout-invoice-billing-line">Company: <strong>{{ billing_company }}</strong></div>
						</div>

						<button type="button" class="checkout-invoice-billing-button" @click="billing_modal_open = true">
							Edit Billing Info
						</button>
					</div>
				</section>

				<section class="checkout-invoice-items">
					<div class="checkout-invoice-items-table">
						<div class="checkout-invoice-items-head">
							<span>Item</span>
							<span>Qty.</span>
							<span>Amount</span>
						</div>

						<div
							v-for="item in selected_checkout_items"
							:key="item.id"
							class="checkout-invoice-items-row"
						>
							<span>{{ itemLabel(item.product.name, item.sizeLabel) }}</span>
							<span>{{ item.qty.toLocaleString() }}</span>
							<strong>{{ formatPrice(item.total) }}</strong>
						</div>
					</div>
				</section>

				<section class="checkout-invoice-totals">
					<div class="checkout-invoice-totals-grid">
						<div class="checkout-invoice-total-line">
							<span>Subtotal:</span>
							<strong>{{ formatPrice(order_subtotal) }}</strong>
						</div>
						<div class="checkout-invoice-total-line">
							<span>Shipping Fee: ({{ shipping_method_name }})</span>
							<strong>{{ formatPrice(order_shipping_fee) }}</strong>
						</div>
						<div class="checkout-invoice-total-line is-discount">
							<span>Discounts:</span>
							<strong>{{ formatPrice(order_discount) }}</strong>
						</div>
						<div class="checkout-invoice-total-line is-final">
							<span>Total:</span>
							<strong>{{ formatPrice(order_total) }}</strong>
						</div>
					</div>
				</section>

				<footer class="checkout-invoice-footer">
					<div class="checkout-invoice-footer-copy">
						<strong>Musticker</strong>
						<span>123-45, Seongdong-gu, Seoul, 04776 South Korea</span>
					</div>
					<strong>www.musticker.com</strong>
				</footer>
			</article>
		</div>

		<CheckoutInvoiceBillingModal
			v-model="billing_modal_open"
			:value="billing_details"
			@save="saveBillingDetails"
		/>

		<UiToast
			:visible="billing_toast_visible"
			message="Billing details updated successfully!"
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

.checkout-invoice-topbar {
	position: sticky;
	top: 0;
	z-index: 10;
	border-bottom: 1px solid var(--gray-30);
	background: rgba(255, 255, 255, 0.98);
	backdrop-filter: blur(8px);

	.checkout-invoice-topbar-inner {
		position: relative;
		max-width: 1360px;
		margin: 0 auto;
		min-height: 58px;
		padding: 10px 18px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.checkout-invoice-topbar-title {
		margin: 0;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 16px;
		line-height: 1.2;
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
		text-align: center;
		pointer-events: none;
	}

	.checkout-invoice-topbar-actions {
		display: inline-flex;
		align-items: center;
		justify-content: flex-end;
		gap: 12px;
	}

	.checkout-invoice-topbar-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 32px;
		padding: 0 14px;
		border: 1px solid var(--gray-60);
		border-radius: 999px;
		background: var(--contrast-light);
		color: var(--text-primary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		cursor: pointer;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			transform 0.16s ease;

		&:hover {
			background: var(--gray-10);
		}

		&:active {
			transform: scale(0.98);
		}
	}
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

.checkout-invoice-hero {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 28px 20px;
	padding: 40px;
	background: #2b2d39;
	color: #f6f7fb;
}

.checkout-invoice-brand {
	display: grid;
	gap: 18px;
}

.checkout-invoice-logo {
	width: 116px;
	height: auto;
	display: block;
}

.checkout-invoice-brand-copy {
	display: grid;
	gap: 8px;
	color: rgba(255, 255, 255, 0.8);
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
}

.checkout-invoice-meta {
	display: grid;
	align-content: start;
	justify-items: end;
	gap: 14px;
	text-align: right;
}

.checkout-invoice-number {
	font-size: 17px;
	line-height: 1.3;
	font-weight: 700;
	color: #ffffff;
}

.checkout-invoice-date {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	color: rgba(255, 255, 255, 0.78);
}

.checkout-invoice-billing {
	grid-column: 1 / -1;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 20px;
	padding-top: 20px;
	border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.checkout-invoice-billing-copy {
	display: grid;
	gap: 8px;
}

.checkout-invoice-billing-title {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: 700;
	color: #ffffff;
}

.checkout-invoice-billing-line {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	color: rgba(255, 255, 255, 0.84);

	strong {
		color: #ffffff;
		font-weight: 600;
	}
}

.checkout-invoice-billing-button {
	flex-shrink: 0;
	min-height: 32px;
	padding: 0 16px;
	border: 1px solid rgba(34, 41, 51, 0.14);
	border-radius: 999px;
	background: #ffffff;
	color: #2f3341;
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: 600;
	cursor: pointer;
	transition:
		background 0.2s ease,
		transform 0.16s ease;

	&:hover {
		background: #f5f6fa;
	}

	&:active {
		transform: scale(0.98);
	}
}

.checkout-invoice-items {
	padding: 28px 40px 30px;
	background: #ffffff;
}

.checkout-invoice-items-table {
	border: 1px solid #e4e7ee;
	border-radius: 10px;
	overflow: hidden;
}

.checkout-invoice-items-head,
.checkout-invoice-items-row {
	display: grid;
	grid-template-columns: minmax(0, 1fr) 110px 140px;
	align-items: center;
	gap: 16px;
	padding: 14px 18px;
}

.checkout-invoice-items-head {
	background: #2b2d39;
	color: #ffffff;
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: 700;
	text-transform: uppercase;

	span:last-child,
	span:nth-child(2) {
		text-align: right;
	}
}

.checkout-invoice-items-row {
	background: #ffffff;
	border-top: 1px solid #eceef3;
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	color: var(--text-secondary);

	span:last-child,
	span:nth-child(2),
	strong {
		text-align: right;
	}

	strong {
		color: var(--text-primary);
		font-weight: 700;
	}
}

.checkout-invoice-totals {
	padding: 24px 40px 20px;
	background: #f4f4f6;
}

.checkout-invoice-totals-grid {
	width: min(100%, 308px);
	margin-left: auto;
	display: grid;
	gap: 10px;
}

.checkout-invoice-total-line {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 16px;
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	color: var(--text-secondary);

	strong {
		color: var(--text-primary);
		font-weight: 600;
	}

	&.is-discount strong {
		color: #e34a5a;
	}

	&.is-final {
		margin-top: 2px;
		font-weight: 700;
		color: var(--text-primary);

		strong {
			font-size: 20px;
			line-height: 1.2;
			font-weight: 800;
		}
	}
}

.checkout-invoice-footer {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 16px;
	padding: 30px 40px 34px;
	background: #ffffff;
	color: var(--text-secondary);
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);

	.checkout-invoice-footer-copy {
		display: grid;
		gap: 6px;

		strong {
			color: var(--text-primary);
			font-size: 18px;
			line-height: 1.3;
			font-weight: 700;
		}
	}
}

@media (max-width: 900px) {
	.checkout-invoice-topbar {
		.checkout-invoice-topbar-inner {
			min-height: auto;
			flex-wrap: wrap;
		}

		.checkout-invoice-topbar-title {
			position: static;
			width: 100%;
			transform: none;
			order: -1;
		}

		.checkout-invoice-topbar-actions {
			justify-content: flex-start;
			flex-wrap: wrap;
		}
	}

	.checkout-invoice-hero,
	.checkout-invoice-items,
	.checkout-invoice-totals,
	.checkout-invoice-footer {
		padding-left: 24px;
		padding-right: 24px;
	}

	.checkout-invoice-hero {
		grid-template-columns: 1fr;
	}

	.checkout-invoice-meta {
		justify-items: start;
		text-align: left;
	}

	.checkout-invoice-billing {
		flex-direction: column;
	}
}

@media (max-width: 640px) {
	.checkout-invoice-shell {
		padding: 20px 16px 40px;
	}

	.checkout-invoice-items-head,
	.checkout-invoice-items-row {
		grid-template-columns: minmax(0, 1fr) 84px 104px;
		padding: 12px 14px;
		font-size: 12px;
	}

	.checkout-invoice-total-line {
		font-size: 13px;

		&.is-final strong {
			font-size: 18px;
		}
	}

	.checkout-invoice-footer {
		flex-direction: column;
		align-items: flex-start;
	}
}

@media print {
	.checkout-invoice-page {
		background: #ffffff;
	}

	.checkout-invoice-topbar {
		display: none;
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