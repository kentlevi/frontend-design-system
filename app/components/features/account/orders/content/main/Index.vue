<template>
	<UiLinearWrapper class="orders-main" direction="column" :gap="16" width="100%">
		<UiCard class="orders-card">
			<UiLinearWrapper class="orders-card-wrapper" direction="column">
				<UiLinearWrapper class="orders-card-header" justify="space-between">
					<UiLinearWrapper align="center" :gap="16">
						<UiHeading variant="5" weight="bold">Order #: 62411120004</UiHeading>
						<UiBadge>In Production</UiBadge>
					</UiLinearWrapper>
					<UiLinearWrapper class="more-details" align="center" :gap="8" @click="is_detail_open = !is_detail_open">
						<UiIcon :name="is_detail_open ? 'regular-chevron-up' : 'regular-chevron-down'" :size="20" />
						<UiText weight="semi-bold">{{ t(is_detail_open ? 'account.orders.lessDetails' : 'account.orders.moreDetails') }}</UiText>
					</UiLinearWrapper>
				</UiLinearWrapper>
				<UiLinearWrapper v-if="is_detail_open" justify="space-between" :gap="40">
					<Address />
					<Address />
				</UiLinearWrapper>
			</UiLinearWrapper>

			<List/>
			<Summary/>
		</UiCard>
		<UiLinearWrapper :gap="12" justify="flex-end">
			<UiButton variant="outline" tone="neutral">On-Hold Order</UiButton>
			<UiButton variant="outline" tone="neutral">Cancel Order</UiButton>
		</UiLinearWrapper>
	</UiLinearWrapper>
</template>

<script setup lang="ts">
import Address from './Address.vue';
import List from './List.vue';
import Summary from './Summary.vue';

const { t } = useI18n();

const is_detail_open = ref(false);

</script>

<style lang="scss" scoped>
.more-details {
	cursor: pointer;
}
</style>