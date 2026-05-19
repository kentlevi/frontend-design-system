<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

const { t: translate } = useI18n();

const summary = {
	tier_name_key: 'tierName',
	badge_src: '/icons/custom/account/points/badges/badge-bumper-boss.svg',
	last_tier_upgrade_date: '01/11/2025',
	balance: '13.90',
	expiry_date: '03/31/2025',
	progress_percent: 28,
	remaining_spend: '5,828,670.20',
};

const openRankingModal = inject<() => void>('points:openRankingModal', () => {})
</script>

<template>
	<button
		type="button"
		class="tier-card"
		data-testid="account-points-hero"
		@click="openRankingModal()"
	>
		<MuLinearWrapper class="head" align="center" :gap="18">
			<img
				:src="summary.badge_src"
				:alt="translate('account.points.tierName')"
				class="icon"
			>
			<div>
				<MuHeading class="tier" weight="bold">{{ translate(`account.points.${summary.tier_name_key}`) }}</MuHeading>
				<MuText color="text-primary" class="meta">
					{{ translate('account.points.lastTierUpgrade') }}: {{ summary.last_tier_upgrade_date }}
				</MuText>
			</div>
		</MuLinearWrapper>

		<div class="balance-wrap">
			<MuLinearWrapper class="balance" data-testid="account-points-balance" align="flex-end" :gap="13">
				{{ summary.balance }}<MuText variant="span" size="xlarge">{{ translate('account.points.pointsUnit') }}</MuText>
			</MuLinearWrapper>
			<UiBadge
				variant="outline"
				size="md"
				badge-class="expiry-pill"
			>
				{{ translate('account.points.expiry') }}: {{ summary.expiry_date }}
			</UiBadge>
		</div>

		<div class="progress">
			<div class="progress-track">
				<div
					class="progress-fill"
					:style="{ width: `${summary.progress_percent}%` }"
				/>
			</div>
			<MuText align="center" color="text-primary" class="progress-text">
				{{ translate('account.points.nextTierRequirementPrefix') }}
				<strong>{{ summary.remaining_spend }} KRW</strong>
				{{ translate('account.points.nextTierRequirementSuffix') }}
			</MuText>
		</div>
	</button>
</template>

<style scoped lang="scss">
.tier-card {
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

	.head {
		align-self: start;
	}

	.icon {
		width: 82px;
		height: 82px;
		flex-shrink: 0;
		filter: drop-shadow(0 12px 22px rgba(255, 85, 215, 0.18));
	}

	.tier {
		font-size: var(--type-size-300);
		line-height: var(--type-line-300);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
	}

	.meta {
		margin: 0;
	}

	.balance-wrap {
		display: grid;
		justify-items: end;
	}

	.balance {
		margin: 0;
		font-size: var(--type-size-500);
		line-height: var(--type-line-500);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
	}

	.expiry-pill {
		border: 1px solid #FFA4E8;
		background: var(--contrast-light);
		color: var(--text-secondary);
	}

	.progress {
		grid-column: 1 / -1;
		display: grid;
		gap: 14px;
		margin-top: 4px;
	}

	.progress-track {
		width: 100%;
		height: 11px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.9);
		overflow: hidden;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
	}

	.progress-fill {
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, #ff34d2 0%, #ff68ee 100%);
		box-shadow: 0 0 14px rgba(255, 78, 217, 0.28);
	}

	.progress-text {
		margin: 0;
	}
}

@media (max-width: 760px) {
	.tier-card {
		grid-template-columns: 1fr;
		padding: 24px 20px 22px;

		.head {
			gap: 14px !important;
		}

		.icon {
			width: 72px;
			height: 72px;
		}

		.tier {
			font-size: 30px;
		}

		.balance-wrap {
			justify-items: start;
		}

		.balance {
			font-size: 42px;
		}
	}
}
</style>
