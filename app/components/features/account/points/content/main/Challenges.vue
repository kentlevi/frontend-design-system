<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import type { useAccountPoints } from '~/composables/account/points/useAccountPoints';

const { t } = useI18n();
const { visible_challenges, completed_challenge_count } = inject<ReturnType<typeof useAccountPoints>>('points:state')!
</script>

<template>
	<section class="account-points-challenges">
		<MuLinearWrapper
			class="account-points-challenges-head"
			justify="space-between"
			align="center"
			:gap="20"
		>
			<MuLinearWrapper class="account-points-challenges-title-wrap" align="center" :gap="14">
				<MuHeading class="account-points-section-title" weight="semi-bold">{{ t('account.points.challengesTitle') }}</MuHeading>
				<div class="account-points-challenge-count">
					{{ completed_challenge_count }}/{{ visible_challenges.length + (12 - visible_challenges.length) }}
				</div>
			</MuLinearWrapper>
			<UiButton
				variant="outline"
				tone="neutral"
				size="sm"
				class="account-points-view-all"
			>
				{{ t('account.points.viewAll') }}
			</UiButton>
		</MuLinearWrapper>

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
</template>

<style scoped lang="scss">
.account-points-section-title {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-size: var(--type-size-300);
	line-height: var(--type-line-300);
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);
}

.account-points-challenges {
	display: grid;
	gap: 20px;
	padding-top: 8px;
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

@media (max-width: 1180px) {
	.account-points-challenge-list {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		justify-content: initial;
	}
}

@media (max-width: 760px) {
	.account-points-challenges-head {
		flex-direction: column !important;
		align-items: flex-start !important;
	}

	.account-points-challenge-list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}
</style>
