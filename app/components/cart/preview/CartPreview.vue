<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue';
import CartItemEditModal from '~/components/cart/modals/CartItemEditModal.vue';
import DeleteConfirmModal from '~/components/ui/DeleteConfirmModal.vue';
import { useCartPreview } from '~/composables/cart/preview/useCartPreview';
import { useCartPreviewHandler } from '~/composables/cart/preview/useCartPreviewHandler';
import type { ProductItem } from '~/types/products/catalog';
import type {
	CartPreviewItem,
	CartPreviewSizeOptionModel,
} from '~/types/cart/preview';
import type { CartItem } from '~/types/cart/cart';
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

const deleting_item_id = ref<string | null>(null);

function openDeleteModal(payload: { itemId: string | null }) {
	if (payload.itemId === null) return;
	deleting_item_id.value = payload.itemId;
}

function closeDeleteModal() {
	deleting_item_id.value = null;
}

const { t } = useI18n();

const {
	cartItems: items,
	sizeOptionModels,
	quantityOptions,
	grandTotal: grand_total,
	itemCount: number_of_items,
	featuredItems,
	editingItemId: editing_item_id,
	editingItem: editing_item,
	draftSizeKey: draft_size_key,
	draftCustomSizeWidth: draft_custom_size_width,
	draftCustomSizeHeight: draft_custom_size_height,
	draftQty: draft_qty,
	draftCustomQty: draft_custom_qty,
	redirectingToCart: redirecting_to_cart,
	savingInlineEdit: saving_inline_edit,
	redirectLoaderRef: redirect_loader_ref,
	openInlineEdit,
	cancelInlineEdit,
	saveInlineEdit,
	removeCartItem,
	getInlineSizeOptions,
	getInlineQtyOptions,
	goToCart,
	goToCheckout,
	customizeFeaturedProduct,
} = useCartPreview({
	closePreview: () => emit('close'),
});

function confirmDeleteItem() {
	if (deleting_item_id.value === null) return;
	removeCartItem(deleting_item_id.value);
	deleting_item_id.value = null;
}

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

/**
 * Local image formatting (fallback for sample data)
 */
function formatImage(item: CartPreviewItem) {
	return item.image || item.product.image;
}

function handleEditItem(item: CartPreviewItem) {
	openInlineEdit(item);
}
</script>

<template>
	<Teleport to="body">
		<Transition name="cart-preview-slide">
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
							@edit-item="handleEditItem"
							@remove-item="openDeleteModal"
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

	<CartItemEditModal
		v-if="editing_item"
		:model-value="Boolean(editing_item_id)"
		:item="editing_item"
		:size-options="getInlineSizeOptions(editing_item)"
		:quantity-options="getInlineQtyOptions(editing_item)"
		:size-key="draft_size_key"
		:custom-size-width="draft_custom_size_width"
		:custom-size-height="draft_custom_size_height"
		:qty="draft_qty"
		:custom-qty="draft_custom_qty"
		@update:model-value="!$event ? cancelInlineEdit() : undefined"
		@update:size-key="draft_size_key = $event"
		@update:custom-size-width="draft_custom_size_width = $event"
		@update:custom-size-height="draft_custom_size_height = $event"
		@update:qty="draft_qty = $event"
		@update:custom-qty="draft_custom_qty = $event"
		@cancel="cancelInlineEdit"
		@save="saveInlineEdit(editing_item.id)"
	/>

	<DeleteConfirmModal
		:model-value="Boolean(deleting_item_id)"
		:title="t('cart.cartPage.deleteItemTitle')"
		:description="t('cart.cartPage.deleteItemDescription')"
		:confirm-label="t('cart.cartPage.removeConfirm')"
		test-id="cart-item-delete-modal"
		@update:model-value="!$event ? closeDeleteModal() : undefined"
		@cancel="closeDeleteModal"
		@confirm="confirmDeleteItem"
	/>
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