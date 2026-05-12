<template>
	<MuLinearWrapper class="summary" direction="column" :gap="4">
		<MuLinearWrapper justify="space-between">
			<MuText color="abyss-40">SubTotal:</MuText>
			<MuText color="abyss-40">492,068.64원</MuText>
		</MuLinearWrapper>
		<MuLinearWrapper justify="space-between">
			<MuText color="abyss-40">Shipping Fee:</MuText>
			<MuText color="abyss-40">0.00원</MuText>
		</MuLinearWrapper>
		<MuLinearWrapper justify="space-between">
			<MuText color="abyss-40">Discounts:</MuText>
			<MuText color="blood-base">-0.00원</MuText>
		</MuLinearWrapper>
		<MuLinearWrapper justify="space-between" align="center">
			<MuText color="shades-black" weight="semi-bold">Total:</MuText>
			<MuHeading variant="5" color="shades-black" weight="bold">492,068.64원</MuHeading>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';


</script>

<style lang="scss" scoped>
.summary{
	padding-top: 16px;
}
</style>