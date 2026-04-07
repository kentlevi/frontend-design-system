<script setup lang="ts">
import { toRef, defineAsyncComponent } from 'vue';
import ProductCategoryStage from '~/components/products/product-category/ProductCategoryStage.vue';
import { useProductCategoryExperience } from '~/composables/products/categoryExperience/useProductCategoryExperience';
import type { Products } from '~/types/navigation/navgiation';
import type { ProductCategoryKey } from '~/types/products/catalog';

const product_reviews_section = defineAsyncComponent(
	() => import('~/components/products/product-reviews/ProductReviewsSection.vue')
);
const product_category_details = defineAsyncComponent(
	() => import('~/components/products/product-category/ProductCategoryDetails.vue')
);
const cart_upload_modal = defineAsyncComponent(
	() => import('~/components/cart/modals/CartUploadModal.vue')
);
const cart_preview = defineAsyncComponent(
	() => import('~/components/cart/preview/CartPreview.vue')
);

const props = defineProps<{
	category: ProductCategoryKey;
	products?: Products;
}>();

const {
	size_feature_cards,
	quantity_options,
	selected_id,
	selected_size,
	selected_qty,
	selection_navigation_in_flight,
	has_picked_product,
	upload_modal_open,
	add_to_cart_loading,
	cart_preview_open,
	featured_open,
	special_instructions,
	artwork_preview_url,
	artwork_input_ref,
	size_option_models,
	selected_product,
	cart_items,
	cart_grand_total,
	subtotal,
	discount_rate,
	total,
	has_uploaded_artwork,
	cart_artwork_name,
	featured_items,
	cart_item_count,
	cart_artwork_size,
	cart_artwork_extension,
	selectProduct,
	openUploadModal,
	closeUploadModal,
	closeCartPreview,
	openFilePicker,
	removeArtwork,
	onArtworkSelected,
	proceedToCart,
	removeCartItem,
	updateCartItem,
	skipAndUploadLater,
	closeFeaturedItems,
	featuredStartPrice,
	formatPrice,
	quantityPrice,
	getProductName,
	getProductBlurb,
} = useProductCategoryExperience(toRef(props, 'category'), toRef(props, 'products'));
</script>

<template>
	<section class="product-experience" data-testid="product-category-experience">
		<div class="product-experience-container" data-testid="product-category-experience-container">
			<ProductCategoryStage
				:category="props.category"
				:has-picked-product="has_picked_product"
				:selected-id="selected_id"
				:selected-product="selected_product"
				:size-feature-cards="size_feature_cards"
				:selected-size="selected_size"
				:quantity-options="quantity_options"
				:selected-qty="selected_qty"
				:navigation-in-flight="selection_navigation_in_flight"
				:subtotal="subtotal"
				:discount-rate="discount_rate"
				:total="total"
				:get-product-name="getProductName"
				:get-product-blurb="getProductBlurb"
				:format-price="formatPrice"
				:quantity-price="quantityPrice"
				data-testid="product-category-stage"
				@select-product="selectProduct"
				@update:selected-size="selected_size = $event"
				@update:selected-qty="selected_qty = $event"
				@open-upload="openUploadModal"
				@proceed-to-cart="proceedToCart"
			/>
		</div>

		<product_category_details
			:category="props.category"
			:selected-product-id="selected_id"
		/>

		<input
			ref="artwork_input_ref" type="file" class="artwork-file-input"
			accept=".eps,.ai,.psd,.pdf,.tif,.tiff,.png,.jpg,.jpeg" data-testid="product-category-artwork-input"
			@change="onArtworkSelected" >

		<cart_upload_modal
			v-if="upload_modal_open"
			:open="upload_modal_open"
			:has-uploaded-artwork="has_uploaded_artwork"
			:artwork-preview-url="artwork_preview_url"
			:cart-artwork-name="cart_artwork_name"
			:cart-artwork-extension="cart_artwork_extension"
			:cart-artwork-size="cart_artwork_size"
			:special-instructions="special_instructions"
			:add-to-cart-loading="add_to_cart_loading"
			data-testid="product-category-upload-modal"
			@close="closeUploadModal"
			@open-file-picker="openFilePicker"
			@remove-artwork="removeArtwork"
			@update:special-instructions="special_instructions = $event"
			@skip-upload-later="skipAndUploadLater"
			@proceed-to-cart="proceedToCart"
		/>

		<cart_preview
			:open="cart_preview_open"
			:cart-item-count="cart_item_count"
			:cart-items="cart_items"
			:grand-total="cart_grand_total"
			:featured-open="featured_open"
			:featured-items="featured_items"
			:size-option-models="size_option_models"
			:quantity-options="quantity_options"
			:get-product-name="getProductName"
			:format-price="formatPrice"
			:featured-start-price="featuredStartPrice"
			@close="closeCartPreview"
			@update-item="updateCartItem($event.itemId, $event.sizeKey, $event.qty, $event.customSizeLabel || '')"
			@remove-item="removeCartItem($event)"
			@close-featured="closeFeaturedItems"
		/>

		<product_reviews_section
			class="product-experience-reviews"
			data-testid="product-category-reviews-section"
		/>
	</section>
</template>

<style scoped lang="scss">
.product-experience {
    background: var(--bg-page);

    .product-experience-container {
        max-width: 1200px;
        margin: 0 auto;
    	padding-bottom: 44px;
        position: relative;
    }

    .artwork-file-input {
        display: none;
    }
}
</style>