<script setup lang="ts">
import { computed } from 'vue';
import { useCheckoutGuest } from '~/composables/checkout/guest/useCheckoutGuest';
import { useCountry } from '@/composables/app/country/useCountry';

const { t } = useI18n();
const { withCountry } = useCountry();
const { selectedCheckoutItems, orderSubtotal, orderShippingFee, orderDiscount, orderTotal, formatPrice, sizeDimOnly } = useCheckoutGuest({
	labelCountry: 'us',
});

const orderNumber = computed(() => '12405070009');
const orderDetailsPath = computed(() => withCountry(`/orders/${orderNumber.value}`));
const estimatedArrival = computed(() => {
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
			<header class="checkout-confirmation-head">
				<div class="checkout-confirmation-title-wrap">
					<img
						src="/icons/custom/checkout/icon-box.svg"
						alt=""
						width="48"
						height="48"
						aria-hidden="true"
						class="checkout-confirmation-icon-image"
					>
					<h1 class="checkout-confirmation-title">{{ t('checkout.confirmation.title') }}</h1>
				</div>
				<NuxtLink :to="withCountry('/')" class="checkout-confirmation-home-link">{{ t('checkout.confirmation.goHome') }}</NuxtLink>
			</header>

			<p class="checkout-confirmation-note">
				{{ t('checkout.confirmation.notePrefix') }}
				<a href="tel:+6531582800">+65 3158 2800</a> or email at
				<a href="mailto:info@mustickers.com">info@mustickers.com</a>.
				{{ t('checkout.confirmation.noteSuffix') }}
			</p>

			<section class="checkout-confirmation-delivery">
				<div class="checkout-confirmation-delivery-label">{{ t('checkout.confirmation.expectedDelivery') }}</div>
				<div class="checkout-confirmation-delivery-value">{{ t('checkout.confirmation.expectedArrival', { date: estimatedArrival }) }}</div>
			</section>

			<section class="checkout-confirmation-summary">
				<header class="checkout-confirmation-summary-head">
					<h2 class="checkout-confirmation-summary-title">{{ t('checkout.confirmation.orderSummary') }}</h2>
					<NuxtLink :to="orderDetailsPath" class="checkout-confirmation-summary-order">
						{{ t('checkout.confirmation.orderNumber', { orderNumber }) }}
					</NuxtLink>
				</header>

				<div class="checkout-confirmation-summary-body">
					<div
						v-for="item in selectedCheckoutItems"
						:key="item.id"
						class="checkout-confirmation-item"
					>
						<div class="checkout-confirmation-item-thumb">
							<img
								:src="item.artworkPreviewUrl || item.product.image"
								:alt="item.product.name"
								class="checkout-confirmation-item-image"
							>
						</div>
						<div class="checkout-confirmation-item-copy">
							<div class="checkout-confirmation-item-name">{{ item.product.name }}</div>
							<div class="checkout-confirmation-item-meta">{{ sizeDimOnly(item.sizeLabel) }} / {{ item.qty.toLocaleString() }}</div>
						</div>
						<div class="checkout-confirmation-item-price">{{ formatPrice(item.total) }}</div>
					</div>

					<div class="checkout-confirmation-totals">
						<div class="checkout-confirmation-total-line">
							<span class="checkout-confirmation-total-label">{{ t('checkout.confirmation.summary.subtotal') }}</span>
							<strong class="checkout-confirmation-total-value">{{ formatPrice(orderSubtotal) }}</strong>
						</div>
						<div class="checkout-confirmation-total-line">
							<span class="checkout-confirmation-total-label">{{ t('checkout.confirmation.summary.shippingFee') }}</span>
							<strong class="checkout-confirmation-total-value">{{ formatPrice(orderShippingFee) }}</strong>
						</div>
						<div class="checkout-confirmation-total-line is-discount">
							<span class="checkout-confirmation-total-label">{{ t('checkout.confirmation.summary.discounts') }}</span>
							<strong class="checkout-confirmation-total-value">{{ formatPrice(orderDiscount) }}</strong>
						</div>
						<div class="checkout-confirmation-total-line is-final">
							<span class="checkout-confirmation-total-label">{{ t('checkout.confirmation.summary.total') }}</span>
							<strong class="checkout-confirmation-total-value">{{ formatPrice(orderTotal) }}</strong>
						</div>
					</div>
				</div>
			</section>
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

		.checkout-confirmation-head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;

			.checkout-confirmation-title-wrap {
				display: flex;
				align-items: center;
				gap: 14px;

				.checkout-confirmation-icon-image {
					width: 48px;
					height: 48px;
					display: block;
					flex: 0 0 48px;
				}

				.checkout-confirmation-title {

					font-size: var(--type-size-350);
					font-weight: var(--font-weight-semibold);
					line-height: var(--type-line-200);
					color: var(--text-primary);
				}
			}

			.checkout-confirmation-home-link {
				color: var(--text-primary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				font-weight: var(--font-weight-semibold);
				text-decoration: none;
				padding: 8px 24px;
			}
		}

		.checkout-confirmation-note {
			color: var(--text-secondary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);

			a {
				color: var(--text-primary);
				font-weight: var(--font-weight-bold);
			}
		}

		.checkout-confirmation-delivery {
			padding: 14px 18px;
			border: 1px solid var(--gray-50);
			border-radius: 10px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;

			.checkout-confirmation-delivery-label {
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				font-weight: var(--font-weight-semibold);
				color: var(--text-primary);
			}

			.checkout-confirmation-delivery-value {
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				color: var(--text-secondary);
			}
		}

		.checkout-confirmation-summary {
			border: 1px solid var(--gray-50);
			border-radius: 10px;
			overflow: hidden;

			.checkout-confirmation-summary-head {
				padding: 14px 22px;
				border-bottom: 1px solid var(--gray-50);
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 16px;

				.checkout-confirmation-summary-title {

					font-size: var(--type-size-100);
					font-weight: var(--font-weight-semibold);
					line-height: var(--type-line-100);
					color: var(--text-primary);
				}

				.checkout-confirmation-summary-order {
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					font-weight: var(--font-weight-bold);
					color: var(--text-primary);
					text-decoration: underline;
				}
			}

			.checkout-confirmation-summary-body {
				padding: 0 24px;

				.checkout-confirmation-item {
					display: grid;
					grid-template-columns: 64px 1fr auto;
					gap: 14px;
					padding: 24px 0;
					border-bottom: 1px solid var(--gray-50);

					.checkout-confirmation-item-thumb {
						width: 64px;
						height: 64px;
						border-radius: 8px;
						background: var(--gray-30);
						display: grid;
						place-items: center;
						overflow: hidden;

						.checkout-confirmation-item-image {
							width: 40px;
							height: 40px;
							object-fit: contain;
						}
					}

					.checkout-confirmation-item-copy {
						.checkout-confirmation-item-name {
							font-size: var(--type-size-100);
							line-height: var(--type-line-100);
							font-weight: var(--font-weight-bold);
							color: var(--text-primary);
						}

						.checkout-confirmation-item-meta {
							font-size: var(--type-size-100);
							line-height: var(--type-line-100);
							color: var(--text-secondary);
						}
					}

					.checkout-confirmation-item-price {
						font-size: var(--type-size-300);
						line-height: var(--type-line-300);
						font-weight: var(--font-weight-bold);
						color: var(--text-primary);
					}
				}

				.checkout-confirmation-totals {
					padding: 24px 0;
					display: grid;
					gap: 4px;

					.checkout-confirmation-total-line {
						display: flex;
						align-items: baseline;
						justify-content: space-between;
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
						color: var(--text-secondary);

						.checkout-confirmation-total-value {
							color: var(--text-secondary);
							font-weight: var(--font-weight-semibold);
						}

						&.is-discount .checkout-confirmation-total-value {
							color: var(--error);
						}

						&.is-final {
							color: var(--text-primary);
							font-weight: var(--font-weight-semibold);

							.checkout-confirmation-total-value {
								font-size: var(--type-size-400);
								line-height: var(--type-line-400);
								font-weight: var(--font-weight-bold);
								color: var(--text-primary);
							}
						}
					}
				}
			}
		}
	}
}

@media (max-width: 900px) {
	.checkout-confirmation-page {
		.checkout-confirmation-card {
			padding: 24px 18px;

			.checkout-confirmation-head,
			.checkout-confirmation-delivery,
			.checkout-confirmation-summary .checkout-confirmation-summary-head {
				flex-direction: column;
				align-items: flex-start;
			}
		}
	}
}
</style>