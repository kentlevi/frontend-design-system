<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';

const { t } = useI18n();
</script>

<template>
	<MuLinearWrapper class="account-quote-chat-footer" data-testid="account-quote-requests-footer" :gap="10">
		<UiInput
			model-value=""
			type="text"
			class="account-quote-chat-input"
			:placeholder="t('account.quoteRequests.messagePlaceholder')"
			data-testid="account-quote-requests-input"
		/>
		<UiButton variant="filled" tone="neutral" size="md" class="account-quote-chat-send" data-testid="account-quote-requests-send-button">
			{{ t('account.quoteRequests.send') }}
		</UiButton>
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.account-quote-chat-footer {
	border-top: 1px solid var(--border-default);
	padding: 12px;
}
</style>
