<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
	<header class="account-gallery-header" data-testid="account-gallery-header">
		<h1 class="account-gallery-title" data-testid="account-gallery-title">{{ t('account.gallery.title') }}</h1>
		<div class="account-gallery-actions" data-testid="account-gallery-actions">
			<UiButton variant="outline" tone="neutral" size="md" data-testid="account-gallery-filters-button">
				{{ t('account.gallery.filters') }}
			</UiButton>
			<UiInput
				model-value=""
				class="account-gallery-search"
				type="text"
				:placeholder="t('account.gallery.searchPlaceholder')"
				data-testid="account-gallery-search"
			/>
		</div>
	</header>
</template>

<style scoped lang="scss">
.account-gallery-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	margin-bottom: 20px;

	.account-gallery-title {
		font-size: var(--type-size-450);
		line-height: var(--type-line-450);
		font-weight: var(--font-weight-bold);
	}

	.account-gallery-actions {
		display: flex;
		gap: 10px;
		align-items: center;

		.account-gallery-search {
			width: 180px;
		}
	}
}
</style>
