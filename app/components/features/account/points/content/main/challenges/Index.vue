<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import List from './List.vue';

const { t: translate } = useI18n();
</script>

<template>
	<section class="challenges">
		<MuLinearWrapper
			class="head"
			justify="space-between"
			align="center"
			:gap="20"
		>
			<MuLinearWrapper class="title-wrap" align="center" :gap="14">
				<MuHeading class="section-title" weight="semi-bold">{{ translate('account.points.challengesTitle') }}</MuHeading>
				<div class="count">
					3/12
				</div>
			</MuLinearWrapper>
			<UiButton
				variant="outline"
				tone="neutral"
				size="sm"
				class="view-all"
			>
				{{ translate('account.points.viewAll') }}
			</UiButton>
		</MuLinearWrapper>

		<List />
	</section>
</template>

<style scoped lang="scss">
.challenges {
	display: grid;
	gap: 20px;
	padding-top: 8px;

	.section-title {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: var(--type-size-300);
		line-height: var(--type-line-300);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
	}

	.count {
		padding: 5px 12px;
		border-radius: 999px;
		border: 1px solid var(--border-default);
		background: var(--contrast-light);
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-medium);
	}

	.view-all {
		border-radius: 999px;
		padding-inline: 16px;
		min-height: 38px;
	}
}

@media (max-width: 760px) {
	.challenges {
		.head {
			flex-direction: column !important;
			align-items: flex-start !important;
		}
	}
}
</style>
