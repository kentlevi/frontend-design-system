<template>
	<div :class="list_classes">
		<template v-if="has_items">
			<div
				v-for="item in props.items"
				:key="item.id"
				class="checkout-summary-item"
			>
				<div class="checkout-summary-thumb">
					<img
						:src="item.artworkPreviewUrl || '/icons/custom/checkout/icon-box.svg'"
						:alt="item.product.name"
						class="checkout-summary-thumb-image"
					>
				</div>
				<div class="checkout-summary-info">
					<div class="checkout-summary-name">{{ item.product.name }}</div>
					<div class="checkout-summary-meta">
						{{ props.itemMeta(item.sizeLabel, item.qty) }}
					</div>
				</div>
				<div class="checkout-summary-price">{{ props.formatPrice(item.total) }}</div>
			</div>
		</template>
		<div v-else class="checkout-summary-skeleton" aria-hidden="true">
			<div v-for="n in 1" :key="n" class="checkout-summary-item is-skeleton">
				<div class="checkout-summary-thumb skeleton-block" />
				<div class="checkout-summary-info">
					<div class="checkout-summary-skeleton-line checkout-summary-skeleton-line--name" />
					<div class="checkout-summary-skeleton-line checkout-summary-skeleton-line--meta" />
				</div>
				<div class="checkout-summary-skeleton-line checkout-summary-skeleton-line--price" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CheckoutItem } from '~/types/checkout';

const props = defineProps<{
	tone: 'guest' | 'member';
	items: CheckoutItem[];
	formatPrice: (value: number) => string;
	itemMeta: (sizeLabel: string, qty: number) => string;
}>();

const has_items = computed(() => props.items.length > 0);
const list_classes = computed(() => ['checkout-summary-list', `is-${props.tone}`]);

</script>

<style scoped lang="scss">
.checkout-summary-list {
	max-height: 360px;
	overflow: auto;

	.checkout-summary-item {
		display: grid;
		grid-template-columns: 46px 1fr auto;
		align-items: center;
		gap: 12px;
		padding: 16px 18px;
		border-bottom: 1px solid var(--gray-50);

		.checkout-summary-thumb {
			width: 40px;
			height: 40px;
			border-radius: 8px;
			background: var(--gray-20);
			overflow: hidden;
			display: grid;
			place-items: center;

			&.skeleton-block {
				border-radius: 8px;
				background: linear-gradient(90deg, var(--gray-20) 25%, var(--gray-40) 37%, var(--gray-20) 63%);
				background-size: 400% 100%;
				animation: checkout-summary-skeleton-shimmer 1.4s ease-in-out infinite;
			}

			.checkout-summary-thumb-image {
				width: 26px;
				height: 26px;
				object-fit: contain;
			}
		}

		.checkout-summary-info {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 100%;

			.checkout-summary-name {
				color: var(--text-primary);
				font-size: var(--type-size-100);
				font-weight: var(--font-weight-bold);
				line-height: var(--type-line-100);
			}

			.checkout-summary-meta {
				color: var(--text-secondary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
			}
		}

		.checkout-summary-price {
			font-size: var(--type-size-200);
			font-weight: var(--font-weight-bold);
			line-height: var(--type-line-200);
			color: var(--text-primary);
		}

		.checkout-summary-skeleton-line {
			border-radius: 8px;
			background: linear-gradient(90deg, var(--gray-20) 25%, var(--gray-40) 37%, var(--gray-20) 63%);
			background-size: 400% 100%;
			animation: checkout-summary-skeleton-shimmer 1.4s ease-in-out infinite;

			&.checkout-summary-skeleton-line--name {
				width: 132px;
				height: 20px;
			}

			&.checkout-summary-skeleton-line--meta {
				width: 96px;
				height: 12px;
			}

			&.checkout-summary-skeleton-line--price {
				width: 58px;
				height: 14px;
				justify-self: end;
			}
		}
	}

	&.is-member {
		.checkout-summary-item {
			grid-template-columns: 40px 1fr auto;
			padding: 16px 24px;
			border-bottom-color: var(--gray-40);

			.checkout-summary-thumb {
				width: 40px;
				height: 40px;
				border-radius: 12px;

				.checkout-summary-thumb-image {
					width: 24px;
					height: 24px;
				}
			}
		}
	}
}

@keyframes checkout-summary-skeleton-shimmer {
	0% {
		background-position: 100% 0;
	}

	100% {
		background-position: 0 0;
	}
}
</style>