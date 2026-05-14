<template>
	<MuLinearWrapper align="center" :gap="28" data-testid="account-shell-stats">
		<MuLinearWrapper
			v-for="stat in account_stats"
			:key="stat.key"
			align="center"
			:gap="10"
			:data-testid="`account-shell-stat-${stat.key}`"
		>
			<img
				v-if="stat.iconSrc"
				:src="stat.iconSrc"
				:alt="stat.iconAlt"
				class="account-shell-stat-icon-image"
			>
			<UiIcon
				v-else-if="stat.iconName"
				:name="stat.iconName"
				:size="48"
			/>
			<MuLinearWrapper direction="column" :gap="2">
				<MuText size="medium" color="text-secondary">{{ stat.label }}</MuText>
				<MuText size="xlarge" weight="bold" color="text-primary">{{ stat.value }}</MuText>
			</MuLinearWrapper>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { formatPrice } from '~/utils/currency/formatPrice';
import type { icons } from '~/data/ui/icons';
import { useOverviewStore } from '~/stores/users/overview.store';
import { storeToRefs } from 'pinia'

type IconName = keyof typeof icons;

type AccountStat = {
	key: string;
	label: string;
	value: string;
	iconName: IconName | null;
	iconSrc: string;
	iconAlt: string;
};

const { t } = useI18n();
const { overview } = storeToRefs(useOverviewStore())

const account_stats = computed<AccountStat[]>(() => [
	{
		key: 'orders',
		label: t('account.shell.stats.order'),
		value: String(overview.value?.total_orders ?? 0),
		iconName: null,
		iconSrc: '/icons/custom/checkout/icon-box.svg',
		iconAlt: 'Orders',
	},
	{
		key: 'points',
		label: t('account.shell.stats.points'),
		value: String(overview.value?.total_points ?? 0),
		iconName: null,
		iconSrc: '/icons/custom/account/points-icon.svg',
		iconAlt: 'Points',
	},
	{
		key: 'coupons',
		label: t('account.shell.stats.coupons'),
		value: String(overview.value?.total_coupons ?? 0),
		iconName: null,
		iconSrc: '/icons/custom/account/coupon-icon.svg',
		iconAlt: 'Coupons',
	},
	{
		key: 'total-spent',
		label: t('account.shell.stats.totalSpent'),
		value: overview.value ? formatPrice(overview.value.total_spent) : t('account.shell.defaultBalance'),
		iconName: null,
		iconSrc: '/icons/custom/account/total-spent-icon.svg',
		iconAlt: 'Total spent',
	},
]);
</script>

<style scoped lang="scss">
.account-shell-stat-icon-image {
	display: block;
	width: 48px;
	height: 48px;
	flex-shrink: 0;
}
</style>