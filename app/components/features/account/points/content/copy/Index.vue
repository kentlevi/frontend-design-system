<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import type { useAccountPoints } from '~/composables/account/points/useAccountPoints';

const { t } = useI18n();
const { summary } = inject<ReturnType<typeof useAccountPoints>>('points:state')!
</script>

<template>
	<div class="account-points-copy-column">
		<MuHeading weight="bold" class="account-points-title" data-testid="account-points-title">{{ t('account.points.title') }}</MuHeading>

		<div class="account-points-copy-cards">
			<section class="account-points-copy-card">
				<div class="account-points-copy-group">
					<MuHeading class="account-points-section-title" weight="semi-bold">
						{{ t('account.points.pointsSystemTitle') }}
						<UiIcon name="regular-info-circle" :size="20" />
					</MuHeading>
					<MuText color="text-secondary" class="account-points-description">
						{{ t('account.points.pointsSystemDescription') }}
					</MuText>
				</div>
				<div class="account-points-conversion-pill">
					{{ summary.conversion_rate_label }}
				</div>
			</section>

			<section class="account-points-copy-card">
				<div class="account-points-copy-group">
					<MuHeading class="account-points-section-title" weight="semi-bold">
						{{ t('account.points.questTitle') }}
					</MuHeading>
					<MuText color="text-secondary" class="account-points-description">
						{{ t('account.points.questDescription') }}
					</MuText>
				</div>
			</section>

			<section class="account-points-copy-card">
				<div class="account-points-copy-group">
					<MuHeading class="account-points-section-title" weight="semi-bold">
						{{ t('account.points.historyTitle') }}
					</MuHeading>
					<MuText color="text-secondary" class="account-points-description">
						{{ t('account.points.historyDescription') }}
					</MuText>
				</div>
			</section>
		</div>
	</div>
</template>

<style scoped lang="scss">
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

.account-points-title {
	font-size: var(--type-size-450);
	line-height: var(--type-line-450);
	font-weight: var(--font-weight-bold);
}

.account-points-section-title {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-size: var(--type-size-300);
	line-height: var(--type-line-300);
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);
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

@media (max-width: 1180px) {
	.account-points-copy-column {
		gap: 28px;
		padding-top: 0;
	}

	.account-points-description {
		max-width: none;
	}
}
</style>
