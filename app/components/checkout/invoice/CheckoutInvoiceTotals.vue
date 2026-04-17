<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
	subtotal: string;
	shippingLabel: string;
	shippingFee: string;
	discount: string;
	total: string;
}>();
</script>

<template>
	<section class="checkout-invoice-totals">
		<div class="checkout-invoice-totals-grid">
			<div class="checkout-invoice-total-line">
				<span>{{ t('checkout.invoice.totals.subtotal') }}</span>
				<strong>{{ subtotal }}</strong>
			</div>
			<div class="checkout-invoice-total-line">
				<span>{{ t('checkout.invoice.totals.shippingFee', { shippingLabel }) }}</span>
				<strong>{{ shippingFee }}</strong>
			</div>
			<div class="checkout-invoice-total-line is-discount">
				<span>{{ t('checkout.invoice.totals.discounts') }}</span>
				<strong>{{ discount }}</strong>
			</div>
			<div class="checkout-invoice-total-line is-final">
				<span>{{ t('checkout.invoice.totals.total') }}</span>
				<strong>{{ total }}</strong>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.checkout-invoice-totals {
	padding: 24px 40px 20px;
	background: #f4f4f6;

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
}

@media (max-width: 900px) {
	.checkout-invoice-totals {
		padding-left: 24px;
		padding-right: 24px;
	}
}

@media (max-width: 640px) {
	.checkout-invoice-totals {
		.checkout-invoice-total-line {
			font-size: 13px;

			&.is-final strong {
				font-size: 18px;
			}
		}
	}
}
</style>