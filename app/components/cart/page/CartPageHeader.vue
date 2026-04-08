<script setup lang="ts">
defineProps<{
	title: string;
	continueShoppingPath: string;
	continueShoppingLabel: string;
}>();
</script>

<template>
	<header class="cart-page-head">
		<h1 class="cart-page-title">{{ title }}</h1>
		<NuxtLink :to="continueShoppingPath" class="cart-page-continue">
			<UiIcon name="strong-long-arrow-right" :size="24" color="var(--text-primary)" />
			{{ continueShoppingLabel }}
		</NuxtLink>
	</header>
</template>

<style scoped lang="scss">
.cart-page-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 56px 0 20px;
	border-bottom: 1px solid var(--gray-30);

	.cart-page-title {
		font-size: var(--type-size-500);
		line-height: var(--type-line-500);
		color: var(--text-primary);
	}

	.cart-page-continue {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--text-primary);
		text-decoration: none;
		font-size: var(--type-size-200);
		font-weight: var(--font-weight-semibold);
		line-height: var(--type-line-200);
	}
}

@media (max-width: 1200px) {
	.cart-page-head {
		.cart-page-title {
			font-size: var(--type-size-550);
			line-height: var(--type-line-550);
		}

		.cart-page-continue {
			font-size: var(--type-size-200);
			line-height: var(--type-line-200);
		}
	}
}
</style>