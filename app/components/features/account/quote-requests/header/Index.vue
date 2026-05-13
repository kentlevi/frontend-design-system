<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
	<header class="account-quote-header" data-testid="account-quote-requests-header">
		<h1 class="account-quote-title" data-testid="account-quote-requests-title">{{ t('account.quoteRequests.title') }}</h1>
		<div class="account-quote-tools" data-testid="account-quote-requests-tools">
			<UiButton variant="outline" tone="neutral" size="md" data-testid="account-quote-requests-select-date-button">
				{{ t('account.quoteRequests.selectDate') }}
			</UiButton>
			<UiButton variant="outline" tone="neutral" size="md" data-testid="account-quote-requests-filters-button">
				{{ t('account.quoteRequests.filters') }}
			</UiButton>
		</div>
	</header>
</template>

<style scoped lang="scss">
.account-quote-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	margin-bottom: 18px;

	.account-quote-title {
		font-size: var(--type-size-450);
		line-height: var(--type-line-450);
		font-weight: var(--font-weight-bold);
	}

	.account-quote-tools {
		display: flex;
		gap: 8px;
	}
}
</style>
