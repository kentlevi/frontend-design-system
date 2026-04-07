<template>
	<section class="checkout-confirmation-summary">
		<header class="checkout-confirmation-summary-head">
			<h2 class="checkout-confirmation-summary-title">{{ props.title }}</h2>
			<NuxtLink :to="props.orderDetailsPath" class="checkout-confirmation-summary-order">
				{{ props.orderNumberLabel }}
			</NuxtLink>
		</header>

		<div class="checkout-confirmation-summary-body">
			<div
				v-for="item in props.items"
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
					<div class="checkout-confirmation-item-meta">{{ props.itemMeta(item.sizeLabel, item.qty) }}</div>
				</div>
				<div class="checkout-confirmation-item-price">{{ props.formatPrice(item.total) }}</div>
			</div>

			<div class="checkout-confirmation-totals">
				<div class="checkout-confirmation-total-line">
					<span class="checkout-confirmation-total-label">{{ props.subtotalLabel }}</span>
					<strong class="checkout-confirmation-total-value">{{ props.formatPrice(props.subtotal) }}</strong>
				</div>
				<div class="checkout-confirmation-total-line">
					<span class="checkout-confirmation-total-label">{{ props.shippingFeeLabel }}</span>
					<strong class="checkout-confirmation-total-value">{{ props.formatPrice(props.shippingFee) }}</strong>
				</div>
				<div class="checkout-confirmation-total-line is-discount">
					<span class="checkout-confirmation-total-label">{{ props.discountLabel }}</span>
					<strong class="checkout-confirmation-total-value">{{ props.formatPrice(props.discount) }}</strong>
				</div>
				<div class="checkout-confirmation-total-line is-final">
					<span class="checkout-confirmation-total-label">{{ props.totalLabel }}</span>
					<strong class="checkout-confirmation-total-value">{{ props.formatPrice(props.total) }}</strong>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import type { CheckoutItem } from '~/types/checkout';

const props = defineProps<{
	title: string;
	orderNumberLabel: string;
	orderDetailsPath: string;
	items: CheckoutItem[];
	itemMeta: (sizeLabel: string, qty: number) => string;
	formatPrice: (value: number) => string;
	subtotalLabel: string;
	shippingFeeLabel: string;
	discountLabel: string;
	totalLabel: string;
	subtotal: number;
	shippingFee: number;
	discount: number;
	total: number;
}>();
</script>

<style scoped lang="scss">
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
</style>