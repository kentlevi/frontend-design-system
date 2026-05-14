<script setup lang="ts">
import { useAccountReviews } from '~/composables/account/reviews/useAccountReviews';

const { reviews } = useAccountReviews();
</script>

<template>
	<div class="account-reviews-list" data-testid="account-reviews-list">
		<FeaturesAccountReviewsContentCard
			v-for="item in reviews"
			:key="item.titleKey"
			:item="item"
		/>
	</div>
</template>

<style scoped lang="scss">
.account-reviews-list {
	display: grid;
	gap: 12px;
}
</style>