<template>
	<UiCard class="order-item" variant="default" padding="md" radius="md" bordered="default">
		<MuLinearWrapper direction="column" gap="4">
			<MuLinearWrapper class="order-item-header" align="center" :gap="8">
				<div class="dot" />
				<MuText size="large" weight="bold">Order #: 62411120012</MuText>
			</MuLinearWrapper>
			<MuLinearWrapper>
				<MuText color="abyss-40">1 item(s) | Order Date: 11/13/2024</MuText>
			</MuLinearWrapper>
		</MuLinearWrapper>
	</UiCard>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';


</script>

<style lang="scss" scoped>
.dot {
	position: relative;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background-color: var(--amber-50);
}
</style>