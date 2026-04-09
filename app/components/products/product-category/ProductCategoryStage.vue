<script setup lang="ts">
import { useProductExperience } from '~/composables/products/categoryExperience/useProductCategoryExperience';
import ProductPickerSlice from '~/components/products/product-category/slices/ProductPickerSlice.vue';
import ProductHeroSlice from '~/components/products/product-category/slices/ProductHeroSlice.vue';
import ProductOptionsSlice from '~/components/products/product-category/slices/ProductOptionsSlice.vue';

const {
	has_picked_product,
	picker_slid_up,
	picker_slide_transition_enabled,
	selected_product,
} = useProductExperience();
</script>

<template>
	<section
		class="product-stage"
		:class="{ 'is-selected': picker_slid_up, 'picker-transition-disabled': !picker_slide_transition_enabled }"
		data-testid="product-category-stage-root"
	>
		<ProductPickerSlice />

		<section v-show="has_picked_product" class="product-reveal product-reveal-layer" data-testid="product-category-reveal">
			<section v-if="selected_product">
				<section class="product-configurator" data-testid="product-category-configurator">
					<ProductHeroSlice />
					<ProductOptionsSlice />
				</section>
			</section>
		</section>
	</section>
</template>

<style scoped lang="scss">
@use '~/assets/scss/fonts/lettering';

.product-stage {
	position: relative;
	margin-top: 0;
	display: grid;
	overflow: visible;
	min-height: 864px;
	align-content: start;

	.product-reveal {
		margin-top: 0;
	}

	.product-picker-layer {
		position: relative;
		z-index: 2;
		grid-area: 1 / 1;
		align-self: start;
		min-height: inherit;
		background: var(--gray-20);
		border-radius: 0 0 20px 20px;
		padding: 56px 60px;
		clip-path: inset(0 0 0 0 round 0 0 20px 20px);
		transition: clip-path 0.85s cubic-bezier(0.22, 1, 0.36, 1);
	}

	&.picker-transition-disabled {
		.product-picker-layer {
			transition: none;
		}
	}

	.product-reveal-layer {
		position: relative;
		z-index: 1;
		grid-area: 1 / 1;
		align-self: stretch;
		overflow: visible;
	}

	&.is-selected {
		.product-picker-layer {
			clip-path: inset(0 0 100% 0 round 0 0 20px 20px);
			pointer-events: none;
		}
	}

	.product-configurator {
		padding-top: 56px;
		padding-bottom: 122px;
		display: grid;
		grid-template-columns: 772px 348px;
		gap: 80px;
	}
}
</style>