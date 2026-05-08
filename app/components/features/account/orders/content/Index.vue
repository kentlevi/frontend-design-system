<template>
	<UiLinearWrapper class="orders-content" :gap="24" align="flex-start">
		<FeaturesAccountOrdersContentSide class="orders-side" />
		<FeaturesAccountOrdersContentMain class="orders-main" />
	</UiLinearWrapper>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.orders-side {
	width: 342px;
}
</style>