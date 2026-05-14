<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import { useAccountQuoteRequests } from '~/composables/account/quoteRequests/useAccountQuoteRequests';

const { t: translate } = useI18n();
const { activeRequest } = useAccountQuoteRequests();
</script>

<template>
	<MuLinearWrapper
		class="account-quote-chat-header"
		data-testid="account-quote-requests-chat-header"
		justify="space-between"
		align="center"
		:gap="12"
	>
		<MuHeading class="account-quote-chat-title">
			{{ translate('account.quoteRequests.orderLabel') }} #{{ activeRequest?.id }}
		</MuHeading>
		<MuText variant="span" weight="bold" color="text-primary" class="account-quote-chat-status">
			{{ translate(`account.quoteRequests.status.${activeRequest?.statusKey || 'inReview'}`) }}
		</MuText>
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.account-quote-chat-header {
	padding: 16px;
	border-bottom: 1px solid var(--border-default);

	.account-quote-chat-title {
		font-size: var(--type-size-550);
		line-height: var(--type-line-550);
		font-weight: var(--font-weight-bold);
	}

	.account-quote-chat-status {
		height: 26px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--brand-primary) 16%, var(--contrast-light));
		display: inline-flex;
		align-items: center;
		padding: 0 10px;
	}
}
</style>