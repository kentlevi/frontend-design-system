<script setup lang="ts">
</script>

<template>
	<section class="account-page" data-testid="account-coupons-page">
		<div class="account-content" data-testid="account-coupons-content">
			<FeaturesAccountCouponsHeader />
			<FeaturesAccountCouponsContent />
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
