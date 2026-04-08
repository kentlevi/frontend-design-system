<script setup lang="ts">
defineProps<{
	iconAlt: string;
	title: string;
	description: string;
}>();
</script>

<template>
	<section class="cart-preview-empty" data-testid="product-category-cart-empty">
		<img
			src="/illustrations/cart/empty-cart-basket.svg"
			:alt="iconAlt"
			width="112"
			height="112"
			class="cart-preview-empty-image"
		>
		<h4 class="cart-preview-empty-title">{{ title }}</h4>
		<p class="cart-preview-empty-description">{{ description }}</p>
	</section>
</template>

<style scoped lang="scss">
.cart-preview-empty {
	display: grid;
	justify-items: center;
	text-align: center;
	row-gap: 10px;
	padding: 18px 14px 20px;
	border-bottom: 0;
	height: 100%;
	align-content: center;
	max-width: 100%;
	margin: 0 auto;

	.cart-preview-empty-image {
		width: 112px;
		height: 112px;
		object-fit: contain;
		display: block;
	}

	.cart-preview-empty-title {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-primary);
	}

	.cart-preview-empty-description {
		max-width: 420px;
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
	}
}
</style>