<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
	<h1 class="account-reviews-title" data-testid="account-reviews-title">
		{{ t('account.reviews.title') }}
	</h1>
</template>

<style scoped lang="scss">
.account-reviews-title {
	margin: 0 0 20px;
	font-size: var(--type-size-450);
	line-height: var(--type-line-450);
	font-weight: var(--font-weight-bold);
}
</style>
