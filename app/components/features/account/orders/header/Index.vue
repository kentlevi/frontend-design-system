<template>
	<MuLinearWrapper class="header" justify="space-between" align="center">
		<MuHeading weight="bold">My Orders</MuHeading>

		<MuLinearWrapper justify="space-between" width="69.2%">
			<MuSegmented v-model="active" :options="active_options" size="sm">
				<template #option="{ option }">
					<MuText weight="bold">{{ option.label }}</MuText>
				</template>
			</MuSegmented>

			<MuLinearWrapper :gap="12">
				<MuLinearWrapper class="date_handler">
					<UiButton
						variant="outline"
						tone="neutral" size="md"
						height="40px"
						icon="regular-calendar"
						icon-position="right" icon-size="24"
						class="account-orders-tool-button account-orders-select-date-button"
						data-testid="account-orders-select-date-button"
						@click="date_picker_open = !date_picker_open"
					>
						<!-- {{ translate('account.orders.selectDate') }} -->
						{{selected_range.start.toLocaleDateString()}} - {{selected_range.end.toLocaleDateString()}}
						<UiIcon name="regular-times-circle"/>
					</UiButton>
					<MuCard v-if="date_picker_open" class="date_calendar" width="100%">
						<MuLinearWrapper direction="column">
							<MuCalendar v-model="selected_range" mode="range" columns="2"/>
							<MuLinearWrapper justify="flex-end" :gap="16">
								<UiButton variant="ghost" tone="neutral" @click="date_picker_open = false">
									Cancel
								</UiButton>
								<UiButton tone="neutral" @click="date_picker_open = false">
									Apply
								</UiButton>
							</MuLinearWrapper>
						</MuLinearWrapper>
					</MuCard>
				</MuLinearWrapper>

				<MuLinearWrapper class="order-filters">
					<UiButton
						variant="outline"
						tone="neutral"
						size="md"
						height="40px"
						icon="regular-slider-horizontal"
						icon-position="left"
						icon-size="24"
						class="account-orders-tool-button"
						data-testid="account-orders-filters-button" @click="filter_status = !filter_status"
					>
						{{ translate('account.orders.filters') }}
					</UiButton>
					<MuCard v-if="filter_status" class="filter-status" padding="none">
						<div class="filter-status__header">
							<MuText size="large" weight="semi-bold">Order Status</MuText>
						</div>
						<div class="filter-status__body">
							<ul>
								<li>
									<MuCheckbox>
										<MuText>On-going (2)</MuText>
									</MuCheckbox>
								</li>
								<li>
									<MuCheckbox>
										<MuText>Action Required (2)</MuText>
									</MuCheckbox>
								</li>
								<li>
									<MuCheckbox>
										<MuText>To Receive (0)</MuText>
									</MuCheckbox>
								</li>
								<li>
									<MuCheckbox>
										<MuText>Completed (1)</MuText>
									</MuCheckbox>
								</li>
								<li>
									<MuCheckbox>
										<MuText>Cancelled (0)</MuText>
									</MuCheckbox>
								</li>
							</ul>
						</div>
						<div class="filter-status__footer">
							<MuLinearWrapper justify="flex-end" :gap="12" padding="16px">
								<UiButton variant="ghost" tone="neutral" @click="filter_status = false">
									Cancel
								</UiButton>
								<UiButton tone="neutral" @click="filter_status = false">
									Apply
								</UiButton>
							</MuLinearWrapper>
						</div>
					</MuCard>
				</MuLinearWrapper>

				<MuSearch
					v-model="search_query"
					size="md"
					class="account-orders-search"
					:placeholder="translate('account.orders.searchPlaceholder')"
					data-testid="account-orders-search-input"
				>
					<template #left>
						<UiIcon
							name="regular-search"
							:size="24"
							color="var(--text-primary)"
							class="account-orders-search-icon"
						/>
					</template>
					<template #right>
						<UiIcon
							name="regular-times"
							:size="24"
							color="var(--text-primary)"
							clickable
						/>
					</template>

				</MuSearch>
			</MuLinearWrapper>
		</MuLinearWrapper>

	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuCalendar from '~/components/base/MuCalendar.vue';
import MuCheckbox from '~/components/base/MuCheckbox.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuSearch from '~/components/core/search/MuSearch.vue';
import MuSegmented from '~/components/base/MuSegmented.vue';
import MuText from '~/components/base/MuText.vue';

const { t: translate } = useI18n();

const active = ref('active');

const active_options = [
	{ label: 'Active', value: 'active' },
	{ label: 'Inactive', value: 'inactive' },
];

const date_picker_open = ref(false);

const selected_range = ref({
	start: new Date(),
	end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 4),
});

const filter_status = ref(false);
const search_query = ref('');
</script>

<style lang="scss" scoped>
.date_handler{
	position: relative;
	.date_calendar{
		position: absolute;
		top: 100%;
		width: 616px;
		z-index: 1;
		margin-top: 5px;
	}
}
.order-filters{
	position: relative;
	.filter-status{
		position: absolute;
		top: 100%;
		width: 232px;
		margin-top: 4px;
		&__header{
			border-bottom: 1px solid var(--gray-50);
			padding: 16px;
		}
		&__body{
			padding: 8px 0;
			ul{
				list-style: none;
				padding: 0;
				margin: 0;
				li{
					padding: 10px 16px;
				}
			}
		}
		&__footer{
			border-top: 1px solid var(--gray-50);
		}
	}
}

</style>