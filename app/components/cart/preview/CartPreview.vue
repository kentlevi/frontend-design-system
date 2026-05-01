<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useCartPreviewHandler } from '~/composables/cart/preview/useCartPreviewHandler';
import CartPreviewEmptyState from './CartPreviewEmptyState.vue';
import CartPreviewFeatured from './CartPreviewFeatured.vue';
import CartPreviewFooter from './CartPreviewFooter.vue';
import CartPreviewHeader from './CartPreviewHeader.vue';
import CartPreviewItems from './CartPreviewItems.vue';
import { useCartPreview } from '~/composables/cart/useCartPreview';
const CartItemEditModal = defineAsyncComponent(() => import('~/components/cart/modals/CartItemEditModal.vue'));
const CartDeleteItemModal = defineAsyncComponent(() => import('~/components/cart/modals/CartDeleteItemModal.vue'));

const {
	featured_items,
	redirecting_to_cart,
	saving_inline_edit,
	redirect_loader_ref,
	t
} = useCartPreviewHandler('cart-preview');


const {
	is_open,
	number_of_items,
	loading,
	requestItems,
} = useCartPreview('cart-preview')

watch(is_open, (v) => {
	if( v ) {
		requestItems();
	}
}, { immediate: true });
</script>

<template>
	<Teleport to="body">
		<Transition name="cart-preview-slide" appear>
			<div v-if="is_open" class="cart-preview-shell" data-testid="product-category-cart-overlay" @click.self="is_open = false">
				<aside class="cart-preview-panel" role="dialog" aria-modal="true" data-testid="product-category-cart-dialog">
					<UiLoadingOverlay
						:visible="redirecting_to_cart || saving_inline_edit"
						:label="redirecting_to_cart ? t('cart.cartPreview.redirectingToCart') : t('cart.cartPage.savingChanges')"
						test-id="product-category-cart-redirect-loading"
						position="absolute"
						:z-index="2"
					>
						<div ref="redirect_loader_ref" aria-hidden="true" />
					</UiLoadingOverlay>

					<CartPreviewHeader />

					<div
						class="cart-preview-body"
						:class="{ 'cart-preview-body--empty': !loading && number_of_items === 0 }"
						data-testid="product-category-cart-body"
					>
						<CartPreviewEmptyState v-if="!loading && number_of_items === 0" />

						<CartPreviewItems v-if="loading || number_of_items > 0" />

						<CartPreviewFeatured
							v-if="featured_items.length > 0"
						/>
					</div>

					<CartPreviewFooter
						v-if="number_of_items > 0"
					/>
				</aside>
			</div>
		</Transition>
	</Teleport>

	<CartItemEditModal v-if="is_open" />

	<CartDeleteItemModal v-if="is_open" />
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
		position: relative;
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
</style>