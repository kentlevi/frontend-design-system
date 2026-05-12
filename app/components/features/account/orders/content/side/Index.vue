<template>
	<MuLinearWrapper class="orders-side" direction="column" :gap="16">
		<OrderList v-for="index in 5" :key="index" />
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import OrderList from './OrderList.vue';

</script>
<style lang="scss" scoped>
.orders-side {
	width: 342px;
	min-width: 342px;
}
</style>