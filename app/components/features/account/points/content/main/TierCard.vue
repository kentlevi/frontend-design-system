<script setup lang="ts">
import type { useAccountPoints } from '~/composables/account/points/useAccountPoints';

const { t } = useI18n();
const { summary } = inject<ReturnType<typeof useAccountPoints>>('points:state')!

const openRankingModal = inject<() => void>('points:openRankingModal', () => {})
</script>

<template>
	<button
		type="button"
		class="account-points-tier-card"
		data-testid="account-points-hero"
		@click="openRankingModal()"
	>
		<div class="account-points-tier-copy">
			<img
				:src="summary.badge_src"
				:alt="t('account.points.tierName')"
				class="account-points-tier-icon"
			>
			<div>
				<h2 class="account-points-tier">{{ t(`account.points.${summary.tier_name_key}`) }}</h2>
				<p class="account-points-meta">
					{{ t('account.points.lastTierUpgrade') }}: {{ summary.last_tier_upgrade_date }}
				</p>
			</div>
		</div>

		<div class="account-points-balance-wrap">
			<p class="account-points-balance" data-testid="account-points-balance">
				{{ summary.balance }}<span>{{ t('account.points.pointsUnit') }}</span>
			</p>
			<UiBadge
				variant="outline"
				size="md"
				badge-class="account-points-expiry-pill"
			>
				{{ t('account.points.expiry') }}: {{ summary.expiry_date }}
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
				{{ t('account.points.nextTierRequirementPrefix') }}
				<strong>{{ summary.remaining_spend }} KRW</strong>
				{{ t('account.points.nextTierRequirementSuffix') }}
			</p>
		</div>
	</button>
</template>

<style scoped lang="scss">
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

@media (max-width: 760px) {
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
}
</style>
