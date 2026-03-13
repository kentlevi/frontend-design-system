<script setup lang="ts">
import { computed } from 'vue';
import { useCheckoutGuest } from '~/composables/checkout/guest/useCheckoutGuest';
import { useCountry } from '~/composables/app/country/useCountry';

definePageMeta({
	layout: 'home',
	headerVariant: 'default',
	footerVariant: 'compact',
});

const { t } = useI18n();
const route = useRoute();
const { withCountry } = useCountry();
const orderNo = computed(() => String(route.params.orderNo || ''));
const { selectedCheckoutItems, orderSubtotal, orderShippingFee, orderDiscount, orderTotal, formatPrice, sizeDimOnly } = useCheckoutGuest();
const primaryItem = computed(() => selectedCheckoutItems.value[0] || null);
</script>

<template>
	<section class="order-details-page" data-testid="order-details-page">
		<div class="order-details-card" data-testid="order-details-card">
			<header class="order-details-head">
				<div class="order-details-crumbs">
					<NuxtLink :to="withCountry('/under-construction')" class="order-details-crumb-link">{{ t('checkout.orderDetails.orders') }}</NuxtLink>
					<UiIcon
						name="regular-chevron-right" :size="24" color="var(--text-primary)"
						class="order-details-crumb-icon" />
					<span class="order-details-crumb-current">{{ t('checkout.orderDetails.title') }}</span>
				</div>

				<div class="order-details-title-row">
					<h1 class="order-details-title">{{ t('checkout.orderDetails.orderNumber', { orderNumber: orderNo }) }}</h1>
					<span class="order-details-chip">{{ t('checkout.orderDetails.status') }}</span>
				</div>
			</header>

			<section class="order-details-actions">
				<div class="order-details-action-row">
					<div class="order-details-action-icon">
						<UiIcon name="regular-invoice-check" :size="24" color="var(--gold-70)" />
					</div>
					<div class="order-details-action-copy">
						<h2 class="order-details-action-title">{{ t('checkout.orderDetails.viewInvoice') }}</h2>
						<p class="order-details-action-text">{{ t('checkout.orderDetails.viewInvoiceText') }}</p>
					</div>
				</div>
				<div class="order-details-action-divider" aria-hidden="true" />

				<div class="order-details-action-row">
					<div class="order-details-action-icon">
						<UiIcon name="regular-dollar-sign" :size="24" color="var(--gold-70)" />
					</div>
					<div class="order-details-action-copy">
						<h2 class="order-details-action-title">{{ t('checkout.orderDetails.paymentProof') }}</h2>
						<p class="order-details-action-text">{{ t('checkout.orderDetails.paymentProofText') }}</p>
					</div>
					<div class="order-details-payment-meta">
						<span class="order-details-paid-chip">{{ t('checkout.orderDetails.paid') }}</span>
						<span class="order-details-method">{{ t('checkout.orderDetails.paymentMethod', { method: t('checkout.orderDetails.paymentMethodValue') }) }}</span>
					</div>
				</div>
			</section>

			<section class="order-details-summary">
				<div class="order-details-summary-main">
					<h2 class="order-details-summary-title">{{ t('checkout.orderDetails.orderSummary') }}</h2>

					<div class="order-details-item">
						<div class="order-details-item-thumb">
							<img
								:src="primaryItem?.artworkPreviewUrl || primaryItem?.product.image || '/icons/custom/checkout/icon-box.svg'"
								:alt="primaryItem?.product.name || t('checkout.orderDetails.orderItemAlt')" class="order-details-item-image">
						</div>
						<div class="order-details-item-copy">
							<div class="order-details-item-heading">
								<span class="order-details-item-no">{{ t('checkout.orderDetails.itemNumber', { number: '001' }) }}</span>
								<UiIcon name="regular-info-circle" :size="20" color="var(--text-secondary)" />
								<span class="order-details-item-warning">
									<UiIcon name="strong-exclamation-triangle" :size="16" color="var(--error-60)" />
									{{ t('checkout.orderDetails.lackingArtwork') }}
								</span>
							</div>
							<div class="order-details-item-meta-group">
								<p class="order-details-item-meta">{{ t('checkout.orderDetails.size', {
									size: primaryItem ? sizeDimOnly(primaryItem.sizeLabel) : '100x100mm',
								}) }}</p>
								<p class="order-details-item-meta">{{ t('checkout.orderDetails.quantity', {
									quantity: primaryItem ? primaryItem.qty.toLocaleString() : '10,000',
								}) }}</p>
							</div>
						</div>
						<div class="order-details-item-side">
							<UiButton
								type="button" variant="filled" tone="neutral" size="md" height="40px"
								class="order-details-upload-btn">
								{{ t('checkout.orderDetails.uploadArtwork') }}
							</UiButton>
							<strong class="order-details-item-price">{{ formatPrice(primaryItem?.total || orderTotal)
							}}</strong>
						</div>
					</div>
				</div>

				<div class="order-details-totals">
					<div class="order-details-total-line">
						<span class="order-details-total-line-label">{{ t('checkout.orderDetails.summary.subtotal') }}</span>
						<strong class="order-details-total-value">{{ formatPrice(orderSubtotal) }}</strong>
					</div>
					<div class="order-details-total-line">
						<span class="order-details-total-line-label">{{ t('checkout.orderDetails.summary.shippingFee', { method: t('checkout.orderDetails.shippingMethod') }) }}</span>
						<strong class="order-details-total-value">{{ formatPrice(orderShippingFee) }}</strong>
					</div>
					<div class="order-details-total-line is-discount">
						<span class="order-details-total-line-label">{{ t('checkout.orderDetails.summary.discounts') }}</span>
						<strong class="order-details-total-value">-{{ formatPrice(orderDiscount) }}</strong>
					</div>
					<div class="order-details-total-line is-final">
						<span class="order-details-total-line-label">{{ t('checkout.orderDetails.summary.total') }}</span>
						<strong class="order-details-total-value">{{ formatPrice(orderTotal) }}</strong>
					</div>
				</div>
			</section>
		</div>
	</section>
</template>

<style scoped lang="scss">
.order-details-page {
	padding: 40px 0 162px 0;
	background: var(--white-base);
	min-height: calc(100vh - 320px);

	.order-details-card {
		max-width: 1200px;
		margin: 0 auto;
		padding: 32px 40px;
		border: 1px solid var(--gray-50);
		border-radius: 10px;
		background: var(--white-base);
		display: flex;
		flex-direction: column;
		gap: 32px;

		.order-details-head {
			display: flex;
			flex-direction: column;
			gap: 4px;

			.order-details-crumbs {
				display: flex;
				align-items: center;
				gap: 4px;
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);

				.order-details-crumb-icon {
					padding: 2px 0;
				}

				.order-details-crumb-link {
					color: var(--gold-70);
					text-decoration: none;
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					font-weight: var(--font-weight-bold);
				}

				.order-details-crumb-current {
					color: var(--text-primary);
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					font-weight: var(--font-weight-semibold);
				}
			}

			.order-details-title-row {
				display: flex;
				align-items: center;
				gap: 16px;

				.order-details-title {

					font-size: var(--type-size-400);
					line-height: var(--type-line-400);
					color: var(--text-primary);
				}

				.order-details-chip {
					padding: 0 12px;
					border-radius: 999px;
					background: var(--amber-base);
					display: inline-flex;
					align-items: center;
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					font-weight: var(--font-weight-bold);
					color: var(--white-base);
				}
			}
		}

		.order-details-actions {
			border-bottom: 1px solid var(--gray-50);

			.order-details-action-row {
				padding-bottom: 17px;
				display: grid;
				grid-template-columns: 40px 1fr auto;
				align-items: center;
				gap: 16px;

				.order-details-action-icon {
					width: 40px;
					height: 40px;
					border-radius: 999px;
					background: #f6efcf;
					display: grid;
					place-items: center;
				}

				.order-details-action-copy {
					.order-details-action-title {

						font-size: var(--type-size-200);
						line-height: var(--type-line-200);
						color: var(--text-primary);
					}

					.order-details-action-text {
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
						color: var(--text-secondary);
					}
				}

				.order-details-payment-meta {
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					gap: 6px;

					.order-details-paid-chip {
						padding: 0 12px;
						border-radius: 999px;
						border: 1px solid var(--success-30);
						background: transparent;
						color: var(--success-60);
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
						font-weight: var(--font-weight-semibold);
					}

					.order-details-method {
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
						color: var(--text-secondary);
					}
				}
			}

			.order-details-action-divider {
				height: 1px;
				background: var(--gray-50);
				margin-bottom: 16px;
			}
		}

		.order-details-summary {
			.order-details-summary-main {
				.order-details-summary-title {
					margin: 0 0 16px;
					font-size: var(--type-size-200);
					line-height: var(--type-line-200);
					color: var(--text-primary);
				}

				.order-details-item {
					display: grid;
					grid-template-columns: 88px 1fr auto;
					gap: 22px;
					align-items: center;
					padding-bottom: 20px;
					border-bottom: 1px solid var(--gray-50);

					.order-details-item-thumb {
						width: 88px;
						height: 88px;
						border-radius: 8px;
						background: var(--gray-20);
						display: grid;
						place-items: center;
						overflow: hidden;

						.order-details-item-image {
							width: 56px;
							height: 56px;
							object-fit: contain;
						}
					}

					.order-details-item-copy {
						display: flex;
						flex-direction: column;
						gap: 8px;

						.order-details-item-heading {
							display: flex;
							align-items: center;
							gap: 8px;
							flex-wrap: wrap;

							.order-details-item-no {
								font-size: var(--type-size-200);
								line-height: var(--type-line-200);
								font-weight: var(--font-weight-bold);
								color: var(--text-primary);
							}

							.order-details-item-warning {
								display: inline-flex;
								align-items: center;
								gap: 6px;
								padding: 0 12px;
								border: 1px solid var(--error-30);
								border-radius: 999px;
								color: var(--error-60);
								font-size: var(--type-size-100);
								line-height: var(--type-line-100);
								font-weight: var(--font-weight-bold);
							}
						}

						.order-details-item-meta-group {
							display: flex;
							flex-direction: column;
							gap: 4px;

							.order-details-item-meta {
								font-size: var(--type-size-100);
								line-height: var(--type-line-100);
								color: var(--text-secondary);
							}
						}
					}

					.order-details-item-side {
						display: flex;
						flex-direction: column;
						align-items: flex-end;
						gap: 14px;

						.order-details-upload-btn {
							border-radius: 16px;
							padding: 0 16px;
							font-size: var(--type-size-100);
							line-height: var(--type-line-100);
						}

						.order-details-item-price {
							font-size: var(--type-size-200);
							line-height: var(--type-line-200);
							font-weight: var(--font-weight-bold);
							color: var(--text-primary);
						}
					}
				}
			}

			.order-details-totals {
				padding-top: 18px;
				display: grid;
				gap: 4px;

				.order-details-total-line {
					display: flex;
					align-items: baseline;
					justify-content: space-between;
					font-size: var(--type-size-300);
					line-height: var(--type-line-300);
					color: var(--text-secondary);

					.order-details-total-line-label, .order-details-total-value {
						color: var(--text-secondary);
						font-size: var(--type-size-100);
						font-weight: var(--font-weight-semibold);
						line-height: var(--type-line-100);
					}

					&.is-discount .order-details-total-value {
						color: var(--error);
					}

					&.is-final {
						margin-top: 2px;
						color: var(--text-primary);
						font-weight: var(--font-weight-semibold);

						.order-details-total-line-label{
							color: var(--text-primary);
							font-size: var(--type-size-100);
							font-weight: var(--font-weight-semibold);
							line-height: var(--type-line-100);
						}
						.order-details-total-value {
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

@media (max-width: 980px) {
	.order-details-page {
		padding: 28px 16px 80px;

		.order-details-card {
			padding: 22px 18px;

			.order-details-head {
				.order-details-title-row {
					flex-wrap: wrap;
				}
			}

			.order-details-actions {
				.order-details-action-row {
					grid-template-columns: 40px 1fr;

					.order-details-payment-meta {
						grid-column: 1 / -1;
						align-items: flex-start;
						padding-left: 56px;
					}
				}
			}

			.order-details-summary {
				.order-details-summary-main .order-details-item {
					grid-template-columns: 1fr;

					.order-details-item-side {
						align-items: flex-start;
					}
				}
			}
		}
	}
}
</style>