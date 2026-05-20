<template>
	<MuLinearWrapper class="cancel-order-confirm" align="flex-start" :gap="20">
		<div class="cancel-order-confirm__icon">
			<img src="/icons/custom/guarantees/proof-review.svg" />
		</div>
		<MuLinearWrapper direction="column" :gap="6">
			<MuText size="large" weight="bold">Are You Sure You Want to Cancel?</MuText>
			<MuText color="text-secondary">
				Cancelling this order will <strong>stop all processing</strong> and cannot be <strong>undone</strong>. Please confirm if you would like to proceed. Refund processing, if applicable, will begin within 1–2 business days.
			</MuText>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
</script>

<style lang="scss" scoped>
.cancel-order-confirm__icon{
	flex: 0 0 auto;
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background: var(--gray-20);
	display: grid;
	place-items: center;
	color: var(--text-primary);
}
</style>
