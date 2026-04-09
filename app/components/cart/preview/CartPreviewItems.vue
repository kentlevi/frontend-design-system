<script setup lang="ts">
import { useCartPreviewItem } from '~/composables/cart/preview/useCartPreviewItem';
import type { CartItem } from '~/types/cart/cart';
import { formattedPrice } from '~/utils/currency';

defineEmits<{
	(e: 'edit-item', item: CartItem): void;
	(e: 'remove-item', item_id : number): void;
}>();

const {
	items: cart_items,
	formatImage,
	deleteCartItem,
	editCartItem,
} = useCartPreviewItem()

</script>

<template>
	<section
		class="cart-preview-items-scroll"
		data-testid="product-category-cart-items-scroll"
	>
		<section
			class="cart-preview-items"
			data-testid="product-category-cart-items"
		>
			<article
				v-for="(item, index) in cart_items"
				:key="item?.id ?? index"
				class="cart-preview-item"
				data-testid="product-category-cart-item"
			>
				<div class="cart-preview-item-main" data-testid="product-category-cart-item-main">
					<div class="cart-preview-item-thumb">
						<img
							:src="formatImage(item)"
							:alt="item.artwork_file_name ?? item.artwork_preview ?? item.product_thumbnail"
							class="cart-preview-image"
						>
					</div>
					<div class="cart-preview-item-copy" data-testid="product-category-cart-item-copy">
						<h4 class="cart-preview-section-title" data-testid="product-category-cart-item-name">
							{{ item.product }}
							<UiIcon name="regular-info-circle" :size="20" color="#6d7180" />
						</h4>
						<p class="cart-preview-meta" data-testid="product-category-cart-item-size">Size: {{item.width}}x{{ item.height }}</p>
						<p class="cart-preview-meta" data-testid="product-category-cart-item-quantity">
							Quantity:
							{{ item.quantity.toLocaleString() }}
						</p>
					</div>
				</div>
				<div class="cart-preview-item-side" data-testid="product-category-cart-item-side">
					<strong class="cart-preview-item-price" data-testid="product-category-cart-item-price">
						{{ formattedPrice(item.cost) }}
					</strong>
					<div
						class="cart-preview-item-actions"
						data-testid="product-category-cart-item-actions"
					>
						<UiButton
							variant="ghost"
							tone="neutral"
							size="sm"
							class="cart-item-icon-btn"
							icon-only
							icon="strong-edit"
							:icon-size="24"
							sr-label="Edit item"
							data-testid="product-category-cart-item-edit-button"
							@click="$emit('edit-item', item); editCartItem(item)"
						/>
						<UiButton
							variant="ghost"
							tone="neutral"
							size="sm"
							class="cart-item-icon-btn"
							icon-only
							icon="strong-trash"
							:icon-size="24"
							sr-label="Remove item"
							data-testid="product-category-cart-item-delete-button"
							@click="deleteCartItem(item.id)"
						/>
					</div>
				</div>
			</article>
		</section>
	</section>
</template>

<style scoped lang="scss">
.cart-preview-items-scroll {
	min-height: 0;
	overflow: auto;
	height: 100%;
}

.cart-preview-items {
	display: grid;
	gap: 16px;
	padding: 24px;
}

.cart-preview-item {
	padding: 0 0 16px;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 12px;
	border-bottom: 1px solid var(--gray-30);
	min-height: 106px;

	.cart-preview-item-main {
		display: flex;
		align-items: flex-start;
		gap: 16px;
		min-width: 0;
	}

	.cart-preview-item-thumb {
		width: 72px;
		height: 72px;
		border-radius: 10px;
		background: var(--gray-10);
		overflow: hidden;
		flex-shrink: 0;

		.cart-preview-image {
			padding: 12px;
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
	}

	.cart-preview-item-copy {
		min-width: 0;
		flex: 1;
		min-height: 72px;

		.cart-preview-section-title {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			color: var(--text-primary);
		}

		.cart-preview-meta {
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			color: var(--text-secondary);
			min-height: 24px;
			display: flex;
			align-items: center;
		}
	}

	.cart-preview-item-side {
		display: grid;
		justify-items: end;
		gap: 8px;
		min-width: 118px;
		align-self: stretch;
		align-content: start;
	}

	.cart-preview-item-price {
		font-size: var(--type-size-300);
		line-height: var(--type-line-300);
		color: var(--text-primary);
		white-space: nowrap;
	}

	.cart-preview-item-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 16px;
		width: 100%;
		min-height: 32px;
	}

	.cart-item-icon-btn {
		width: 32px;
		height: 32px;
		min-width: 32px;
		border-radius: 6px;
		padding: 0;
		box-shadow: none;
		--btn-soft: transparent;
		--btn-border: transparent;

		&:hover {
			background: var(--gray-20);
		}
	}
}

@media (max-width: 820px) {
	.cart-preview-item {
		.cart-preview-item-price {
			font-size: var(--type-size-500);
			line-height: var(--type-line-500);
		}
	}
}
</style>