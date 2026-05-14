<script setup lang="ts">
import MuText from '~/components/base/MuText.vue';

const { t } = useI18n();
</script>

<template>
	<div class="account-quote-chat-messages" data-testid="account-quote-requests-messages">
		<div class="account-quote-chat-bubble" data-testid="account-quote-requests-bubble">
			{{ t('account.quoteRequests.sampleMessage') }}
			<div class="account-quote-chat-request">
				<MuText variant="span" weight="bold" class="account-quote-chat-request-label">{{ t('account.quoteRequests.requestLabel') }}:</MuText>
				{{ t('account.quoteRequests.sampleRequestDetails') }}
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.account-quote-chat-messages {
	padding: 16px;

	.account-quote-chat-bubble {
		max-width: 620px;
		border-radius: 10px;
		background: color-mix(in srgb, var(--brand-primary) 14%, var(--contrast-light));
		padding: 12px;
		color: var(--text-primary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);

		.account-quote-chat-request {
			margin-top: 8px;
			border: 1px solid color-mix(in srgb, var(--brand-primary) 58%, var(--border-default));
			border-radius: 8px;
			padding: 10px;
			background: var(--contrast-light);

			.account-quote-chat-request-label {
				font-weight: var(--font-weight-bold);
			}
		}
	}
}
</style>
