<template>
	<UiLinearWrapper class="order-list" direction="column" :gap="8">
		<UiText size="large" weight="semi-bold">On-Going</UiText>
		<OrderItem v-for="index in 5" :key="index" />
	</UiLinearWrapper>
</template>

<script setup lang="ts">
import OrderItem from './OrderItem.vue';


</script>

<style lang="scss" scoped>
.order-list {}
</style>