<script setup lang="ts">
import type { CartItem } from '~/types/cart/cart';
import { formatPrice } from '~/utils/currency/formatPrice';

defineProps<{
	items: CartItem[];
}>();
</script>

<template>
	<section class="checkout-invoice-items">
		<div class="checkout-invoice-items-table">

			<div class="checkout-invoice-items-head">
				<span>Item</span>
				<span>Qty.</span>
				<span>Amount</span>
			</div>

			<ClientOnly>
				<template #default>
					<div
						v-for="(item, index) in items"
						:key="item.id ?? index"
						class="checkout-invoice-items-row"
					>
						<span>{{ item.product }}</span>
						<span>{{ item.quantity }}</span>
						<strong>{{ formatPrice(item.cost) }}</strong>
					</div>
				</template>

				<!-- FALLBACK SKELETON -->
				<template #fallback>
					<div
						v-for="n in 2"
						:key="n"
						class="checkout-invoice-items-row is-skeleton"
					>
						<span><span class="skeleton-bar" style="width: 65%;" /></span>
						<span><span class="skeleton-bar" style="width: 28px;" /></span>
						<strong><span class="skeleton-bar" style="width: 56px;" /></strong>
					</div>
				</template>
			</ClientOnly>

		</div>
	</section>
</template>

<style scoped lang="scss">
.checkout-invoice-items {
	padding: 28px 40px 30px;
	background: #ffffff;

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

	.skeleton-bar {
		display: inline-block;
		height: 12px;
		border-radius: 4px;
		background: linear-gradient(90deg, #e8eaf0 25%, #f4f5f8 50%, #e8eaf0 75%);
		background-size: 200% 100%;
		animation: skeleton-shimmer 1.4s ease-in-out infinite;
	}

	@keyframes skeleton-shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
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
}

@media (max-width: 900px) {
	.checkout-invoice-items {
		padding-left: 24px;
		padding-right: 24px;
	}
}

@media (max-width: 640px) {
	.checkout-invoice-items {
		.checkout-invoice-items-head,
		.checkout-invoice-items-row {
			grid-template-columns: minmax(0, 1fr) 84px 104px;
			padding: 12px 14px;
			font-size: 12px;
		}
	}
}
</style>