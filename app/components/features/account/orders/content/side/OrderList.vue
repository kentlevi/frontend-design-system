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
		<MuLinearWrapper :gap="8">
			<MuText size="large" weight="semi-bold">{{ label }} </MuText>
			<div class="order-count"><MuText size="small" weight="bold" color="white-base">{{ orders.length }}</MuText></div>
		</MuLinearWrapper>
		<OrderItem v-for="order in orders" :key="order.id" :order="order" />
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
// .order-list {}
.order-count{
	width: 20px;
	height: 20px;
	background-color: var(--gold-60);
	border-radius: 50%;
	position: relative;
	p{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}
</style>