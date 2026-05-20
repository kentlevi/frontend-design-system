<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuCalendar from '~/components/base/MuCalendar.vue';
import MuCheckbox from '~/components/base/MuCheckbox.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuSearch from '~/components/core/search/MuSearch.vue';
import MuSegmented from '~/components/base/MuSegmented.vue';
import MuText from '~/components/base/MuText.vue';
import { useOrdersHeader } from '~/composables/orders/useOrdersHeader';
import { useOrdersHeaderUI } from '~/composables/orders/useOrdersHeaderUI';

const { active_mode } = useOrdersHeader();
const {
	translate,
	active_options,
	status_options,
	date_picker_open,
	pending_date_range,
	active_quick_filter,
	date_button_label,
	pending_date_label,
	has_date_filter,
	quick_filters,
	filter_status,
	search_query,
	isStatusPending,
	toggleStatus,
	toggleFilter,
	applyFilter,
	cancelFilter,
	selectQuickFilter,
	toggleDatePicker,
	applyDatePicker,
	cancelDatePicker,
	clearDateFilter,
	submitSearch,
	clearSearch,
} = useOrdersHeaderUI();
</script>

<template>
	<MuLinearWrapper class="header" justify="space-between" align="center">
		<MuHeading weight="bold">{{ translate('account.orders.title') }}</MuHeading>

		<MuLinearWrapper justify="space-between" width="69.2%" :gap="12">
			<MuSegmented v-model="active_mode" :options="active_options" size="sm">
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
						@click="toggleDatePicker"
					>
						{{ date_button_label }}
						<UiIcon
							v-if="has_date_filter"
							name="regular-times-circle"
							clickable
							@click.stop="clearDateFilter"
						/>
					</UiButton>
					<MuCard v-if="date_picker_open" class="date_calendar" width="100%" padding="none">
						<div class="date_calendar__body">
							<MuCalendar v-model="pending_date_range" mode="range" :columns="2" class="date_calendar__calendar"/>
							<div class="date_calendar__filters">
								<MuText class="date_calendar__filters-title" weight="bold">Filters:</MuText>
								<ul class="date_calendar__filters-list">
									<li v-for="filter in quick_filters" :key="filter.key">
										<button
											type="button"
											class="date_calendar__filter"
											:data-active="active_quick_filter === filter.key ? 'true' : 'false'"
											@click="selectQuickFilter(filter)"
										>
											{{ filter.label }}
										</button>
									</li>
								</ul>
							</div>
						</div>
						<MuLinearWrapper class="date_calendar__actions" justify="space-between" align="center">
							<MuLinearWrapper :gap="8" align="center">
								<MuText class="date_calendar__actions-label">Select Dates:</MuText>
								<MuText class="date_calendar__actions-value">{{ pending_date_label }}</MuText>
							</MuLinearWrapper>
							<MuLinearWrapper :gap="16">
								<UiButton variant="ghost" tone="neutral" @click="cancelDatePicker">
									Cancel
								</UiButton>
								<UiButton tone="neutral" @click="applyDatePicker">
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
						data-testid="account-orders-filters-button"
						@click="toggleFilter"
					>
						{{ translate('account.orders.filters') }}
						<div class="filter-count">1</div>
					</UiButton>
					<MuCard v-if="filter_status" class="filter-status" padding="none">
						<div class="filter-status__header">
							<MuText size="large" weight="semi-bold">{{ translate('account.orders.filterOptions.orderStatus') }}</MuText>
						</div>
						<div class="filter-status__body">
							<ul>
								<li v-for="option in status_options" :key="option.type">
									<MuCheckbox
										:model-value="isStatusPending(option.type)"
										@update:model-value="toggleStatus(option.type)"
									>
										<MuText>{{ option.label }} ({{ option.count }})</MuText>
									</MuCheckbox>
								</li>
							</ul>
						</div>
						<div class="filter-status__footer">
							<MuLinearWrapper justify="flex-end" :gap="12" padding="16px">
								<UiButton variant="ghost" tone="neutral" @click="cancelFilter">
									Cancel
								</UiButton>
								<UiButton tone="neutral" @click="applyFilter">
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
					@enter="submitSearch"
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
							v-if="search_query"
							name="regular-times"
							:size="24"
							color="var(--text-primary)"
							clickable
							@click="clearSearch"
						/>
					</template>

				</MuSearch>
			</MuLinearWrapper>
		</MuLinearWrapper>

	</MuLinearWrapper>
</template>

<style lang="scss" scoped>
.date_handler{
	position: relative;
	.date_calendar{
		position: absolute;
		top: 100%;
		width: 760px;
		z-index: 1;
		margin-top: 5px;

		&__body{
			display: flex;
			gap: 24px;
			padding: 20px 20px 16px;
		}

		&__calendar{ flex: 1; min-width: 0; }

		&__filters{
			width: 148px;
			display: grid;
			gap: 12px;
		}

		&__filters-list{
			list-style: none;
			margin: 0;
			padding: 0;
			display: grid;
			gap: 2px;
		}

		&__filter{
			width: 100%;
			padding: 8px 14px;
			text-align: left;
			background: transparent;
			border: 0;
			border-radius: 8px;
			cursor: pointer;
			color: var(--text-primary);
			font: inherit;

			&:hover{ background: var(--gray-30); }
			&[data-active="true"]{
				background: var(--gray-50);
				font-weight: 500;
			}
		}

		&__actions{
			padding: 14px 20px;
			border-top: 1px solid var(--gray-50);
		}

		&__actions-label{ color: var(--text-secondary); }
		&__actions-value{ color: var(--text-primary); font-weight: 500; }
	}
}

.filter-count{
	position: absolute;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: var(--error-60);
	color: var(--white-base);
	top: -5px;
	right: -5px;
	line-height: 20px;
	box-shadow: 0 0 0 4px var(--white-base);
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