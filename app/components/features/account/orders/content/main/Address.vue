<template>
	<UiLinearWrapper direction="column" :gap="4" width="100%">
		<UiText weight="semi-bold" color="shades-black">Shipping address</UiText>
		<UiLinearWrapper align="center" justify="space-between">
			<UiText color="abyss-40">Receiver:</UiText>
			<UiText weight="semi-bold" color="abyss-40">Joy Love</UiText>
		</UiLinearWrapper>
		<UiLinearWrapper align="center" justify="space-between">
			<UiText color="abyss-40">Contact Number:</UiText>
			<UiText weight="semi-bold" color="abyss-40">011-3333-2222</UiText>
		</UiLinearWrapper>
		<UiLinearWrapper align="flex-start" justify="space-between" :gap="16">
			<UiText color="abyss-40">Address:</UiText>
			<UiText weight="semi-bold" color="abyss-40" align="right">Incheon, Gaseong-si, 176-6, Yusan-ri, Gusan-myeon,
				01000
			</UiText>
		</UiLinearWrapper>
		<UiLinearWrapper align="center" justify="space-between">
			<UiText color="abyss-40">Company:</UiText>
			<UiText weight="semi-bold" color="abyss-40">Summit Inc.</UiText>
		</UiLinearWrapper>
	</UiLinearWrapper>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped></style>