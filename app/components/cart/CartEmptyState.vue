<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { CartEmptyProduct } from '~/composables/cart/page/useCartPage';

const props = defineProps<{
	featuredItems: CartEmptyProduct[];
	discoverItems: CartEmptyProduct[];
}>();

const itemsPerPage = 6;
const pageIndex = ref(0);

const pageCount = computed(() => Math.max(1, Math.ceil(props.discoverItems.length / itemsPerPage)));
const discoverPages = computed(() => {
	const pages: CartEmptyProduct[][] = [];
	for (let index = 0; index < props.discoverItems.length; index += itemsPerPage) {
		pages.push(props.discoverItems.slice(index, index + itemsPerPage));
	}
	return pages.length ? pages : [[]];
});
const canGoPrev = computed(() => pageIndex.value > 0);
const canGoNext = computed(() => pageIndex.value < pageCount.value - 1);

function prevPage() {
	if (!canGoPrev.value) return;
	pageIndex.value -= 1;
}

function nextPage() {
	if (!canGoNext.value) return;
	pageIndex.value += 1;
}

watch(
	() => props.discoverItems.length,
	() => {
		if (pageIndex.value > pageCount.value - 1) {
			pageIndex.value = Math.max(0, pageCount.value - 1);
		}
	}
);
</script>

<template>
	<section class="cart-empty-state" data-testid="cart-page-empty-state">
		<div class="cart-empty-state-top">
			<div class="cart-empty-state-hero">
				<h2 class="cart-empty-state-title">Your cart is empty.</h2>
				<p class="cart-empty-state-description">
					Looks like your cart is empty. Start browsing our products and add items to your cart to begin your order. You can also explore the recommended products below to quickly find items you might like.
				</p>
			</div>

			<section class="cart-empty-state-featured" aria-label="Featured products">
				<NuxtLink
					v-for="item in props.featuredItems"
					:key="item.id"
					:to="item.to"
					class="cart-empty-state-product cart-empty-state-product--featured"
					:data-testid="`cart-empty-featured-${item.id}`"
				>
					<div class="cart-empty-state-featured-image-wrap">
						<img :src="item.image" :alt="item.label" class="cart-empty-state-featured-image">
					</div>
					<p class="cart-empty-state-product-label">{{ item.label }}</p>
				</NuxtLink>
			</section>
		</div>

		<section class="cart-empty-state-discover" aria-label="Discover more products">
			<div class="cart-empty-state-discover-head">
				<h3 class="cart-empty-state-discover-title">Discover more products you might like.</h3>
				<div class="cart-empty-state-controls">
					<UiButton
						variant="outline"
						tone="neutral"
						size="md"
						:icon-only="true"
						icon="regular-angle-left"
						icon-size="24"
						:disabled="!canGoPrev"
						:sr-label="'Previous products'"
						aria-label="Previous products"
						class="cart-empty-state-arrow"
						@click="prevPage"
					/>
					<UiButton
						variant="outline"
						tone="neutral"
						size="md"
						:icon-only="true"
						icon="regular-angle-right"
						icon-size="24"
						:disabled="!canGoNext"
						:sr-label="'Next products'"
						aria-label="Next products"
						class="cart-empty-state-arrow"
						@click="nextPage"
					/>
				</div>
			</div>

			<div class="cart-empty-state-discover-strip">
				<div class="cart-empty-state-discover-inner">
					<div class="cart-empty-state-discover-viewport">
						<div
							class="cart-empty-state-discover-track"
							:style="{ transform: `translateX(-${pageIndex * 100}%)` }"
						>
							<div
								v-for="(page, pageNumber) in discoverPages"
								:key="`discover-page-${pageNumber}`"
								class="cart-empty-state-discover-page"
							>
								<div class="cart-empty-state-discover-grid">
									<NuxtLink
										v-for="item in page"
										:key="item.id"
										:to="item.to"
										class="cart-empty-state-product cart-empty-state-product--discover"
										:data-testid="`cart-empty-discover-${item.id}`"
									>
										<div class="cart-empty-state-discover-image-wrap">
											<img :src="item.image" :alt="item.label" class="cart-empty-state-discover-image">
										</div>
										<p class="cart-empty-state-product-label">{{ item.label }}</p>
									</NuxtLink>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</section>
</template>

<style scoped lang="scss">
.cart-empty-state {
	max-width: 1200px;
	margin: 0 auto;
	padding: 112px 0 110px;
	display: grid;
	gap: 80px;

	.cart-empty-state-top {
		display: grid;
		gap: 40px;
	}

	.cart-empty-state-hero {
		max-width: 588px;
		margin: 0 auto;
		text-align: center;
		display: grid;
		gap: 16px;
	}

	.cart-empty-state-title {
		font-size: var(--type-size-500);
		line-height: var(--type-line-500);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
	}

	.cart-empty-state-description {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
	}

	.cart-empty-state-featured,
	.cart-empty-state-discover-grid {
		display: flex;
		gap: 24px;
		justify-content: center;
	}

	.cart-empty-state-discover {
		display: grid;
		gap: 32px;
	}

	.cart-empty-state-discover-strip {
		width: 100vw;
		margin-left: calc(50% - 50vw);
		margin-right: calc(50% - 50vw);
		background: #f5f5f5;
		border-top: 1px solid var(--gray-20);
		border-bottom: 1px solid var(--gray-20);
	}

	.cart-empty-state-discover-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 24px 0;
	}

	.cart-empty-state-discover-viewport {
		overflow: hidden;
	}

	.cart-empty-state-discover-track {
		display: flex;
		transition: transform 0.36s ease;
		will-change: transform;
	}

	.cart-empty-state-discover-page {
		min-width: 100%;
	}

	.cart-empty-state-discover-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}

	.cart-empty-state-discover-title {
		font-size: var(--type-size-350);
		line-height: var(--type-line-200);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
	}

	.cart-empty-state-controls {
		display: flex;
		gap: 10px;
		flex-shrink: 0;
	}

	.cart-empty-state-arrow {
		width: 40px;
		height: 40px;
		border-radius: 999px;
	}

	.cart-empty-state-product {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-decoration: none;
		color: inherit;
		border-radius: 20px;
		transition: background-color 0.18s ease, transform 0.18s ease;

		&:hover {
			background: var(--gray-10);
			transform: translateY(-2px);
		}
	}

	.cart-empty-state-featured-image-wrap {
		width: 180px;
		height: 120px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cart-empty-state-discover-image-wrap {
		width: 180px;
		height: 72px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cart-empty-state-featured-image {
		max-width: 125px;
		max-height: 96px;
		width: 100%;
    	height: 100%;
		object-fit: contain;
		display: block;
	}

	.cart-empty-state-discover-image {
		max-width: 73px;
		max-height: 56px;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.cart-empty-state-product-label {
		font-size: var(--type-size-200);
		line-height: var(--type-line-200);
		font-weight: var(--font-weight-medium);
		color: var(--text-primary);
		padding-bottom: 12px;
		text-align: center;
	}
}

@media (max-width: 1080px) {
	.cart-empty-state {
		padding: 40px 0 56px;
		gap: 56px;
	}
}

@media (max-width: 720px) {
	.cart-empty-state {
		.cart-empty-state-discover-head {
			flex-direction: column;
			align-items: flex-start;
		}

		.cart-empty-state-featured,
		.cart-empty-state-discover-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 18px;
		}

		.cart-empty-state-featured-image-wrap,
		.cart-empty-state-discover-image-wrap {
			width: 100%;
			height: 104px;
		}

		.cart-empty-state-featured-image,
		.cart-empty-state-discover-image {
			max-width: 110px;
			max-height: 86px;
		}
	}
}
</style>