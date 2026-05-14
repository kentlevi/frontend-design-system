<script setup lang="ts">
</script>

<template>
	<section class="account-page" data-testid="account-reviews-page">
		<div class="account-content" data-testid="account-reviews-content">
			<FeaturesAccountReviewsHeader />
			<FeaturesAccountReviewsContent />
		</div>
	</section>
</template>

<style scoped lang="scss">
.account-page {
	background: var(--bg-page);
	min-height: calc(100vh - 176px);

	.account-content {
		padding-top: 40px;
	}
}
</style>