<script setup lang="ts">
import { useFeaturedItem } from '~/composables/shared/featured-item/useFeaturedItem';
import { formatPrice } from '~/utils/currency/formatPrice';

const { t: translate } = useI18n()

const {
	number_of_items,
	featured_items,
	clear,
	requestFeaturedItems,
	formatImage,
	redirectCustomization,
} = useFeaturedItem('cart/preview/CartPreviewFeatured')


onMounted(() => {
	requestFeaturedItems()
})



</script>

<template>
	<section
		class="cart-featured"
		:class="{ 'cart-featured--with-item': number_of_items > 0 }"
		data-testid="product-category-cart-featured"
	>
		<div class="cart-featured-head" data-testid="product-category-cart-featured-head">
			<h4 class="cart-preview-section-title" data-testid="product-category-cart-featured-title">
				{{ translate('cart.cartPreview.featuredItems') }}
			</h4>
			<UiButton
				type="button"
				variant="ghost"
				tone="neutral"
				size="sm"
				icon-only
				icon="strong-times"
				icon-size="md"
				:sr-label="translate('cart.cartPreview.closeFeaturedItems')"
				class="cart-featured-close"
				data-testid="product-category-cart-featured-close-button"
				@click="clear"
			/>
		</div>
		<div class="cart-featured-grid" data-testid="product-category-cart-featured-list">
			<article
				v-for="item in featured_items"
				:key="item.url_slug"
				class="cart-featured-card"
				:data-testid="`product-category-cart-featured-item-${item.url_slug}`"
			>
				<div class="cart-featured-media">
					<img :src="formatImage(item.image)" :alt="item.product" class="cart-preview-image">
				</div>
				<div class="cart-featured-content">
					<h5 class="cart-featured-item-title">{{ item.product }}</h5>
					<p class="cart-featured-price">
						<span class="cart-preview-label">{{ translate('cart.cartPreview.startsAt') }}</span>
						<strong class="cart-preview-value">{{ formatPrice(item.price) }}</strong>
					</p>
					<UiButton
						type="button"
						variant="subtle"
						tone="neutral"
						class="cart-featured-customize-btn"
						@click="redirectCustomization(item)"
					>
						{{ translate('cart.cartPreview.customize') }}
					</UiButton>
				</div>
			</article>
		</div>
	</section>
</template>

<style scoped lang="scss">
.cart-featured {
	margin-top: 16px;
	padding: 16px 24px;
	border-top: 1px solid var(--gray-30);
	min-width: 0;

	&.cart-featured--with-item {
		margin-top: auto;
	}

	.cart-featured-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;

		.cart-preview-section-title {
			font-size: var(--type-size-200);
			line-height: var(--type-line-200);
			color: var(--text-primary);
		}
	}

	.cart-featured-close {
		width: 26px;
		height: 26px;
		min-width: 26px;
		border-radius: 6px;
		padding: 0;
		--btn-soft: transparent;
	}

	.cart-featured-grid {
		display: flex;
		flex-wrap: nowrap;
		gap: 10px;
		overflow-x: auto;
		overflow-y: hidden;
		padding-bottom: 12px;
		scrollbar-width: thin;
		width: 100%;
		max-width: 100%;
		min-width: 0;

		&::-webkit-scrollbar {
			height: 6px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background: var(--gray-50);
			border-radius: 999px;
		}
	}

	.cart-featured-card {
		min-width: 184px;
		flex: 0 0 184px;
		border: 1px solid var(--gray-30);
		border-radius: 10px;
		background: var(--contrast-light);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition: transform 0.2s ease, border-color 0.2s ease;

		&:hover {
			border-color: var(--gray-50);
		}

		.cart-preview-image {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}

		.cart-featured-item-title {
			font-size: var(--type-size-100);
			font-weight: var(--font-weight-medium);
			line-height: var(--type-line-100);
			color: var(--text-primary);
		}

		.cart-featured-customize-btn {
			width: 100%;
			margin: 0 auto;
			height: 32px;
			border-radius: 8px;
			background: var(--gray-20);
			color: var(--text-primary);
			font-size: var(--type-size-100);
			font-weight: var(--font-weight-semibold);
			line-height: var(--type-line-100);
			box-shadow: none;
			transition: background-color 0.18s ease;

			&:hover {
				background: var(--gray-30);
			}
		}
	}

	.cart-featured-media {
		height: 120px;
		background: var(--gray-10);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px 22px;
	}

	.cart-featured-content {
		padding: 16px;
		display: grid;
		gap: 8px;
	}

	.cart-featured-price {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;

		.cart-preview-label {
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			color: var(--text-secondary);
		}

		.cart-preview-value {
			font-size: var(--type-size-200);
			line-height: var(--type-line-200);
			color: var(--text-primary);
		}
	}
}
</style>