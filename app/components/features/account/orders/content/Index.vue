<template>
	<MuLinearWrapper class="orders-content" :gap="24" align="flex-start">
		<FeaturesAccountOrdersContentSide class="orders-side" />
		<FeaturesAccountOrdersContentMain class="orders-main" />
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
</script>

<style lang="scss" scoped>
.orders-side {
	width: 342px;
}
</style>