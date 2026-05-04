<script setup lang="ts">
import CartItemDetailsModal from '~/components/cart/modals/CartItemDetailsModal.vue';
import CartItemEditModal from '~/components/cart/modals/CartItemEditModal.vue';
import CartEmptyState from './CartEmptyState.vue';
import CartPageHeader from './CartPageHeader.vue';
import CartPageItems from './CartPageItems.vue';
import CartPageSummary from './CartPageSummary.vue';
import CartPageSkeleton from './CartPageSkeleton.vue';
import CartDeleteItemModal from '~/components/cart/modals/CartDeleteItemModal.vue';
import { useCartPage } from '~/composables/cart/page/useCartPage';
import { useCartPage as useCartPageHandler } from '~/composables/cart/useCartPage';

const { t } = useI18n();
const {
	openItemDetails,
	saveItemArtworkDetails,
} = useCartPage();

const {
	refreshing_item,
	has_items,
	artwork_action_file_input_ref,
	open_artwork_modal,
	item_picking_artwork,
	openArtworkPicker,
	onArtworkActionSelected,
	refreshItems,
	updateSelectedArtwork,
} = useCartPageHandler()

onMounted(() => {
	refreshItems()
})
</script>

<template>
	<main class="cart-page" data-testid="cart-page">
		<input
			ref="artwork_action_file_input_ref"
			type="file"
			class="cart-item-artwork-action-input"
			accept=".eps,.ai,.psd,.pdf,.tif,.tiff,.png,.jpg,.jpeg"
			@change="onArtworkActionSelected"
		>

		<section class="cart-page-shell">
			<CartPageSkeleton v-if="refreshing_item" />

			<template v-else>
				<template v-if="has_items">
					<CartPageHeader
						:title="t('cart.cartPage.title')"
						continue-shopping-path="/stickers"
						:continue-shopping-label="t('cart.cartPage.continueShopping')"
					/>

					<section class="cart-page-layout">
						<CartPageItems
							@open-item-details="openItemDetails"
							@open-artwork-picker="openArtworkPicker"
							@update-artwork="updateSelectedArtwork"
						/>
						<CartPageSummary />
					</section>
				</template>

				<CartEmptyState v-else />
			</template>
		</section>

		<!-- Confirmation of Item Deletion -->
		<CartDeleteItemModal />
		<!-- Artwork Update Modal -->
		<CartItemDetailsModal
			:model-value="open_artwork_modal"
			:item="item_picking_artwork"
			@cancel="open_artwork_modal = false"
			@save="saveItemArtworkDetails"
		/>
		<!-- Editing Item Details -->
		<CartItemEditModal :show-quantity="false" />
	</main>
</template>

<style scoped lang="scss">
.cart-page {
	min-height: calc(100dvh - 120px);
	background: var(--bg-page);

	.cart-item-artwork-action-input {
		display: none;
	}

	.cart-page-shell {
		position: relative;
		max-width: 1200px;
		margin: 0 auto;
	}
	.cart-page-layout {
		margin-top: 26px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 282px;
		gap: 34px;
	}
}

@media (max-width: 980px) {
	.cart-page {
		.cart-page-layout {
			grid-template-columns: 1fr;
		}
	}
}
</style>