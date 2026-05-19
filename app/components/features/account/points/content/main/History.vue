<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

type LogFilter = 'all' | 'earned' | 'deducted';

const { t: translate } = useI18n();

const filters: Array<{ id: LogFilter; label: string }> = [
	{ id: 'all', label: translate('account.points.filters.all') },
	{ id: 'earned', label: translate('account.points.filters.earned') },
	{ id: 'deducted', label: translate('account.points.filters.deducted') },
];

const all_logs = [
	{
		id: 'earned-order-12405077220',
		title: `${translate('account.points.logs.pointsEarned')} (Order # 12405077220)`,
		date: '11/05/2024',
		value: '+0.36 P',
		positive: true,
		filter: 'earned' as LogFilter,
	},
	{
		id: 'used-order-12405077220',
		title: `${translate('account.points.logs.pointsUsed')} (Order # 12405077220)`,
		date: '11/05/2024',
		value: '-25.00 P',
		positive: false,
		filter: 'deducted' as LogFilter,
	},
	{
		id: 'quest-sticker-explorer',
		title: `${translate('account.points.logs.stickerQuest')} (${translate('account.points.challenges.stickerExplorer.name')})`,
		date: '10/22/2024',
		value: '+5.00 P',
		positive: true,
		filter: 'earned' as LogFilter,
	},
	{
		id: 'quest-first-order-victory',
		title: `${translate('account.points.logs.stickerQuest')} (${translate('account.points.challenges.firstOrderVictory.name')})`,
		date: '10/15/2024',
		value: '+5.00 P',
		positive: true,
		filter: 'earned' as LogFilter,
	},
	{
		id: 'rank-level-up',
		title: `${translate('account.points.logs.rankLevelUp')} (${translate('account.points.tierName')})`,
		date: '10/05/2024',
		value: translate('account.points.data.freeExpressShippingOneTime'),
		positive: true,
		filter: 'earned' as LogFilter,
	},
];

const active_filter = ref<LogFilter>('all');

const logs = computed(() => {
	if (active_filter.value === 'all') return all_logs;
	return all_logs.filter((log) => log.filter === active_filter.value);
});

function setActiveFilter(filter_id: LogFilter) {
	active_filter.value = filter_id;
}

function handleFilterClick(filter_id: LogFilter) {
	setActiveFilter(filter_id);
}
</script>

<template>
	<section class="history">
		<MuLinearWrapper class="filters" align="center" :gap="18">
			<MuText variant="span" weight="semi-bold" color="text-primary" class="filter-label">{{ translate('account.points.filter') }}</MuText>
			<div class="filter-group">
				<button
					v-for="filter in filters"
					:key="filter.id"
					type="button"
					class="filter-button"
					:data-active="active_filter === filter.id"
					@click="handleFilterClick(filter.id)"
				>
					{{ filter.label }}
				</button>
			</div>
		</MuLinearWrapper>

		<div class="logs" data-testid="account-points-logs">
			<div class="logs-head">
				{{ translate('account.points.logsTitle') }}
			</div>

			<div class="log-list">
				<MuLinearWrapper
					v-for="log in logs"
					:key="log.id"
					class="log-row"
					:data-testid="`account-points-log-${log.id}`"
					justify="space-between"
					:gap="12"
				>
					<div>
						<MuHeading variant="3" class="log-title">{{ log.title }}</MuHeading>
						<MuText color="text-secondary" class="log-date">{{ log.date }}</MuText>
					</div>
					<strong :class="{ plus: log.positive, minus: !log.positive }">{{ log.value }}</strong>
				</MuLinearWrapper>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.history {
	display: grid;
	gap: 16px;
	padding-top: 2px;

	.filter-group {
		display: inline-flex;
		align-items: center;
		border: 1px solid var(--text-primary);
		border-radius: 999px;
		overflow: hidden;
		background: var(--contrast-light);
		box-shadow: 0 2px 6px rgba(27, 32, 44, 0.05);
	}

	.filter-button {
		min-width: 88px;
		height: 40px;
		padding: 0 18px;
		border: 0;
		border-left: 1px solid var(--text-primary);
		background: transparent;
		color: var(--text-primary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		cursor: pointer;

		&:first-child {
			border-left: 0;
		}

		&[data-active='true'] {
			background: var(--text-primary);
			color: var(--contrast-light);
		}
	}

	.logs {
		border: 1px solid var(--border-default);
		border-radius: 12px;
		overflow: hidden;
		background: var(--contrast-light);
		box-shadow: 0 10px 24px rgba(17, 24, 39, 0.05);
	}

	.logs-head {
		padding: 15px 22px;
		border-bottom: 1px solid var(--border-default);
		background: #f6f6f7;
		color: var(--text-primary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
	}

	.log-list {
		max-height: 452px;
		overflow-y: auto;

		&::-webkit-scrollbar {
			width: 8px;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: 999px;
			background: color-mix(in srgb, var(--text-secondary) 28%, white);
		}
	}

	.log-row {
		padding: 20px 22px;
		border-top: 1px solid var(--border-default);

		&:first-child {
			border-top: 0;
		}

		.log-title {
			margin: 0 0 8px;
			font-size: var(--type-size-200);
			line-height: var(--type-line-200);
			font-weight: var(--font-weight-semibold);
			color: var(--text-primary);
		}

		.log-date {
			margin: 0;
		}

		strong {
			align-self: center;
			text-align: right;
			font-size: var(--type-size-200);
			line-height: var(--type-line-200);
			font-weight: var(--font-weight-bold);

			&.plus {
				color: #30b44a;
			}

			&.minus {
				color: #ff4343;
			}
		}
	}
}

@media (max-width: 760px) {
	.history {
		.filters {
			flex-direction: column !important;
			align-items: flex-start !important;
			gap: 10px !important;
		}

		.filter-group {
			width: 100%;
		}

		.filter-button {
			flex: 1;
			min-width: 0;
		}

		.log-row {
			flex-direction: column !important;
			align-items: flex-start !important;

			strong {
				text-align: left;
			}
		}
	}
}
</style>
