<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';

const { t } = useI18n();
</script>

<template>
	<MuLinearWrapper
		class="account-gallery-header"
		data-testid="account-gallery-header"
		justify="space-between"
		align="center"
		:gap="16"
	>
		<MuHeading variant="4" weight="bold" class="account-gallery-title" data-testid="account-gallery-title">
			{{ t('account.gallery.title') }}
		</MuHeading>
		<MuLinearWrapper
			class="account-gallery-actions"
			data-testid="account-gallery-actions"
			align="center"
			:gap="10"
		>
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
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.account-gallery-header {
	margin-bottom: 20px;
}

.account-gallery-actions {
	.account-gallery-search {
		width: 180px;
	}
}
</style>
