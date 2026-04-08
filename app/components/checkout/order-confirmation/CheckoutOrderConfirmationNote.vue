<template>
	<p class="checkout-confirmation-note">
		{{ props.prefix }}
		<a href="tel:+6531582800">+65 3158 2800</a> or email at
		<a href="mailto:info@mustickers.com">info@mustickers.com</a>.
		{{ props.suffix }}
	</p>
</template>

<script setup lang="ts">
const props = defineProps<{
	prefix: string;
	suffix: string;
}>();
</script>

<style scoped lang="scss">
.checkout-confirmation-note {
	color: var(--text-secondary);
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);

	a {
		color: var(--text-primary);
		font-weight: var(--font-weight-bold);
	}
}
</style>