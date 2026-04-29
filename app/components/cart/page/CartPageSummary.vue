<script setup lang="ts">
import { useCartPageSummary } from '~/composables/cart/page/useCartPageSummary';
import { formatPrice } from '~/utils/currency/formatPrice';

const { t } = useI18n();
const {
	selected_total,
	selected_ids,
	payment_options,
	goToCheckout,
} = useCartPageSummary();
</script>

<template>
	<aside class="cart-summary-column" data-testid="cart-page-summary">
		<section class="cart-summary-card">
			<header class="cart-summary-header">
				<h2 class="cart-summary-title">{{ t('cart.cartPage.orderSummary') }}</h2>
			</header>
			<div class="cart-summary-body">
				<div class="cart-summary-line">
					<span class="cart-summary-total-label">{{ t('cart.cartPage.total') }}</span>
					<strong class="cart-summary-total-value">{{ formatPrice(selected_total) }}</strong>
				</div>
				<div class="cart-summary-actions">
					<UiButton
						type="button"
						variant="filled"
						tone="neutral"
						size="md"
						class="cart-checkout-btn"
						:disabled="selected_ids.length === 0"
						@click="goToCheckout"
					>
						{{ t('cart.cartPage.proceedToCheckout') }}
					</UiButton>
					<p class="cart-summary-note">{{ t('cart.cartPage.note') }}</p>
				</div>
			</div>
		</section>

		<section class="cart-payment-section">
			<p class="cart-payment-label">{{ t('cart.cartPage.securedPayments') }}</p>
			<div class="cart-payment-grid">
				<span
					v-for="option in payment_options"
					:key="option.key"
					class="cart-payment-chip"
				>
					<img
						:src="option.icon"
						:alt="option.label"
						class="cart-payment-chip-icon"
						loading="lazy"
					>
				</span>
			</div>
		</section>
	</aside>
</template>

<style scoped lang="scss">
.cart-summary-column {
	position: sticky;
	top: 24px;
	align-self: start;
	max-width: 282px;
	display: flex;
	flex-direction: column;
	gap: 24px;

	.cart-summary-card {
		border: 1px solid var(--gray-30);
		border-radius: 16px;
		background: var(--bg-page);

		.cart-summary-header {
			padding: 16px 24px;
			border-bottom: 1px solid var(--gray-30);

			.cart-summary-title {
				font-size: var(--type-size-200);
				font-weight: var(--font-weight-bold);
				line-height: var(--type-line-200);
				color: var(--text-primary);
			}
		}

		.cart-summary-body {
			padding: 16px 24px;
			display: flex;
			flex-direction: column;
			gap: 16px;

			.cart-summary-line {
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: var(--text-primary);

				.cart-summary-total-label {
					font-size: var(--type-size-100);
					font-weight: var(--font-weight-semibold);
					line-height: var(--type-line-100);
				}

				.cart-summary-total-value {
					font-size: var(--type-size-400);
					line-height: var(--type-line-400);
					font-weight: var(--font-weight-bold);
				}
			}

			.cart-summary-actions {
				display: flex;
				flex-direction: column;
				gap: 10px;
				align-items: center;

				.cart-checkout-btn {
					width: 100%;
					height: 48px;
					border-radius: 16px;
					font-size: var(--type-size-200);
					font-weight: var(--font-weight-medium);
					line-height: var(--type-line-200);
					box-shadow: none;
				}

				.cart-summary-note {
					color: var(--text-secondary);
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
				}
			}
		}
	}

	.cart-payment-section {
		display: flex;
		flex-direction: column;
		gap: 8px;

		.cart-payment-label {
			color: var(--text-primary);
			font-size: var(--type-size-100);
			font-weight: var(--font-weight-regular);
			line-height: var(--type-line-100);
		}

		.cart-payment-grid {
			display: flex;
			gap: 12px;
			flex-wrap: wrap;

			.cart-payment-chip {
				width: 24px;
				height: 24px;
				display: grid;
				place-items: center;

				.cart-payment-chip-icon {
					width: 24px;
					height: 24px;
					object-fit: contain;
					display: block;
				}
			}
		}
	}
}

@media (max-width: 980px) {
	.cart-summary-column {
		position: static;
		top: auto;
		max-width: none;
	}
}
</style>