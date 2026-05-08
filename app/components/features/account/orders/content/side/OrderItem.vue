<template>
	<UiCard class="order-item" variant="default" padding="md" radius="md" bordered="default">
		<UiLinearWrapper direction="column" gap="4">
			<UiLinearWrapper class="order-item-header" align="center" :gap="8">
				<div class="dot" />
				<UiText size="large" weight="bold">Order #: 62411120012</UiText>
			</UiLinearWrapper>
			<UiLinearWrapper>
				<UiText color="abyss-40">1 item(s) | Order Date: 11/13/2024</UiText>
			</UiLinearWrapper>
		</UiLinearWrapper>
	</UiCard>
</template>

<script setup lang="ts">

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