<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';

interface ReviewItem {
	titleKey: string
	textKey: string
	date: string
	rating: number
}

defineProps<{
	item: ReviewItem
}>()

const { t } = useI18n();
</script>

<template>
	<MuCard
		padding="none"
		class="account-reviews-card"
		:data-testid="`account-reviews-item-${item.titleKey}`"
	>
		<header class="account-reviews-card-header">
			<h2 class="account-reviews-card-title">{{ t(`account.reviews.items.${item.titleKey}.title`) }}</h2>
			<p class="account-reviews-card-date">{{ t('account.reviews.reviewedOn') }}: {{ item.date }}</p>
		</header>
		<p class="account-reviews-card-rating">{{ t('account.reviews.rating') }}: {{ item.rating }}/5</p>
		<p class="account-reviews-card-body">{{ t(`account.reviews.items.${item.textKey}.text`) }}</p>
	</MuCard>
</template>

<style scoped lang="scss">
.account-reviews-card {
	padding: 16px;

	.account-reviews-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;

		.account-reviews-card-title {
			font-size: var(--type-size-500);
			line-height: var(--type-line-500);
			font-weight: var(--font-weight-bold);
		}

		.account-reviews-card-date {
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			color: var(--text-secondary);
		}
	}

	.account-reviews-card-rating {
		margin: 8px 0 0;
		font-weight: var(--font-weight-bold);
		color: var(--brand-primary);
	}

	.account-reviews-card-body {
		margin: 8px 0 0;
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
	}
}
</style>
