<script setup lang="ts">
import { toRef, defineAsyncComponent  } from 'vue';
import ProductCategoryStage from '~/components/products/product-category/ProductCategoryStage.vue';
import { useProductCategoryExperience } from '~/composables/products/useProductCategoryExperience';
import type { ProductCategoryKey } from '~/data/products/catalog';


const ProductReviewsSection = defineAsyncComponent(
    () => import('~/components/products/product-reviews/ProductReviewsSection.vue')
);
const ProductCategoryDetails = defineAsyncComponent(
    () => import('~/components/products/product-category/ProductCategoryDetails.vue')
);
const CartUploadModal = defineAsyncComponent(
    () => import('~/components/cart/CartUploadModal.vue')
);
const CartPreview = defineAsyncComponent(
    () => import('~/components/cart/CartPreview.vue')
);

const props = defineProps<{
    category: ProductCategoryKey;
}>();

const {
    sizeFeatureCards,
    quantityOptions,
    categoryData,
    selectedId,
    selectedSize,
    selectedQty,
    selectionNavigationInFlight,
    hasPickedProduct,
    uploadModalOpen,
    addToCartLoading,
    cartPreviewOpen,
    featuredOpen,
    specialInstructions,
    artworkPreviewUrl,
    artworkInputRef,
    sizeOptionModels,
    selectedProduct,
    cartItems,
    cartGrandTotal,
    subtotal,
    discountRate,
    total,
    hasUploadedArtwork,
    cartArtworkName,
    featuredItems,
    cartItemCount,
    cartArtworkSize,
    cartArtworkExtension,
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
} = useProductCategoryExperience(toRef(props, 'category'));
</script>

<template>
    <section class="product-experience" data-testid="product-category-experience">
        <div class="product-experience-container" data-testid="product-category-experience-container">
            <ProductCategoryStage
                :category-products="categoryData.products"
                :has-picked-product="hasPickedProduct"
                :selected-id="selectedId"
                :selected-product="selectedProduct"
                :size-feature-cards="sizeFeatureCards"
                :selected-size="selectedSize"
                :size-option-models="sizeOptionModels"
                :quantity-options="quantityOptions"
                :selected-qty="selectedQty"
                :navigation-in-flight="selectionNavigationInFlight"
                :subtotal="subtotal"
                :discount-rate="discountRate"
                :total="total"
                :get-product-name="getProductName"
                :get-product-blurb="getProductBlurb"
                :format-price="formatPrice"
                :quantity-price="quantityPrice"
                data-testid="product-category-stage"
                @select-product="selectProduct"
                @update:selected-size="selectedSize = $event"
                @update:selected-qty="selectedQty = $event"
                @open-upload="openUploadModal"
            />
        </div>

        <ProductCategoryDetails
            :has-picked-product="hasPickedProduct"
            data-testid="product-category-details"
        />

        <input
ref="artworkInputRef" type="file" class="artwork-file-input"
            accept=".eps,.ai,.psd,.pdf,.tif,.tiff,.png,.jpg,.jpeg" data-testid="product-category-artwork-input"
            @change="onArtworkSelected" >

        <CartUploadModal
            v-if="uploadModalOpen"
            :open="uploadModalOpen"
            :has-uploaded-artwork="hasUploadedArtwork"
            :artwork-preview-url="artworkPreviewUrl"
            :cart-artwork-name="cartArtworkName"
            :cart-artwork-extension="cartArtworkExtension"
            :cart-artwork-size="cartArtworkSize"
            :special-instructions="specialInstructions"
            :add-to-cart-loading="addToCartLoading"
            data-testid="product-category-upload-modal"
            @close="closeUploadModal"
            @open-file-picker="openFilePicker"
            @remove-artwork="removeArtwork"
            @update:special-instructions="specialInstructions = $event"
            @skip-upload-later="skipAndUploadLater"
            @proceed-to-cart="proceedToCart"
        />

        <CartPreview
            :open="cartPreviewOpen"
            :cart-item-count="cartItemCount"
            :cart-items="cartItems"
            :grand-total="cartGrandTotal"
            :featured-open="featuredOpen"
            :featured-items="featuredItems"
            :size-option-models="sizeOptionModels"
            :quantity-options="quantityOptions"
            :get-product-name="getProductName"
            :format-price="formatPrice"
            :featured-start-price="featuredStartPrice"
            data-testid="product-category-cart-preview"
            @close="closeCartPreview"
            @update-item="updateCartItem($event.itemId, $event.sizeKey, $event.qty)"
            @remove-item="removeCartItem($event)"
            @close-featured="closeFeaturedItems"
        />

        <ProductReviewsSection
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
        position: relative;
    }

    .artwork-file-input {
        display: none;
    }
}
</style>


