<script setup lang="ts">
import { toRef, defineAsyncComponent } from 'vue';
import ProductCategoryStage from '~/components/products/product-category/ProductCategoryStage.vue';
import { provideProductExperience } from '~/composables/products/categoryExperience/useProductCategoryExperience';
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

const { t } = useI18n();

// Slicedown: Provide context to all children
const {
	selected_id,
	upload_modal_open,
	add_to_cart_loading,
	has_lettering_editor,
	cart_preview_open,
	special_instructions,
	artwork_preview_url,
	artwork_input_ref,
	has_uploaded_artwork,
	cart_artwork_name,
	cart_artwork_size,
	cart_artwork_extension,
	closeUploadModal,
	closeCartPreview,
	openFilePicker,
	removeArtwork,
	onArtworkSelected,
	proceedToCart,
	skipAndUploadLater,
} = provideProductExperience(toRef(props, 'category'), toRef(props, 'products'));
</script>

<template>
	<section class="product-experience" data-testid="product-category-experience">
		<UiLoadingOverlay
			:visible="add_to_cart_loading && has_lettering_editor"
			:label="t('cart.cartPreview.redirectingToCart')"
			test-id="product-category-page-loading-overlay"
			transition-name="cart-redirect-fade"
			position="fixed"
			:z-index="120"
		/>

		<div class="product-experience-container" data-testid="product-category-experience-container">
			<ProductCategoryStage />
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
			@close="closeCartPreview"
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