<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import OrderList from './OrderList.vue';
</script>

<template>
	<MuLinearWrapper class="orders-side" direction="column" :gap="16">
		<OrderList status="ongoing" />
		<OrderList status="action_required" />
		<OrderList status="completed" />
	</MuLinearWrapper>
</template>

<style lang="scss" scoped>
.orders-side {
	width: 342px;
	min-width: 342px;
}
</style>