<script setup lang="ts">
import { storeToRefs } from 'pinia';
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
import { useUsersStore } from '~/stores/users/users.store';

const { selected_order, is_loading } = useOrdersMain();
const { translate, is_detail_open } = useOrdersMainUI();

const users_store = useUsersStore();
const { role_code } = storeToRefs(users_store);
</script>

<template>
	<MuLinearWrapper class="orders-main" direction="column" :gap="16" width="100%">
		<MuText v-if="is_loading" class="orders-card-loading" color="abyss-40" align="center">Loading order details...</MuText>
		<template v-else>
			<MuCard class="orders-card">
				<MuLinearWrapper class="orders-card-wrapper" direction="column">
					<MuLinearWrapper
						v-if="role_code != 'MEMBER'"
						class="orders-card-breadcrumb"
						align="center"
						:gap="6"
					>
						<NuxtLink to="/account/orders" class="orders-card-breadcrumb__home">
							Orders
						</NuxtLink>
						<UiIcon name="regular-chevron-right" :size="12" color="var(--text-secondary)" />
						<MuText weight="semi-bold">Order Details</MuText>
					</MuLinearWrapper>
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
		</template>
	</MuLinearWrapper>
</template>

<style lang="scss" scoped>
.more-details {
	cursor: pointer;
}
.orders-card-loading {
	padding: 32px 16px;
}
.orders-card-breadcrumb {
	margin-bottom: 8px;

	&__home {
		color: var(--gold-70);
		font-weight: var(--font-weight-semibold);
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
}
</style>