<template>
	<MuLinearWrapper justify="space-between" align="center">
		<MuHeading weight="bold">My Orders</MuHeading>

		<MuLinearWrapper justify="space-between" width="69.2%">
<MuSegmented v-model="active" :options="active_options" size="sm">
					<template #option="{ option }">
						<MuText weight="bold">{{ option.label }}</MuText>
					</template>
				</MuSegmented>

			<MuLinearWrapper :gap="12">
				<UiButton variant="outline" tone="neutral" size="md" height="40px" icon="regular-calendar"
					icon-position="right" icon-size="24"
					class="account-orders-tool-button account-orders-select-date-button"
					data-testid="account-orders-select-date-button">
					{{ t('account.orders.selectDate') }}
				</UiButton>

				<UiButton variant="outline" tone="neutral" size="md" height="40px" icon="regular-slider-horizontal"
					icon-position="left" icon-size="24" class="account-orders-tool-button"
					data-testid="account-orders-filters-button">
					{{ t('account.orders.filters') }}
				</UiButton>

				<UiInput type="search" size="md" class="account-orders-search"
					:placeholder="t('account.orders.searchPlaceholder')" data-testid="account-orders-search-input">
					<template #icon-left>
						<UiIcon name="regular-search" :size="24" color="var(--text-primary)"
							class="account-orders-search-icon" />
					</template>

				</UiInput>
			</MuLinearWrapper>
		</MuLinearWrapper>

	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuSegmented from '~/components/base/MuSegmented.vue';
import MuText from '~/components/base/MuText.vue';

const { t } = useI18n();

const active = ref('active');

const active_options = [
	{ label: 'Active', value: 'active' },
	{ label: 'Inactive', value: 'inactive' },
];

</script>

<style lang="scss" scoped></style>