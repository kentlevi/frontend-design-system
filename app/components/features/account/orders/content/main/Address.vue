<template>
	<MuLinearWrapper direction="column" :gap="4" width="100%">
		<MuText weight="semi-bold" color="shades-black">Shipping address</MuText>
		<MuLinearWrapper align="center" justify="space-between">
			<MuText color="abyss-40">Receiver:</MuText>
			<MuText weight="semi-bold" color="abyss-40">Joy Love</MuText>
		</MuLinearWrapper>
		<MuLinearWrapper align="center" justify="space-between">
			<MuText color="abyss-40">Contact Number:</MuText>
			<MuText weight="semi-bold" color="abyss-40">011-3333-2222</MuText>
		</MuLinearWrapper>
		<MuLinearWrapper align="flex-start" justify="space-between" :gap="16">
			<MuText color="abyss-40">Address:</MuText>
			<MuText weight="semi-bold" color="abyss-40" align="right">Incheon, Gaseong-si, 176-6, Yusan-ri, Gusan-myeon,
				01000
			</MuText>
		</MuLinearWrapper>
		<MuLinearWrapper align="center" justify="space-between">
			<MuText color="abyss-40">Company:</MuText>
			<MuText weight="semi-bold" color="abyss-40">Summit Inc.</MuText>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';

</script>

<style lang="scss" scoped></style>