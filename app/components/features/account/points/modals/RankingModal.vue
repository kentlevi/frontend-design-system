<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import type { AccountPointRank } from '~/types/account/points';

const { t: translate } = useI18n();

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
		:title="translate('account.points.ranking.title')"
		align="center"
		width="1440px"
		padding="0"
		gap="0"
		modal-class="points-ranking-shell"
		@update:model-value="handleModelValueChange"
	>
		<section class="ranking" data-testid="account-points-ranking-modal">
			<div class="grid">
				<MuCard
					v-for="rank in props.ranks"
					:key="rank.id"
					padding="none"
					radius="lg"
					class="card"
					:data-theme="rank.theme"
					:data-current="rank.is_current ? 'true' : 'false'"
				>
					<div class="hero">
						<img
							:src="rank.background_src"
							:alt="''"
							class="hero-bg"
							aria-hidden="true"
						>
						<div class="pill">
							{{ rank.rank_label }}
						</div>

						<div class="badge-wrap">
							<img
								:src="rank.badge_src"
								:alt="rank.name"
								class="badge"
							>
						</div>
					</div>

					<div class="body">
						<div class="copy">
							<MuHeading variant="3" weight="bold" color="text-primary" class="title">{{ rank.name }}</MuHeading>
							<MuText color="text-secondary" class="spend">{{ rank.spend_requirement }}</MuText>
						</div>

						<div class="section">
							<MuHeading variant="6" weight="semi-bold" color="text-primary" class="label">{{ translate('account.points.ranking.perksLabel') }}</MuHeading>
							<ul class="list">
								<li v-for="perk in rank.perks" :key="perk">{{ perk }}</li>
							</ul>
						</div>

						<div class="section">
							<MuHeading variant="6" weight="semi-bold" color="text-primary" class="label">{{ translate('account.points.ranking.levelUpBonusLabel') }}</MuHeading>
							<ul class="list">
								<li v-for="gift in rank.level_up_bonus_gifts" :key="gift">{{ gift }}</li>
							</ul>
						</div>
					</div>
				</MuCard>
			</div>
		</section>
	</UiModal>
</template>

<style scoped lang="scss">
:global(.points-ranking-shell) {
	width: min(1440px, calc(100vw - 32px)) !important;
	max-width: min(1440px, calc(100vw - 32px));
}

.ranking {
	.grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 24px;
	}

	.card {
		overflow: hidden;

		&[data-current='true'] {
			box-shadow: inset 0 0 0 1px #ff41cb;
		}
	}

	.hero {
		position: relative;
		padding: 20px 20px 0;
		height: 164px;
		display: grid;
		gap: 12px;
		align-content: space-between;
		overflow: visible;
	}

	.hero-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: top;
	}

	.pill {
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

	.badge-wrap {
		position: relative;
		place-items: center;
	}

	.badge {
		width: 128px;
		height: 128px;
		object-fit: contain;
	}

	.body {
		display: grid;
		gap: 24px;
		padding: 46px 30px 30px;
	}

	.copy {
		display: grid;
		gap: 8px;
		text-align: center;
	}

	.title {
		font-size: 34px;
		line-height: 1;
	}

	.section {
		display: grid;
		gap: 12px;
	}

	.label {
		font-size: var(--type-size-300);
		line-height: var(--type-line-300);
	}

	.list {
		display: grid;
		gap: 12px;
		margin: 0;
		padding-left: 24px;
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}

	@media (max-width: 1280px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 760px) {
		padding: 16px;

		.grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.body {
			padding-inline: 20px;
		}
	}
}
</style>
