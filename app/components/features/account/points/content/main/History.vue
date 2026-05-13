<script setup lang="ts">
import type { useAccountPoints } from '~/composables/account/points/useAccountPoints';
import type { AccountPointLogFilter } from '~/types/account/points';

const { t } = useI18n();
const {
	filters,
	logs,
	active_filter,
	setActiveFilter,
} = inject<ReturnType<typeof useAccountPoints>>('points:state')!

function handleFilterClick(filter_id: AccountPointLogFilter) {
	setActiveFilter(filter_id);
}
</script>

<template>
	<section class="account-points-history-panel">
		<div class="account-points-filters">
			<span class="account-points-filter-label">{{ t('account.points.filter') }}</span>
			<div class="account-points-filter-group">
				<button
					v-for="filter in filters"
					:key="filter.id"
					type="button"
					class="account-points-filter-button"
					:data-active="active_filter === filter.id"
					@click="handleFilterClick(filter.id)"
				>
					{{ filter.label }}
				</button>
			</div>
		</div>

		<div class="account-points-logs" data-testid="account-points-logs">
			<div class="account-points-logs-head">
				{{ t('account.points.logsTitle') }}
			</div>

			<div class="account-points-log-list">
				<article
					v-for="log in logs"
					:key="log.id"
					class="account-points-log-row"
					:data-testid="`account-points-log-${log.id}`"
				>
					<div>
						<h3 class="account-points-log-title">{{ log.title }}</h3>
						<p class="account-points-log-date">{{ log.date }}</p>
					</div>
					<strong :class="{ plus: log.positive, minus: !log.positive }">{{ log.value }}</strong>
				</article>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.account-points-history-panel {
	display: grid;
	gap: 16px;
	padding-top: 2px;
}

.account-points-filters {
	display: inline-flex;
	align-items: center;
	gap: 18px;
}

.account-points-filter-label {
	color: var(--text-primary);
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-semibold);
}

.account-points-filter-group {
	display: inline-flex;
	align-items: center;
	border: 1px solid var(--text-primary);
	border-radius: 999px;
	overflow: hidden;
	background: var(--contrast-light);
	box-shadow: 0 2px 6px rgba(27, 32, 44, 0.05);
}

.account-points-filter-button {
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

.account-points-logs {
	border: 1px solid var(--border-default);
	border-radius: 12px;
	overflow: hidden;
	background: var(--contrast-light);
	box-shadow: 0 10px 24px rgba(17, 24, 39, 0.05);
}

.account-points-logs-head {
	padding: 15px 22px;
	border-bottom: 1px solid var(--border-default);
	background: #f6f6f7;
	color: var(--text-primary);
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-semibold);
}

.account-points-log-list {
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

.account-points-log-row {
	display: flex;
	justify-content: space-between;
	gap: 12px;
	padding: 20px 22px;
	border-top: 1px solid var(--border-default);

	&:first-child {
		border-top: 0;
	}

	.account-points-log-title {
		margin: 0 0 8px;
		font-size: var(--type-size-200);
		line-height: var(--type-line-200);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
	}

	.account-points-log-date {
		margin: 0;
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
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

@media (max-width: 760px) {
	.account-points-filters {
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
	}

	.account-points-filter-group {
		width: 100%;
	}

	.account-points-filter-button {
		flex: 1;
		min-width: 0;
	}

	.account-points-log-row {
		flex-direction: column;
		align-items: flex-start;

		strong {
			text-align: left;
		}
	}
}
</style>
