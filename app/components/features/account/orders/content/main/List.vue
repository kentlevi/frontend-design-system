<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import Item from './Item.vue';
import { useOrderDetailList } from '~/composables/orders/useOrderDetailList';

const { items } = useOrderDetailList();
</script>

<template>
	<MuLinearWrapper class="list" direction="column" :gap="16">
		<MuText weight="bold">Order Summary:</MuText>
		<MuText v-if="!items.length" color="abyss-40">No items to display.</MuText>
		<Item
			v-for="(item, index) in items"
			:key="item.order_item_id"
			:item="item"
			:index="index"
		/>
	</MuLinearWrapper>
</template>

<style lang="scss" scoped>
.list{
	padding-bottom: 16px;
	border-bottom: solid 1px var(--gray-50);
}
</style>