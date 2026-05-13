<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import type { AccountPointRank } from '~/types/account/points';

const { t } = useI18n();

const props = defineProps<{
	modelValue: boolean;
	ranks: AccountPointRank[];
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();

function handleModelValueChange(value: boolean) {
	emit('update:modelValue', value);
}
</script>

<template>
	<UiModal
		:model-value="props.modelValue"
		:title="t('account.points.ranking.title')"
		align="center"
		width="1440px"
		padding="0"
		gap="0"
		modal-class="account-points-ranking-modal-shell"
		@update:model-value="handleModelValueChange"
	>
		<section class="account-points-ranking-modal" data-testid="account-points-ranking-modal">
			<div class="account-points-ranking-modal-grid">
				<MuCard
					v-for="rank in props.ranks"
					:key="rank.id"
					padding="none"
					radius="lg"
					class="account-points-ranking-card"
					:data-theme="rank.theme"
					:data-current="rank.is_current ? 'true' : 'false'"
				>
					<div class="account-points-ranking-card-hero">
						<img
							:src="rank.background_src"
							:alt="''"
							class="account-points-ranking-card-hero-bg"
							aria-hidden="true"
						>
						<div class="account-points-ranking-card-pill">
							{{ rank.rank_label }}
						</div>

						<div class="account-points-ranking-card-badge-wrap">
							<img
								:src="rank.badge_src"
								:alt="rank.name"
								class="account-points-ranking-card-badge"
							>
						</div>
					</div>

					<div class="account-points-ranking-card-body">
						<div class="account-points-ranking-card-copy">
							<h3 class="account-points-ranking-card-title">{{ rank.name }}</h3>
							<p class="account-points-ranking-card-spend">{{ rank.spend_requirement }}</p>
						</div>

						<div class="account-points-ranking-card-section">
							<h4 class="account-points-ranking-card-label">{{ t('account.points.ranking.perksLabel') }}</h4>
							<ul class="account-points-ranking-card-list">
								<li v-for="perk in rank.perks" :key="perk">{{ perk }}</li>
							</ul>
						</div>

						<div class="account-points-ranking-card-section">
							<h4 class="account-points-ranking-card-label">{{ t('account.points.ranking.levelUpBonusLabel') }}</h4>
							<ul class="account-points-ranking-card-list">
								<li v-for="gift in rank.level_up_bonus_gifts" :key="gift">{{ gift }}</li>
							</ul>
						</div>
					</div>
				</MuCard>
			</div>
		</section>
	</UiModal>
</template>

<style lang="scss">
.account-points-ranking-modal-shell {
	width: min(1440px, calc(100vw - 32px)) !important;
	max-width: min(1440px, calc(100vw - 32px));
}

.account-points-ranking-modal {
	.account-points-ranking-modal-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 24px;
	}

	.account-points-ranking-card {
		overflow: hidden;

		&[data-current='true'] {
			box-shadow: inset 0 0 0 1px #ff41cb;
		}
	}

	.account-points-ranking-card-hero {
		position: relative;
		padding: 20px 20px 0;
		height: 164px;
		display: grid;
		gap: 12px;
		align-content: space-between;
		overflow: visible;
	}

	.account-points-ranking-card-hero-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: top;
	}

	.account-points-ranking-card-pill {
		position: relative;
		z-index: 1;
		width: fit-content;
		padding: 6px 12px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--rank-accent) 88%, white);
		color: var(--contrast-light);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-bold);
	}

	.account-points-ranking-card-badge-wrap {
		position: relative;
		place-items: center;
	}

	.account-points-ranking-card-badge {
		width: 128px;
		height: 128px;
		object-fit: contain;
	}

	.account-points-ranking-card-body {
		display: grid;
		gap: 24px;
		padding: 46px 30px 30px;
	}

	.account-points-ranking-card-copy {
		display: grid;
		gap: 8px;
		text-align: center;
	}

	.account-points-ranking-card-title {
		margin: 0;
		font-size: 34px;
		line-height: 1;
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
	}

	.account-points-ranking-card-spend {
		margin: 0;
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}

	.account-points-ranking-card-section {
		display: grid;
		gap: 12px;
	}

	.account-points-ranking-card-label {
		margin: 0;
		font-size: var(--type-size-300);
		line-height: var(--type-line-300);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
	}

	.account-points-ranking-card-list {
		display: grid;
		gap: 12px;
		margin: 0;
		padding-left: 24px;
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}

	@media (max-width: 1280px) {
		.account-points-ranking-modal-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 760px) {
		padding: 16px;

		.account-points-ranking-modal-grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.account-points-ranking-card-body {
			padding-inline: 20px;
		}
	}
}
</style>
