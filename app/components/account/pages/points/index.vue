<script setup lang="ts">
import AccountPointsRankingModal from './AccountPointsRankingModal.vue';
import { useAccountPoints } from '~/composables/account/points/useAccountPoints';
import type { AccountPointLogFilter } from '~/types/account/points';

const { t: translate } = useI18n();
const {
	summary,
	ranks,
	visible_challenges,
	completed_challenge_count,
	filters,
	logs,
	active_filter,
	setActiveFilter,
} = useAccountPoints();
const is_ranking_modal_open = ref(false);

function handleFilterClick(filter_id: AccountPointLogFilter) {
	setActiveFilter(filter_id);
}

function openRankingModal() {
	is_ranking_modal_open.value = true;
}
</script>

<template>
	<section class="account-page" data-testid="account-points-page">
		<div class="account-content" data-testid="account-points-content">
			<div class="account-points-grid">
				<div class="account-points-copy-column">
					<h1 class="account-points-title" data-testid="account-points-title">{{ translate('account.points.title') }}</h1>

					<div class="account-points-copy-cards">
						<section class="account-points-copy-card">
							<div class="account-points-copy-group">
								<h2 class="account-points-section-title">
									{{ translate('account.points.pointsSystemTitle') }}
									<UiIcon name="regular-info-circle" :size="20" />
								</h2>
								<p class="account-points-description">
									{{ translate('account.points.pointsSystemDescription') }}
								</p>
							</div>
							<div class="account-points-conversion-pill">
								{{ summary.conversion_rate_label }}
							</div>
						</section>

						<section class="account-points-copy-card">
							<div class="account-points-copy-group">
								<h2 class="account-points-section-title">
									{{ translate('account.points.questTitle') }}
								</h2>
								<p class="account-points-description">
									{{ translate('account.points.questDescription') }}
								</p>
							</div>
						</section>

						<section class="account-points-copy-card">
							<div class="account-points-copy-group">
								<h2 class="account-points-section-title">
									{{ translate('account.points.historyTitle') }}
								</h2>
								<p class="account-points-description">
									{{ translate('account.points.historyDescription') }}
								</p>
							</div>
						</section>
					</div>
				</div>

				<div class="account-points-main-column">
					<button
						type="button"
						class="account-points-tier-card"
						data-testid="account-points-hero"
						@click="openRankingModal"
					>
						<div class="account-points-tier-copy">
							<img
								:src="summary.badge_src"
								:alt="translate('account.points.tierName')"
								class="account-points-tier-icon"
							>
							<div>
								<h2 class="account-points-tier">{{ translate(`account.points.${summary.tier_name_key}`) }}</h2>
								<p class="account-points-meta">
									{{ translate('account.points.lastTierUpgrade') }}: {{ summary.last_tier_upgrade_date }}
								</p>
							</div>
						</div>

						<div class="account-points-balance-wrap">
							<p class="account-points-balance" data-testid="account-points-balance">
								{{ summary.balance }}<span>{{ translate('account.points.pointsUnit') }}</span>
							</p>
							<UiBadge
								variant="outline"
								size="md"
								badge-class="account-points-expiry-pill"
							>
								{{ translate('account.points.expiry') }}: {{ summary.expiry_date }}
							</UiBadge>
						</div>

						<div class="account-points-progress">
							<div class="account-points-progress-track">
								<div
									class="account-points-progress-fill"
									:style="{ width: `${summary.progress_percent}%` }"
								/>
							</div>
							<p class="account-points-progress-copy">
								{{ translate('account.points.nextTierRequirementPrefix') }}
								<strong>{{ summary.remaining_spend }} KRW</strong>
								{{ translate('account.points.nextTierRequirementSuffix') }}
							</p>
						</div>
					</button>

					<section class="account-points-challenges">
						<div class="account-points-challenges-head">
							<div class="account-points-challenges-title-wrap">
								<h2 class="account-points-section-title">{{ translate('account.points.challengesTitle') }}</h2>
								<div class="account-points-challenge-count">
									{{ completed_challenge_count }}/{{ visible_challenges.length + (12 - visible_challenges.length) }}
								</div>
							</div>
							<UiButton
								variant="outline"
								tone="neutral"
								size="sm"
								class="account-points-view-all"
							>
								{{ translate('account.points.viewAll') }}
							</UiButton>
						</div>

						<div class="account-points-challenge-list">
							<article
								v-for="challenge in visible_challenges"
								:key="challenge.id"
								class="account-points-challenge-card"
								:data-state="challenge.state"
							>
								<div class="account-points-challenge-frame">
									<img
										:src="challenge.icon_src"
										:alt="challenge.name"
										class="account-points-challenge-image"
									>
								</div>
							</article>
						</div>
					</section>

					<section class="account-points-history-panel">
						<div class="account-points-filters">
							<span class="account-points-filter-label">{{ translate('account.points.filter') }}</span>
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
								{{ translate('account.points.logsTitle') }}
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
				</div>
			</div>
		</div>

		<AccountPointsRankingModal
			v-model="is_ranking_modal_open"
			:ranks="ranks"
		/>
	</section>
</template>

<style scoped lang="scss">
.account-page {
	background: var(--bg-page);
	min-height: calc(100vh - 176px);

		.account-content {
		padding-top: 40px;
		padding-bottom: 48px;

		.account-points-title {
			font-size: var(--type-size-450);
			line-height: var(--type-line-450);
			font-weight: var(--font-weight-bold);
		}

		.account-points-grid {
			display: grid;
			grid-template-columns: 384px minmax(0, 1fr);
			gap: 126px;
			align-items: start;
		}

		.account-points-copy-column {
			display: grid;
			gap: 24px;
		}

		.account-points-copy-cards {
			display: grid;
			gap: 56px;
		}

		.account-points-copy-card {
			display: grid;
			gap: 16px;
		}

		.account-points-copy-group {
			display: grid;
		}

		.account-points-section-title {
			display: inline-flex;
			align-items: center;
			gap: 4px;
			margin: 0;
			font-size: var(--type-size-300);
			line-height: var(--type-line-300);
			font-weight: var(--font-weight-semibold);
			color: var(--text-primary);
		}

		.account-points-description {
			margin: 0;
			color: var(--text-secondary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
		}

		.account-points-conversion-pill {
			width: fit-content;
			padding: 6px 11px;
			border-radius: 999px;
			border: 1px solid color-mix(in srgb, var(--brand-primary) 68%, white);
			color: var(--brand-primary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			font-weight: var(--font-weight-semibold);
			background: color-mix(in srgb, var(--brand-primary) 8%, white);
		}

		.account-points-main-column {
			display: grid;
			gap: 56px;
			width: 100%;
			justify-self: end;
		}

		.account-points-tier-card {
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto;
			gap: 30px 0;
			padding: 30px 32px 26px;
			width: 100%;
			border: 0;
			text-align: left;
			appearance: none;
			border-radius: 20px;
			background:
				radial-gradient(circle at 14% 22%, rgba(255, 255, 255, 0.76) 0, rgba(255, 255, 255, 0.02) 22%),
				linear-gradient(90deg, #ffe2f3 0%, #ffc0e9 100%);
			box-shadow: 0 14px 30px rgba(255, 111, 205, 0.16);
			cursor: pointer;
			transition: transform 0.18s ease, box-shadow 0.18s ease;

			&:hover {
				transform: translateY(-1px);
				box-shadow: 0 18px 38px rgba(255, 111, 205, 0.2);
			}

			&:focus-visible {
				outline: 2px solid #ff41cb;
				outline-offset: 4px;
			}
		}

		.account-points-tier-copy {
			display: inline-flex;
			align-items: center;
			gap: 18px;
			align-self: start;
		}

		.account-points-tier-icon {
			width: 82px;
			height: 82px;
			flex-shrink: 0;
			filter: drop-shadow(0 12px 22px rgba(255, 85, 215, 0.18));
		}

		.account-points-tier {
			font-size: var(--type-size-300);
			line-height: var(--type-line-300);
			font-weight: var(--font-weight-bold);
			color: var(--text-primary);
		}

		.account-points-meta {
			margin: 0;
			color: var(--text-primary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
		}

		.account-points-balance-wrap {
			display: grid;
			justify-items: end;
		}

		.account-points-balance {
			margin: 0;
			font-size: var(--type-size-500);
			line-height: var(--type-line-500);
			font-weight: var(--font-weight-bold);
			color: var(--text-primary);
			display: flex;
			align-items: flex-end;
			gap: 13px;

			span {
				font-size: var(--type-size-300);
				line-height: var(--type-line-300);
			}
		}

		.account-points-expiry-pill {
			border: 1px solid #FFA4E8;
			background: var(--contrast-light);
			color: var(--text-secondary);
		}

		.account-points-progress {
			grid-column: 1 / -1;
			display: grid;
			gap: 14px;
			margin-top: 4px;
		}

		.account-points-progress-track {
			width: 100%;
			height: 11px;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.9);
			overflow: hidden;
			box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
		}

		.account-points-progress-fill {
			height: 100%;
			border-radius: inherit;
			background: linear-gradient(90deg, #ff34d2 0%, #ff68ee 100%);
			box-shadow: 0 0 14px rgba(255, 78, 217, 0.28);
		}

		.account-points-progress-copy {
			margin: 0;
			text-align: center;
			color: var(--text-primary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
		}

		.account-points-challenges {
			display: grid;
			gap: 20px;
			padding-top: 8px;
		}

		.account-points-challenges-head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 20px;
		}

		.account-points-challenges-title-wrap {
			display: inline-flex;
			align-items: center;
			gap: 14px;
		}

		.account-points-challenge-count {
			padding: 5px 12px;
			border-radius: 999px;
			border: 1px solid var(--border-default);
			background: var(--contrast-light);
			color: var(--text-secondary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			font-weight: var(--font-weight-medium);
		}

		.account-points-view-all {
			border-radius: 999px;
			padding-inline: 16px;
			min-height: 38px;
		}

		.account-points-challenge-list {
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			gap: 32px;
		}

		.account-points-challenge-card {
			display: grid;
			place-items: center;
			min-height: 126px;
			flex: 0 0 auto;
		}

		.account-points-challenge-frame {
			width: 88px;
			height: 116px;
			display: grid;
			place-items: center;
		}

		.account-points-challenge-image {
			width: 100%;
			height: 100%;
			object-fit: contain;
			object-position: center bottom;
			display: block;
		}

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
	}

		@media (max-width: 1180px) {
		.account-content {
			.account-points-grid {
				grid-template-columns: 1fr;
				gap: 36px;
			}

			.account-points-copy-column {
				gap: 28px;
				padding-top: 0;
			}

			.account-points-description {
				max-width: none;
			}

			.account-points-main-column {
				max-width: none;
				justify-self: stretch;
			}

			.account-points-challenge-list {
				display: grid;
				grid-template-columns: repeat(3, minmax(0, 1fr));
				justify-content: initial;
			}
		}
	}

	@media (max-width: 760px) {
		.account-content {
			padding-top: 24px;

			.account-points-tier-card {
				grid-template-columns: 1fr;
				padding: 24px 20px 22px;
			}

			.account-points-tier-copy {
				gap: 14px;
			}

			.account-points-tier-icon {
				width: 72px;
				height: 72px;
			}

			.account-points-tier {
				font-size: 30px;
			}

			.account-points-balance-wrap {
				justify-items: start;
			}

			.account-points-balance {
				font-size: 42px;
			}

			.account-points-challenges-head {
				flex-direction: column;
				align-items: flex-start;
			}

			.account-points-challenge-list {
				display: grid;
				grid-template-columns: repeat(2, minmax(0, 1fr));
			}

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
	}
}
</style>