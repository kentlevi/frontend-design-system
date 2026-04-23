<script setup lang="ts">
import { useProductExperience } from '~/composables/products/categoryExperience/useProductCategoryExperience';
import ProductPickerSlice from '~/components/products/product-category/slices/ProductPickerSlice.vue';
// import ProductHeroSlice from '~/components/products/product-category/slices/ProductHeroSlice.vue';
// import ProductOptionsSlice from '~/components/products/product-category/slices/ProductOptionsSlice.vue';
import ProductHeroSlice from '~/components/products/product-category/slices-temp/ProductHeroSlice.vue';
import ProductOptionsSlice from '~/components/products/product-category/slices-temp/ProductOptionsSlice.vue';

const {
	has_picked_product,
	picker_slid_up,
	picker_slide_transition_enabled,
	selection_navigation_in_flight,
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
			<section
				v-else-if="selection_navigation_in_flight"
				class="product-configurator product-configurator-skeleton"
				data-testid="product-category-configurator-skeleton"
			>
				<section class="product-configurator-skeleton-hero">
					<UiSkeleton width="420px" height="54px" border-radius="14px" />
					<UiSkeleton width="720px" height="392px" border-radius="24px" />
					<div class="product-configurator-skeleton-cards">
						<UiSkeleton
							v-for="index in 4"
							:key="`product-stage-size-card-skeleton-${index}`"
							width="150px"
							height="142px"
							border-radius="18px"
						/>
					</div>
				</section>

				<section class="product-configurator-skeleton-options">
					<UiSkeleton width="220px" height="24px" border-radius="8px" />
					<div class="product-configurator-skeleton-swatch-row">
						<UiSkeleton
							v-for="index in 8"
							:key="`product-stage-color-skeleton-${index}`"
							width="40px"
							height="40px"
							border-radius="999px"
						/>
					</div>
					<UiSkeleton width="260px" height="24px" border-radius="8px" />
					<UiSkeleton width="100%" height="38px" border-radius="999px" />
					<UiSkeleton width="240px" height="24px" border-radius="8px" />
					<div class="product-configurator-skeleton-qty-grid">
						<UiSkeleton
							v-for="index in 8"
							:key="`product-stage-qty-skeleton-${index}`"
							height="38px"
							border-radius="999px"
						/>
					</div>
					<UiSkeleton width="100%" height="38px" border-radius="999px" />
					<div class="product-configurator-skeleton-summary">
						<UiSkeleton width="120px" height="16px" border-radius="8px" />
						<UiSkeleton width="164px" height="34px" border-radius="10px" />
						<UiSkeleton width="120px" height="14px" border-radius="8px" />
					</div>
					<UiSkeleton width="100%" height="52px" border-radius="999px" />
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

	.product-configurator-skeleton {
		align-items: start;
	}

	.product-configurator-skeleton-hero,
	.product-configurator-skeleton-options {
		display: grid;
		align-content: start;
	}

	.product-configurator-skeleton-hero {
		gap: 28px;
	}

	.product-configurator-skeleton-cards {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px;
	}

	.product-configurator-skeleton-options {
		gap: 18px;
		padding-top: 4px;
	}

	.product-configurator-skeleton-swatch-row {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.product-configurator-skeleton-qty-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px 8px;
	}

	.product-configurator-skeleton-summary {
		display: grid;
		justify-items: end;
		gap: 8px;
		padding-top: 8px;
	}
}
</style>