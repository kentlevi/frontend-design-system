<script setup lang="ts">
defineProps<{
	title: string;
	continueShoppingLabel: string;
}>();

defineEmits<{
	(e: 'close'): void;
}>();
</script>

<template>
	<header class="cart-preview-header" data-testid="product-category-cart-header">
		<h3 class="cart-preview-title" data-testid="product-category-cart-title">{{ title }}</h3>
		<UiButton
			type="button"
			variant="ghost"
			tone="neutral"
			class="cart-preview-continue"
			data-testid="product-category-cart-continue-shopping-button"
			@click="$emit('close')"
		>
			{{ continueShoppingLabel }}
			<UiIcon name="strong-long-arrow-right" :size="18" color="#2a2f3d" />
		</UiButton>
	</header>
</template>

<style scoped lang="scss">
.cart-preview-header {
	min-height: 84px;
	border-bottom: 1px solid var(--gray-30);
	padding: 0 22px;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.cart-preview-title {
		font-size: var(--type-size-300);
		line-height: var(--type-line-300);
		color: var(--text-primary);
	}

	.cart-preview-continue {
		color: var(--text-primary);
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: var(--type-size-100);
		font-weight: var(--font-weight-semibold);
		line-height: var(--type-line-100);
		padding: 6px 0;
		min-height: auto;
		border-radius: 0;
		--btn-soft: transparent;
		transition: opacity 0.18s ease;

		&:hover {
			opacity: 0.7;
		}
	}
}

@media (max-width: 820px) {
	.cart-preview-header {
		.cart-preview-title {
			font-size: var(--type-size-500);
			line-height: var(--type-line-500);
		}
	}
}
</style>