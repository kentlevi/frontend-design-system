<script setup lang="ts">
import CartItemDetailsModal from '~/components/cart/modals/CartItemDetailsModal.vue';
import CartItemEditModal from '~/components/cart/modals/CartItemEditModal.vue';
import CartEmptyState from './CartEmptyState.vue';
import CartPageHeader from './CartPageHeader.vue';
import CartPageList from './CartPageList.vue';
import CartPageSummary from './CartPageSummary.vue';
import CartPageSkeleton from './CartPageSkeleton.vue';
import CartDeleteItemModal from '~/components/cart/modals/CartDeleteItemModal.vue';
import { useCartPage } from '~/composables/cart/page/useCartPage';

const { t } = useI18n();
const {
	loading,
	detail_item_id,
	detail_item,
	artwork_action_file_input_ref,
	openItemDetails,
	openArtworkPicker,
	onArtworkActionSelected,
	saveItemArtworkDetails,
	has_items,
} = useCartPage();
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
			<CartPageSkeleton v-if="loading" />

			<template v-else-if="!loading">
				<template v-if="has_items">
					<CartPageHeader
						:title="t('cart.cartPage.title')"
						continue-shopping-path="/stickers"
						:continue-shopping-label="t('cart.cartPage.continueShopping')"
					/>

					<section class="cart-page-layout">
						<CartPageList
							@open-item-details="openItemDetails"
							@open-artwork-picker="openArtworkPicker"
						/>

						<CartPageSummary />
					</section>
				</template>

				<CartEmptyState v-else />
			</template>
		</section>

		<CartDeleteItemModal />
		<CartItemDetailsModal
			:model-value="Boolean(detail_item_id)"
			:item="detail_item"
			@cancel="detail_item_id = null"
			@save="saveItemArtworkDetails"
		/>
		<CartItemEditModal />
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