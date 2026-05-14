<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import { useAccountQuoteRequests } from '~/composables/account/quoteRequests/useAccountQuoteRequests';

const { t: translate } = useI18n();
const { requests } = useAccountQuoteRequests();
</script>

<template>
	<aside class="account-quote-list" data-testid="account-quote-requests-list">
		<MuCard
			v-for="(item, index) in requests"
			:key="item.id"
			padding="none"
			:class="['account-quote-item', { active: index === 0 }]"
			:data-testid="`account-quote-requests-item-${index}`"
		>
			<MuHeading variant="3" class="account-quote-item-title">
				{{ translate('account.quoteRequests.orderLabel') }} #{{ item.id }}
			</MuHeading>
			<MuText color="text-secondary" class="account-quote-item-meta">
				{{ translate('account.quoteRequests.quoteDate') }}: {{ item.date }}
			</MuText>
		</MuCard>
	</aside>
</template>

<style scoped lang="scss">
.account-quote-list {
	display: grid;
	gap: 8px;
	align-content: start;

	.account-quote-item {
		padding: 12px;
		cursor: pointer;

		&.active {
			background: color-mix(in srgb, var(--brand-primary) 12%, var(--contrast-light));
			box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--brand-primary) 60%, var(--border-default));
		}

		.account-quote-item-title {
			font-size: var(--type-size-400);
			line-height: var(--type-line-400);
			font-weight: var(--font-weight-bold);
		}

		.account-quote-item-meta {
			margin: 8px 0 0;
		}
	}
}
</style>