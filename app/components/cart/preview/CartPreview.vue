<script setup lang="ts">
import CartDeleteItemModal from '~/components/cart/modals/CartDeleteItemModal.vue';
import CartItemEditModal from '~/components/cart/modals/CartItemEditModal.vue';
import { useCartPreview } from '~/composables/cart/preview/useCartPreview';
import { useCartPreviewHandler } from '~/composables/cart/preview/useCartPreviewHandler';
import type { ProductItem } from '~/types/products/catalog';
import CartPreviewEmptyState from './CartPreviewEmptyState.vue';
import CartPreviewFeatured from './CartPreviewFeatured.vue';
import CartPreviewFooter from './CartPreviewFooter.vue';
import CartPreviewHeader from './CartPreviewHeader.vue';
import CartPreviewItems from './CartPreviewItems.vue';

const props = defineProps<{
	open: boolean;
}>();

const emit = defineEmits<{
	close: [];
}>();

const { t } = useI18n();

const {
	featuredItems,
	redirectingToCart: redirecting_to_cart,
	savingInlineEdit: saving_inline_edit,
	redirectLoaderRef: redirect_loader_ref,
	goToCart,
	goToCheckout,
	customizeFeaturedProduct,
} = useCartPreview({
	closePreview: () => emit('close'),
});

/**
 * Helper to get product name (fallback for sample data)
 */
function getProductName(product: ProductItem) {
	return product.name;
}

/**
 * Local total formatting
 */
function formatPrice(value: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(value);
}

const {
	items,
	grand_total,
	number_of_items,
	composePreview,
	formatImage,
} = useCartPreviewHandler('cart-preview')

watch(() => props.open, (v) => {
	if( v ) {
		console.warn('Composing cart preview...')
		composePreview()
	}
}, { immediate: true })

</script>

<template>
	<Teleport to="body">
		<Transition name="cart-preview-slide" appear>
			<div v-if="props.open" class="cart-preview-shell" data-testid="product-category-cart-overlay" @click.self="emit('close')">
				<UiLoadingOverlay
					:visible="redirecting_to_cart || saving_inline_edit"
					:label="redirecting_to_cart ? t('cart.cartPreview.redirectingToCart') : t('cart.cartPage.savingChanges')"
					test-id="product-category-cart-redirect-loading"
					transition-name="cart-redirect-fade"
					position="absolute"
					:z-index="2"
				>
					<div ref="redirect_loader_ref" aria-hidden="true" />
				</UiLoadingOverlay>

				<aside class="cart-preview-panel" role="dialog" aria-modal="true" data-testid="product-category-cart-dialog">
					<CartPreviewHeader
						:title="t('cart.cartPreview.previewTitle', { count: number_of_items })"
						:continue-shopping-label="t('cart.cartPreview.continueShopping')"
						@close="emit('close')"
					/>

					<div
						class="cart-preview-body"
						:class="{ 'cart-preview-body--empty': number_of_items === 0 }"
						data-testid="product-category-cart-body"
					>
						<CartPreviewEmptyState
							v-if="number_of_items === 0"
							:icon-alt="t('cart.cartPreview.emptyIconAlt')"
							:title="t('cart.cartPreview.emptyTitle')"
							:description="t('cart.cartPreview.emptyDescription')"
						/>

						<CartPreviewItems
							v-if="number_of_items > 0"
							:items="items"
							:format-image="formatImage"
							:format-price="formatPrice"
						/>

						<CartPreviewFeatured
							v-if="featuredItems.length > 0"
							:has-items="number_of_items > 0"
							:featured-items="featuredItems"
							:get-product-name="getProductName"
							:featured-start-price="(p) => formatPrice(5.00)"
							:title="t('cart.cartPreview.featuredItems')"
							:close-label="t('cart.cartPreview.closeFeaturedItems')"
							:starts-at-label="t('cart.cartPreview.startsAt')"
							:customize-label="t('cart.cartPreview.customize')"
							@close-featured="featuredItems = []"
							@customize="customizeFeaturedProduct"
						/>
					</div>

					<CartPreviewFooter
						v-if="number_of_items > 0"
						:total-label="t('cart.cartPreview.total')"
						:total-value="formatPrice(grand_total)"
						:note-label="t('cart.cartPreview.noteLabel')"
						:note="t('cart.cartPreview.note')"
						:view-cart-label="t('cart.cartPreview.viewCart')"
						:checkout-label="t('cart.cartPreview.proceedToCheckout')"
						:loading="redirecting_to_cart"
						@view-cart="goToCart"
						@checkout="goToCheckout"
					/>
				</aside>
			</div>
		</Transition>
	</Teleport>

	<CartItemEditModal  v-if="props.open"/>

	<CartDeleteItemModal  v-if="props.open"/>
</template>

<style scoped lang="scss">
.cart-preview-shell {
	position: fixed;
	inset: 0;
	background: transparent;
	z-index: 230;
	display: flex;
	align-items: stretch;
	justify-content: flex-end;

	.cart-preview-panel {
		width: min(540px, 100vw);
		max-width: 100vw;
		background: var(--contrast-light);
		border-left: 1px solid var(--gray-30);
		box-shadow: -20px 0 42px rgba(7, 14, 26, 0.16);
		height: 100dvh;
		display: grid;
		grid-template-rows: auto 1fr auto;
		overflow-x: hidden;
	}

	.cart-preview-body {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		overflow-x: hidden;
		padding: 0;
		min-height: 0;

		&.cart-preview-body--empty {
			display: grid;
			grid-template-rows: minmax(0, 1fr) auto;
			align-items: stretch;
			padding-top: 0;
			overflow: hidden;
		}
	}
}
</style>

<style lang="scss">
.cart-preview-slide-enter-active,
.cart-preview-slide-leave-active {
	transition: opacity 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}

.cart-preview-slide-enter-from,
.cart-preview-slide-leave-to {
	opacity: 0;
}

.cart-preview-slide-enter-from .cart-preview-panel,
.cart-preview-slide-leave-to .cart-preview-panel {
	transform: translateX(100%);
}

.cart-preview-slide-enter-active .cart-preview-panel,
.cart-preview-slide-leave-active .cart-preview-panel {
	transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}

.cart-redirect-fade-enter-active,
.cart-redirect-fade-leave-active {
	transition: opacity 0.16s ease;
}

.cart-redirect-fade-enter-from,
.cart-redirect-fade-leave-to {
	opacity: 0;
}
</style>