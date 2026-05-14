<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import Actions from './Actions.vue';
import Address from './Address.vue';
import List from './List.vue';
import Summary from './Summary.vue';
import { useOrdersMain } from '~/composables/orders/useOrdersMain';
import { useOrdersMainUI } from '~/composables/orders/useOrdersMainUI';

const { selected_order } = useOrdersMain();
const { translate, is_detail_open } = useOrdersMainUI();
</script>

<template>
	<MuLinearWrapper class="orders-main" direction="column" :gap="16" width="100%">
		<MuCard class="orders-card">
			<MuLinearWrapper class="orders-card-wrapper" direction="column">
				<MuLinearWrapper class="orders-card-header" justify="space-between">
					<MuLinearWrapper align="center" :gap="16">
						<MuHeading variant="5" weight="bold">Order #: {{ selected_order?.order_number }}</MuHeading>
						<UiBadge>{{ selected_order?.order_status?.name }}</UiBadge>
					</MuLinearWrapper>
					<MuLinearWrapper class="more-details" align="center" :gap="8" @click="is_detail_open = !is_detail_open">
						<UiIcon :name="is_detail_open ? 'regular-chevron-up' : 'regular-chevron-down'" :size="20" />
						<MuText weight="semi-bold">{{ translate(is_detail_open ? 'account.orders.lessDetails' : 'account.orders.moreDetails') }}</MuText>
					</MuLinearWrapper>
				</MuLinearWrapper>
				<MuLinearWrapper v-if="is_detail_open" justify="space-between" :gap="40">
					<Address type="shipping" />
					<Address type="billing" />
				</MuLinearWrapper>
			</MuLinearWrapper>
			<Actions/>
			<List/>
			<Summary/>
		</MuCard>
		<MuLinearWrapper :gap="12" justify="flex-end">
			<UiButton variant="outline" tone="neutral">On-Hold Order</UiButton>
			<UiButton variant="outline" tone="neutral">Cancel Order</UiButton>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<style lang="scss" scoped>
.more-details {
	cursor: pointer;
}
</style>