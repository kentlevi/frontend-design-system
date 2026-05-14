<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import type { UserOrder } from '~/types/order/user-orders';
import { useOrderItem } from '~/composables/orders/useOrderItem';

const props = defineProps<{ order: UserOrder }>()

const { formatted_date } = useOrderItem(props)
</script>

<template>
	<MuCard class="order-item" variant="default" padding="md" radius="md" bordered="default">
		<MuLinearWrapper direction="column" gap="4">
			<MuLinearWrapper class="order-item-header" align="center" :gap="8">
				<div class="dot" />
				<MuText size="large" weight="bold">Order #: {{ order.order_number }}</MuText>
			</MuLinearWrapper>
			<MuLinearWrapper>
				<MuText color="abyss-40">{{ order.items_count }} item(s) | Order Date: {{ formatted_date }}</MuText>
			</MuLinearWrapper>
		</MuLinearWrapper>
	</MuCard>
</template>

<style lang="scss" scoped>
.dot {
	position: relative;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background-color: var(--amber-50);
}
</style>