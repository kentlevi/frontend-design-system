<script setup lang="ts">
import MuText from '~/components/base/MuText.vue';
import OrderItem from './OrderItem.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import type { UserOrderType } from '~/types/order/user-orders';
import { useOrderList } from '~/composables/orders/useOrderList';

const props = defineProps<{ status: UserOrderType }>()

const { orders, label, has_orders } = useOrderList(props)
</script>

<template>
	<MuLinearWrapper v-if="has_orders" class="order-list" direction="column" :gap="8">
		<MuText size="large" weight="semi-bold">{{ label }}</MuText>
		<OrderItem v-for="order in orders" :key="order.id" :order="order" />
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.order-list {}
</style>