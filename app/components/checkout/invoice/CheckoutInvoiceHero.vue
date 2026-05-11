<script setup lang="ts">
import { useCheckoutInvoiceHero } from '~/composables/checkout/invoice/billing-address/useCheckoutInvoiceHero';

defineProps<{
	invoiceNumber: string | null;
	issuedDate: string;
	billingName: string;
	billingCompany: string;
}>();

const {
	translate,

	billing_address,

	buildAddressLines,
	openModal,
} = useCheckoutInvoiceHero()
</script>

<template>
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
			<div class="checkout-invoice-number">{{ translate('checkout.invoice.invoiceNumber', { invoiceNumber }) }}</div>
			<div class="checkout-invoice-date">{{ translate('checkout.invoice.dateIssued', { issuedDate }) }}</div>
		</div>

		<div class="checkout-invoice-billing">
			<div class="checkout-invoice-billing-copy">
				<div class="checkout-invoice-billing-title">{{ translate('checkout.invoice.billingDetails') }}</div>
				<div class="checkout-invoice-billing-line">{{ translate('checkout.invoice.billingName') }} <strong>{{ billing_address.contact_name }}</strong></div>
				<div class="checkout-invoice-billing-line">{{ translate('checkout.invoice.billingAddress') }} <strong>{{ buildAddressLines(billing_address) }}</strong></div>
				<div class="checkout-invoice-billing-line">{{ translate('checkout.invoice.billingCompany') }} <strong>{{ billing_address.company }}</strong></div>
			</div>

			<button type="button" class="checkout-invoice-billing-button" @click="openModal">
				{{ translate('checkout.invoice.editBillingInfo') }}
			</button>
		</div>
	</section>
</template>

<style scoped lang="scss">
.checkout-invoice-hero {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 28px 20px;
	padding: 40px;
	background: #2b2d39;
	color: #f6f7fb;

	.checkout-invoice-brand {
		display: grid;
		gap: 18px;

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
	}

	.checkout-invoice-meta {
		display: grid;
		align-content: start;
		justify-items: end;
		gap: 14px;
		text-align: right;

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
	}

	.checkout-invoice-billing {
		grid-column: 1 / -1;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 20px;
		padding-top: 20px;
		border-top: 1px solid rgba(255, 255, 255, 0.12);

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
	}
}

@media (max-width: 900px) {
	.checkout-invoice-hero {
		grid-template-columns: 1fr;
		padding-left: 24px;
		padding-right: 24px;

		.checkout-invoice-meta {
			justify-items: start;
			text-align: left;
		}

		.checkout-invoice-billing {
			flex-direction: column;
		}
	}
}
</style>