<script setup lang="ts">
import { useCartPreviewHandler } from '~/composables/cart/preview/useCartPreviewHandler';

const {
	grand_total,
	formatPrice,
	redirecting_to_cart,
	goToCart,
	goToCheckout,
	close,
	t
} = useCartPreviewHandler('cart-preview-footer');
</script>

<template>
	<footer class="cart-preview-footer" data-testid="product-category-cart-footer">
		<div class="cart-preview-summary" data-testid="product-category-cart-summary">
			<p class="cart-preview-total" data-testid="product-category-cart-total-row">
				<span class="cart-preview-label">{{ t('cart.cartPreview.total') }}</span>
				<strong class="cart-preview-value">{{ formatPrice(grand_total) }}</strong>
			</p>
			<div class="cart-preview-note-row" data-testid="product-category-cart-note-row">
				<p class="cart-preview-note-label">{{ t('cart.cartPreview.noteLabel') }}</p>
				<p class="cart-preview-note">{{ t('cart.cartPreview.note') }}</p>
			</div>
		</div>
		<div class="cart-preview-actions" data-testid="product-category-cart-actions">
			<UiButton
				type="button"
				variant="outline"
				tone="neutral"
				size="md"
				height="48px"
				class="cart-preview-view-btn"
				:disabled="redirecting_to_cart"
				data-testid="product-category-cart-view-button"
				@click="goToCart(close)"
			>
				{{ t('cart.cartPreview.viewCart') }}
			</UiButton>
			<UiButton
				type="button"
				variant="filled"
				tone="neutral"
				size="md"
				height="48px"
				class="cart-preview-checkout-btn"
				data-testid="product-category-cart-checkout-button"
				@click="goToCheckout(close)"
			>
				<UiIcon name="regular-paper-plane" :size="16" color="#ffffff" />
				{{ t('cart.cartPreview.proceedToCheckout') }}
			</UiButton>
		</div>
	</footer>
</template>

<style scoped lang="scss">
.cart-preview-footer {
	border-top: 1px solid var(--gray-30);
	padding: 24px;
	display: flex;
	flex-direction: column;
	gap: 16px;

	.cart-preview-total {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 2px;

		.cart-preview-label {
			font-size: var(--type-size-200);
			line-height: var(--type-line-200);
			color: var(--text-primary);
		}

		.cart-preview-value {
			font-size: var(--type-size-400);
			line-height: var(--type-line-400);
			color: var(--text-primary);
		}
	}

	.cart-preview-note-row {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: start;
		column-gap: 10px;
	}

	.cart-preview-note-label {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
	}

	.cart-preview-note {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
		text-align: right;
	}

	.cart-preview-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}

	.cart-preview-view-btn {
		border-radius: 16px;
		border: 1px solid var(--gray-80);
		background: var(--contrast-light);
		color: var(--text-primary);
		font-size: var(--type-size-200);
		font-weight: var(--font-weight-semibold);
		line-height: var(--type-line-200);
		box-shadow: none;
		transition: background-color 0.18s ease;
		padding: 10px 16px;

		&:hover {
			background: var(--gray-20);
		}
	}

	.cart-preview-checkout-btn {
		border-radius: 16px;
		background: var(--gray-100);
		color: #ffffff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-size: var(--type-size-200);
		font-weight: var(--font-weight-semibold);
		line-height: var(--type-line-200);
		transition: filter 0.18s ease;
		padding: 10px 20px;

		&:hover {
			filter: brightness(1.05);
		}
	}
}

@media (max-width: 820px) {
	.cart-preview-footer {
		.cart-preview-total {
			.cart-preview-label {
				font-size: var(--type-size-500);
				line-height: var(--type-line-500);
			}

			.cart-preview-value {
				font-size: var(--type-size-550);
				line-height: var(--type-line-550);
			}
		}

		.cart-preview-actions {
			display: grid;
			grid-template-columns: 1fr;
		}

		.cart-preview-view-btn,
		.cart-preview-checkout-btn {
			width: 100%;
		}
	}
}
</style>