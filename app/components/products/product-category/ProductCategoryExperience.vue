<script setup lang="ts">
import { toRef, defineAsyncComponent } from 'vue';
import ProductCategoryStage from '~/components/products/product-category/ProductCategoryStage.vue';
import { provideProductExperience } from '~/composables/products/categoryExperience/useProductCategoryExperience';
import type { Products } from '~/types/navigation/navgiation';
import type { ProductCategoryKey } from '~/types/products/catalog';

const productReviewsSection = defineAsyncComponent(
	() => import('~/components/products/product-reviews/ProductReviewsSection.vue')
);
const productCategoryDetails = defineAsyncComponent(
	() => import('~/components/products/product-category/ProductCategoryDetails.vue')
);
const cartUploadModal = defineAsyncComponent(
	() => import('~/components/cart/modals/CartUploadModal.vue')
);

const props = defineProps<{
	category: ProductCategoryKey;
	products?: Products;
}>();

const { t } = useI18n();

// Slicedown: Provide context to all children
const {
	upload_modal_open,
	add_to_cart_loading,
	has_lettering_editor,
} = provideProductExperience(toRef(props, 'category'), toRef(props, 'products'));
</script>

<template>
	<section class="product-experience" data-testid="product-category-experience">
		<UiLoadingOverlay
			:visible="add_to_cart_loading && has_lettering_editor"
			:label="t('cart.cartPreview.redirectingToCart')"
			test-id="product-category-page-loading-overlay"
		/>

		<div class="product-experience-container" data-testid="product-category-experience-container">
			<ProductCategoryStage />
		</div>

		<productCategoryDetails />

		<cartUploadModal />

		<productReviewsSection />
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