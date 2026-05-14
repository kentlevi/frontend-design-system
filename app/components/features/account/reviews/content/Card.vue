<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

interface ReviewItem {
	titleKey: string
	textKey: string
	date: string
	rating: number
}

defineProps<{
	item: ReviewItem
}>()

const { t: translate } = useI18n();
</script>

<template>
	<MuCard
		padding="none"
		class="account-reviews-card"
		:data-testid="`account-reviews-item-${item.titleKey}`"
	>
		<MuLinearWrapper
			class="account-reviews-card-header"
			justify="space-between"
			align="center"
			:gap="12"
		>
			<MuHeading class="account-reviews-card-title">{{ translate(`account.reviews.items.${item.titleKey}.title`) }}</MuHeading>
			<MuText color="text-secondary" class="account-reviews-card-date">{{ translate('account.reviews.reviewedOn') }}: {{ item.date }}</MuText>
		</MuLinearWrapper>
		<MuText weight="bold" color="brand-primary" class="account-reviews-card-rating">{{ translate('account.reviews.rating') }}: {{ item.rating }}/5</MuText>
		<MuText color="text-secondary" class="account-reviews-card-body">{{ translate(`account.reviews.items.${item.textKey}.text`) }}</MuText>
	</MuCard>
</template>

<style scoped lang="scss">
.account-reviews-card {
	padding: 16px;

	.account-reviews-card-title {
		font-size: var(--type-size-500);
		line-height: var(--type-line-500);
		font-weight: var(--font-weight-bold);
	}

	.account-reviews-card-rating {
		margin: 8px 0 0;
	}

	.account-reviews-card-body {
		margin: 8px 0 0;
	}
}
</style>