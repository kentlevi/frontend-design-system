<script setup lang="ts">
import { useAccountQuoteRequests } from '~/composables/account/quoteRequests/useAccountQuoteRequests';

const { t } = useI18n();
const { activeRequest } = useAccountQuoteRequests();
</script>

<template>
	<header class="account-quote-chat-header" data-testid="account-quote-requests-chat-header">
		<h2 class="account-quote-chat-title">
			{{ t('account.quoteRequests.orderLabel') }} #{{ activeRequest?.id }}
		</h2>
		<span class="account-quote-chat-status">
			{{ t(`account.quoteRequests.status.${activeRequest?.statusKey || 'inReview'}`) }}
		</span>
	</header>
</template>

<style scoped lang="scss">
.account-quote-chat-header {
	padding: 16px;
	border-bottom: 1px solid var(--border-default);
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;

	.account-quote-chat-title {
		font-size: var(--type-size-550);
		line-height: var(--type-line-550);
		font-weight: var(--font-weight-bold);
	}

	.account-quote-chat-status {
		height: 26px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--brand-primary) 16%, var(--contrast-light));
		color: var(--text-primary);
		display: inline-flex;
		align-items: center;
		padding: 0 10px;
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-bold);
	}
}
</style>
