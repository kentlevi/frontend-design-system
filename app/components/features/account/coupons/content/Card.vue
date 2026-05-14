<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

interface CouponItem {
	code: string;
	titleKey: string;
	expiry: string;
	tag: string;
}

defineProps<{
	item: CouponItem;
}>();

const { t: translate } = useI18n();
</script>

<template>
	<MuLinearWrapper
		class="account-coupons-card"
		:data-testid="`account-coupons-item-${item.code}`"
		justify="space-between"
		:gap="14"
	>
		<div class="account-coupons-card-copy">
			<MuHeading weight="semi-bold" class="account-coupons-card-title">{{ translate(`account.coupons.items.${item.titleKey}.title`) }}</MuHeading>
			<MuHeading variant="3" class="account-coupons-code">{{ item.code }}</MuHeading>
			<MuText color="text-secondary" class="account-coupons-note">{{ translate(`account.coupons.items.${item.titleKey}.note`) }}</MuText>
		</div>
		<div class="account-coupons-right">
			<MuText weight="bold" color="text-primary" class="account-coupons-expiry">{{ item.expiry }}</MuText>
			<MuText variant="span" weight="bold" color="text-primary" class="account-coupons-tag">{{ translate(`account.coupons.tags.${item.tag}`) }}</MuText>
		</div>
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.account-coupons-card {
	padding: 16px 18px;
	border-top: 1px solid var(--border-default);

	&:first-child {
		border-top: 0;
	}

	.account-coupons-card-copy {
		.account-coupons-card-title {
			font-weight: var(--font-weight-semibold);
			font-size: var(--type-size-400);
			line-height: var(--type-line-400);
		}

		.account-coupons-code {
			margin: 4px 0 0;
			font-size: var(--type-size-550);
			line-height: var(--type-line-550);
		}

		.account-coupons-note {
			margin: 8px 0 0;
		}
	}

	.account-coupons-right {
		text-align: right;
		display: grid;
		align-content: space-between;
		gap: 16px;

		.account-coupons-expiry {
			font-size: var(--type-size-500);
			line-height: var(--type-line-500);
		}

		.account-coupons-tag {
			justify-self: end;
			height: 28px;
			border-radius: 999px;
			padding: 0 12px;
			display: inline-flex;
			align-items: center;
			background: color-mix(in srgb, var(--brand-primary) 16%, var(--contrast-light));
		}
	}
}
</style>