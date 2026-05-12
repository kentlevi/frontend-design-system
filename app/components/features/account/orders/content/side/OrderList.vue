<template>
	<MuLinearWrapper class="order-list" direction="column" :gap="8">
		<MuText size="large" weight="semi-bold">On-Going</MuText>
		<OrderItem v-for="index in 5" :key="index" />
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuText from '~/components/base/MuText.vue';
import OrderItem from './OrderItem.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';


</script>

<style lang="scss" scoped>
.order-list {}
</style>