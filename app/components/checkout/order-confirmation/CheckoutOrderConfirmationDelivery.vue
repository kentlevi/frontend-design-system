<template>
	<section class="checkout-confirmation-delivery">
		<div class="checkout-confirmation-delivery-label">{{ props.label }}</div>
		<div class="checkout-confirmation-delivery-value">{{ props.value }}</div>
	</section>
</template>

<script setup lang="ts">
const props = defineProps<{
	label: string;
	value: string;
}>();
</script>

<style scoped lang="scss">
.checkout-confirmation-delivery {
	padding: 14px 18px;
	border: 1px solid var(--gray-50);
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;

	.checkout-confirmation-delivery-label {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
	}

	.checkout-confirmation-delivery-value {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
	}
}
</style>