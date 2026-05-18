<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import type { useAccountPoints } from '~/composables/account/points/useAccountPoints';

const { t: translate } = useI18n();
const { summary } = inject<ReturnType<typeof useAccountPoints>>('points:state')!
</script>

<template>
	<div class="side">
		<MuHeading weight="bold" class="title" data-testid="account-points-title">{{ translate('account.points.title') }}</MuHeading>

		<div class="cards">
			<section class="card">
				<div class="group">
					<MuHeading class="section-title" weight="semi-bold">
						{{ translate('account.points.pointsSystemTitle') }}
						<UiIcon name="regular-info-circle" :size="20" />
					</MuHeading>
					<MuText color="text-secondary" class="description">
						{{ translate('account.points.pointsSystemDescription') }}
					</MuText>
				</div>
				<div class="pill">
					{{ summary.conversion_rate_label }}
				</div>
			</section>

			<section class="card">
				<div class="group">
					<MuHeading class="section-title" weight="semi-bold">
						{{ translate('account.points.questTitle') }}
					</MuHeading>
					<MuText color="text-secondary" class="description">
						{{ translate('account.points.questDescription') }}
					</MuText>
				</div>
			</section>

			<section class="card">
				<div class="group">
					<MuHeading class="section-title" weight="semi-bold">
						{{ translate('account.points.historyTitle') }}
					</MuHeading>
					<MuText color="text-secondary" class="description">
						{{ translate('account.points.historyDescription') }}
					</MuText>
				</div>
			</section>
		</div>
	</div>
</template>

<style scoped lang="scss">
.side {
	display: grid;
	gap: 24px;

	.title {
		font-size: var(--type-size-450);
		line-height: var(--type-line-450);
		font-weight: var(--font-weight-bold);
	}

	.cards {
		display: grid;
		gap: 56px;
	}

	.card {
		display: grid;
		gap: 16px;
	}

	.group {
		display: grid;
	}

	.section-title {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: var(--type-size-300);
		line-height: var(--type-line-300);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
	}

	.pill {
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
}

@media (max-width: 1180px) {
	.side {
		gap: 28px;
		padding-top: 0;

		.description {
			max-width: none;
		}
	}
}
</style>
