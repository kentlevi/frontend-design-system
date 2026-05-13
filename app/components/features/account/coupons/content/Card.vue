<script setup lang="ts">
interface CouponItem {
	code: string;
	titleKey: string;
	expiry: string;
	tag: string;
}

defineProps<{
	item: CouponItem;
}>();

const { t } = useI18n();
</script>

<template>
	<article
		class="account-coupons-card"
		:data-testid="`account-coupons-item-${item.code}`"
	>
		<div class="account-coupons-card-copy">
			<h2 class="account-coupons-card-title">{{ t(`account.coupons.items.${item.titleKey}.title`) }}</h2>
			<h3 class="account-coupons-code">{{ item.code }}</h3>
			<p class="account-coupons-note">{{ t(`account.coupons.items.${item.titleKey}.note`) }}</p>
		</div>
		<div class="account-coupons-right">
			<p class="account-coupons-expiry">{{ item.expiry }}</p>
			<span class="account-coupons-tag">{{ t(`account.coupons.tags.${item.tag}`) }}</span>
		</div>
	</article>
</template>

<style scoped lang="scss">
.account-coupons-card {
	padding: 16px 18px;
	border-top: 1px solid var(--border-default);
	display: flex;
	justify-content: space-between;
	gap: 14px;

	&:first-child {
		border-top: 0;
	}

	.account-coupons-card-copy {
		.account-coupons-card-title {
			font-weight: var(--font-weight-semibold);;
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
			color: var(--text-secondary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
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
			font-weight: var(--font-weight-bold);
			color: var(--text-primary);
		}

		.account-coupons-tag {
			justify-self: end;
			height: 28px;
			border-radius: 999px;
			padding: 0 12px;
			display: inline-flex;
			align-items: center;
			background: color-mix(in srgb, var(--brand-primary) 16%, var(--contrast-light));
			color: var(--text-primary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			font-weight: var(--font-weight-bold);
		}
	}
}
</style>
