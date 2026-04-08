<template>
	<header class="checkout-confirmation-head">
		<div class="checkout-confirmation-title-wrap">
			<img
				src="/icons/custom/checkout/icon-box.svg"
				alt=""
				width="48"
				height="48"
				aria-hidden="true"
				class="checkout-confirmation-icon-image"
			>
			<h1 class="checkout-confirmation-title">{{ props.title }}</h1>
		</div>
		<NuxtLink :to="props.homePath" class="checkout-confirmation-home-link">{{ props.homeLabel }}</NuxtLink>
	</header>
</template>

<script setup lang="ts">
const props = defineProps<{
	title: string;
	homeLabel: string;
	homePath: string;
}>();
</script>

<style scoped lang="scss">
.checkout-confirmation-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;

	.checkout-confirmation-title-wrap {
		display: flex;
		align-items: center;
		gap: 14px;

		.checkout-confirmation-icon-image {
			width: 48px;
			height: 48px;
			display: block;
			flex: 0 0 48px;
		}

		.checkout-confirmation-title {
			font-size: var(--type-size-350);
			font-weight: var(--font-weight-semibold);
			line-height: var(--type-line-200);
			color: var(--text-primary);
		}
	}

	.checkout-confirmation-home-link {
		color: var(--text-primary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		text-decoration: none;
		padding: 8px 24px;
	}
}
</style>