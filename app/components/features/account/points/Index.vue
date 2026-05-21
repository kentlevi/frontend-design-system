<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const RankingModal = defineAsyncComponent(
	() => import('~/components/features/account/points/modals/RankingModal.vue')
);

const is_ranking_modal_open = ref(false);

function openRankingModal() {
	is_ranking_modal_open.value = true;
}

provide('points:openRankingModal', openRankingModal)
</script>

<template>
	<section class="account-page" data-testid="account-points-page">
		<div class="account-content" data-testid="account-points-content">
			<FeaturesAccountPointsContent />
		</div>

		<RankingModal v-model="is_ranking_modal_open" />
	</section>
</template>

<style scoped lang="scss">
.account-page {
	background: var(--bg-page);
	min-height: calc(100vh - 176px);

	.account-content {
		padding-top: 40px;
		padding-bottom: 48px;
	}

	@media (max-width: 760px) {
		.account-content {
			padding-top: 24px;
		}
	}
}
</style>