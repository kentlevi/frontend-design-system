<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useOrderDetailSummary } from '~/composables/orders/useOrderDetailSummary';

const { subtotal, shipping, discount, total } = useOrderDetailSummary();
</script>

<template>
	<MuLinearWrapper class="summary" direction="column" :gap="4">
		<MuLinearWrapper justify="space-between">
			<MuText color="abyss-40">SubTotal:</MuText>
			<MuText color="abyss-40">{{ subtotal }}</MuText>
		</MuLinearWrapper>
		<MuLinearWrapper justify="space-between">
			<MuText color="abyss-40">Shipping Fee:</MuText>
			<MuText color="abyss-40">{{ shipping }}</MuText>
		</MuLinearWrapper>
		<MuLinearWrapper justify="space-between">
			<MuText color="abyss-40">Discounts:</MuText>
			<MuText color="blood-base">{{ discount }}</MuText>
		</MuLinearWrapper>
		<MuLinearWrapper justify="space-between" align="center">
			<MuText color="shades-black" weight="semi-bold">Total:</MuText>
			<MuHeading variant="5" color="shades-black" weight="bold">{{ total }}</MuHeading>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<style lang="scss" scoped>
.summary{
	padding-top: 16px;
}
</style>