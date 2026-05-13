<script setup lang="ts">
import { useAccountCoupons } from '~/composables/account/coupons/useAccountCoupons';
import CouponsCard from './CouponsCard.vue';

const { t } = useI18n();
const { coupons } = useAccountCoupons();
</script>

<template>
	<section class="account-page" data-testid="account-coupons-page">
		<div class="account-content" data-testid="account-coupons-content">
			<header class="account-coupons-header" data-testid="account-coupons-header">
				<h1 class="account-coupons-title" data-testid="account-coupons-title">{{ t('account.coupons.title') }}</h1>
				<div class="account-coupons-add-row" data-testid="account-coupons-add-row">
					<UiInput
						model-value=""
						type="text"
						class="account-coupons-code-input"
						:placeholder="t('account.coupons.codePlaceholder')"
						data-testid="account-coupons-code-input"
					/>
					<UiButton variant="filled" tone="neutral" size="md" data-testid="account-coupons-add-button">
						{{ t('account.coupons.addCoupon') }}
					</UiButton>
				</div>
			</header>

			<div class="account-coupons-list" data-testid="account-coupons-list">
				<CouponsCard
					v-for="item in coupons"
					:key="item.code"
					:item="item"
				/>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.account-page {
	background: var(--bg-page);
	min-height: calc(100vh - 176px);

	.account-content {
		padding-top: 40px;
	}

	.account-coupons-header {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		align-items: center;
		margin-bottom: 20px;

		.account-coupons-title {
			font-size: var(--type-size-450);
			line-height: var(--type-line-450);
			font-weight: var(--font-weight-bold);
		}
	}

	.account-coupons-add-row {
		display: flex;
		gap: 8px;
		align-items: center;

		.account-coupons-code-input {
			width: 420px;
		}
	}

	.account-coupons-list {
		border: 1px solid var(--border-default);
		border-radius: 10px;
		overflow: hidden;
		background: var(--contrast-light);
	}
}
</style>