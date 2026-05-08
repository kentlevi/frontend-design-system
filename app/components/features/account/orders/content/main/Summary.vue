<template>
	<UiLinearWrapper class="summary" direction="column" :gap="4">
		<UiLinearWrapper justify="space-between">
			<UiText color="abyss-40">SubTotal:</UiText>
			<UiText color="abyss-40">492,068.64원</UiText>
		</UiLinearWrapper>
		<UiLinearWrapper justify="space-between">
			<UiText color="abyss-40">Shipping Fee:</UiText>
			<UiText color="abyss-40">0.00원</UiText>
		</UiLinearWrapper>
		<UiLinearWrapper justify="space-between">
			<UiText color="abyss-40">Discounts:</UiText>
			<UiText color="blood-base">-0.00원</UiText>
		</UiLinearWrapper>
		<UiLinearWrapper justify="space-between" align="center">
			<UiText color="shades-black" weight="semi-bold">Total:</UiText>
			<UiHeading variant="5" color="shades-black" weight="bold">492,068.64원</UiHeading>
		</UiLinearWrapper>
	</UiLinearWrapper>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.summary{
	padding-top: 16px;
}
</style>