<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';

const { t } = useI18n();
</script>

<template>
	<MuLinearWrapper
		class="account-quote-header"
		data-testid="account-quote-requests-header"
		justify="space-between"
		align="center"
		:gap="16"
	>
		<MuHeading variant="4" weight="bold" class="account-quote-title" data-testid="account-quote-requests-title">
			{{ t('account.quoteRequests.title') }}
		</MuHeading>
		<MuLinearWrapper class="account-quote-tools" data-testid="account-quote-requests-tools" :gap="8">
			<UiButton variant="outline" tone="neutral" size="md" data-testid="account-quote-requests-select-date-button">
				{{ t('account.quoteRequests.selectDate') }}
			</UiButton>
			<UiButton variant="outline" tone="neutral" size="md" data-testid="account-quote-requests-filters-button">
				{{ t('account.quoteRequests.filters') }}
			</UiButton>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.account-quote-header {
	margin-bottom: 18px;
}
</style>
